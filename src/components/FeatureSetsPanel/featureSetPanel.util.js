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

import { REDISNOSQL } from './FeatureSetsPanelTargetStore/featureSetsPanelTargetStore.util'

export const nameValidationPattern = /^(?=[\S\s]{1,56}$)[a-z0-9]([-a-z0-9]*[a-z0-9])?$/

export const checkValidation = (
  newFeatureSet,
  setValidation,
  validation,
  startIngestion,
  setAccessKeyRequired
) => {
  let isValid = true

  const externalOfflineTarget = newFeatureSet.spec.targets.find(
    targetKind => targetKind.name === 'externalOffline'
  )

  const isPartitionByTimeExist = newFeatureSet.spec.targets.some(target =>
    Boolean(target.time_partitioning_granularity)
  )

  const onlineRedisTarget = newFeatureSet.spec.targets.find(
    targetKind => targetKind.kind === REDISNOSQL
  )

  if (!Object.values(validation).every(value => value)) {
    isValid = false
  }

  if (!newFeatureSet.spec.targets.length && !newFeatureSet.spec.passthrough) {
    setValidation(prevState => ({
      ...prevState,
      isTargetStoreValid: false
    }))

    isValid = false
  }

  if (onlineRedisTarget) {
    if (/[{}]/g.test(onlineRedisTarget.path)) {
      setValidation(prevState => ({
        ...prevState,
        isOnlineTargetPathValid: false
      }))

      isValid = false
    }
  }

  if (newFeatureSet.metadata.name.length === 0 || !validation.isNameValid) {
    setValidation(prevState => ({
      ...prevState,
      isNameValid: false
    }))

    isValid = false
  }

  if (newFeatureSet.spec.source.path.length === 0 || !validation.isUrlValid) {
    setValidation(prevState => ({
      ...prevState,
      isUrlValid: false
    }))

    isValid = false
  }

  if (newFeatureSet.spec.source.kind === 'parquet') {
    const { time_field, start_time, end_time } = newFeatureSet.spec.source

    if (time_field.length === 0 && start_time.length === 0 && end_time.length === 0) {
      setValidation(prevState => ({
        ...prevState,
        isTimeFieldValid: true,
        isStartTimeValid: true,
        isEndTimeValid: true
      }))
    } else {
      if (!validation.isTimeFieldValid) {
        isValid = false
      }

      if (start_time.length === 0 && end_time.length === 0) {
        setValidation(prevState => ({
          ...prevState,
          isStartTimeValid: false,
          isEndTimeValid: false
        }))

        isValid = false
      } else if (time_field.length === 0) {
        setValidation(prevState => ({
          ...prevState,
          isTimeFieldValid: false
        }))

        isValid = false
      } else if ((end_time && !start_time) || (start_time && !end_time)) {
        setValidation(prevState => ({
          ...prevState,
          isStartTimeValid: end_time.length === 0,
          isEndTimeValid: start_time.length === 0
        }))

        isValid = false
      }

      if (!validation.isStartTimeValid || !validation.isEndTimeValid) {
        isValid = false
      }
    }
  }

  if (newFeatureSet.spec.entities.length === 0 || !validation.isEntitiesValid) {
    setValidation(prevState => ({
      ...prevState,
      isEntitiesValid: false
    }))

    isValid = false
  }

  if (
    !newFeatureSet.spec.passthrough &&
    externalOfflineTarget &&
    (externalOfflineTarget.path.length === 0 || !validation.isExternalOfflineTargetPathValid)
  ) {
    setValidation(prevState => ({
      ...prevState,
      isExternalOfflineTargetPathValid: false
    }))

    isValid = false
  }

  if (isPartitionByTimeExist && newFeatureSet.spec.timestamp_key.length === 0) {
    setValidation(prevState => ({
      ...prevState,
      isTimestampKeyValid: false
    }))

    isValid = false
  }

  if (newFeatureSet.credentials.access_key.length === 0 && startIngestion) {
    setValidation(state => ({
      ...state,
      isAccessKeyValid: false
    }))
    setAccessKeyRequired(true)

    isValid = false
  } else {
    setValidation(state => ({
      ...state,
      isAccessKeyValid: true
    }))
    setAccessKeyRequired(false)
  }

  return isValid
}
