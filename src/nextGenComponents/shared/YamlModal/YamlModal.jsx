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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Prism from 'prismjs'
import * as yaml from 'js-yaml'

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle
} from 'igz-controls/nextGenComponents'
import CloseIcon from 'igz-controls/images/close.svg?react'
import { getValidYaml } from './yaml.utils'

const YamlModal = ({ open, onClose, data = null }) => {
  const { yamlString, dumpError } = useMemo(() => {
    if (!data) return { yamlString: '', dumpError: false }
    try {
      return { yamlString: getValidYaml(yaml.dump(data, { lineWidth: -1 })), dumpError: false }
    } catch {
      return { yamlString: '', dumpError: true }
    }
  }, [data])

  const highlightedHtml = useMemo(
    () => (yamlString ? Prism.highlight(yamlString, Prism.languages.yml, 'yml') : ''),
    [yamlString]
  )

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        closeOnOutsideClick
        className="w-[70vw] max-h-[90vh] flex flex-col overflow-hidden"
        data-testid="yaml-modal"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">YAML</DialogTitle>
        <div className="flex justify-end px-3 pt-3 shrink-0" data-testid="yaml-modal-close-strip">
          <DialogClose asChild>
            <Button
              variant="rounded"
              size="icon"
              aria-label="Close"
              tooltip="Close"
              className="focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              data-testid="yaml-modal-close-button"
            >
              <CloseIcon className="w-6 h-6" />
            </Button>
          </DialogClose>
        </div>
        <div className="flex-1 px-5 pb-5 min-h-0 flex flex-col">
          <div className="flex-1 overflow-y-auto overflow-x-hidden" data-testid="yaml-modal-body">
            {dumpError ? (
              <p className="text-sm text-red-500" data-testid="yaml-modal-error">
                Failed to serialize YAML content.
              </p>
            ) : (
              <pre
                className="m-0 text-sm font-mono leading-6 whitespace-pre-wrap break-words"
                data-testid="yaml-modal-code"
              >
                <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
              </pre>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

YamlModal.propTypes = {
  data: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default YamlModal
