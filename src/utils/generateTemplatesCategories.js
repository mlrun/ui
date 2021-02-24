const aliasToCategory = {
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
const excludeCategoryKinds = ['serving', 'nuclio']
export const generateCategories = templates => {
  const templatesCategories = {}

  templates
    .filter(template => !excludeCategoryKinds.includes(template.kind))
    .forEach(template => {
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

  return templatesCategories
}
