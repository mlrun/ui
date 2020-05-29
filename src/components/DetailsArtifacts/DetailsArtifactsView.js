import React from 'react'
import PropTypes from 'prop-types'

import Download from '../../common/Download/Download'
import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Accordion from '../../common/Accordion/Accordion'

import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Popout } from '../../images/popout.svg'

import './detailsArtifacts.scss'

const DetailsArtifactsView = ({ content, showPreview }) => (
  <div className="item-artifacts">
    {content.map((artifact, index) => {
      const targetPath = `${
        artifact.target_path.schema ? `${artifact.target_path.schema}://` : ''
      }${artifact.target_path.path}`

      return (
        <Accordion
          key={index}
          icon={<Arrow />}
          iconClassName="item-artifacts__arrow"
          accordionClassName="item-artifacts__row-wrapper"
        >
          <div className="item-artifacts__row">
            <div className="item-artifacts__row-item">{artifact.key}</div>
            <div className="item-artifacts__row-item item-artifacts__row-item_long">
              <Tooltip template={<TextTooltipTemplate text={targetPath} />}>
                {targetPath}
              </Tooltip>
            </div>
            <div className="item-artifacts__row-item">
              <Tooltip template={<TextTooltipTemplate text={artifact.size} />}>
                size: {artifact.size}
              </Tooltip>
            </div>
            <div className="item-artifacts__row-item">
              <Tooltip template={<TextTooltipTemplate text={artifact.date} />}>
                {artifact.date}
              </Tooltip>
            </div>
            <div className="item-artifacts__row-item item-artifacts__row-item_short">
              <Tooltip
                template={<TextTooltipTemplate text="Artifacts Preview" />}
              >
                <Popout
                  className="icon-popout"
                  onClick={() => {
                    showPreview(artifact)
                  }}
                />
              </Tooltip>
            </div>
            <div className="item-artifacts__row-item item-artifacts__row-item_short">
              <Download
                className="icon-download"
                path={artifact.target_path.path}
                schema={artifact.target_path.schema}
                user={artifact.user}
              />
            </div>
          </div>
          <div className="item-artifacts__preview">
            <ArtifactsPreview artifact={artifact} />
          </div>
        </Accordion>
      )
    })}
  </div>
)

DetailsArtifactsView.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  showPreview: PropTypes.func.isRequired
}

export default DetailsArtifactsView
