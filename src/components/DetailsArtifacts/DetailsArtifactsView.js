import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'
import Download from '../../common/Download/Download'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'

import { ReactComponent as Popout } from '../../images/popout.svg'

import './detailsArtifacts.scss'

const DetailsArtifactsView = ({
  artifactsIndexes,
  content,
  match,
  showArtifact,
  showPreview
}) => (
  <div className="item-artifacts">
    {content.map((artifact, index) => {
      const targetPath = `${
        artifact.target_path.schema ? `${artifact.target_path.schema}://` : ''
      }${artifact.target_path.path}`

      return (
        <div className="item-artifacts__row-wrapper" key={index}>
          <div className="item-artifacts__row">
            <div className="item-artifacts__row-item">
              <span
                className="item-artifacts__name"
                onClick={() => showArtifact(index)}
              >
                {artifact.key}
              </span>
              <Link
                className="artifact-details-link"
                to={`/projects/${
                  match.params.projectName
                }/artifacts/${artifact.db_key || artifact.key}/info`}
              >
                View details...
              </Link>
            </div>
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
                fileName={artifact.db_key || artifact.key}
                path={artifact.target_path.path}
                schema={artifact.target_path.schema}
                user={artifact.user}
              />
            </div>
          </div>
          {artifactsIndexes.includes(index) && (
            <div className="item-artifacts__preview">
              <ArtifactsPreview artifact={artifact} />
            </div>
          )}
        </div>
      )
    })}
  </div>
)

DetailsArtifactsView.propTypes = {
  artifactsIndexes: PropTypes.array.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  match: PropTypes.shape({}).isRequired,
  showArtifact: PropTypes.func.isRequired,
  showPreview: PropTypes.func.isRequired
}

export default DetailsArtifactsView
