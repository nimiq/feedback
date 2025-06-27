import { array, boolean, fallback, file, integer, maxLength, maxSize, maxValue, mimeType, minLength, minValue, object, optional, picklist, pipe, string, transform } from 'valibot'
import { imageMimeTypes } from '~~/shared/utils'

export const FormSchema = object({
  type: picklist(['feedback', 'bug', 'idea'], 'Invalid submission type'),
  app: string('App must be a string'),
  tags: fallback(optional(pipe(
    string(),
    transform(value => value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : []),
    array(string(), 'Tags must be an array of strings'),
    maxLength(10, 'Maximum 10 tags allowed'),
  )), []),
  acceptTerms: pipe(string(), transform(value => value === 'true' || value === 'on'), boolean('You need to accept the legal terms')),
  description: string('Description must be a string'),
  email: optional(string('Email must be a string')),
  rating: optional(pipe(
    string(),
    transform(Number),
    integer('Rating must be an integer'),
    minValue(0, 'Rating must be at least 0'),
    maxValue(5, 'Rating cannot exceed 5'),
  )),
  attachments: optional(pipe(
    array(pipe(
      file('Select an image file.'),
      mimeType(imageMimeTypes as `${string}/${string}`[], 'Select an image.'),
      maxSize(1024 * 1024 * 10, 'Select a file smaller than 10 MB.'),
    ), 'Attachments must be an array of images'),
    minLength(0),
    maxLength(5),
  ), []),
  logs: optional(string('Logs must be a string')),
})

export const QuerySchema = object({
  test: fallback(optional(pipe(string(), transform(value => value === 'true'), boolean('Test must be a boolean'))), false),
})
