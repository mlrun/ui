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

import MembersPopUp from '../MembersPopUp/MembersPopUp'
import Loader from '../../common/Loader/Loader'

import { ReactComponent as Users } from 'igz-controls/images/users.svg'

import './ProjectSettingsMembers.scss'

const ProjectSettingsMembers = ({
  changeMembersCallback,
  loading,
  membersDispatch,
  membersState,
  projectMembersIsShown
}) => {

  const generateMembersTitle = () => {
    const ownerId = membersState.projectInfo?.owner?.id
    const totalMembersInProject = ownerId
      ? membersState.members.length - 1
      : membersState.members.length

    if (totalMembersInProject === 0) {
      if (ownerId) {
        return 'One owner has access to this project'
      } else {
        return 'This project does not have a valid owner'
      }
    } else if (totalMembersInProject === 1) {
      if (ownerId) {
        return 'One owner and one member have access to this project'
      } else {
        return 'One member has access to this project'
      }
    } else {
      if (ownerId) {
        return (
          <>
            One owner and
            <b> {totalMembersInProject} </b>
            members have access to this project
          </>
        )
      } else {
        return (
          <>
            <b>{totalMembersInProject} </b>
            members have access to this project
          </>
        )
      }
    }
  }

  return (
    <div className="settings__card">
      {loading ? (
        <Loader />
      ) : (
        <div className="settings__card-content">
          <div className="settings__card-content-col">
            <div className="settings__members-summary">
              <span className="settings__members-summary_icon">
                <Users />
              </span>
              <span>{generateMembersTitle()}</span>
            </div>
            {projectMembersIsShown && (
              <MembersPopUp
                changeMembersCallback={changeMembersCallback}
                membersState={membersState}
                membersDispatch={membersDispatch}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

ProjectSettingsMembers.propTypes = {
  changeMembersCallback: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  membersDispatch: PropTypes.func.isRequired,
  membersState: PropTypes.shape({}).isRequired,
  projectMembersIsShown: PropTypes.bool.isRequired
}

export default ProjectSettingsMembers
