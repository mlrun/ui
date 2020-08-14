import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

import TableTypeCell from '../../elements/TableTypeCell/TableTypeCell'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'

import './projectTable.scss'

const ProjectTable = ({ table }) => {
  return (
    <>
      <div className="project-data-card__table">
        <div className="project-data-card__table-header">
          {table.header.map(header => (
            <div
              key={header.value}
              className={`project-data-card__table-cell ${header.className} table-header__item`}
            >
              <Tooltip template={<TextTooltipTemplate text={header.value} />}>
                {header.value}
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="project-data-card__table-body">
          {table.body.map((body, index) => {
            return (
              <div key={index} className="project-data-card__table-row">
                {Object.keys(body).map((key, index) => {
                  const tableValueClassName = classnames(
                    'project-data-card__table-cell',
                    body[key].className,
                    key === 'status' && `status_${body[key].value} capitalize`
                  )

                  return key === 'type' ? (
                    <TableTypeCell
                      key={body[key].value + index}
                      data={body[key]}
                    />
                  ) : (
                    <div
                      key={body[key].value + index}
                      className={tableValueClassName}
                    >
                      {key === 'name' ? (
                        <Link
                          className="project-data-card__table-link"
                          to={body[key].link}
                        >
                          <Tooltip
                            template={
                              <TextTooltipTemplate text={body[key].value} />
                            }
                          >
                            {body[key].value}
                          </Tooltip>
                        </Link>
                      ) : (
                        <Tooltip
                          template={
                            <TextTooltipTemplate text={body[key].value} />
                          }
                        >
                          {body[key].value}
                        </Tooltip>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

ProjectTable.propTypes = {
  table: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectTable)
