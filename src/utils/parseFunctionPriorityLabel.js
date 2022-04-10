export const parseFunctionPriorityLabel = id => {
  let labelName = id.split('-').pop()
  return labelName.charAt(0).toUpperCase() + labelName.slice(1)
}
