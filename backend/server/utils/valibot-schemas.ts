import { any, array, boolean, check, fallback, file, forward, integer, maxBytes, maxLength, maxSize, maxValue, mimeType, minLength, minValue, object, optional, parseJson, picklist, pipe, record, string, transform, trim, uuid } from 'valibot'
import { imageMimeTypes, maxAttachments, maxAttachmentSize } from '~~/shared/utils'

function requiredText(label: string, max: number) {
  return pipe(
    string(`${label} must be a string`),
    trim(),
    minLength(1, `${label} is required`),
    maxLength(max, `${label} is too long`),
  )
}

export const FormSchema = pipe(object({
  type: picklist(['feedback', 'bug', 'idea'], 'Invalid submission type'),
  app: requiredText('App', 64),
  tags: fallback(optional(pipe(
    string(),
    transform(value => value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : []),
    array(pipe(string(), maxLength(64, 'Tags must be at most 64 characters')), 'Tags must be an array of strings'),
    maxLength(10, 'Maximum 10 tags allowed'),
  )), []),
  acceptTerms: pipe(
    string(),
    transform(value => value === 'true' || value === 'on'),
    boolean('You need to accept the legal terms'),
    check(value => value, 'You need to accept the legal terms'),
  ),
  description: requiredText('Description', 10_000),
  email: optional(pipe(
    string('Email must be a string'),
    trim(),
    maxLength(320, 'Email is too long'),
  )),
  rating: optional(pipe(
    string(),
    transform(Number),
    integer('Rating must be an integer'),
    minValue(1, 'Rating must be at least 1'),
    maxValue(5, 'Rating cannot exceed 5'),
  )),
  attachments: optional(pipe(
    array(pipe(
      file('Select an image file.'),
      mimeType(imageMimeTypes as `${string}/${string}`[], 'Select an image.'),
      maxSize(maxAttachmentSize, 'Select a file smaller than 10 MB.'),
    ), 'Attachments must be an array of images'),
    minLength(0),
    maxLength(maxAttachments),
  ), []),
  logs: optional(pipe(
    string('Logs must be a string'),
    maxBytes(512 * 1024, 'Logs must be smaller than 512 KB'),
  )),
  meta: optional(pipe(
    string(),
    maxBytes(64 * 1024, 'Meta must be smaller than 64 KB'),
    parseJson({}, 'Meta must contain valid JSON'),
    record(string(), any(), 'Meta must be a valid JSON object'),
  )),
  idempotencyKey: optional(pipe(
    string(),
    uuid('Idempotency key must be a UUID'),
  )),
}), forward(
  check(form => form.type !== 'feedback' || form.rating !== undefined, 'Rating is required for feedback'),
  ['rating'],
))

export const QuerySchema = object({
  linearAssignee: optional(pipe(string('Linear assignee must be a string'), maxLength(320, 'Linear assignee is too long'))),
  linearLabels: fallback(optional(pipe(
    string(),
    transform(value => value ? value.split(',').map(label => label.trim()).filter(Boolean) : []),
    array(pipe(string(), maxLength(100, 'Linear labels must be at most 100 characters')), 'Linear labels must be an array of strings'),
    maxLength(20, 'Maximum 20 Linear labels allowed'),
  )), []),
  linearPriority: optional(pipe(
    string(),
    transform(Number),
    integer('Linear priority must be an integer'),
    minValue(0, 'Linear priority must be at least 0'),
    maxValue(4, 'Linear priority cannot exceed 4'),
  )),
  linearProject: optional(pipe(string('Linear project must be a string'), maxLength(200, 'Linear project is too long'))),
  linearState: optional(pipe(string('Linear state must be a string'), maxLength(200, 'Linear state is too long'))),
  linearTeam: optional(pipe(string('Linear team must be a string'), maxLength(200, 'Linear team is too long'))),
  linearTitle: optional(pipe(string('Linear title must be a string'), maxLength(500, 'Linear title is too long'))),
  linearWorkspace: optional(pipe(string('Linear workspace must be a string'), maxLength(100, 'Linear workspace is too long'))),
})
