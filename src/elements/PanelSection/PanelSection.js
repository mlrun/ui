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

import { Tip } from 'igz-controls/components'

import './panelSection.scss'

const PanelSection = ({ children, tip, title, className }) => {
  return (
    <div className={`panel-section ${className}`}>
      <div className="panel-section__title">
        <h5>{title}</h5>
        {tip && <Tip className="panel-section__tip" text={tip} />}
      </div>
      {children && <div className="panel-section__body">{children}</div>}
    </div>
  )
}

PanelSection.defaultProps = {
  className: '',
  tip: ''
}

PanelSection.propTypes = {
  className: PropTypes.string,
  tip: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default PanelSection
