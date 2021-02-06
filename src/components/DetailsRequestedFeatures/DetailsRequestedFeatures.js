import React from 'react'
import PropTypes from 'prop-types'

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
          {selectedItem.specFeatures.map(feature => {
            const project =
              feature.indexOf('/') > 0 ? feature.split('/')[0] : ''
            const featureSet = feature.match(/(?<=\/)(.*?)(?=\.)/)
              ? feature.match(/(?<=\/)(.*?)(?=\.)/)[0].split(':')[0]
              : feature.split('.')[0]
            const tag = feature.match(/(?<=\/)(.*?)(?=\.)/)
              ? feature.match(/(?<=\/)(.*?)(?=\.)/)[0].split(':')[1]
              : ''
            const featureName = feature.match(/(?<=\.)(.*?)(?=as)/)
              ? feature.match(/(?<=\.)(.*?)(?=as)/)[0]
              : feature.split('.')[1]
            const alias = feature.split('as')[1]

            return (
              <div className="item-requested-features__table-row" key={feature}>
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
                  {featureName}
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
