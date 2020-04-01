import React from 'react'
import Prism from 'prismjs'
import PropTypes from 'prop-types'

import { ReactComponent as Close } from '../../images/close.svg'

import './yamlmodal.scss'

const YamlModal = ({ convertedYaml, toggleConvertToYaml }) => {
  const html =
    convertedYaml && Prism.highlight(convertedYaml, Prism.languages.yml, 'yml')

  return (
    <div
      className={`yaml-modal${convertedYaml.length > 0 ? ' modal-showed' : ''}`}
      id="yaml_modal"
    >
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
        <button onClick={toggleConvertToYaml}>
          <Close />
        </button>
      </pre>
    </div>
  )
}

YamlModal.propTypes = {
  convertedYaml: PropTypes.string.isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired
}

export default YamlModal
