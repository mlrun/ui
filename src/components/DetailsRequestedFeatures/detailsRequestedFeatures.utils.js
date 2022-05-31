export const headers = [
  { label: '', id: 'label-icon' },
  { label: 'Project name', id: 'project-name' },
  { label: 'Feature set', id: 'feature-set' },
  { label: 'Feature', id: 'feature' },
  { label: 'Alias', id: 'alias' },
  { label: '', id: 'actions' }
]

export const countChanges = (initialFieldValue, currentFieldValue) => {
    let counter = 0

    initialFieldValue.forEach(item => {
        if (!currentFieldValue.includes(item)) {
            counter++
        }
    })

    return counter
}
