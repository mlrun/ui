import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import primaryIcon from '../../images/ic-key.png'

import './artifactinfometadata.scss'

const ArtifactInfoMetadata = ({ item }) => {
  const { primaryKey } = item.schema
  let metadata = item.schema.fields.map(_item => {
    const { name, type } = _item
    return {
      '': '', //column of primary key
      name: name,
      type: type,
      count: item?.stats?.[name]?.count,
      mean: item?.stats?.[name]?.mean,
      std: item?.stats?.[name]?.std?.toFixed(8),
      min: item?.stats?.[name]?.min,
      '25%': item?.stats?.[name]?.['25%'],
      '50%': item?.stats?.[name]?.['50%'],
      '75%': item?.stats?.[name]?.['75%'],
      max: item?.stats?.[name]?.max
    }
  })

  let headers = metadata.reduce((prev, cur) => {
    return Object.keys(cur)
  }, {})

  return (
    <div className="artifact_metadata_table">
      <div className="artifact_metadata_table_header">
        {headers.map(header => {
          return (
            <div className="artifact_metadata_table_header_item" key={header}>
              <span>{header}</span>
            </div>
          )
        })}
      </div>
      <div className="artifact_metadata_table_body">
        {metadata.map(item => {
          return (
            <div key={item.name} className="artifact_metadata_table_body_row">
              {Object.keys(item).map(key => {
                return (
                  <div
                    key={key}
                    className="artifact_metadata_table_body_row_item"
                  >
                    {key === '' && primaryKey.includes(item.name) ? (
                      <Tooltip
                        template={<TextTooltipTemplate text={'Primary key'} />}
                      >
                        <img src={primaryIcon} alt="key" />
                      </Tooltip>
                    ) : key === 'name' ? (
                      <Tooltip
                        template={<TextTooltipTemplate text={item[key]} />}
                      >
                        {item[key]}
                      </Tooltip>
                    ) : (
                      key !== '' &&
                      item[key] !== undefined && <span>{item[key]} </span>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

ArtifactInfoMetadata.propTypes = {
  item: PropTypes.shape({}).isRequired
}

export default ArtifactInfoMetadata
