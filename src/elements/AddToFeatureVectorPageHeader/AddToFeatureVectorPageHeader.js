import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { FEATURE_VECTORS_TAB } from '../../constants'

import { ReactComponent as BackArrowIcon } from '../../images/back-arrow.svg'

import './addToFeatureVectorPageHeader.scss'

const AddToFeatureVectorPageHeader = ({ params }) => {
  return (
    <div className="add-to-feature-vector-header">
      <Link to={`/projects/${params.projectName}/feature-store/${FEATURE_VECTORS_TAB}`}>
        <BackArrowIcon />
      </Link>
      <h3 className="add-to-feature-vector-header__title">Add to feature vector</h3>
    </div>
  )
}

AddToFeatureVectorPageHeader.propTypes = {
  params: PropTypes.shape({}).isRequired
}

export default AddToFeatureVectorPageHeader
