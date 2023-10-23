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

import { functionRunKinds } from '../components/Jobs/jobs.util'

const excludedFunctionNames = ['batch-inference']

export const aliasToCategory = {
  analysis: 'data-analysis',
  BERT: 'other',
  'concept-drift': 'other',
  'data-movement': 'etl',
  'data-source': 'etl',
  embeddings: 'other',
  experimental: 'other',
  ops: 'notifications',
  'sentiment analysis': 'data-analysis',
  serve: 'model-serving',
  serving: 'model-serving',
  test: 'other',
  utils: 'other'
}

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
        categories: value?.categories.map(category => aliasToCategory[category] ?? category)
      }
    }))
    .filter(template => functionRunKinds.includes(template.kind))

  const templatesCategories = {}

  templates.forEach(template => {
    if (template.metadata.categories) {
      template.metadata.categories.forEach(category => {
        const valueToAdd = aliasToCategory[category] ?? category
        templatesCategories[valueToAdd] ??= []
        if (!templatesCategories[valueToAdd].includes(template)) {
          templatesCategories[valueToAdd].push(template)
        }
      })
    }
  })

  return { templates, templatesCategories }
}

export const generateHubCategories = functionTemplates => {
  const hubFunctions = functionTemplates
    .map(template => ({
      ...template,
      ui: {
        categories: template.metadata?.categories.map(
          category => aliasToCategory[category] ?? category
        ),
        versions: functionTemplates
          .filter(funcTemplate => funcTemplate.metadata.name === template.metadata.name)
          .map(funcTemplate => funcTemplate.metadata.version)
      }
    }))
    .filter(
      template =>
        functionRunKinds.includes(template.spec.kind) &&
        !excludedFunctionNames.includes(template.metadata.name)
    )

  const hubFunctionsCategories = []

  hubFunctions.forEach(template => {
    template.metadata.categories.forEach(category => {
      const valueToAdd = aliasToCategory[category] ?? category

      if (!hubFunctionsCategories.includes(valueToAdd)) {
        hubFunctionsCategories.push(valueToAdd)
      }
    })
  })

  return { hubFunctions, hubFunctionsCategories }
}
