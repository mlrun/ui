import React from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'
import Editor from '@monaco-editor/react'
import { Base64 } from 'js-base64'

import { SECONDARY_BUTTON, TERTIARY_BUTTON } from '../../constants'

import Button from '../Button/Button'

import './editorModal.scss'

const EditorModalView = ({ closeModal, data, handleSaveCode, setData }) =>
  createPortal(
    <div className="editor-modal-container">
      <div className="editor-modal">
        <div className="editor-modal__header">
          <span>Code must be written in Python</span>
          <Button
            label="Cancel"
            onClick={closeModal}
            variant={TERTIARY_BUTTON}
          />
          <Button
            label="Save"
            onClick={() => handleSaveCode(Base64.encode(data))}
            variant={SECONDARY_BUTTON}
          />
        </div>
        <Editor
          className="editor-modal__body"
          defaultLanguage="python"
          defaultValue={data}
          onChange={value => setData(value)}
        />
      </div>
    </div>,
    document.getElementById('overlay_container')
  )

EditorModalView.propTypes = {
  closeModal: PropTypes.func.isRequired,
  data: PropTypes.string.isRequired,
  handleSaveCode: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired
}

export default EditorModalView
