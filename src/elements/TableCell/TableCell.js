/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import ChipCell from '../../common/ChipCell/ChipCell'
import CopyToClipboard from '../../common/CopyToClipboard/CopyToClipboard'
import Download from '../../common/Download/Download'
import TableLinkCell from '../TableLinkCell/TableLinkCell'
import TableProducerCell from '../TableProducerCell/TableProducerCell'
import TableTypeCell from '../TableTypeCell/TableTypeCell'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { BUTTON_COPY_URI_CELL_TYPE } from '../../constants'
import { getChipOptions } from '../../utils/getChipOptions'
import { showArtifactsPreview } from '../../reducers/artifactsReducer'
import { truncateUid } from '../../utils'

import { ReactComponent as ArtifactView } from 'igz-controls/images/eye.svg'
import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'

const TableCell = ({
  className,
  data,
  firstCell,
  handleExpandRow,
  item,
  link,
  selectItem,
  selectedItem,
  showExpandButton
}) => {
  const dispatch = useDispatch()
  const { value: stateValue, label: stateLabel, className: stateClassName } = item.state ?? {}

  if (link && data.type !== 'hidden') {
    return (
      <TableLinkCell
        className={className}
        data={data}
        showExpandButton={showExpandButton}
        handleExpandRow={handleExpandRow}
        item={item}
        link={link}
        selectItem={selectItem}
        selectedItem={selectedItem}
      />
    )
  } else if (firstCell && !link) {
    return (
      <div className={`table-body__cell ${data.class} ${className}`}>
        {item.state && stateValue && stateLabel && (
          <Tooltip className="status" template={<TextTooltipTemplate text={stateLabel} />}>
            <i className={stateClassName} />
          </Tooltip>
        )}
        {!item.state && item.status && (
          <Tooltip className="status" template={<TextTooltipTemplate text={item.status} />}>
            <i className={`${item.status[0].toLowerCase()}${item.status.slice(1)}`} />
          </Tooltip>
        )}
        <span className="cell_name data-ellipsis">
          {data && (
            <Tooltip
              className="text_small"
              template={<TextTooltipTemplate text={data.tooltip || data.value} />}
            >
              {data.value}
            </Tooltip>
          )}
        </span>
        {showExpandButton && (
          <Arrow onClick={e => handleExpandRow(e, item)} className="expand-arrow" />
        )}
      </div>
    )
  } else if (data.type === 'type') {
    return <TableTypeCell className={className} data={data} />
  } else if (data.type === 'icons') {
    return (
      <div className={`table-body__cell ${data.class} ${className}`}>
        {data.value.map((valueItem, index) => (
          <Tooltip
            key={valueItem.tooltip + index}
            template={<TextTooltipTemplate text={valueItem.tooltip} />}
          >
            {valueItem.icon}
          </Tooltip>
        ))}
      </div>
    )
  } else if (Array.isArray(data.value)) {
    return (
      <div className={`table-body__cell ${data.class} ${className}`}>
        <ChipCell chipOptions={getChipOptions(data.type)} elements={data.value} tooltip />
      </div>
    )
  } else if (data.type === 'producer') {
    return <TableProducerCell className={className} data={data} />
  } else if (data.type === 'buttonPopout') {
    return (
      <div className={`table-body__cell ${data.class} ${className}`}>
        <button
          onClick={() => {
            dispatch(
              showArtifactsPreview({
                isPreview: true,
                selectedItem: item
              })
            )
          }}
        >
          <Tooltip template={<TextTooltipTemplate text="Artifact Preview" />}>
            <ArtifactView />
          </Tooltip>
        </button>
      </div>
    )
  } else if (data.type === 'buttonDownload') {
    return (
      <div className={`table-body__cell ${data.class} ${className}`}>
        <Tooltip template={<TextTooltipTemplate text="Download" />}>
          <Download
            path={`${item?.target_path}${item?.model_file ? item.model_file : ''}`}
            user={item?.producer?.owner || item.user}
          />
        </Tooltip>
      </div>
    )
  } else if (data.type === BUTTON_COPY_URI_CELL_TYPE) {
    return (
      <div className={`table-body__cell ${data.class} ${className}`}>
        <CopyToClipboard tooltipText="Copy URI" textToCopy={data.actionHandler(item)} />
      </div>
    )
  } else if (data.type === 'hash') {
    return (
      <div className={`table-body__cell ${data.class} ${className}`}>
        <Tooltip template={<TextTooltipTemplate text={data.value} />}>
          <span>{truncateUid(data.value)}</span>
        </Tooltip>
      </div>
    )
  } else if (data.type === 'hidden') {
    return null
  } else if (data.type === 'component') {
    return <div className={`table-body__cell ${data.class} ${className}`}>{data.value}</div>
  } else {
    return (
      <div className={`table-body__cell ${data.class} ${className}`}>
        <Tooltip
          className="text_small"
          template={<TextTooltipTemplate text={data.tooltip || data.value} />}
        >
          {data.value}
        </Tooltip>
      </div>
    )
  }
}

TableCell.defaultProps = {
  className: '',
  expandLink: false,
  firstRow: false,
  handleExpandRow: null,
  item: {
    target_path: '',
    schema: ''
  },
  link: '',
  match: null,
  selectItem: () => {},
  selectedItem: {},
  showExpandButton: false
}

TableCell.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape({}).isRequired,
  firstCell: PropTypes.bool,
  handleExpandRow: PropTypes.func,
  item: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  selectItem: PropTypes.func,
  selectedItem: PropTypes.shape({}),
  showExpandButton: PropTypes.bool
}

export default TableCell
