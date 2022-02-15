import React from 'react'
import PropTypes from 'prop-types'

import MembersPopUp from '../MembersPopUp/MembersPopUp'

import { ReactComponent as Users } from '../../images/users.svg'

import './ProjectSettingsMembers.scss'

const ProjectSettingsMembers = ({
  changeMembersCallback,
  membersDispatch,
  membersState,
  projectMembershipIsEnabled
}) => {
  return (
    <div className="settings__card">
      <div className="settings__card-content">
        {projectMembershipIsEnabled && (
          <div className="settings__card-content-col">
            <div className="settings__members-summary">
              <span className="settings__members-summary_icon">
                <Users />
              </span>
              <span className="settings__members-summary_amount">
                {membersState.users.length + membersState.userGroups.length}
              </span>
              members has access to this project
            </div>
            <MembersPopUp
              changeMembersCallback={changeMembersCallback}
              membersState={membersState}
              membersDispatch={membersDispatch}
            />
          </div>
        )}
      </div>
    </div>
  )
}

ProjectSettingsMembers.propTypes = {
  changeMembersCallback: PropTypes.func.isRequired,
  membersDispatch: PropTypes.func.isRequired,
  membersState: PropTypes.shape({}).isRequired,
  projectMembershipIsEnabled: PropTypes.bool.isRequired
}

export default ProjectSettingsMembers
