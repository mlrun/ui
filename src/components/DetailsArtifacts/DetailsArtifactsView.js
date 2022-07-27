import React from 'react'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'
import Download from '../../common/Download/Download'
import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { DATASETS, MODELS_TAB, TAG_FILTER_LATEST } from '../../constants'

import { ReactComponent as Popout } from 'igz-controls/images/popout.svg'
import { ReactComponent as DetailsIcon } from 'igz-controls/images/view-details.svg'

import './detailsArtifacts.scss'

const DetailsArtifactsView = ({
  artifactsIndexes,
  content,
  iteration,
  loading,
  noData,
  preview,
  showArtifact,
  showPreview
}) => {
  const params = useParams()

  return (
    <div className="item-artifacts">
      {loading ? null : content.length === 0 ? (
        <NoData />
      ) : (
        content.map((artifact, index) => {
          const artifactScreenLinks = {
            model: `/projects/${params.projectName}/models/${MODELS_TAB}/${
              artifact.db_key || artifact.key
            }/${artifact.tag ?? TAG_FILTER_LATEST}/${iteration}/overview`,
            dataset: `/projects/${params.projectName}/${DATASETS}/${
              artifact.db_key || artifact.key
            }/${artifact.tag ?? TAG_FILTER_LATEST}/${iteration}/overview`
          }

          return (
            <div className="item-artifacts__row-wrapper" key={index}>
              <div className="item-artifacts__row">
                <div className="item-artifacts__row-item">
                  <Tooltip
                    className="item-artifacts__name"
                    template={<TextTooltipTemplate text={artifact.key} />}
                  >
                    <span className="link" onClick={() => showArtifact(index)}>
                      {artifact.key}
                    </span>
                  </Tooltip>
                </div>
                <div className="item-artifacts__row-item item-artifacts__row-item_long">
                  <Tooltip template={<TextTooltipTemplate text={artifact.target_path} />}>
                    {artifact.target_path}
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
                  <Tooltip template={<TextTooltipTemplate text="Show Details" />}>
                    <Link
                      target="_blank"
                      to={
                        artifactScreenLinks[artifact.kind] ??
                        `/projects/${params.projectName}/files/${artifact.db_key || artifact.key}/${
                          artifact.tag ?? TAG_FILTER_LATEST
                        }/${iteration}/overview`
                      }
                    >
                      <DetailsIcon />
                    </Link>
                  </Tooltip>
                </div>
                <div className="item-artifacts__row-item item-artifacts__row-item_short">
                  <Download
                    className="icon-download"
                    path={artifact.target_path}
                    user={artifact.user}
                  />
                </div>
              </div>
              {artifactsIndexes.includes(index) && (
                <div className="item-artifacts__preview">
                  <Tooltip
                    template={<TextTooltipTemplate text="Artifacts Preview" />}
                    className="icon-popout"
                  >
                    <Popout
                      onClick={() => {
                        showPreview(artifact)
                      }}
                    />
                  </Tooltip>
                  <ArtifactsPreview noData={noData} preview={preview[index] || []} />
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

DetailsArtifactsView.propTypes = {
  artifactsIndexes: PropTypes.array.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  iteration: PropTypes.string.isRequired,
  noData: PropTypes.bool.isRequired,
  preview: PropTypes.shape({}).isRequired,
  showArtifact: PropTypes.func.isRequired,
  showPreview: PropTypes.func.isRequired
}

export default DetailsArtifactsView
