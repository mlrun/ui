import React from 'react'
import PropTypes from 'prop-types'
import Prism from 'prismjs'

import DetailsResults from '../DetailsResults/DetailsResults'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

const ArtifactsPreviewView = ({ preview }) => (
  <>
    {preview?.type === 'table-results' && (
      <div className="preview-table">
        <DetailsResults job={preview} />
      </div>
    )}
    {preview?.type === 'table' && (
      <div className="preview-table">
        <div className="preview-table__row">
          {preview.data.headers.map(header => {
            return (
              <div key={header} className="preview-table__header">
                <Tooltip template={<TextTooltipTemplate text={header} />}>
                  {header}
                </Tooltip>
              </div>
            )
          })}
        </div>
        {preview.data.content.map(contentItem => (
          <div key={contentItem + Math.random()} className="preview-table__row">
            {typeof contentItem === 'string' ? (
              <Tooltip
                className="preview-table__content"
                template={<TextTooltipTemplate text={contentItem} />}
              >
                {contentItem}
              </Tooltip>
            ) : (
              contentItem.map(value => (
                <Tooltip
                  className="preview-table__content"
                  key={value + Math.random()}
                  template={<TextTooltipTemplate text={`${value}`} />}
                >
                  {value}
                </Tooltip>
              ))
            )}
          </div>
        ))}
      </div>
    )}
    {preview?.type === 'text' && <div>{preview?.data.content}</div>}
    {preview?.type === 'html' && (
      <iframe srcDoc={preview?.data.content} frameBorder="0" title="Preview" />
    )}
    {preview?.type === 'json' && (
      <div className="json">
        <pre>
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
  </>
)

ArtifactsPreviewView.propTypes = {
  preview: PropTypes.shape({}).isRequired
}

export default ArtifactsPreviewView
