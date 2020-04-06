import React from 'react'
import PropTypes from 'prop-types'

import Download from '../../common/Download/Download'
import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Popout } from '../../images/popout.svg'

import artifactAction from '../../actions/artifacts'

import './detailsArtifacts.scss'

const DetailsArtifactsView = ({ items, handleClick, dispatch }) => {
  return (
    <div className="table__item_artifacts">
      {items.map((item, i) => {
        const targetPath = `${
          item.target_path.schema ? `${item.target_path.schema}://` : ''
        }${item.target_path.path}`
        return (
          <div key={i} className="table__item_artifacts_wrapper">
            <div className="table__item_artifacts__row">
              <div
                className="table__item_artifacts__row_item"
                onClick={handleClick}
              >
                <Arrow className="arrow" />
                {item.key}
              </div>
              <div className="table__item_artifacts__row_item table__item_artifacts__row_item_long">
                <Tooltip
                  className="table__item_artifacts__row__cell_path"
                  template={<TextTooltipTemplate text={targetPath} />}
                >
                  {targetPath}
                </Tooltip>
              </div>
              <div className="table__item_artifacts__row_item">
                size: {item.size}
              </div>
              <div className="table__item_artifacts__row_item">{item.date}</div>
              <div className="table__item_artifacts__row_item table__item_artifacts__row_item_short">
                <Tooltip
                  template={<TextTooltipTemplate text="Artifacts Preview" />}
                >
                  <Popout
                    onClick={() => {
                      dispatch(
                        artifactAction.showArtifactsPreview({
                          isPreview: true,
                          item: item
                        })
                      )
                    }}
                  />
                </Tooltip>
              </div>
              <div className="table__item_artifacts__row_item table__item_artifacts__row_item_short">
                <Download
                  path={item.target_path.path}
                  schema={item.target_path.schema}
                  user={item.user}
                />
              </div>
            </div>
            <div className="table__item_artifacts__preview" key={i + 1}>
              <ArtifactsPreview artifact={item} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

DetailsArtifactsView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleClick: PropTypes.func.isRequired
}

export default DetailsArtifactsView
