import type { LocaleMessages } from './types'

export default {
  attachmentUploader: {
    previewAlt: 'Aperçu',
    deleteImageLabel: 'Supprimer l\'image',
    uploadHere: 'Télécharger ici',
    anyImageFormat: 'Tout format d\'image',
    title: 'Pièces jointes',
  },
  bugForm: {
    descriptionPlaceholder: 'Veuillez nous dire comment nous pouvons améliorer votre expérience Nimiq*',
    descriptionDefaultValue: '',
    emailLabel: 'E-mail',
    emailPlaceholder: 'Si nous avons besoin de plus d\'informations*',
    shareDebugInfoLabel: 'Inclure les détails techniques pour nous aider à résoudre ce problème plus rapidement',
  },
  feedbackForm: {
    descriptionPlaceholder: 'Veuillez nous dire comment nous pouvons améliorer votre expérience Nimiq*',
  },
  feedbackWidget: {
    title: 'Envoyez vos commentaires',
    bugReportButton: 'Signaler un bug',
    ideaButton: 'Vous avez une idée ?',
    feedbackButton: 'Commentaires',
    termsAndConditionsLink: 'Conditions générales',
    termsApplySuffix: ' s\'appliquent',
  },
  formContainer: {
    titleBug: 'Signaler un bug',
    titleIdea: 'Vous avez une idée ?',
    titleFeedback: 'Donner des commentaires',
    successMessage: 'Soumission réussie ! Veuillez patienter...',
    errorPrefix: 'Erreur :',
    errorDetailsSummary: 'Détails',
    sendingButton: 'Envoi en cours...',
    submitButtonDefault: 'Envoyer les commentaires',
    learnMore: 'En savoir plus',
    privacyPolicyText: 'sur la façon dont nous traitons vos données.',
  },
  ideaForm: {
    descriptionPlaceholder: 'Veuillez nous dire comment nous pouvons améliorer votre expérience Nimiq*',
    exampleHint: 'Par exemple, une capture d\'écran d\'une fonctionnalité d\'une autre application',
  },
} satisfies LocaleMessages
