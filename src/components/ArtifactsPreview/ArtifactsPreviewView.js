import React from 'react'
import PropTypes from 'prop-types'
import Prism from 'prismjs'

import DetailsResults from '../DetailsResults/DetailsResults'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import PreviewError from './PreviewError/PreviewError'

const ArtifactsPreviewView = ({ preview, setShowError, showError }) => (
  <div className="item-artifacts__preview-content">
    {preview.header && <h2 className="preview-header">{preview.header}</h2>}
    {preview.error?.text?.length > 0 ? (
      <PreviewError
        error={preview.error}
        setShowError={setShowError}
        showError={showError}
      />
    ) : (
      <>
        {preview?.type === 'table-results' && (
          <div className="preview-table">
            <DetailsResults job={preview} />
          </div>
        )}
        {preview?.type === 'table' && (
          <div className="preview-table">
            <div className="preview-table__row table-header">
              {preview.data.headers.map(header => {
                return (
                  <div key={header} className="preview-table__content">
                    <Tooltip template={<TextTooltipTemplate text={header} />}>
                      {header}
                    </Tooltip>
                  </div>
                )
              })}
            </div>
            <div className="preview-table__body">
              {preview.data.content.map(contentItem => (
                <div
                  key={contentItem + Math.random()}
                  className="preview-table__row"
                >
                  {Array.isArray(contentItem) ? (
                    contentItem.map(value => (
                      <Tooltip
                        className="preview-table__content"
                        key={value + Math.random()}
                        template={<TextTooltipTemplate text={`${value}`} />}
                      >
                        {value}
                      </Tooltip>
                    ))
                  ) : (
                    <Tooltip
                      className="preview-table__content"
                      template={<TextTooltipTemplate text={contentItem} />}
                    >
                      {contentItem}
                    </Tooltip>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {preview?.type === 'text' && <div>{preview?.data.content}</div>}
        {preview?.type === 'html' && (
          <iframe
            srcDoc={preview?.data.content}
            frameBorder="0"
            title="Preview"
          />
        )}
        {preview?.type === 'json' && (
          <div className="json">
            <pre className="json-content">
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(
                    preview?.data.content,
                    Prism.languages.json,
                    'json'
                  )
                }}
              />
            </pre>
          </div>
        )}
        <div>
          <img id="image" alt="bla" />
        </div>
        {preview?.type === 'unknown' && <div>No preview</div>}
      </>
    )}
  </div>
)

ArtifactsPreviewView.propTypes = {
  preview: PropTypes.shape({}).isRequired,
  setShowError: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired
}

export default ArtifactsPreviewView
