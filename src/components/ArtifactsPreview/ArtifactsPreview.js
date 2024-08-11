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
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ArtifactsPreviewView from './ArtifactsPreviewView'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'

const ArtifactsPreview = ({ className = '', noData, preview }) => {
  const [showErrorBody, setShowErrorBody] = useState(false)
  const artifactsPreviewClasses = classnames('artifact-preview', className)

  return !noData && preview.length === 0 ? (
    <div className="loader-container">
      <Loader />
    </div>
  ) : noData ? (
    <NoData />
  ) : (
    <>
      {preview.map((previewItem, index) => (
        <ArtifactsPreviewView
          className={artifactsPreviewClasses}
          key={index}
          preview={previewItem}
          setShowErrorBody={setShowErrorBody}
          showErrorBody={showErrorBody}
        />
      ))}
    </>
  )
}

ArtifactsPreview.propTypes = {
  className: PropTypes.string,
  noData: PropTypes.bool.isRequired,
  preview: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string,
      error: PropTypes.shape({
        text: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired
      }),
      type: PropTypes.string.isRequired,
      data: PropTypes.shape({
        headers: PropTypes.arrayOf(PropTypes.string),
        content: PropTypes.any.isRequired
      })
    })
  ).isRequired
}

export default ArtifactsPreview
