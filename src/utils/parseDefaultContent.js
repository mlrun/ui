export const parseDefaultContent = parameters => {
  return parameters.reduce((prev, curr) => {
    return { ...prev, [curr.data.name.label]: curr.data.value?.label }
  }, {})
}
