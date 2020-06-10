export const editHyperParams = (
  hyperParams,
  functionHyperParams,
  selectedParameterData
) => {
  if (hyperParams[selectedParameterData.name]) {
    hyperParams[selectedParameterData.name] = selectedParameterData.value.split(
      ','
    )

    return { ...hyperParams }
  } else {
    return {
      ...functionHyperParams,
      [selectedParameterData.name]: selectedParameterData.value.split(',')
    }
  }
}
