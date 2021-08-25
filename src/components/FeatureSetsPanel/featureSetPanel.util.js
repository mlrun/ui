export const nameValidationPattern = /^(?=[\S\s]{1,63}$)[a-z0-9]([-a-z0-9]*[a-z0-9])?$/

export const checkValidation = (newFeatureSet, setValidation, validation) => {
  const externalOfflineTarget = newFeatureSet.spec.targets.find(
    targetKind => targetKind.name === 'externalOffline'
  )

  if (newFeatureSet.metadata.name.length === 0 || !validation.isNameValid) {
    setValidation(prevState => ({
      ...prevState,
      isNameValid: false
    }))

    return false
  }

  if (newFeatureSet.spec.source.path.length === 0) {
    setValidation(prevState => ({
      ...prevState,
      isUrlValid: false
    }))

    return false
  }

  if (newFeatureSet.spec.source.kind === 'parquet') {
    const { time_field, start_time, end_time } = newFeatureSet.spec.source

    if (
      time_field.length === 0 &&
      start_time.length === 0 &&
      end_time.length === 0
    ) {
      setValidation(prevState => ({
        ...prevState,
        isTimeFieldValid: true,
        isStartTimeValid: true,
        isEndTimeValid: true
      }))
    } else {
      if (!validation.isTimeFieldValid) {
        return false
      }

      if (start_time.length === 0 && end_time.length === 0) {
        setValidation(prevState => ({
          ...prevState,
          isStartTimeValid: false,
          isEndTimeValid: false
        }))

        return false
      }

      if (!validation.isStartTimeValid || !validation.isEndTimeValid) {
        return false
      }
    }
  }

  if (newFeatureSet.spec.entities.length === 0 || !validation.isEntitiesValid) {
    setValidation(prevState => ({
      ...prevState,
      isEntitiesValid: false
    }))

    return false
  }

  if (
    externalOfflineTarget &&
    (externalOfflineTarget.path.length === 0 || !validation.isTargetsPathValid)
  ) {
    setValidation(prevState => ({
      ...prevState,
      isTargetsPathValid: false
    }))

    return false
  }

  return true
}
