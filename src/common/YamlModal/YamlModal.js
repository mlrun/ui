import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import cancel from '../../images/cancel.png'

import './yamlmodal.scss'

const YamlModal = ({ convertedYaml }) => {
  const modal = useRef()
  const closeYamlModal = () => {
    modal.current.style.display = 'none'
  }
  return (
    <div className="yaml_modal" ref={modal} id="yaml_modal">
      <pre>
        <code>{convertedYaml}</code>
        <button onClick={closeYamlModal}>
          <img src={cancel} alt="Cancel" />
        </button>
      </pre>
    </div>
  )
}

YamlModal.propTypes = {
  convertedYaml: PropTypes.string
}

export default YamlModal
