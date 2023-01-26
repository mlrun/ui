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
const excludeCategoryKinds = ['serving', 'nuclio', 'remote']

export const aliasToCategory = {
  BERT: 'other',
  'concept-drift': 'other',
  'data-movement': 'data-source',
  embeddings: 'other',
  experimental: 'other',
  ops: 'notifications',
  'sentiment analysis': 'analysis',
  serve: 'serving',
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
    .filter(template => !excludeCategoryKinds.includes(template.kind))

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
