import type { LocaleMessages } from './types'

export default {
  attachmentUploader: {
    previewAlt: 'Preview',
    deleteImageLabel: 'Delete image',
    uploadHere: 'Upload here',
    anyImageFormat: 'Any image format',
    title: 'Attachments',
  },
  bugForm: {
    descriptionPlaceholder: 'Please, tell us how we can make your Nimiq experience better*',
    descriptionDefaultValue: '',
    emailLabel: 'Email',
    emailPlaceholder: 'If we need more information*',
    shareDebugInfoLabel: 'Include technical details to help us fix this issue faster',
  },
  feedbackForm: {
    descriptionPlaceholder: 'Please, tell us how we can make your Nimiq experience better*',
  },
  feedbackWidget: {
    title: 'Send your feedback',
    bugReportButton: 'Bug report',
    ideaButton: 'Share your idea',
    feedbackButton: 'Feedback',
    termsAndConditionsApply: 'Terms and conditions apply',
  },
  formContainer: {
    titleBug: 'Report a bug',
    titleIdea: 'Share your idea',
    titleFeedback: 'Give feedback',
    successMessage: 'Submission successful! Please wait...',
    errorPrefix: 'Error:',
    errorDetailsSummary: 'Details',
    sendingButton: 'Sending...',
    submitButtonDefault: 'Submit Feedback',
    learnMore: 'Learn more',
    privacyPolicyText: 'about how we handle your data.',
  },
  ideaForm: {
    descriptionPlaceholder: 'Please, tell us how we can make your Nimiq experience better*',
    exampleHint: 'For example a screenshot of a feature from another app',
  },
} satisfies LocaleMessages
