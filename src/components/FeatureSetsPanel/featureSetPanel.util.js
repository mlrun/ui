export const nameValidationPattern = /^(?=[\S\s]{1,56}$)[a-z0-9]([-a-z0-9]*[a-z0-9])?$/

export const checkValidation = (
  newFeatureSet,
  setValidation,
  validation,
  startIngestion,
  setAccessKeyRequired
) => {
  const externalOfflineTarget = newFeatureSet.spec.targets.find(
    targetKind => targetKind.name === 'externalOffline'
  )
  const isPartitionByTimeExist = newFeatureSet.spec.targets.some(target =>
    Boolean(target.time_partitioning_granularity)
  )

  if (newFeatureSet.metadata.name.length === 0 || !validation.isNameValid) {
    setValidation(prevState => ({
      ...prevState,
      isNameValid: false
    }))

    return false
  }

  if (newFeatureSet.spec.source.path.length === 0 || !validation.isUrlValid) {
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
      } else if (time_field.length === 0) {
        setValidation(prevState => ({
          ...prevState,
          isTimeFieldValid: false
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

  if (isPartitionByTimeExist && newFeatureSet.spec.timestamp_key.length === 0) {
    setValidation(prevState => ({
      ...prevState,
      isTimestampKeyValid: false
    }))

    return false
  }

  if (newFeatureSet.credentials.access_key.length === 0 && startIngestion) {
    setValidation(state => ({
      ...state,
      isAccessKeyValid: false
    }))
    setAccessKeyRequired(true)

    return false
  } else {
    setValidation(state => ({
      ...state,
      isAccessKeyValid: true
    }))
    setAccessKeyRequired(false)
  }

  return true
}
