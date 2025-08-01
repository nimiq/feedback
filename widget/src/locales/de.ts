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
    descriptionPlaceholder: 'Bitte teile uns mit, wie wir deine Nimiq-Erfahrung verbessern können.*',
    descriptionDefaultValue: '',
    emailLabel: 'E-Mail',
    emailPlaceholder: 'Falls wir weitere Informationen benötigen',
    shareDebugInfoLabel: 'Technische Details einbeziehen, um dieses Problem schneller zu lösen',
  },
  feedbackForm: {
    descriptionPlaceholder: 'Bitte teile uns mit, wie wir deine Nimiq-Erfahrung verbessern können.*',
  },
  feedbackWidget: {
    title: 'Sende dein Feedback',
    bugReportButton: 'Fehlerbericht senden',
    ideaButton: 'Ideen vorschlagen',
    feedbackButton: 'Feedback senden',
    termsAndConditionsApply: 'Allgemeine Geschäftsbedingungen akzeptieren',
  },
  formContainer: {
    titleBug: 'Einen Fehler melden',
    titleIdea: 'Hast du eine Idee?',
    titleFeedback: 'Feedback senden',
    successMessage: 'Übermittlung erfolgreich! Bitte warten...',
    errorPrefix: 'Fehler:',
    errorDetailsSummary: 'Details',
    sendingButton: 'Wird gesendet...',
    submitButtonDefault: 'Feedback senden',
    consentTermsAndFeedback: 'Ich stimme den Nutzungsbedingungen und der Verwendung meines Feedbacks zur Verbesserung der Nimiq-Produkte zu',
    readFullTerms: 'Vollständige Bedingungen lesen',
    learnMore: 'Erfahre mehr',
    privacyPolicyText: 'darüber, wie wir mit deinen Daten umgehen.',
  },
  ideaForm: {
    descriptionPlaceholder: 'Bitte teile uns mit, wie wir deine Nimiq-Erfahrung verbessern können.*',
    exampleHint: 'Zum Beispiel einen Screenshot einer Funktion aus einer anderen App',
  },
} satisfies LocaleMessages
