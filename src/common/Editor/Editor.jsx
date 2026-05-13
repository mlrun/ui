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
import MonacoEditor from '@monaco-editor/react'
import { Loader } from 'igz-controls/components'
import { loader } from '@monaco-editor/react'

import { getScssVariableValue } from 'igz-controls/utils/common.util'

loader.init().then(monaco => {
  const alabasterColor = getScssVariableValue('--alabasterColor')
  const mischkaColor = getScssVariableValue('--mischkaColor')
  const spunPearlColor = getScssVariableValue('--spunPearlColor')
  const whiteSolidColor = getScssVariableValue('--whiteSolidColor')

  monaco.editor.defineTheme('custom-theme', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': alabasterColor,
      'editorGutter.background': alabasterColor,
      'editor.lineHighlightBackground': whiteSolidColor,
      'editorLineNumber.foreground': spunPearlColor,
      'editor.selectionBackground': mischkaColor
    }
  })
})

const Editor = ({ value, language, readOnly = true, contextmenu = false }) => {
  return (
    <MonacoEditor
      height="100%"
      language={language || 'plaintext'}
      theme="custom-theme"
      value={value}
      wrapperProps={{
        style: {
          display: 'flex',
          position: 'relative',
          textAlign: 'initial',
          width: '100%'
        }
      }}
      options={{
        automaticLayout: true,
        bracketPairColorization: { enabled: true },
        contextmenu: contextmenu,
        fontFamily: "'Fira Code', 'Menlo', monospace",
        fontLigatures: true,
        fontSize: 14,
        guides: { bracketPairs: true },
        minimap: { enabled: false },
        readOnly: readOnly,
        renderLineHighlight: 'all',
        scrollBeyondLastLine: false,
        scrollbar: {
          verticalScrollbarSize: 4,
          horizontalScrollbarSize: 4
        }
      }}
      loading={<Loader section />}
    />
  )
}

Editor.propTypes = {
  contextmenu: PropTypes.bool,
  value: PropTypes.string.isRequired,
  language: PropTypes.string,
  readOnly: PropTypes.bool
}

export default Editor
