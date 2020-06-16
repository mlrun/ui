import React from 'react'
import PropTypes from 'prop-types'
import Prism from 'prismjs'

import DetailsResults from '../DetailsResults/DetailsResults'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

const ArtifactsPreviewView = ({ preview }) => (
  <div className="item-artifacts__preview-content">
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
      <iframe srcDoc={preview?.data.content} frameBorder="0" title="Preview" />
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
    {preview?.type === 'image' && <div>{preview?.data.content}</div>}
    {preview?.type === 'unknown' && <div>No preview</div>}
  </div>
)

ArtifactsPreviewView.propTypes = {
  preview: PropTypes.shape({}).isRequired
}

export default ArtifactsPreviewView
