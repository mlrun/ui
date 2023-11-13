/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
// import { set } from 'lodash'

import { FUNCTION_SELECTION_STEP } from '../../../../constants'

export const FUNCTIONS_SELECTION_FUNCTIONS_TAB = 'functions'
export const FUNCTIONS_SELECTION_HUB_TAB = 'hub'

export const trainModelAllowedHubFunctions = {
  'auto-trainer': ['train'],
  'azureml-utils': ['submit_training_job', 'train']
}

export const functionsSelectionTabs = [
  {
    id: FUNCTIONS_SELECTION_FUNCTIONS_TAB,
    label: 'Functions'
  },
  {
    id: FUNCTIONS_SELECTION_HUB_TAB,
    label: 'Hub'
  }
]

export const generateFunctionCardData = functionData => {
  return {
    header: functionData.name,
    subHeader: functionData.functions?.[0]?.metadata?.project ?? '',
    description: functionData.functions?.[0]?.spec?.description ?? '',
    sideTag: ''
  }
}

export const generateFunctionTemplateCardData = templateData => {
  const functionTemplateCardData = {
    header: templateData.metadata.name,
    subHeader: '',
    description: templateData.metadata.description,
    sideTag: '',
    labelsName: `${FUNCTION_SELECTION_STEP}.templatesLabels.${templateData.metadata.name}`
  }

  // todo: add links when the backend is ready
  // if (templateData.metadata.docfile) {
  //   set(functionTemplateCardData, 'links.documentation', '')
  // }
  // if (templateData.metadata.versions?.latest) {
  //   set(functionTemplateCardData, 'links.examples', '')
  // }

  return functionTemplateCardData
}

export const filterTrainFunctionMethods = result => {
  const allowedMethods = trainModelAllowedHubFunctions[result.name]
  const { entry_points } = result.functions[0].spec

  if (entry_points) {
    result.functions[0].spec.entry_points = Object.fromEntries(
      Object.entries(entry_points).filter(([key]) => allowedMethods.includes(key))
    )
  }

  return result
}
