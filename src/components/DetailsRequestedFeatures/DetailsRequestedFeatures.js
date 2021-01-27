import React from 'react'
import PropTypes from 'prop-types'

import './detailsRequestedFeatures.scss'

const DetailsRequestedFeatures = ({ selectedItem }) => {
  const headers = [{ label: 'Requested rule', id: 'requestedRule' }]

  return (
    <div className="item-requested-features">
      <div className="item-requested-features__table">
        <div className="item-requested-features__table-header">
          {headers.map(header => (
            <div
              className="item-requested-features__table-cell"
              key={header.id}
            >
              {header.label}
            </div>
          ))}
        </div>
        <div className="item-requested-features__table-body">
          {selectedItem.specFeatures.map(feature => {
            const featureSet = feature.split('.')[0]
            const featureName = feature.split('.')[1].split(' ')[0]
            const aliasPrefix = feature.split(' ')[1]
            const alias = feature.split('as')[1]

            return (
              <div className="item-requested-features__table-row" key={feature}>
                <div className="item-requested-features__table-cell_rule">
                  <span className="item-requested-features__table-cell_name">
                    {featureSet}
                  </span>
                  <span className="item-requested-features__table-cell_hash">
                    {' #'}
                  </span>
                  <span className="item-requested-features__table-cell_feature">
                    {featureName}
                  </span>
                  {aliasPrefix && (
                    <>
                      <span className="item-requested-features__table-cell_prefix">
                        {' '}
                        {aliasPrefix}
                      </span>
                      <span className="item-requested-features__table-cell_alias">
                        {alias}
                      </span>
                    </>
                  )}
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
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsRequestedFeatures
