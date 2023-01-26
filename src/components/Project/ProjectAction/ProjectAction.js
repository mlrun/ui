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

import './ProjectAction.scss'

const ProjectAction = ({ actions, onClick }) => {
  return (
    <ul className="project-overview-actions">
      {actions.map(({ icon, id, hidden, label, handleClick, tooltip }) => {
        return !hidden ? (
          <li key={id} className="project-overview-actions__item" title={label}>
            <button
              className="project-overview-actions__item-wrapper"
              onClick={() => onClick(handleClick)}
            >
              <i className="project-overview-actions__item-icon">{icon}</i>
              <span className="link">{label}</span>
              {tooltip && <Tip text={tooltip} />}
            </button>
          </li>
        ) : null
      })}
    </ul>
  )
}

ProjectAction.defaultProps = {
  actions: [],
  onClick: () => {},
  showActions: true
}

ProjectAction.propTypes = {
  actions: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  showActions: PropTypes.bool
}

export default ProjectAction
