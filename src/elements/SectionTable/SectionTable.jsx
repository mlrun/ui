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

import { TableTypeCell } from 'igz-controls/elements'
import { TextTooltipTemplate, Tooltip, Tip, Loader, ReadOnlyChips } from 'igz-controls/components'

import './SectionTable.scss'

const SectionTable = ({ loading = false, params, table }) => {
  return loading ? (
    <Loader section secondary />
  ) : (
    <>
      <table className="section-table" cellPadding="0" cellSpacing="0">
        <thead>
          <tr className="section-table__table-header">
            <>
              {table.header.map(
                header =>
                  !header.hidden && (
                    <th
                      key={header.value}
                      className={`section-table__table-cell ${header.className} table-header-item`}
                    >
                      <Tooltip template={<TextTooltipTemplate text={header.value} />}>
                        {header.value}
                      </Tooltip>
                      {header.tip && <Tip text={header.tip} />}
                    </th>
                  )
              )}
            </>
          </tr>
        </thead>
        <tbody className="section-table__table-body">
          {table.body.map((body, index) => {
            const extractedItemName = body['name'].value.startsWith(params.projectName)
              ? body['name'].value.slice(params.projectName.length + 1)
              : body['name'].value

            return (
              <tr key={index} className="section-table__table-row">
                <>
                  {Object.keys(body).map((key, index) => {
                    const tableValueClassName = classnames(
                      'section-table__table-cell',
                      body[key].className,
                      key === 'name' && 'name-wrapper',
                      key === 'status' && 'status-cell',
                      key === 'status' &&
                        !Array.isArray(body[key].value) &&
                        `status_${body?.[key]?.value?.toLowerCase?.()} capitalize`
                    )

                    return (
                      !body[key].hidden &&
                      (key === 'type' ? (
                        <TableTypeCell key={body[key].value + index} cellData={body[key]} />
                      ) : (
                        <td key={body[key].value + index + key} className={tableValueClassName}>
                          {key === 'name' ? (
                            <>
                              {body[key].href ? (
                                <a
                                  href={body[key].href}
                                  target="_top"
                                  className="link section-table__table-link"
                                >
                                  <Tooltip
                                    className="item-name"
                                    template={<TextTooltipTemplate text={extractedItemName} />}
                                    textShow={true}
                                  >
                                    {extractedItemName}
                                  </Tooltip>
                                </a>
                              ) : body[key].link ? (
                                <Link className="link section-table__table-link" to={body[key].link}>
                                  <Tooltip className="item-name" template={<TextTooltipTemplate text={body[key].value} />}>
                                    {body[key].value}
                                  </Tooltip>
                                </Link>
                              ) : (
                                <Tooltip className="item-name" template={<TextTooltipTemplate text={body[key].value} />}>
                                  {body[key].value}
                                </Tooltip>
                              )}
                              
                              {body[key].tag ? (
                                <Tooltip className="item-tag" template={<TextTooltipTemplate text={body[key].tag} />}>
                                  {body[key].tag}
                                </Tooltip>
                              ) : null}
                            </>
                          ) : key === 'labels' ? (
                            <ReadOnlyChips labels={body.labels.value} shortChips />
                          ) : key === 'status' ? (
                            <>
                              {Array.isArray(body.status.value) ? (
                                body.status.value.map((status, index) => {
                                  return (
                                    <Tooltip
                                      key={body.status.value + index}
                                      template={<TextTooltipTemplate text={status} />}
                                    >
                                      <i className={`state-${status}-job status-icon`} />
                                    </Tooltip>
                                  )
                                })
                              ) : (
                                <Tooltip
                                  template={
                                    <TextTooltipTemplate
                                      text={body[key].tooltip || body[key].value}
                                    />
                                  }
                                >
                                  {body[key].value}
                                </Tooltip>
                              )}
                            </>
                          ) : (
                            <>
                              <Tooltip
                                template={
                                  <TextTooltipTemplate
                                    text={body[key].tooltip || body[key].value}
                                  />
                                }
                              >
                                {body[key].value}
                              </Tooltip>
                              {body[key].status && (
                                <Tooltip
                                  key={body[key].status + index}
                                  template={<TextTooltipTemplate text={body[key].status} />}
                                >
                                  <i className={`state-${body[key].status}-job status-icon`} />
                                </Tooltip>
                              )}
                            </>
                          )}
                        </td>
                      ))
                    )
                  })}
                </>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

SectionTable.propTypes = {
  loading: PropTypes.bool,
  params: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired
}

export default React.memo(SectionTable)
