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

import Input from '../../common/Input/Input'
import CheckBox from '../../common/CheckBox/CheckBox'

import { LOAD_SOURCE_ON_RUN, SOURCE_URL } from '../../constants'

import './projectSettingsSource.scss'

const ProjectSettingsSource = ({
  editProjectData,
  handleEditProject,
  handleOnBlur,
  handleOnKeyDown,
  handleSourceChange,
  projectData,
  setValidation,
  toggleLoadSourceOnRun,
  validation
}) => {
  const { source } = editProjectData

  return (
    <div className="settings__source">
      <Input
        floatingLabel
        focused
        invalid={!validation.isSourceValid}
        label="Source URL"
        link={{
          show: source.value ?? projectData?.source,
          url: source.value ?? projectData?.source
        }}
        onBlur={() => handleOnBlur(SOURCE_URL)}
        onChange={value => handleSourceChange(SOURCE_URL, value)}
        onFocus={() => handleEditProject(SOURCE_URL)}
        onKeyDown={handleOnKeyDown}
        setInvalid={value =>
          setValidation(state => {
            return {
              ...state,
              isSourceValid: value
            }
          })
        }
        tip="Source URL is the Git Repo that is associated with the project. When the user pulls the project it will use the source URL to pull from"
        type="text"
        value={source.value ?? projectData?.source}
      />
      <CheckBox
        item={{ id: LOAD_SOURCE_ON_RUN, label: 'Pull at runtime' }}
        onChange={toggleLoadSourceOnRun}
        selectedId={projectData?.load_source_on_run ? LOAD_SOURCE_ON_RUN : ''}
      />
    </div>
  )
}

ProjectSettingsSource.defaultProps = {
  projectData: {}
}

ProjectSettingsSource.propTypes = {
  editProjectData: PropTypes.shape({}).isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  handleSourceChange: PropTypes.func.isRequired,
  projectData: PropTypes.object,
  setValidation: PropTypes.func.isRequired,
  toggleLoadSourceOnRun: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default ProjectSettingsSource
