import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Prism from 'prismjs'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'

import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { generatePods } from './detailsPods.util'

import './detailsPods.scss'

const DetailsPods = ({ detailsStore }) => {
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
    <div className="pods">
      {detailsStore.pods.error ? (
        <div className="pods__error">Failed to fetch data. Please try again later.</div>
      ) : table.length ? (
        <>
          <div className="pods__table">
            <div className="pods__table-body">
              {table.map((row, rowIndex) => {
                const rowClassNames = classnames(
                  'pods__table-row',
                  selectedPod?.value === row.value && 'row_active'
                )

                return (
                  <div className={rowClassNames} key={rowIndex} onClick={() => setSelectedPod(row)}>
                    <Tooltip
                      className="data-ellipsis link"
                      template={<TextTooltipTemplate text={row.value} />}
                    >
                      {row.value}
                    </Tooltip>
                    {row.pending && (
                      <Tooltip
                        className="data-ellipsis"
                        template={<TextTooltipTemplate text="pending..." />}
                      >
                        pending...
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
        </>
      ) : (
        <NoData />
      )}
    </div>
  )
}

export default connect(({ detailsStore }) => ({
  detailsStore
}))(DetailsPods)
