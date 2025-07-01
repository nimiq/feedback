import type { InjectionKey } from 'vue'

export interface LocaleMessages {
  attachmentUploader: {
    title: string
    previewAlt: string
    deleteImageLabel: string
    uploadHere: string
    anyImageFormat: string
  }
  bugForm: {
    descriptionPlaceholder: string
    descriptionDefaultValue: string
    emailLabel: string
    emailPlaceholder: string
    shareDebugInfoLabel: string
  }
  feedbackForm: {
    descriptionPlaceholder: string
  }
  feedbackWidget: {
    title: string
    bugReportButton: string
    ideaButton: string
    feedbackButton: string
    termsAndConditionsApply: string
  }
  formContainer: {
    titleBug: string
    titleIdea: string
    titleFeedback: string
    successMessage: string
    errorPrefix: string
    errorDetailsSummary: string
    sendingButton: string
    submitButtonDefault: string
    learnMore: string
    privacyPolicyText: string
  }
  ideaForm: {
    descriptionPlaceholder: string
    exampleHint: string
  }
}

export interface I18nContext {
  locale: string
  messages: LocaleMessages
  t: (key: string, params?: Record<string, string | number>) => string
}

export const I18nInjectionKey: InjectionKey<I18nContext> = Symbol('i18n')
