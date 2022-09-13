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
import React from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'
import Editor from '@monaco-editor/react'
import { Base64 } from 'js-base64'

import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'

import { Button } from 'igz-controls/components'

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
