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
import React, { useReducer, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'
import { useParams } from 'react-router-dom'

import { handleFinishEdit } from '../Details/details.util'

import { detailsInfoActions, detailsInfoReducer, initialState } from './detailsInfoReducer'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import DetailsInfoView from './DetailsInfoView'

import './detailsInfo.scss'

const DetailsInfo = React.forwardRef(
  (
    { detailsStore, pageData, selectedItem, setChangesData, setChangesCounter },
    applyChangesRef
  ) => {
    const [detailsInfoState, detailsInfoDispatch] = useReducer(detailsInfoReducer, initialState)
    const params = useParams()
    const editItemRef = React.createRef()

    const onApplyChanges = useCallback(
      event => {
        if (applyChangesRef.current && applyChangesRef.current.contains(event.target)) {
          detailsInfoDispatch({
            type: detailsInfoActions.RESET_EDIT_MODE
          })
        }
      },
      [applyChangesRef]
    )

    useEffect(() => {
      return () => {
        detailsInfoDispatch({
          type: detailsInfoActions.RESET_EDIT_MODE
        })
      }
    }, [detailsInfoDispatch, params.name])

    useEffect(() => {
      window.addEventListener('click', onApplyChanges)

      return () => {
        window.removeEventListener('click', onApplyChanges)
      }
    }, [onApplyChanges])

    const handleDiscardChanges = field => {
      detailsInfoDispatch({
        type: detailsInfoActions.RESET_EDIT_MODE
      })

      setChangesData({
        ...detailsStore.changes.data,
        [field]: {
          ...detailsStore.changes.data[field],
          currentFieldValue: detailsStore.changes.data[field]?.previousFieldValue
        }
      })
    }

    const handleInfoItemClick = (field, fieldType, info) => {
      if (isEveryObjectValueEmpty(detailsInfoState.editMode)) {
        detailsInfoDispatch({
          type: detailsInfoActions.SET_EDIT_MODE,
          payload: {
            field,
            fieldType
          }
        })

        if (isNil(detailsStore.changes.data[field]?.initialFieldValue)) {
          setChangesData({
            ...detailsStore.changes.data,
            [field]: {
              initialFieldValue: info,
              currentFieldValue: info,
              previousFieldValue: info
            }
          })
        } else {
          setChangesData({
            ...detailsStore.changes.data,
            [field]: {
              ...detailsStore.changes.data[field],
              currentFieldValue: info
            }
          })
        }
      }
    }

    const sources = Array.isArray(selectedItem.sources)
      ? selectedItem.sources.reduce((prev, cur) => {
          let source = {}
          source[cur.name] = cur.path

          return { ...prev, ...source }
        }, {})
      : selectedItem.sources

    return (
      <DetailsInfoView
        detailsInfoDispatch={detailsInfoDispatch}
        detailsInfoState={detailsInfoState}
        detailsStore={detailsStore}
        handleDiscardChanges={handleDiscardChanges}
        handleFinishEdit={() =>
          handleFinishEdit(
            Object.keys(detailsStore.changes.data),
            detailsStore.changes,
            detailsInfoActions,
            detailsInfoDispatch,
            detailsInfoState,
            setChangesData,
            setChangesCounter
          )
        }
        handleInfoItemClick={handleInfoItemClick}
        pageData={pageData}
        params={params}
        ref={editItemRef}
        selectedItem={selectedItem}
        setChangesData={setChangesData}
        sources={sources}
      />
    )
  }
)

DetailsInfo.propTypes = {
  detailsStore: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsInfo
