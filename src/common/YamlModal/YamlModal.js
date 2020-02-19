import React, { useRef } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { tomorrowNightBright } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
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
      <div>
        {convertedYaml && (
          <SyntaxHighlighter language="yaml" style={tomorrowNightBright}>
            {convertedYaml}
          </SyntaxHighlighter>
        )}
        <button onClick={closeYamlModal}>
          <img src={cancel} alt="Cancel" />
        </button>
      </div>
    </div>
  )
}

export default YamlModal
