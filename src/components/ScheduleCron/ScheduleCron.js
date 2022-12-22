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

import Input from '../../common/Input/Input'

const ScheduleCron = ({ cron, setCron }) => {
  return (
    <>
      <p>
        Note: all times are interpreted in UTC timezone. <br />
        The first weekday (0) is always <b>Monday</b>.
      </p>
      <Input
        placeholder="10 * * * *"
        value={cron}
        className="cron-string"
        onChange={setCron}
        type="text"
      />
      <div>
        You can use{' '}
        <a
          className="link cron-link"
          rel="noopener noreferrer"
          target="_blank"
          href="https://www.freeformatter.com/cron-expression-generator-quartz.html"
        >
          this external website
        </a>{' '}
        to generate cronstring
      </div>
    </>
  )
}

ScheduleCron.propTypes = {
  cron: PropTypes.string.isRequired,
  setCron: PropTypes.func.isRequired
}

export default ScheduleCron
