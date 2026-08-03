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
import React from 'react'
import PropTypes from 'prop-types'

import CopyIcon from 'igz-controls/images/copy-to-clipboard-icon.svg?react'
import CheckIcon from 'igz-controls/images/double-check.svg?react'
import LogsBlock from '../../../../shared/LogsBlock/LogsBlock'
import { Loader } from 'igz-controls/nextGenComponents'

const LogSection = ({ title, logs, isLoading, loadingMessage, isCopied, onCopy }) => (
  <div
    className="border border-igz-gray-light rounded-lg flex flex-col h-[85%] shrink-0"
    data-testid={`build-logs-section-${title.toLowerCase()}`}
  >
    <div className="px-4 pt-4 pb-0 bg-background rounded-t-lg">
      <h3 className="text-base m-0 font-semibold text-igz-primary">{title}</h3>
    </div>

    <div className="p-4 bg-background rounded-b-lg flex-1 min-h-0">
      <div className="relative h-full">
        <LogsBlock logs={logs} isLoading={isLoading} loadingMessage={loadingMessage} />

        {isLoading && (
          <Loader
            mode="inline"
            size="md"
            className="absolute top-2 right-4 border-white/40 border-t-white"
            aria-label="Loading logs"
            data-testid={`logs-loading-${title.toLowerCase()}`}
          />
        )}

        {!isLoading && (
          <button
            type="button"
            onClick={onCopy}
            className="absolute bottom-3 right-4 flex items-center justify-center w-7 h-7 rounded text-white transition-colors bg-white/[0.12]"
            aria-label={`Copy ${title} logs`}
            data-testid={`copy-logs-${title.toLowerCase()}`}
          >
            {isCopied ? (
              <CheckIcon
                className="w-4 h-4 [&>*]:fill-current"
                data-testid={`check-icon-${title.toLowerCase()}`}
              />
            ) : (
              <CopyIcon
                className="w-4 h-4 [&>*]:fill-current"
                data-testid={`copy-icon-${title.toLowerCase()}`}
              />
            )}
          </button>
        )}
      </div>
    </div>
  </div>
)

LogSection.propTypes = {
  isCopied: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadingMessage: PropTypes.string,
  logs: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onCopy: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default LogSection
