import type { LocaleMessages } from './types'

export default {
  attachmentUploader: {
    previewAlt: 'Preview',
    deleteImageLabel: 'Delete image',
    uploadHere: 'Upload here',
    anyImageFormat: 'Any image format',
  },
  bugForm: {
    descriptionPlaceholder: 'Please, tell us how we can make your Nimiq experience better*',
    descriptionDefaultValue: 'This is a test, awesome!',
    emailLabel: 'Email',
    emailPlaceholder: 'If we need more information*',
  },
  feedbackForm: {
    descriptionPlaceholder: 'Please, tell us how we can make your Nimiq experience better*',
  },
  feedbackWidget: {
    title: 'Send your feedback',
    bugReportButton: 'Bug report',
    ideaButton: 'Got an idea?',
    feedbackButton: 'Feedback',
    termsAndConditionsLink: 'Terms and conditions',
    termsApplySuffix: ' apply',
  },
  formContainer: {
    titleBug: 'Report a bug',
    titleIdea: 'Got an idea?',
    titleFeedback: 'Give feedback',
    successMessage: 'Submission successful! Please wait...',
    errorPrefix: 'Error:',
    errorDetailsSummary: 'Details',
    sendingButton: 'Sending...',
    submitButtonDefault: 'Submit Feedback',
  },
  ideaForm: {
    descriptionPlaceholder: 'Please, tell us how we can make your Nimiq experience better*',
    exampleHint: 'For example a screenshot of a feature from another app',
  },
} satisfies LocaleMessages
