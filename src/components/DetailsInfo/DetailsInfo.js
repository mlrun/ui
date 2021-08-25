import React, { useReducer, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'

import { handleFinishEdit } from '../Details/details.util'

import {
  detailsInfoActions,
  detailsInfoReducer,
  initialState
} from './detailsInfoReducer'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import DetailsInfoView from './DetailsInfoView'

import './detailsInfo.scss'

const DetailsInfo = React.forwardRef(
  (
    {
      changes,
      content,
      match,
      pageData,
      selectedItem,
      setChangesData,
      setChangesCounter
    },
    applyChangesRef
  ) => {
    const [detailsInfoState, detailsInfoDispatch] = useReducer(
      detailsInfoReducer,
      initialState
    )
    const editItemRef = React.createRef()

    const onApplyChanges = useCallback(
      event => {
        if (
          applyChangesRef.current &&
          applyChangesRef.current.contains(event.target)
        ) {
          detailsInfoDispatch({
            type: detailsInfoActions.RESET_EDIT_MODE
          })
        }
      },
      [applyChangesRef]
    )

    const handleInfoItemClick = (field, fieldType, info) => {
      if (isEveryObjectValueEmpty(detailsInfoState.editMode)) {
        detailsInfoDispatch({
          type: detailsInfoActions.SET_EDIT_MODE,
          payload: {
            field,
            fieldType
          }
        })

        if (isNil(changes.data[field]?.initialFieldValue)) {
          setChangesData({
            ...changes.data,
            [field]: {
              initialFieldValue: info,
              currentFieldValue: info,
              previousFieldValue: info
            }
          })
        } else {
          setChangesData({
            ...changes.data,
            [field]: {
              ...changes.data[field],
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

    useEffect(() => {
      return () => {
        detailsInfoDispatch({
          type: detailsInfoActions.RESET_EDIT_MODE
        })
      }
    }, [match.params.name])

    useEffect(() => {
      window.addEventListener('click', onApplyChanges)

      return () => {
        window.removeEventListener('click', onApplyChanges)
      }
    }, [onApplyChanges])

    return (
      <DetailsInfoView
        changes={changes}
        content={content}
        detailsInfoState={detailsInfoState}
        handleFinishEdit={field =>
          handleFinishEdit(
            [field],
            changes,
            detailsInfoActions,
            detailsInfoDispatch,
            detailsInfoState,
            setChangesData,
            setChangesCounter
          )
        }
        handleInfoItemClick={handleInfoItemClick}
        match={match}
        pageData={pageData}
        ref={editItemRef}
        selectedItem={selectedItem}
        sources={sources}
      />
    )
  }
)

DetailsInfo.propTypes = {
  changes: PropTypes.shape({}).isRequired,
  content: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsInfo
