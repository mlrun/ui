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
  projectMembersIsShown,
  setNotification
}) => {
  const totalMembersInProject =
    membersState.users.length + membersState.userGroups.length
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
              <span className="settings__members-summary_amount">
                {totalMembersInProject}
              </span>
              member{totalMembersInProject !== 1 ? 's have' : ' has'} access to
              this project
            </div>
            {projectMembersIsShown && (
              <MembersPopUp
                changeMembersCallback={changeMembersCallback}
                membersState={membersState}
                membersDispatch={membersDispatch}
                setNotification={setNotification}
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
