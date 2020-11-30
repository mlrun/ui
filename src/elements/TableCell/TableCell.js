import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { capitalize } from 'lodash'

import ChipCell from '../../common/ChipCell/ChipCell'
import Download from '../../common/Download/Download'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import TableLinkCell from '../TableLinkCell/TableLinkCell'
import TableTypeCell from '../TableTypeCell/TableTypeCell'
import TableProducerCell from '../TableProducerCell/TableProducerCell'

import { ReactComponent as ArtifactView } from '../../images/eye.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'

import artifactAction from '../../actions/artifacts'
import { truncateUid } from '../../utils'

const TableCell = ({
  data,
  expandLink,
  firstRow,
  handleExpandRow,
  isGroupedByWorkflow,
  item,
  link,
  match,
  selectItem,
  selectedItem
}) => {
  const dispatch = useDispatch()

  if (link && !isGroupedByWorkflow && data.type !== 'hidden') {
    return (
      <TableLinkCell
        data={data}
        expandLink={expandLink}
        handleExpandRow={handleExpandRow}
        item={item}
        link={link}
        selectItem={selectItem}
        selectedItem={selectedItem}
      />
    )
  } else if (firstRow || (link && isGroupedByWorkflow)) {
    return (
      <div className={`table-body__cell ${data.class}`}>
        {data && data.value}
        <Arrow
          onClick={e => handleExpandRow(e, item)}
          className="expand-arrow"
        />
      </div>
    )
  } else if (data.type === 'type') {
    return <TableTypeCell data={data} />
  } else if (Array.isArray(data.value)) {
    return (
      <div className={`table-body__cell ${data.class}`}>
        <ChipCell
          className={`table-body__${data.type}`}
          elements={data.value}
          tooltip
        />
      </div>
    )
  } else if (data.type === 'producer') {
    return <TableProducerCell data={data} match={match} />
  } else if (data.type === 'buttonPopout') {
    return (
      <div className={`table-body__cell ${data.class}`}>
        <button
          onClick={() => {
            dispatch(
              artifactAction.showArtifactsPreview({
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
      <div className={`table-body__cell ${data.class}`}>
        <Tooltip template={<TextTooltipTemplate text="Download" />}>
          <Download
            fileName={item?.db_key || item?.key}
            path={item?.target_path.path}
            schema={item?.target_path.schema}
            user={item?.producer?.owner || item.user}
          />
        </Tooltip>
      </div>
    )
  } else if (data.type === 'hash') {
    return (
      <div className={`table-body__cell ${data.class}`}>
        <Tooltip template={<TextTooltipTemplate text={data.value} />}>
          <span>{truncateUid(data.value)}</span>
        </Tooltip>
      </div>
    )
  } else if (data.type === 'hidden') {
    return null
  } else if (data.type === 'date with state') {
    return (
      <div
        className={`table-body__cell table-body__cell_last-run ${data.class}`}
      >
        <Tooltip
          className="status"
          template={<TextTooltipTemplate text={capitalize(data.value.state)} />}
        >
          <i className={data.value.state} />
        </Tooltip>
        <Tooltip
          className="text_small"
          template={<TextTooltipTemplate text={data.value.date} />}
        >
          {data.value.date}
        </Tooltip>
      </div>
    )
  } else {
    return (
      <div className={`table-body__cell ${data.class}`}>
        <Tooltip
          className="text_small"
          template={<TextTooltipTemplate text={data.value} />}
        >
          {data.value}
        </Tooltip>
      </div>
    )
  }
}

TableCell.defaultProps = {
  expandLink: false,
  firstRow: false,
  handleExpandRow: null,
  isGroupedByWorkflow: false,
  item: {
    target_path: '',
    schema: ''
  },
  link: '',
  match: null
}

TableCell.propTypes = {
  data: PropTypes.shape({}).isRequired,
  expandLink: PropTypes.bool,
  firstRow: PropTypes.bool,
  handleExpandRow: PropTypes.func,
  isGroupedByWorkflow: PropTypes.bool,
  item: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  match: PropTypes.shape({}),
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default TableCell
