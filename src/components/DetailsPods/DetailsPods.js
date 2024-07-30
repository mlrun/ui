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
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Prism from 'prismjs'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'
import Loader from '../../common/Loader/Loader'

import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { generatePods } from './detailsPods.util'

import './detailsPods.scss'

const DetailsPods = ({ detailsStore, noDataMessage = '' }) => {
  const [selectedPod, setSelectedPod] = useState(null)
  const [table, setTable] = useState([])
  const params = useParams()

  useEffect(() => {
    setTable(generatePods(detailsStore.pods))

    return () => {
      setSelectedPod(null)
    }
  }, [detailsStore.pods, params.jobId])

  useEffect(() => {
    if (!selectedPod) {
      setSelectedPod(table[0])
    }
  }, [selectedPod, table])

  return (
    <>
      {detailsStore.pods.loading ? (
        <Loader />
      ) : detailsStore.pods.error ? (
        <div className="pods__error">Failed to fetch data. Please try again later.</div>
      ) : table.length > 0 ? (
        <div className="pods">
          <div className="pods__table">
            <div className="pods__table-body">
              {table.map((row, rowIndex) => {
                const rowClassNames = classnames(
                  'pods__table-row',
                  selectedPod?.value === row.value && 'row_active'
                )
                const podStatus =
                  row.status?.phase?.toLowerCase() === 'pending'
                    ? 'pending...'
                    : row.status?.phase?.toLowerCase() ?? ''

                return (
                  <div className={rowClassNames} key={rowIndex} onClick={() => setSelectedPod(row)}>
                    <Tooltip
                      className="data-ellipsis link"
                      template={<TextTooltipTemplate text={row.value} />}
                    >
                      {row.value}
                    </Tooltip>
                    {row.status?.phase && (
                      <Tooltip
                        className="data-ellipsis"
                        template={<TextTooltipTemplate text={podStatus} />}
                      >
                        {podStatus}
                      </Tooltip>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="pods__status">
            {selectedPod?.status && (
              <div className="pods__status-view">
                <div className="json">
                  <pre className="json-content">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: Prism.highlight(
                          JSON.stringify(selectedPod.status, null, 2),
                          Prism.languages.json,
                          'json'
                        )
                      }}
                    />
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        detailsStore.pods.podsList.length === 0 && <NoData message={noDataMessage} />
      )}
    </>
  )
}

DetailsPods.propTypes = {
  noDataMessage: PropTypes.string
}

export default connect(({ detailsStore }) => ({
  detailsStore
}))(DetailsPods)
