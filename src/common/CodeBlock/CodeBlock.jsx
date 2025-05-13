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
import Prism from 'prismjs'

import './codeBlock.scss'
import classNames from 'classnames'

const CodeBlock = ({ className = '', codeData = {}, label = '', language = 'json' }) => {
  const codeBlockClassName = classNames('code-block', className)

  return (
    <div className={codeBlockClassName}>
      <div className="code-block__label">{label}</div>
      <div className="code-block__content">
        <pre>
          <code
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                JSON.stringify(codeData, null, 2),
                Prism.languages[language],
                language
              )
            }}
          ></code>
        </pre>
      </div>
    </div>
  )
}

CodeBlock.propTypes = {
  className: PropTypes.string,
  codeData: PropTypes.object,
  label: PropTypes.string,
  language: PropTypes.string
}

export default CodeBlock
