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
