import React from 'react'
import Select from '../../common/Select/select'
import refresh from '../../images/refresh.png'
import './artifactsfiltermenu.scss'

const date = (date, day, month = null) => {
  if (day) {
    date.setDate(date.getDate() - day)
  } else {
    date.setMonth(date.getMonth() - month)
  }
  return date.getTime()
}

const ArtifactsFilerMenu = ({ refreshArtifacts, changePeriod }) => {
  const periodOptions = [
    {
      label: 'Last 7 days',
      value: date(new Date(), 7)
    },
    {
      label: 'Last 14 days',
      value: date(new Date(), 14)
    },
    {
      label: 'Last months',
      value: date(new Date(), null, 1)
    },
    {
      label: 'Last 6 months',
      value: date(new Date(), null, 6)
    }
  ]

  return (
    <div className="artifacts_filter_container">
      <div className="artifacts_filter_period">
        <Select
          label="Period:"
          options={periodOptions}
          defaultIndex={0}
          onChange={value => {
            changePeriod(value)
          }}
        ></Select>
      </div>
      <div className="artifacts-filter-refresh">
        <button onClick={() => refreshArtifacts()}>
          <img src={refresh} alt="refresh" />
        </button>
      </div>
    </div>
  )
}

export default React.memo(ArtifactsFilerMenu)
