import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import CodeBlock from '../../common/CodeBlock/CodeBlock'
import MlReactFlow from '../../common/ReactFlow/MlReactFlow'
import RoundedIcon from '../../common/RoundedIcon/RoundedIcon'

import { ReactComponent as Back } from '../../images/back-arrow.svg'
import { ReactComponent as CloseIcon } from '../../images/close.svg'

const PipelineView = ({
  elements,
  match,
  pipeline,
  selectedStep,
  selectedStepData,
  setSelectedStep,
  stepIsSelected
}) => {
  const linkBackTitle = pipeline?.nuclio_name || pipeline?.name
  const graphViewClassNames = classnames('graph-view')

  return (
    <div className="pipeline-container">
      <div className="pipeline-header">
        <div className="link-back">
          <Link
            to={`/projects/${match.params.projectName}/models/${match.params.pageTab}`}
            className="link-back__icon"
          >
            <Tooltip template={<TextTooltipTemplate text="Back" />}>
              <Back />
            </Tooltip>
          </Link>
          <div className="link-back__title">
            <Tooltip template={<TextTooltipTemplate text={linkBackTitle} />}>
              {linkBackTitle}
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="graph-container pipeline-content">
        <div className={graphViewClassNames}>
          <MlReactFlow
            elements={elements}
            alignTriggerItem={stepIsSelected}
            onElementClick={(event, element) => {
              if (element.data?.customData) {
                setSelectedStep(element)
              }
            }}
          />
        </div>
        {stepIsSelected && (
          <div className="graph-pane">
            <div className="graph-pane__title">
              <span>{selectedStep.id}</span>
              <RoundedIcon
                onClick={() => setSelectedStep({})}
                tooltipText="Close"
              >
                <CloseIcon />
              </RoundedIcon>
            </div>
            {selectedStepData.map(rowData => (
              <div className="graph-pane__row" key={rowData.label}>
                {rowData.type === 'codeblock' ? (
                  <CodeBlock label="Arguments" codeData={rowData.value} />
                ) : (
                  <>
                    <div className="graph-pane__row-label">{rowData.label}</div>
                    <div className="graph-pane__row-value">{rowData.value}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

PipelineView.defaultProps = {
  pipeline: null
}

PipelineView.propTypes = {
  elements: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
  pipeline: PropTypes.object,
  selectedStep: PropTypes.object.isRequired,
  selectedStepData: PropTypes.array.isRequired,
  setSelectedStep: PropTypes.func.isRequired,
  stepIsSelected: PropTypes.bool.isRequired
}

export default PipelineView
