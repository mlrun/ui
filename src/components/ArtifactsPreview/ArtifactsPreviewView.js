import React from 'react'
import PropTypes from 'prop-types'
import Prism from 'prismjs'
import DetailsResults from '../DetailsResults/DetailsResults'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

const ArtifactsPreviewView = ({ preview }) => (
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
                <Tooltip template={<TextTooltipTemplate text={header} />}>
                  {header}
                </Tooltip>
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
      <iframe srcDoc={preview.data.content} frameBorder="0" title="Preview" />
    )}
    {preview.data && preview.type === 'json' && (
      <div className="json">
        <pre>
          <code
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                preview.data.content,
                Prism.languages.json,
                'json'
              )
            }}
          />
        </pre>
      </div>
    )}
    {preview.data && preview.type === 'image' && (
      <div>{preview.data.content}</div>
    )}
    {preview.type && preview.type === 'unknown' && <div>No preview</div>}
  </>
)

ArtifactsPreviewView.propTypes = {
  preview: PropTypes.shape({}).isRequired
}

export default ArtifactsPreviewView
