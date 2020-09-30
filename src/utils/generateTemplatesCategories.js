export const generateCategories = templates => {
  const templatesCategories = {}

  templates.forEach(template => {
    if (template.metadata.categories) {
      template.metadata.categories.forEach(category => {
        if (category === 'serving' || category === 'serve') {
          if (templatesCategories['serving']) {
            templatesCategories['serving'] = [
              ...templatesCategories['serving'],
              template
            ]
          } else {
            templatesCategories['serving'] = [template]
          }
        } else if (
          category === 'analysis' ||
          category === 'sentiment analysis'
        ) {
          if (templatesCategories['analysis']) {
            templatesCategories['analysis'] = [
              ...templatesCategories['analysis'],
              template
            ]
          } else {
            templatesCategories['analysis'] = [template]
          }
        } else if (category === 'data-movement' || category === 'data-source') {
          if (templatesCategories['data-source']) {
            templatesCategories['data-source'] = [
              ...templatesCategories['data-source'],
              template
            ]
          } else {
            templatesCategories['data-source'] = [template]
          }
        } else if (category === 'notifications' || category === 'ops') {
          if (templatesCategories['notifications']) {
            templatesCategories['notifications'] = [
              ...templatesCategories['notifications'],
              template
            ]
          } else {
            templatesCategories['notifications'] = [template]
          }
        } else if (
          category === 'test' ||
          category === 'utils' ||
          category === 'BERT' ||
          category === 'embeddings' ||
          category === 'concept-drift' ||
          category === 'experimental'
        ) {
          if (templatesCategories.other) {
            templatesCategories.other = [...templatesCategories.other, template]
          } else {
            templatesCategories.other = [template]
          }
        } else if (templatesCategories[category]) {
          templatesCategories[category] = [
            ...templatesCategories[category],
            template
          ]
        } else {
          templatesCategories[category] = [template]
        }
      })
    }
  })

  return templatesCategories
}
