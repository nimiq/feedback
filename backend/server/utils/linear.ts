import type { InferOutput } from 'valibot'
import type { FormSchema, QuerySchema } from './valibot-schemas'
import { LinearClient, LinearError } from '@linear/sdk'

interface CreateLinearIssueOptions {
  form: InferOutput<typeof FormSchema>
  markdown: string
  query: InferOutput<typeof QuerySchema>
}

interface LinearWorkspaceConfig {
  apiKey: string
  assignee?: string
  labels?: string[]
  project?: string
  state?: string
  team?: string
}

interface ConnectionLike<T> {
  fetchNext: () => Promise<unknown>
  nodes: T[]
  pageInfo: {
    hasNextPage: boolean
  }
}

type CreateLinearResult = Result<LinearIssue | undefined>

const resourceCache = new Map<string, { expiresAt: number, value: Promise<unknown[]> }>()
const resourceCacheTtl = 5 * 60 * 1000

const typeTitles: Record<InferOutput<typeof FormSchema>['type'], string> = {
  bug: 'Bug report',
  feedback: 'Feedback',
  idea: 'Idea',
}

function defaultLinearIssueTitle(form: InferOutput<typeof FormSchema>): string {
  return `[${form.app}] - ${typeTitles[form.type]}`
}

function formatLinearError(error: unknown): string {
  if (error instanceof LinearError) {
    const details = error.errors?.map(linearError => linearError.message).filter(Boolean).join('; ')
    return details ? `Linear API error: ${details}` : `Linear API error: ${error.message}`
  }

  if (error instanceof Error)
    return `Linear API error: ${error.message}`

  return `Linear API error: ${String(error)}`
}

function hasLinearRequest(query: InferOutput<typeof QuerySchema>): boolean {
  const labels = query.linearLabels ?? []

  return Boolean(
    query.linearAssignee
    || labels.length > 0
    || query.linearPriority !== undefined
    || query.linearProject
    || query.linearState
    || query.linearTeam
    || query.linearTitle
    || query.linearWorkspace,
  )
}

async function loadAll<T>(connection: ConnectionLike<T>): Promise<T[]> {
  while (connection.pageInfo.hasNextPage)
    await connection.fetchNext()

  return connection.nodes
}

function loadCached<T>(key: string, loader: () => Promise<T[]>): Promise<T[]> {
  const now = Date.now()
  const cached = resourceCache.get(key)
  if (cached && cached.expiresAt > now)
    return cached.value as Promise<T[]>

  const value = loader()
  resourceCache.set(key, { expiresAt: now + resourceCacheTtl, value })
  value.catch(() => resourceCache.delete(key))
  return value
}

function normalizeValue(value: string | null | undefined): string | undefined {
  return value?.trim().toLowerCase()
}

function matchesSelector(selector: string, ...candidates: Array<string | null | undefined>): boolean {
  const normalizedSelector = normalizeValue(selector)
  if (!normalizedSelector)
    return false

  return candidates.some(candidate => normalizeValue(candidate) === normalizedSelector)
}

function uniq(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

function resolveWorkspace(query: InferOutput<typeof QuerySchema>): [string, LinearWorkspaceConfig] | undefined {
  const { defaultWorkspace, workspaces } = useSafeRuntimeConfig().linear

  if (query.linearWorkspace) {
    const workspace = workspaces[query.linearWorkspace]
    return workspace ? [query.linearWorkspace, workspace] : undefined
  }

  if (defaultWorkspace && workspaces[defaultWorkspace])
    return [defaultWorkspace, workspaces[defaultWorkspace]]

  const configuredWorkspaces = Object.entries(workspaces)
  return configuredWorkspaces.length === 1 ? configuredWorkspaces[0] : undefined
}

async function resolveTeam(client: LinearClient, workspace: string, selector: string) {
  const teams = await loadCached(`${workspace}:teams`, async () => loadAll(await client.teams({ first: 250 })))
  return teams.find(team => matchesSelector(selector, team.id, team.key, team.name, team.displayName))
}

async function resolveProject(client: LinearClient, workspace: string, selector: string) {
  const projects = await loadCached(`${workspace}:projects`, async () => loadAll(await client.projects({ first: 250 })))
  return projects.find(project => matchesSelector(selector, project.id, project.name, project.slugId))
}

async function resolveUser(client: LinearClient, workspace: string, selector: string) {
  const users = await loadCached(`${workspace}:users`, async () => loadAll(await client.users({ first: 250 })))
  return users.find(user => matchesSelector(selector, user.id, user.email, user.name, user.displayName))
}

async function resolveState(client: LinearClient, workspace: string, teamId: string, selector: string) {
  const team = await client.team(teamId)
  const states = await loadCached(`${workspace}:team:${teamId}:states`, async () => loadAll(await team.states({ first: 250 })))
  return states.find(state => matchesSelector(selector, state.id, state.name))
}

async function resolveLabels(client: LinearClient, workspace: string, selectors: string[]) {
  if (selectors.length === 0)
    return []

  const labels = await loadCached(`${workspace}:labels`, async () => loadAll(await client.issueLabels({ first: 250 })))

  return selectors.map((selector) => {
    const label = labels.find(candidate => matchesSelector(selector, candidate.id, candidate.name))
    if (!label)
      throw new Error(`Linear label "${selector}" was not found`)

    return label
  })
}

export async function createLinearIssue({ markdown, form, query }: CreateLinearIssueOptions): CreateLinearResult {
  if (!hasLinearRequest(query))
    return [true, undefined, undefined]

  const workspace = resolveWorkspace(query)
  if (!workspace)
    return [false, 'Linear workspace could not be resolved from the request parameters and configured workspaces.', undefined]

  const [workspaceName, workspaceConfig] = workspace
  const client = new LinearClient({ apiKey: workspaceConfig.apiKey })

  const teamSelector = query.linearTeam ?? workspaceConfig.team
  if (!teamSelector)
    return [false, `Linear team is required for workspace "${workspaceName}".`, undefined]

  try {
    const projectSelector = query.linearProject ?? workspaceConfig.project
    const assigneeSelector = query.linearAssignee ?? workspaceConfig.assignee
    const labelSelectors = uniq([...(workspaceConfig.labels ?? []), ...(query.linearLabels ?? [])])
    const [team, project, assignee, labels] = await Promise.all([
      resolveTeam(client, workspaceName, teamSelector),
      projectSelector ? resolveProject(client, workspaceName, projectSelector) : undefined,
      assigneeSelector ? resolveUser(client, workspaceName, assigneeSelector) : undefined,
      resolveLabels(client, workspaceName, labelSelectors),
    ])

    if (!team)
      return [false, `Linear team "${teamSelector}" was not found in workspace "${workspaceName}".`, undefined]

    if (projectSelector && !project)
      return [false, `Linear project "${projectSelector}" was not found in workspace "${workspaceName}".`, undefined]

    if (assigneeSelector && !assignee)
      return [false, `Linear assignee "${assigneeSelector}" was not found in workspace "${workspaceName}".`, undefined]

    const stateSelector = query.linearState ?? workspaceConfig.state
    const state = stateSelector ? await resolveState(client, workspaceName, team.id, stateSelector) : undefined
    if (stateSelector && !state)
      return [false, `Linear state "${stateSelector}" was not found for team "${team.name}".`, undefined]

    const issuePayload = await client.createIssue({
      assigneeId: assignee?.id,
      description: markdown,
      labelIds: labels.map(label => label.id),
      priority: query.linearPriority,
      projectId: project?.id,
      stateId: state?.id,
      teamId: team.id,
      title: query.linearTitle?.trim() || defaultLinearIssueTitle(form),
    })

    if (!issuePayload.success)
      return [false, 'Linear API returned success=false while creating the issue.', undefined]

    const issue = await issuePayload.issue
    if (!issue)
      return [false, 'Linear API did not return an issue after a successful createIssue call.', undefined]

    return [true, undefined, { identifier: issue.identifier, issueUrl: issue.url }]
  }
  catch (error) {
    return [false, formatLinearError(error), undefined]
  }
}
