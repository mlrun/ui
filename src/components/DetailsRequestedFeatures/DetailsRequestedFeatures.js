import React from 'react'
import PropTypes from 'prop-types'

import { parseFeatureTemplate } from '../../utils/parseFeatureTemplate'

import './detailsRequestedFeatures.scss'

const DetailsRequestedFeatures = ({ projectName, selectedItem }) => {
  const headers = [
    { label: 'Project name', id: 'project-name' },
    { label: 'Feature set', id: 'feature-set' },
    { label: 'Feature', id: 'feature' },
    { label: 'Alias', id: 'alias' }
  ]

  return (
    <div className="item-requested-features">
      <div className="item-requested-features__table">
        <div className="item-requested-features__table-header">
          {headers.map(header => (
            <div
              className={`item-requested-features__table-cell header_${header.id}`}
              key={header.id}
            >
              {header.label}
            </div>
          ))}
        </div>
        <div className="item-requested-features__table-body">
          {selectedItem.specFeatures.map(featureTemplate => {
            const {
              project,
              featureSet,
              tag,
              feature,
              alias
            } = parseFeatureTemplate(featureTemplate)

            return (
              <div
                className="item-requested-features__table-row"
                key={featureTemplate}
              >
                <div className="item-requested-features__table-cell cell_project-name">
                  {project !== projectName && project}
                </div>
                <div className="item-requested-features__table-cell">
                  <span className="cell_feature-set">{featureSet}</span>
                  {tag && (
                    <>
                      <span className="cell_tag">: {tag}</span>
                    </>
                  )}
                </div>
                <div className="item-requested-features__table-cell cell_feature">
                  {feature}
                </div>
                <div className="item-requested-features__table-cell cell_alias">
                  {alias}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

DetailsRequestedFeatures.propTypes = {
  projectName: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsRequestedFeatures
