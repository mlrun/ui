import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import lodash from 'lodash'
import PropTypes from 'prop-types'

import Button from '../../common/Button/Button'
import Modal from '../../common/Modal/Modal'
import UploadDataForm from '../../elements/UploadDataForm/UploadDataForm'

import { checkValidation, initialPageData, generatePageData } from './UploadDataPopup_util'
import { FILES } from '../../constants'

const UploadDataPopup = ({ onClose, show, title }) => {
  const [sourceType, setSourceType] = useState(FILES)
  const [formData, setFormData] = useState({
    files: {
      file: null,
      store: null
    },
    tabular: {
      file: null,
      store: null
    },
    isValid: false
  })
  const [pageData, setPageData] = useState(initialPageData)
  const [validation, setValidations] = useState({
    files: {
      file: true,
      store: true
    },
    tabular: {
      file: true,
      store: true
    }
  })

  const {
    appStore: { frontendSpec },
    projectStore: { project }
  } = useSelector(store => store)

  const isFormInvalid = !Object.values(validation[sourceType]).every(value => value)

  const handleFormData = (path, value) => {
    checkValidation(path, value, setValidations, pageData)

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
    setSourceType(FILES)
    setPageData(initialPageData)
    onClose()
  }, [onClose])

  useEffect(() => {
    setPageData(state => ({
      ...state,
      ...generatePageData(sourceType)
    }))
  }, [sourceType])

  return (
    <Modal
      actions={pageData.actions.map(action => (
        <Button key={action.id} disabled={isFormInvalid} {...action} />
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
