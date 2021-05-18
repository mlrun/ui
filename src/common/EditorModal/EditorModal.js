import React, { useState } from 'react'
import { Base64 } from 'js-base64'
import PropTypes from 'prop-types'

import EditorModalView from './EditorModalView'

const EditorModal = ({ closeModal, defaultData, handleSaveCode }) => {
  const [data, setData] = useState(Base64.decode(defaultData))

  return (
    <EditorModalView
      closeModal={closeModal}
      data={data}
      handleSaveCode={handleSaveCode}
      setData={setData}
    />
  )
}

EditorModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  defaultData: PropTypes.string,
  handleSaveCode: PropTypes.func.isRequired
}

export default EditorModal
