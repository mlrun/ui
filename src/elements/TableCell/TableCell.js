import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import ChipCell from '../ChipCell/ChipCell'
import Download from '../../common/Download/Download'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import ProducerTooltipTemplate from '../TooltipTemplate/ProducerTooltipTemplate'
import TableLinkCell from '../TableLinkCell/TableLinkCell'
import TableTypeCell from '../TableTypeCell/TableTypeCell'

import { ReactComponent as ArtifactView } from '../../images/eye.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'

import artifactAction from '../../actions/artifacts'

import { truncateUid } from '../../utils'
import jobsData from '../../components/JobsPage/jobsData'
import { useDispatch } from 'react-redux'

const TableCell = ({
  data,
  firstRow,
  item,
  link,
  selectItem,
  selectedItem,
  match,
  expandLink,
  handleExpandRow
}) => {
  const dispatch = useDispatch()
  if (link) {
    return (
      <TableLinkCell
        handleExpandRow={handleExpandRow}
        selectedItem={selectedItem}
        expandLink={expandLink}
        link={link}
        item={item}
        selectItem={selectItem}
        data={data}
      />
    )
  } else if (data.type === 'uid') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Tooltip
          textShow={true}
          template={<TextTooltipTemplate text={data.value} />}
        >
          {truncateUid(data.value)}
        </Tooltip>
      </div>
    )
  } else if (firstRow) {
    return (
      <div className={`table-body__cell ${data.size}`}>
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
      <div className={`table-body__cell ${data.size}`}>
        <ChipCell
          className={`table-body__${data.type}`}
          elements={data.value}
          tooltip
        />
      </div>
    )
  } else if (data.type === 'producer') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        {data.value.uri && (
          <Tooltip
            template={
              <ProducerTooltipTemplate
                kind={data.value.kind}
                owner={data.value.owner ? data.value.owner : ''}
              />
            }
          >
            <Link
              to={`/projects/${match.params.projectName}/jobs/${data.value
                .uri && data.value.uri.split('/')[1]}/${
                jobsData.detailsMenu[0]
              }`}
            >
              {data.value.name}
            </Link>
          </Tooltip>
        )}
      </div>
    )
  } else if (data.type === 'buttonPopout') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <button
          onClick={() => {
            dispatch(
              artifactAction.artifactPreview({
                isPreview: true,
                item
              })
            )
          }}
        >
          <ArtifactView />
        </button>
      </div>
    )
  } else if (data.type === 'buttonDownload') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Download
          path={item?.target_path.path}
          schema={item?.target_path.schema}
          user={item?.producer?.owner}
        />
      </div>
    )
  } else if (data.type === 'path') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Tooltip
          className="table-body__cell_path"
          template={<TextTooltipTemplate text={data.value.path} />}
        >
          {`${data.value.schema ? `${data.value.schema}://` : ''}${
            data.value.path
          }`}
        </Tooltip>
      </div>
    )
  } else if (data.type === 'hash') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Tooltip template={<TextTooltipTemplate text={data.value} />}>
          <span>{truncateUid(data.value)}</span>
        </Tooltip>
      </div>
    )
  } else if (data.type === 'hidden') {
    return null
  } else {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <span>{data.value}</span>
      </div>
    )
  }
}

TableCell.defaultProps = {
  item: {
    target_path: '',
    schema: ''
  },
  link: ''
}

TableCell.propTypes = {
  data: PropTypes.shape({}).isRequired,
  item: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default TableCell
