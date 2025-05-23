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
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { FEATURE_VECTORS_TAB } from '../../constants'

import BackArrowIcon from 'igz-controls/images/back-arrow.svg?react'

import { RoundedIcon } from 'igz-controls/components'

import './addToFeatureVectorPageHeader.scss'

const AddToFeatureVectorPageHeader = ({ params }) => {
  return (
    <div className="add-to-feature-vector-header">
      <Link
        to={`/projects/${params.projectName}/feature-store/${FEATURE_VECTORS_TAB}`}
        data-testid="feature-vector-back-btn"
      >
        <RoundedIcon tooltipText="Go to list">
          <BackArrowIcon />
        </RoundedIcon>
      </Link>
      <h3 className="add-to-feature-vector-header__title">Add to feature vector</h3>
    </div>
  )
}

AddToFeatureVectorPageHeader.propTypes = {
  params: PropTypes.object.isRequired
}

export default AddToFeatureVectorPageHeader
