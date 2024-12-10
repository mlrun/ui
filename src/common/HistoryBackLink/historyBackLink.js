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
import { Link } from 'react-router-dom'

import { RoundedIcon, TextTooltipTemplate, Tooltip } from 'iguazio.dashboard-react-controls/dist/components'

import { ReactComponent as Back } from 'igz-controls/images/back-arrow.svg'
import { ReactComponent as HistoryIcon } from 'igz-controls/images/history.svg'

import './historyBackLink.scss'

const HistoryBackLink = ({ itemName, link }) => {
  return (
    <div className="history-back-link">
      <Link to={link} className="history-back-link__icon">
        <RoundedIcon id="history-back-link-btn" tooltipText="Back">
          <Back />
        </RoundedIcon>
      </Link>
      <div className="history-back-link__title">
        <HistoryIcon />
        <div className="history-back-link__title-version" data-testid="version-history">
          Version history:{' '}
        </div>
        <Tooltip template={<TextTooltipTemplate text={itemName} />}>{itemName}</Tooltip>
      </div>
    </div>
  )
}

HistoryBackLink.propTypes = {
  itemName: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
}

export default HistoryBackLink
