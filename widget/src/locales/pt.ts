import type { LocaleMessages } from './types'

export default {
  attachmentUploader: {
    previewAlt: 'Pré-visualização',
    deleteImageLabel: 'Excluir imagem',
    uploadHere: 'Enviar aqui',
    anyImageFormat: 'Qualquer formato de imagem',
    title: 'Anexos',
  },
  bugForm: {
    descriptionPlaceholder: 'Por favor, nos conte como podemos melhorar sua experiência com Nimiq*',
    descriptionDefaultValue: '',
    emailLabel: 'E-mail',
    emailPlaceholder: 'Se precisarmos de mais informações*',
    shareDebugInfoLabel: 'Incluir detalhes técnicos para nos ajudar a corrigir este problema mais rapidamente',
  },
  feedbackForm: {
    descriptionPlaceholder: 'Por favor, nos conte como podemos melhorar sua experiência com Nimiq*',
  },
  feedbackWidget: {
    title: 'Envie seu feedback',
    bugReportButton: 'Relatar bug',
    ideaButton: 'Tem uma ideia?',
    feedbackButton: 'Feedback',
    termsAndConditionsLink: 'Termos e condições',
    termsApplySuffix: ' se aplicam',
  },
  formContainer: {
    titleBug: 'Relatar um bug',
    titleIdea: 'Tem uma ideia?',
    titleFeedback: 'Dar feedback',
    successMessage: 'Envio bem-sucedido! Por favor, aguarde...',
    errorPrefix: 'Erro:',
    errorDetailsSummary: 'Detalhes',
    sendingButton: 'Enviando...',
    submitButtonDefault: 'Enviar Feedback',
  },
  ideaForm: {
    descriptionPlaceholder: 'Por favor, nos conte como podemos melhorar sua experiência com Nimiq*',
    exampleHint: 'Por exemplo, uma captura de tela de um recurso de outro aplicativo',
  },
} satisfies LocaleMessages
