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
import classnames from 'classnames'
import { Link } from 'react-router-dom'

import TableTypeCell from '../TableTypeCell/TableTypeCell'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import './projectTable.scss'

const ProjectTable = ({ params, table }) => {
  return (
    <>
      <table className="project-data-card__table" cellPadding="0" cellSpacing="0">
        <thead>
          <tr className="project-data-card__table-header">
            {table.header.map(header => (
              <th
                key={header.value}
                className={`project-data-card__table-cell ${header.className} table-header-item`}
              >
                <Tooltip template={<TextTooltipTemplate text={header.value} />}>
                  {header.value}
                </Tooltip>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="project-data-card__table-body">
          {table.body.map((body, index) => {
            const extractedItemName = body['name'].value.startsWith(params.projectName)
              ? body['name'].value.slice(params.projectName.length + 1)
              : body['name'].value

            return (
              <tr key={index} className="project-data-card__table-row">
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
                    <TableTypeCell key={body[key].value + index} data={body[key]} />
                  ) : (
                    <td key={body[key].value + index} className={tableValueClassName}>
                      {key === 'name' ? (
                        body[key].href ? (
                          <a
                            href={body[key].href}
                            target="_top"
                            className="link project-data-card__table-link"
                          >
                            <Tooltip
                              template={<TextTooltipTemplate text={extractedItemName} />}
                              textShow={true}
                            >
                              {extractedItemName}
                            </Tooltip>
                          </a>
                        ) : (
                          <Link className="link project-data-card__table-link" to={body[key].link}>
                            <Tooltip template={<TextTooltipTemplate text={body[key].value} />}>
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
                                  template={<TextTooltipTemplate text={status} />}
                                >
                                  <i className={`state-${status}-job status-icon`} />
                                </Tooltip>
                              )
                            })
                          ) : (
                            <Tooltip template={<TextTooltipTemplate text={body[key].value} />}>
                              {body[key].value}
                            </Tooltip>
                          )}
                        </>
                      ) : (
                        <Tooltip template={<TextTooltipTemplate text={body[key].value} />}>
                          {body[key].value}
                        </Tooltip>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

ProjectTable.propTypes = {
  params: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired
}

export default React.memo(ProjectTable)
