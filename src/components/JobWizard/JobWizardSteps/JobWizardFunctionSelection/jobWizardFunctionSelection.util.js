export const FUNCTIONS_SELECTION_FUNCTIONS_TAB = 'functions'
export const FUNCTIONS_SELECTION_MARKETPLACE_TAB = 'marketplace'

export const functionsSelectionTabs = [
  {
    id: FUNCTIONS_SELECTION_FUNCTIONS_TAB,
    label: 'Functions'
  },
  {
    id: FUNCTIONS_SELECTION_MARKETPLACE_TAB,
    label: 'Marketplace'
  }
]

export const generateFunctionCardData = functionData => {
  return {
    header: functionData.name,
    subHeader: functionData.functions?.[0]?.metadata?.project ?? '',
    description: '',
    sideTag: ''
  }
}

export const generateFunctionTemplateCardData = templateData => {
  return {
    header: templateData.metadata.name,
    subHeader: '',
    description: templateData.metadata.description,
    sideTag: ''
  }
}
