import React, { useRef } from 'react'
import cancel from '../../images/cancel.png'
import './yamlmodal.scss'
const YamlModal = ({ convertedYaml, close }) => {
  const modal = useRef()
  const closeYamlModal = () => {
    close && close()
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

export default YamlModal
