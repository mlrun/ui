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

import { isEmpty } from 'lodash'

import { FUNCTION_RUN_KINDS } from '../constants'

const excludedFunctionNames = ['batch-inference']

export const generateCategories = functionTemplates => {
  const templates = Object.entries(functionTemplates)
    .map(([key, value]) => ({
      kind: value?.kind,
      metadata: {
        name: key,
        hash: '',
        description: value?.description,
        docfile: value?.docfile,
        categories: value?.categories,
        versions: value?.versions,
        tag: ''
      },
      status: {
        state: ''
      },
      ui: {
        categories: value?.categories
      }
    }))
    .filter(template => FUNCTION_RUN_KINDS.includes(template.kind))

  const templatesCategories = {}

  templates.forEach(template => {
    if (template.metadata.categories) {
      template.metadata.categories.forEach(category => {
        templatesCategories[category] ??= []
        if (!templatesCategories[category].includes(template)) {
          templatesCategories[category].push(template)
        }
      })
    }
  })

  return { templates, templatesCategories }
}

export const generateHubCategories = (functionTemplates, allowedHubFunctions = {}) => {
  const hubFunctions = functionTemplates
    .filter(
      template =>
        FUNCTION_RUN_KINDS.includes(template.spec.kind) &&
        !excludedFunctionNames.includes(template.metadata.name) &&
        (isEmpty(allowedHubFunctions) ||
          Object.keys(allowedHubFunctions).includes(template.metadata.name))
    )
    .map(template => ({
      ...template,
      ui: {
        categories: template.metadata?.categories,
        versions: functionTemplates
          .filter(funcTemplate => funcTemplate.metadata.name === template.metadata.name)
          .map(funcTemplate => funcTemplate.metadata.version)
      }
    }))

  const hubFunctionsCategories = []

  hubFunctions.forEach(template => {
    template.metadata.categories.forEach(category => {
      if (!hubFunctionsCategories.includes(category)) {
        hubFunctionsCategories.push(category)
      }
    })
  })
  hubFunctionsCategories.sort()

  return { hubFunctions, hubFunctionsCategories }
}
