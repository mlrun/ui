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
import React, { useCallback, useMemo } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { TextTooltipTemplate, Tooltip } from 'igz-controls/components'
import ArtifactPopUp from '../DetailsPopUp/ArtifactPopUp/ArtifactPopUp'

import { openPopUp } from 'igz-controls/utils/common.util'
import { parseUri } from '../../utils'

const TableModelCell = ({ id, modelUri, bodyCellClassName = '' }) => {
  const cellClassNames = classnames('table-body__cell', bodyCellClassName)
  const parsedUri = useMemo(() => {
    return parseUri(modelUri)
  }, [modelUri])

  const handleOpenArtifactPopUp = useCallback(() => {
    openPopUp(ArtifactPopUp, {
      artifactData: parsedUri
    })
  }, [parsedUri])

  return (
    <td data-testid={id} className={cellClassNames}>
      {parsedUri?.key && (parsedUri?.uid || parsedUri.tree) && (
        <div className="data-ellipsis">
          <div className="link" onClick={() => handleOpenArtifactPopUp()}>
            <Tooltip template={<TextTooltipTemplate text={modelUri} />} textShow>
              {parsedUri.key}
            </Tooltip>
            <span className="link-subtext">{parsedUri.tag}</span>
          </div>
        </div>
      )}
      {parsedUri?.key && !parsedUri?.uid && !parsedUri.tree && (
        <>
          <Tooltip template={<TextTooltipTemplate text={modelUri} />}>{parsedUri.key}</Tooltip>
          <span className="link-subtext">{parsedUri.tag}</span>
        </>
      )}
    </td>
  )
}

TableModelCell.propTypes = {
  id: PropTypes.string.isRequired,
  modelUri: PropTypes.string.isRequired,
  bodyCellClassName: PropTypes.string
}

export default TableModelCell
