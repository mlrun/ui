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

import Input from '../../../common/Input/Input'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

const ProjectName = React.forwardRef(
  (
    { editNameData, handleOnChangeProject, handleOnKeyDown, projectName },
    ref
  ) => {
    return (
      <div data-testid="project-name" className="general-info__name">
        {editNameData.isEdit ? (
          <Input
            focused={true}
            onChange={handleOnChangeProject}
            onKeyDown={handleOnKeyDown}
            ref={ref}
            type="text"
            value={editNameData.value ?? projectName}
          />
        ) : (
          <Tooltip
            template={
              <TextTooltipTemplate text={editNameData.value ?? projectName} />
            }
          >
            {editNameData.value ?? projectName}
          </Tooltip>
        )}
      </div>
    )
  }
)

ProjectName.propTypes = {
  editNameData: PropTypes.shape({}).isRequired,
  handleOnChangeProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  projectName: PropTypes.string.isRequired
}

export default ProjectName
