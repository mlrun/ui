import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import api from '../../api/artifacts-api'
import Loader from '../../common/Loader/Loader'
import './artifactsdetailspreview.scss'

const fetchPreviewData = (schema, path, setPreview, setLoader) => {
  api.getArtifactPreview(schema, path).then(res => {
    if (res.headers['content-type'].includes('text/html')) {
      setPreview({
        type: 'text/html',
        data: res.data
      })
    } else if (res.headers['content-type'].includes('text/csv')) {
      setPreview({
        type: 'text/csv',
        data: res.data.split('\n').map(item => item.split(','))
      })
    } else if (
      res.headers['content-type'].includes('application/octet-stream')
    ) {
      setPreview({
        type: 'application/octet-stream',
        data: null
      })
    } else if (res.headers['content-type'].includes('text/plain')) {
      setPreview({
        type: 'text/plain',
        data: res.data
      })
    }
    setLoader(false)
  })
}

const ArtifactsDetailsPreview = ({ artifact }) => {
  const [preview, setPreview] = useState({
    type: null,
    data: null
  })

  const [isLoader, setLoader] = useState(false)

  let isSchemaExist = /^([\w\d]+)(?=:)/gi.test(artifact.target_path)
  let path = isSchemaExist
    ? artifact.target_path.match(/(?<=\/{2})([\w\W\d]+)|^\/([\w\W\d]+)/gi)[0]
    : null
  let schema = isSchemaExist
    ? artifact.target_path.match(/^([\w\d]+)(?=:)/gi)[0]
    : null

  useEffect(() => {
    setLoader(true)
    fetchPreviewData(
      schema,
      path ? path : artifact.target_path,
      setPreview,
      setLoader
    )
  }, [schema, path, artifact.target_path])

  return (
    <div className="preview_container">
      {isLoader ? (
        <Loader />
      ) : (
        <>
          {preview.type === 'text/csv' &&
            preview.data.map((item, _index) => {
              if (item.length === 1) {
                return null
              }
              return (
                <div
                  key={_index}
                  className={
                    _index === 0 && Object.is(Number(item[0]), NaN)
                      ? 'preview_container_item_header'
                      : 'preview_container_item'
                  }
                >
                  {item.map((item, index) => (
                    <div
                      className={
                        _index === 0 && Object.is(Number(item), NaN)
                          ? 'preview_header'
                          : 'preview_value'
                      }
                      key={item + index}
                    >
                      {['completed', 'running', 'failed'].includes(item) ? (
                        <div className={item}></div>
                      ) : (
                        item
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          {preview.type === 'text/html' && (
            <iframe srcDoc={preview.data} frameBorder="0" title="Preview" />
          )}
          {preview.type === 'application/octet-stream' && (
            <div className="no_preview">No preview</div>
          )}
          {preview.type === 'text/plain' && (
            <div className="preview_text">{preview.data}</div>
          )}
        </>
      )}
    </div>
  )
}

ArtifactsDetailsPreview.propTypes = {
  artifact: PropTypes.shape({}).isRequired
}

export default ArtifactsDetailsPreview
