export const generateCategories = templates => {
  const templatesCategories = {}

  templates.forEach(template => {
    if (template.metadata.categories) {
      template.metadata.categories.forEach(category => {
        console.log(category)
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
