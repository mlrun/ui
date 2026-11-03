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
import classnames from 'classnames'
import PropTypes from 'prop-types'

import './loader.scss'

const Loader = ({ overlay = false, secondary = false, section = false, small = false }) => {
  const wrapperClassNames = classnames(
    'loader-wrapper',
    overlay && 'overlay-loader',
    section && 'section-loader',
    small && 'small-loader',
    secondary && 'secondary-loader'
  )

  const svgSize = small ? 20 : 40

  return (
    <div className={wrapperClassNames} data-testid="loader">
      <output aria-label="Loading" className="loader-output">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="loader-icon"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </output>
    </div>
  )
}

Loader.propTypes = {
  overlay: PropTypes.bool,
  secondary: PropTypes.bool,
  section: PropTypes.bool,
  small: PropTypes.bool
}

export default React.memo(Loader)
