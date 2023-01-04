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
import { isEmpty } from 'lodash'

import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

const DetailsInputs = ({ inputs }) => {
  return (
    <div className="inputs_container">
      {isEmpty(inputs) ? (
        <NoData />
      ) : (
        <ul className="table__item_inputs">
          {Object.entries(inputs || {}).map(([key, value]) => (
            <li className="table__item_inputs_item" key={key}>
              <div>
                <Tooltip template={<TextTooltipTemplate text={key} />}>{key}</Tooltip>
              </div>
              <div>{value}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

DetailsInputs.propTypes = {
  inputs: PropTypes.shape({}).isRequired
}

export default DetailsInputs
