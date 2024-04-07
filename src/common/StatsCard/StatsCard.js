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

import './statsCard.scss'

const StatsCard = ({ children, className, onClick }) => {
  return (
    <div className={`stats-card ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

StatsCard.Header = ({ children, title }) => {
  return (
    <div className="stats-card__row">
      {title && <h5 className="stats-card__title">{title}</h5>}
      {children}
    </div>
  )
}

StatsCard.Row = ({ children }) => {
  return <div className="stats-card__row">{children}</div>
}

StatsCard.Col = ({ children }) => {
  return <div className="stats-card__col">{children}</div>
}

StatsCard.defaultProps = {
  className: '',
  onClick: () => {}
}

StatsCard.Header.defaultProps = {
  children: null,
  title: ''
}

StatsCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
}

StatsCard.Header.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
}

export default StatsCard
