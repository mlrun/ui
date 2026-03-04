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
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { cloneDeep, debounce, groupBy } from 'lodash'

import CheckBox from '../../common/CheckBox/CheckBox'
import SuggestionsChips from '../../common/SuggestionsChips/SuggestionsChips'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import MembersPopUpRow from './MembersPopUpRow'
import { Button, ConfirmDialog, RoundedIcon, Tip } from 'igz-controls/components'

import { TERTIARY_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'
import projectsIguazioApi from '../../api/projects-iguazio-api'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { getErrorMsg } from 'igz-controls/utils/common.util'
import { getRoleOptions, initialNewMembersRole, DELETE_MODIFICATION } from './membersPopUp.util'
import { membersActions } from './membersReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

import { OWNER_ROLE, USER_GROUP_ROLE, USER_ROLE } from '../../constants'

import Add from 'igz-controls/images/add.svg?react'
import Close from 'igz-controls/images/close.svg?react'
import Filter from 'igz-controls/images/filter.svg?react'
import User from 'igz-controls/images/user.svg?react'
import Users from 'igz-controls/images/users.svg?react'

import './membersPopUp.scss'

const MembersPopUp = ({ changeMembersCallback, membersDispatch, membersState }) => {
  const [membersData, setMembersData] = useState(membersState)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const [inviteNewMembers, setInviteNewMembers] = useState(false)
  const [notifyByEmail, setNotifyByEmail] = useState(false)
  const [newMembersSuggestionList, setNewMembersSuggestionList] = useState([])
  const [newMembers, setNewMembers] = useState([])
  const [newMembersRole, setNewMembersRole] = useState(initialNewMembersRole)
  const [filters, setFilters] = useState({
    name: '',
    role: 'All'
  })
  const dispatch = useDispatch()

  const handleOnClose = () => {
    setConfirmDiscard(false)
    setNotifyByEmail(false)
    setNewMembers([])
  }

  const addNewMembers = () => {
    const membersCopy = cloneDeep(membersData.members)

    newMembers.forEach(newMember => {
      const existingMember = membersCopy.find(member => member.id === newMember.id)

      if (existingMember) {
        existingMember.modification = newMembersRole !== existingMember.initialRole ? 'put' : ''
        existingMember.role = newMembersRole
      } else {
        membersCopy.push({
          name: newMember.originalContent.label,
          id: newMember.originalContent.id,
          type: newMember.originalContent.ui.type,
          role: newMembersRole,
          icon: newMember.originalContent.ui.type === USER_ROLE ? <User /> : <Users />,
          modification: 'post'
        })
      }
    })

    setNewMembers([])
    setNewMembersRole(initialNewMembersRole)
    setInviteNewMembers(false)

    setMembersData(state => ({ ...state, members: membersCopy }))
  }

  const applyMembersChanges = () => {
    const projectName = membersData.projectInfo.id
    const visibleMembers = membersData.members.filter(
      member => member.modification !== DELETE_MODIFICATION && member.role !== OWNER_ROLE
    )
    const groupedByRole = groupBy(visibleMembers, 'role')

    const membership = {}

    membersState.projectAuthorizationRoles
      .filter(policy => policy.spec.displayName !== OWNER_ROLE)
      .forEach(policy => {
        const roleName = policy.spec.displayName.toLowerCase()
        membership[roleName] = {
          values: (groupedByRole[policy.spec.displayName] || []).map(member => member.id)
        }
      })

    const body = {
      membership,
      override: true
    }

    membersDispatch({
      type: membersActions.SET_MEMBERS,
      payload: membersData.members
    })

    projectsIguazioApi
      .setProjectMembership(projectName, body)
      .then(() => {
        const activeUsername = membersData.activeUser.data?.attributes?.username
        const userIsStillMember = membersData.members?.some(
          member =>
            member.modification !== DELETE_MODIFICATION &&
            (member.id === activeUsername ||
              (member.type === USER_GROUP_ROLE &&
                membersData.activeUser.data?.attributes?.user_group_names?.has(member.id)))
        )

        changeMembersCallback(userIsStillMember)
      })
      .catch(error => {
        const customErrorMsg =
          error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
            ? 'Missing edit permission for the project'
            : getErrorMsg(error, 'Failed to edit project data')

        showErrorNotification(dispatch, error, '', customErrorMsg, () => applyMembersChanges())
      })

    handleOnClose()
  }

  const areChangesMade = () => {
    return membersData.members.some(member => member.modification !== '')
  }

  const closeMemberPopUp = event => {
    if (areChangesMade()) {
      setConfirmDiscard(true)
    } else {
      discardChanges(event)
    }
  }

  const discardChanges = event => {
    event.stopPropagation()
    setMembersData(membersState)
    handleOnClose()
  }

  const toSuggestionItem = (id, type) => {
    const existingMember = membersData.members.find(
      member => member.id === id && member.modification !== DELETE_MODIFICATION
    )

    return {
      label: id,
      id,
      subLabel: existingMember?.role ?? '',
      disabled: Boolean(existingMember),
      icon:
        type === USER_ROLE ? (
          <i data-identity-type="user">
            <User />
          </i>
        ) : (
          <i data-identity-type="user_group">
            <Users />
          </i>
        ),
      ui: { type }
    }
  }

  const generateUsersSuggestionList = debounce(searchQuery => {
    const getUsersPromise = projectsIguazioApi.searchUsersMetadata(searchQuery)
    const getUserGroupsPromise = projectsIguazioApi.searchGroupsMetadata(searchQuery)

    Promise.all([getUsersPromise, getUserGroupsPromise])
      .then(([usersResponse, groupsResponse]) => {
        const users = usersResponse.data.items || []
        const groups = groupsResponse.data.items || []
        const suggestionList = [
          ...users.map(user => toSuggestionItem(user.username, USER_ROLE)),
          ...groups.map(group => toSuggestionItem(group.path || group.groupId, USER_GROUP_ROLE))
        ]

        setNewMembersSuggestionList(suggestionList)
      })
      .catch(error => {
        showErrorNotification(dispatch, error, 'Failed to fetch users')
      })
  }, 400)

  return (
    <div className="settings__members">
      <div className="info-row">
        <div className="members-overview">
          <span className="member-overview">
            <span className="member-count">
              {membersData.groupedOriginalMembers.Editor?.length ?? 0}
            </span>
            &nbsp;editors,&nbsp;
          </span>
          <span className="member-overview">
            <span className="member-count">
              {membersData.groupedOriginalMembers.Viewer?.length ?? 0}
            </span>
            &nbsp;viewers,&nbsp;
          </span>
          <span className="member-overview">
            <span className="member-count">
              {membersData.groupedOriginalMembers.Admin?.length ?? 0}
            </span>
            &nbsp;admins&nbsp;
          </span>
          <Tip text="Some of the members might be user groups" />
        </div>
        <div className="invite-new-members-btn" onClick={() => setInviteNewMembers(true)}>
          <Add className="add-icon" />
          Invite new members
        </div>
      </div>
      {inviteNewMembers && (
        <div className="invite-new-members">
          <div className="new-members-title">
            <span>Invite new members</span>
            <div className="close-icon">
              <RoundedIcon onClick={() => setInviteNewMembers(false)} tooltipText="Close">
                <Close data-testid="pop-up-close-btn" />
              </RoundedIcon>
            </div>
          </div>
          <div className="new-members-row">
            <SuggestionsChips
              className="new-member-name"
              elements={newMembers}
              placeholder="Type to add members..."
              onInputChange={generateUsersSuggestionList}
              initialMembers={membersState}
              setElements={setNewMembers}
              suggestionList={newMembersSuggestionList}
            />
            <Select
              className="new-member-role"
              label="Role"
              density="dense"
              floatingLabel
              onClick={newRole => setNewMembersRole(newRole)}
              options={getRoleOptions()}
              selectedId={newMembersRole}
            />
            <div className="new-member-btn">
              <Button
                variant={PRIMARY_BUTTON}
                disabled={newMembers.length === 0 || !newMembersRole}
                label="Add"
                onClick={addNewMembers}
              />
            </div>
          </div>
        </div>
      )}
      <div className="members-table">
        <div className="table-header">
          <div className="member-info">
            <Filter />
            <Input
              disabled={inviteNewMembers}
              placeholder="Type to filter members..."
              withoutBorder
              density="dense"
              onChange={memberName => {
                setFilters({
                  ...filters,
                  name: memberName
                })
              }}
              type="text"
              value={filters.name}
            />
          </div>
          <div className="member-roles">
            <Select
              disabled={inviteNewMembers}
              density="dense"
              floatingLabel
              label="Role"
              onClick={roleOption => {
                setFilters({
                  ...filters,
                  role: roleOption
                })
              }}
              options={getRoleOptions('', true)}
              selectedId={filters.role}
            />
          </div>
          <div className="member-actions actions"></div>
        </div>
        <div className="table-body">
          {membersData.members
            .filter(member => {
              return (
                (!filters.name || member.name.toLowerCase().includes(filters.name.toLowerCase())) &&
                (filters.role === 'All' || member.role === filters.role) &&
                member.modification !== DELETE_MODIFICATION
              )
            })
            .map(member => (
              <MembersPopUpRow
                key={`${member.name}${member.role}${member.type}`}
                inviteNewMembers={inviteNewMembers}
                member={member}
                membersData={membersData}
                setMembersData={setMembersData}
              />
            ))}
        </div>
      </div>
      <p className="footer-annotation">
        Note that adding users to the project doesn't mean they can access the project data. In
        order to access the project data they need to set access permission for the project folder.{' '}
        <a
          href="https://www.iguazio.com/docs/latest-release/users-and-security/security/#data-access-policy-rules"
          className="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more
        </a>
      </p>
      <div className="footer-actions">
        <CheckBox
          className="notify-by-email"
          item={{
            label: 'Notify by email',
            id: 'notifyByEmail'
          }}
          onChange={() => {
            setNotifyByEmail(!notifyByEmail)
          }}
          selectedId={notifyByEmail ? 'notifyByEmail' : ''}
        />
        <div className="apply-discard-buttons">
          <Button
            disabled={!areChangesMade()}
            variant={TERTIARY_BUTTON}
            label="Discard"
            className="pop-up-dialog__btn_cancel"
            onClick={closeMemberPopUp}
          />
          <Button
            variant={PRIMARY_BUTTON}
            disabled={!areChangesMade()}
            label="Apply"
            onClick={applyMembersChanges}
          />
        </div>
      </div>

      {confirmDiscard && (
        <ConfirmDialog
          cancelButton={{
            handler: () => {
              setConfirmDiscard(false)
            },
            label: 'No',
            variant: TERTIARY_BUTTON
          }}
          closePopUp={() => setConfirmDiscard(false)}
          confirmButton={{
            handler: discardChanges,
            label: 'Discard',
            variant: PRIMARY_BUTTON
          }}
          header="Discard all pending changes?"
          isOpen={Boolean(confirmDiscard)}
        />
      )}
    </div>
  )
}

MembersPopUp.propTypes = {
  changeMembersCallback: PropTypes.func.isRequired,
  membersDispatch: PropTypes.func.isRequired,
  membersState: PropTypes.object.isRequired
}

export default MembersPopUp
