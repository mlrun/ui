import React from 'react'
import PropTypes from 'prop-types'
import Prism from 'prismjs'

import './codeBlock.scss'
import classNames from 'classnames'

const CodeBlock = ({ className, codeData, label, language }) => {
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

CodeBlock.defaultProps = {
  className: '',
  codeData: {},
  label: '',
  language: 'json'
}

CodeBlock.propTypes = {
  className: PropTypes.string,
  codeData: PropTypes.object,
  label: PropTypes.string,
  language: PropTypes.string
}

export default CodeBlock
