import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import api from '../../api/artifacts-api'
import Loader from '../../common/Loader/Loader'
import DetailsResults from '../DetailsResults/DetailsResults'

const ArtifactsDetailsPreview = ({ artifact }) => {
  const [preview, setPreview] = useState({
    type: null,
    data: null
  })

  const getArtifactPreview = (schema, path) => {
    return api.getArtifactPreview(schema, path).then(res => {
      const artifact = {}
      if (res.headers['content-type'].includes('text/csv')) {
        const data = res.data.split('\n')
        if (data[0].includes('state')) {
          const headers = data[0].split(',')
          let content = data.slice(1)
          content.pop()
          content = content.map(item => item.split(','))
          artifact.type = 'table-results'
          artifact.iterationStats = [headers].concat(content)
        } else {
          let content = data.slice(1)
          content = content.map(item => item.split(','))
          content.pop()
          artifact.type = 'table'
          artifact.data = {
            headers: data[0].split(','),
            content: content
          }
        }
      } else if (res.headers['content-type'].includes('text/plain')) {
        artifact.type = 'text'
        artifact.data = {
          content: res.data
        }
      } else if (res.headers['content-type'].includes('text/html')) {
        artifact.type = 'html'
        artifact.data = {
          content: res.data
        }
      } else if (res.headers['content-type'].includes('application/json')) {
        artifact.type = 'json'
        artifact.data = {
          content: res.data
        }
      } else if (res.headers['content-type'].includes('image')) {
        artifact.type = 'image'
        artifact.data = {
          content: URL.createObjectURL(new Blob([res.data]))
        }
      } else {
        artifact.type = 'unknown'
      }
      setPreview(artifact)
    })
  }

  const [isLoader, setLoader] = useState(false)

  useEffect(() => {
    setLoader(true)
    getArtifactPreview(
      artifact.target_path.schema,
      artifact.target_path.path
    ).then(() => setLoader(false))
  }, [artifact.target_path])

  return isLoader ? (
    <Loader />
  ) : (
    <>
      {preview.type && preview.type === 'table-results' && (
        <div className="table__item_artifacts__preview_table">
          <DetailsResults job={preview} />
        </div>
      )}
      {preview.type && preview.type === 'table' && (
        <div className="table__item_artifacts__preview_table">
          <div className="table__item_artifacts__preview_table__row">
            {preview.data.headers.map(header => {
              return (
                <div
                  key={header}
                  className="table__item_artifacts__preview_table__header"
                >
                  {header}
                </div>
              )
            })}
          </div>
          {preview.data.content.map(item => (
            <div
              key={item + Math.random()}
              className="table__item_artifacts__preview_table__row"
            >
              {typeof item === typeof '' ? (
                <div className="table__item_artifacts__preview_table__row__content">
                  {item}
                </div>
              ) : (
                item.map(value => (
                  <div
                    key={value + Math.random()}
                    className="table__item_artifacts__preview_table__row__content"
                  >
                    {value}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
      {preview.data && preview.type === 'text' && (
        <div>{preview.data.content}</div>
      )}
      {preview.data && preview.type === 'html' && (
        <div>
          <iframe
            srcDoc={preview.data.content}
            frameBorder="0"
            title="Preview"
          />
        </div>
      )}
      {preview.data && preview.type === 'json' && (
        <div>
          <pre>
            <code>{preview.data.content}</code>
          </pre>
        </div>
      )}
      {preview.data && preview.type === 'image' && (
        <div>{preview.data.content}</div>
      )}
      {preview.type && preview.type === 'unknown' && <div>No preview</div>}
    </>
  )
}

ArtifactsDetailsPreview.propTypes = {
  artifact: PropTypes.shape({}).isRequired
}

export default ArtifactsDetailsPreview
