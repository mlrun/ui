import React, { useRef } from 'react'
import cancel from '../../images/cancel.png'

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

export default YamlModal
