import React from 'react'
import PropTypes from 'prop-types'
import prettyBytes from 'pretty-bytes'
import { useDispatch } from 'react-redux'

import DetailsArtifactsView from './DetailsArtifactsView'

import { formatDatetime } from '../../utils'
import artifactAction from '../../actions/artifacts'
import { generateArtifactPreviewData } from '../../utils/generateArtifactPreviewData'

const DetailsArtifacts = ({ selectedItem }) => {
  const dispatch = useDispatch()

  const content = selectedItem.artifacts.map(artifact => {
    const indexOfSchema = artifact.target_path.indexOf('://')
    const schema =
      indexOfSchema > 0 ? artifact.target_path.slice(0, indexOfSchema) : ''
    let generatedPreviewData = {
      preview: [],
      extraDataPath: ''
    }

    if (artifact.extra_data) {
      generatedPreviewData = generateArtifactPreviewData(
        artifact.extra_data,
        schema
      )
    }

    const target_path = {
      schema: schema,
      path: generatedPreviewData.extraDataPath
        ? generatedPreviewData.extraDataPath
        : indexOfSchema > 0
        ? artifact.target_path.slice(indexOfSchema + '://'.length)
        : artifact.target_path
    }

    const generatedArtifact = {
      date: formatDatetime(selectedItem.startTime),
      key: artifact.key,
      preview: generatedPreviewData.preview,
      size: artifact.size ? prettyBytes(artifact.size) : 'N/A',
      target_path: target_path,
      user: selectedItem?.labels
        ?.find(item => item.match(/v3io_user|owner/g))
        .replace(/(v3io_user|owner): /, '')
    }

    if (artifact.schema) {
      return {
        ...generatedArtifact,
        header: artifact.header,
        preview: artifact.preview,
        schema: artifact.schema
      }
    }

    return generatedArtifact
  })

  const showPreview = artifact => {
    dispatch(
      artifactAction.showArtifactsPreview({
        isPreview: true,
        selectedItem: artifact
      })
    )
  }

  return <DetailsArtifactsView content={content} showPreview={showPreview} />
}

DetailsArtifacts.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsArtifacts
