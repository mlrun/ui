import React from 'react'
import Prism from 'prismjs'
import PropTypes from 'prop-types'

import PopUpDialog from '../PopUpDialog/PopUpDialog'

import './yamlmodal.scss'

const YamlModal = ({ convertedYaml, toggleConvertToYaml }) => {
  const html =
    convertedYaml && Prism.highlight(convertedYaml, Prism.languages.yml, 'yml')

  return (
    <PopUpDialog className="yaml-modal" closePopUp={toggleConvertToYaml}>
      <div
        data-testid="yaml-modal"
        className="yaml-modal-container"
        id="yaml_modal"
      >
        <pre>
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
    </PopUpDialog>
  )
}

YamlModal.propTypes = {
  convertedYaml: PropTypes.string.isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired
}

export default YamlModal
