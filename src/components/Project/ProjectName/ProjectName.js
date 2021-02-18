import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../../common/Input/Input'
import Tooltip from '../../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../../elements/TooltipTemplate/TextTooltipTemplate'

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
