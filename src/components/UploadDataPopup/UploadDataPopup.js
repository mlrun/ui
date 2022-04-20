import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import lodash from 'lodash'
import PropTypes from 'prop-types'

import Button from '../../common/Button/Button'
import Modal from '../../common/Modal/Modal'
import UploadDataForm from '../../elements/UploadDataForm/UploadDataForm'

import { generatePageData, initialPageData } from './UploadDataPopup_util'
import { TABULAR } from '../../constants'

const UploadDataPopup = ({ onClose, show, title }) => {
  const [sourceType, setSourceType] = useState(null)
  const [formData, setFormData] = useState({
    tabular: {
      file: null,
      store: null
    },
    files: {
      file: null,
      store: null
    },
    isValid: false
  })
  const [pageData, setPageData] = useState(initialPageData)
  const [validation, setValidations] = useState({
    tabular: {
      file: true,
      store: true
    },
    files: {
      file: true,
      store: true
    }
  })

  const {
    appStore: { frontendSpec },
    projectStore: { project }
  } = useSelector(store => store)

  const handleFormData = (path, value) => {
    if (value && pageData.type === TABULAR && pageData.config.type === 'file') {
      setValidations(oldState =>
        lodash
          .chain(oldState)
          .cloneDeep()
          .set(path, value.name.includes('.parquet'))
          .value()
      )
    }
    setFormData(oldState =>
      lodash
        .chain(oldState)
        .cloneDeep()
        .set(path, value)
        .value()
    )
  }

  const handlePageData = (path, value) => {
    setPageData(oldState =>
      lodash
        .chain(oldState)
        .cloneDeep()
        .set(path, value)
        .value()
    )
  }

  const handleCloseModal = useCallback(() => {
    setPageData(initialPageData)
    setSourceType(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (sourceType) {
      setPageData(state => ({
        ...state,
        ...generatePageData(sourceType)
      }))
    }
  }, [sourceType])

  return (
    <Modal
      actions={pageData.actions.map(action => (
        <Button key={action.value} {...action} />
      ))}
      onClose={handleCloseModal}
      size="sm"
      show={show}
      title={title}
    >
      <UploadDataForm
        form={formData}
        frontendSpec={frontendSpec}
        handleFormData={handleFormData}
        handlePageData={handlePageData}
        pageData={pageData}
        project={project}
        setSourceType={setSourceType}
        sourceType={sourceType}
        validation={validation}
      />
    </Modal>
  )
}

UploadDataPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}

export default UploadDataPopup
