import { resolve } from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
import { z } from 'zod'

function parseJsonEnv<T>(value: string | undefined, fallback: T, envName: string): T {
  if (!value)
    return fallback

  try {
    return JSON.parse(value) as T
  }
  catch (error) {
    throw new Error(`Invalid JSON in ${envName}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

const linearWorkspaceSchema = z.object({
  apiKey: z.string(),
  assignee: z.string().optional(),
  labels: z.array(z.string()).optional(),
  project: z.string().optional(),
  state: z.string().optional(),
  team: z.string().optional(),
})

// Define runtime config schema for validation
const runtimeConfigSchema = z.object({
  github: z.object({
    owner: z.string(),
    repo: z.string(),
    token: z.string(),
  }),
  slack: z.object({
    webhookUrl: z.string().optional(),
  }),
  linear: z.object({
    defaultWorkspace: z.string().optional(),
    workspaces: z.record(z.string(), linearWorkspaceSchema),
  }),
  productionUrl: z.string(),
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-09-09',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@nuxthub/core',
    'reka-ui/nuxt',
    'nuxt-safe-runtime-config',
  ],
  future: { compatibilityVersion: 4 },
  css: ['~/assets/css/main.css'],

  eslint: {
    config: {
      standalone: false,
      autoInit: false,
    },
  },

  vite: {
    plugins: [tailwindcss() as any],
  },

  icon: {
    customCollections: [
      {
        prefix: 'nimiq',
        dir: '../shared/icons/nimiq',
      },
    ],
  },

  hub: {
    blob: true,
    cache: true,
    db: 'sqlite',
    kv: true,
  },

  hooks: {
    'hub:db:migrations:dirs': (dirs: string[]) => {
      dirs.push(resolve('./server/database/migrations'))
    },
    'hub:db:schema:extend': ({ paths }: { paths: string[] }) => {
      paths.push(resolve('./server/database/schema.ts'))
    },
  } as Record<string, (...args: any[]) => void>,

  runtimeConfig: {
    github: {
      owner: process.env.NUXT_GITHUB_OWNER,
      repo: process.env.NUXT_GITHUB_REPO,
      token: process.env.NUXT_GITHUB_TOKEN,
    },
    slack: {
      webhookUrl: process.env.NUXT_SLACK_WEBHOOK_URL,
    },
    linear: {
      defaultWorkspace: process.env.NUXT_LINEAR_DEFAULT_WORKSPACE,
      workspaces: parseJsonEnv(process.env.NUXT_LINEAR_WORKSPACES, {}, 'NUXT_LINEAR_WORKSPACES'),
    },
    productionUrl: process.env.NUXT_PRODUCTION_URL,
  },

  safeRuntimeConfig: {
    $schema: runtimeConfigSchema,
  },

  typescript: {
    tsConfig: {
      include: ['./app/types.d.ts'],
    },
  },

  watch: ['~~/../widget/**/*.{ts,vue,js,css}'],

  routeRules: {
    '/widget.js': {
      cache: { maxAge: 3600 },
    },
    '/widget.css': {
      cache: { maxAge: 3600 },
    },
    '/api/feedback': { swr: 0, cors: true },
  },
})
