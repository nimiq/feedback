import type { LocaleMessages } from './types'

export default {
  attachmentUploader: {
    previewAlt: 'Vorschau',
    deleteImageLabel: 'Bild löschen',
    uploadHere: 'Hier hochladen',
    anyImageFormat: 'Beliebiges Bildformat',
    title: 'Anhänge',
  },
  bugForm: {
    descriptionPlaceholder: 'Bitte teilen Sie uns mit, wie wir Ihre Nimiq-Erfahrung verbessern können*',
    descriptionDefaultValue: '',
    emailLabel: 'E-Mail',
    emailPlaceholder: 'Falls wir weitere Informationen benötigen*',
    shareDebugInfoLabel: 'Technische Details einbeziehen, um dieses Problem schneller zu lösen',
  },
  feedbackForm: {
    descriptionPlaceholder: 'Bitte teilen Sie uns mit, wie wir Ihre Nimiq-Erfahrung verbessern können*',
  },
  feedbackWidget: {
    title: 'Senden Sie Ihr Feedback',
    bugReportButton: 'Fehlerbericht',
    ideaButton: 'Haben Sie eine Idee?',
    feedbackButton: 'Feedback',
    termsAndConditionsLink: 'Allgemeine Geschäftsbedingungen',
    termsApplySuffix: ' gelten',
  },
  formContainer: {
    titleBug: 'Einen Fehler melden',
    titleIdea: 'Haben Sie eine Idee?',
    titleFeedback: 'Feedback geben',
    successMessage: 'Übermittlung erfolgreich! Bitte warten...',
    errorPrefix: 'Fehler:',
    errorDetailsSummary: 'Details',
    sendingButton: 'Wird gesendet...',
    submitButtonDefault: 'Feedback senden',
  },
  ideaForm: {
    descriptionPlaceholder: 'Bitte teilen Sie uns mit, wie wir Ihre Nimiq-Erfahrung verbessern können*',
    exampleHint: 'Zum Beispiel einen Screenshot einer Funktion aus einer anderen App',
  },
} satisfies LocaleMessages
