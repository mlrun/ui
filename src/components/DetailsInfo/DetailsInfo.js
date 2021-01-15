import React, { useReducer, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  detailsInfoActions,
  detailsInfoReducer,
  initialState
} from './detailsInfoReducer'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { detailsActions } from './detailsReducer'

import './detailsInfo.scss'
import DetailsInfoView from './DetailsInfoView'

const DetailsInfo = ({
  changes,
  content,
  detailsDispatch,
  match,
  pageData,
  selectedItem
}) => {
  const [detailsInfoState, detailsInfoDispatch] = useReducer(
    detailsInfoReducer,
    initialState
  )
  const editItemRef = React.createRef()

  const onBlurEditField = useCallback(
    event => {
      if (editItemRef.current && !editItemRef.current.contains(event.target)) {
        if (changes.counter === 0 && !isEveryObjectValueEmpty(changes.data)) {
          detailsDispatch({
            type: detailsActions.SET_CHANGES_DATA,
            payload: {}
          })
          detailsInfoDispatch({
            type: detailsInfoActions.SET_FIELDS_DATA,
            payload: {}
          })
        } else if (changes.data[detailsInfoState.editMode.field]) {
          detailsDispatch({
            type: detailsActions.SET_CHANGES_DATA,
            payload: {
              ...changes.data,
              [detailsInfoState.editMode.field]:
                detailsInfoState.fieldsData[detailsInfoState.editMode.field]
                  .previousFieldValue
            }
          })
        }

        detailsInfoDispatch({
          type: detailsInfoActions.SET_EDIT_MODE,
          payload: {
            field: '',
            fieldType: ''
          }
        })
      }
    },
    [
      changes.counter,
      changes.data,
      detailsDispatch,
      detailsInfoState.editMode.field,
      detailsInfoState.fieldsData,
      editItemRef
    ]
  )

  useEffect(() => {
    window.addEventListener('click', onBlurEditField)

    return () => {
      window.removeEventListener('click', onBlurEditField)
    }
  }, [onBlurEditField])

  const handleFinishEdit = (event, field) => {
    detailsInfoDispatch({
      type: detailsInfoActions.SET_EDIT_MODE,
      payload: {
        field: '',
        fieldType: ''
      }
    })

    if (
      detailsInfoState.fieldsData[field].initialFieldValue ===
      changes.data[field]
    ) {
      const fieldsData = { ...detailsInfoState.fieldsData }
      const changesData = { ...changes.data }

      delete fieldsData[field]
      delete changesData[field]

      detailsDispatch({
        type: detailsActions.SET_CHANGES_COUNTER,
        payload: fieldsData.length || 0
      })
      detailsInfoDispatch({
        type: detailsInfoActions.SET_FIELDS_DATA,
        payload: { ...fieldsData }
      })
      detailsDispatch({
        type: detailsActions.SET_CHANGES_DATA,
        payload: { ...changesData }
      })
    } else {
      detailsDispatch({
        type: detailsActions.SET_CHANGES_COUNTER,
        payload: Object.keys(changes.data).length
      })
    }
  }

  const handleInfoItemClick = (field, fieldType, info) => {
    detailsInfoDispatch({
      type: detailsInfoActions.SET_EDIT_MODE,
      payload: {
        field,
        fieldType
      }
    })

    if (!detailsInfoState.fieldsData[field]?.initialFieldValue) {
      detailsInfoDispatch({
        type: detailsInfoActions.SET_FIELDS_DATA,
        payload: {
          ...detailsInfoState.fieldsData,
          [field]: {
            previousFieldValue: info,
            initialFieldValue: info
          }
        }
      })
    } else {
      detailsInfoDispatch({
        type: detailsInfoActions.SET_FIELDS_DATA,
        payload: {
          ...detailsInfoState.fieldsData,
          [field]: {
            ...detailsInfoState.fieldsData[field],
            previousFieldValue: info
          }
        }
      })
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
      ref={editItemRef}
      changes={changes}
      content={content}
      detailsInfoState={detailsInfoState}
      handleFinishEdit={handleFinishEdit}
      handleInfoItemClick={handleInfoItemClick}
      match={match}
      pageData={pageData}
      selectedItem={selectedItem}
      sources={sources}
    />
  )
}

DetailsInfo.propTypes = {
  changes: PropTypes.shape({}).isRequired,
  content: PropTypes.shape({}).isRequired,
  detailsDispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsInfo
