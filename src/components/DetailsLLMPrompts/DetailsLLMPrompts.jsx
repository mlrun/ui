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
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { Loader, TextTooltipTemplate, Tooltip } from 'igz-controls/components'
import NoData from '../../common/NoData/NoData'

import { fetchLLMPromptArtifacts, removeDetailsLLMPrompts } from '../../reducers/detailsReducer'
import {
  generateLLMPromptsTabContent,
  LLM_PROMPTS_DISPLAY_LIMIT,
  navigateToLLMPromptsPage
} from './detailsLLMPrompts.util'
import { REQUEST_CANCELED } from '../../constants'

import ExclamationMarkIcon from 'igz-controls/images/exclamation-mark.svg?react'

import './detailsLLMPrompts.scss'

const DetailsLLMPrompts = ({ selectedItem, isDetailsPopUp = false, handleCancel = null }) => {
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()
  const { llmPromptsArtifacts } = useSelector(state => state.detailsStore)
  const [requestErrorMessage, setRequestErrorMessage] = useState('')

  const llmPromptsContent = useMemo(
    () => generateLLMPromptsTabContent(llmPromptsArtifacts.data, params, isDetailsPopUp),
    [isDetailsPopUp, llmPromptsArtifacts, params]
  )

  useEffect(() => {
    const abortController = new AbortController()

    if (selectedItem) {
      dispatch(
        fetchLLMPromptArtifacts({
          project: selectedItem.project,
          filters: {
            parent: selectedItem.URI
              ? `${selectedItem.URI}`
              : `${selectedItem.db_key || selectedItem.key}:${selectedItem.tag}`
          },
          config: {
            ui: {
              controller: abortController,
              setRequestErrorMessage
            },
            params: { page: 1, 'page-size': LLM_PROMPTS_DISPLAY_LIMIT }
          }
        })
      )
    }

    return () => {
      abortController.abort(REQUEST_CANCELED)
      dispatch(removeDetailsLLMPrompts())
    }
  }, [dispatch, selectedItem])

  return llmPromptsArtifacts.loading ? (
    <Loader section />
  ) : llmPromptsArtifacts.length === 0 ? (
    <NoData message={requestErrorMessage} />
  ) : (
    <div className="llm-artifacts">
      {llmPromptsContent.length >= LLM_PROMPTS_DISPLAY_LIMIT && (
        <div className="alerts-container__content-info">
          <ExclamationMarkIcon />
          <div>{`Displays only ${LLM_PROMPTS_DISPLAY_LIMIT} LLM prompts. View all prompts in the`}</div>
          <span
            className="link"
            onClick={() =>
              navigateToLLMPromptsPage(navigate, params.projectName, selectedItem, handleCancel)
            }
          >
            LLM prompts screen
          </span>
        </div>
      )}
      <div className="table">
        <div className="table-header">
          <div className="table-row table-header-row">
            {(llmPromptsContent[0] ?? []).map(
              ({ headerLabel, headerId, className = '' }, index) => (
                <div
                  className={classnames('table-header__cell', className)}
                  key={`${headerId}` + index}
                >
                  <Tooltip template={<TextTooltipTemplate text={headerLabel} />}>
                    <label>
                      <span className="data-ellipsis">{headerLabel}</span>
                    </label>
                  </Tooltip>
                </div>
              )
            )}
          </div>
        </div>
        <div className="table-body">
          {llmPromptsContent.map((LLMPromptRow, index) => (
            <div key={LLMPromptRow[0].value + index}>
              <div className="table-row">
                {LLMPromptRow.map((LLMPromptCell, LLMPromptCellIndex) => (
                  <div
                    key={`${LLMPromptCellIndex}`}
                    className={classnames(
                      'table-body__cell',
                      LLMPromptCell.className && LLMPromptCell.className
                    )}
                  >
                    {LLMPromptCell.template ? (
                      LLMPromptCell.template
                    ) : (
                      <Tooltip template={<TextTooltipTemplate text={LLMPromptCell.value} />}>
                        {LLMPromptCell.value}
                      </Tooltip>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

DetailsLLMPrompts.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  isDetailsPopUp: PropTypes.bool,
  handleCancel: PropTypes.func
}

export default DetailsLLMPrompts
