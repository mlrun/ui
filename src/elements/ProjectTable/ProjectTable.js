import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

import TableTypeCell from '../TableTypeCell/TableTypeCell'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import './projectTable.scss'

const ProjectTable = ({ params, table }) => {
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
                    key === 'status' && 'status-cell',
                    key === 'status' &&
                      !Array.isArray(body[key].value) &&
                      `status_${body[key].value.toLowerCase()} capitalize`
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
                        body[key].href ? (
                          <a
                            href={body[key].href}
                            target="_top"
                            className="link project-data-card__table-link"
                          >
                            <Tooltip
                              template={
                                <TextTooltipTemplate text={body[key].value} />
                              }
                              textShow={true}
                            >
                              {body[key].value.startsWith(
                                params.projectName
                              )
                                ? body[key].value.slice(
                                    params.projectName.length + 1
                                  )
                                : body[key].value}
                            </Tooltip>
                          </a>
                        ) : (
                          <Link
                            className="link project-data-card__table-link"
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
                        )
                      ) : key === 'status' ? (
                        <>
                          {Array.isArray(body.status.value) ? (
                            body.status.value.map((status, index) => {
                              return (
                                <Tooltip
                                  key={index}
                                  template={
                                    <TextTooltipTemplate text={status} />
                                  }
                                >
                                  <i
                                    className={`state-${status}-job status-icon`}
                                  />
                                </Tooltip>
                              )
                            })
                          ) : (
                            <Tooltip
                              template={
                                <TextTooltipTemplate text={body[key].value} />
                              }
                            >
                              {body[key].value}
                            </Tooltip>
                          )}
                        </>
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
  params: PropTypes.shape({}).isRequired,
  table: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectTable)
