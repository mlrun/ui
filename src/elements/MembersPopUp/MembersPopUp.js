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
import React, { createRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useDispatch } from 'react-redux'
import { cloneDeep, debounce, groupBy } from 'lodash'

import CheckBox from '../../common/CheckBox/CheckBox'
import ChipInput from '../../common/ChipInput/ChipInput'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import { Button, ConfirmDialog, RoundedIcon, Tip } from 'igz-controls/components'

import {
  DANGER_BUTTON,
  LABEL_BUTTON,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON
} from 'igz-controls/constants'
import projectsIguazioApi from '../../api/projects-iguazio-api'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { getErrorMsg } from 'igz-controls/utils/common.util'
import { getRoleOptions, initialNewMembersRole, DELETE_MODIFICATION } from './membersPopUp.util'
import { isIgzVersionCompatible } from '../../utils/isIgzVersionCompatible'
import { membersActions } from './membersReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { useNavigate } from 'react-router-dom'

import { OWNER_ROLE, USER_GROUP_ROLE, USER_ROLE } from '../../constants'

import { ReactComponent as Add } from 'igz-controls/images/add.svg'
import { ReactComponent as Close } from 'igz-controls/images/close.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as Filter } from 'igz-controls/images/filter.svg'
import { ReactComponent as User } from 'igz-controls/images/user.svg'
import { ReactComponent as Users } from 'igz-controls/images/users.svg'

import './membersPopUp.scss'

const MembersPopUp = ({ changeMembersCallback, membersDispatch, membersState }) => {
  const [membersData, setMembersData] = useState(membersState)
  const [deleteMemberId, setDeleteMemberId] = useState('')
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
  const navigate = useNavigate()
  const membersTableRowClassNames = classnames('table-row', inviteNewMembers && 'inactive')

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
          name: newMember.label,
          id: newMember.id,
          type: newMember.ui.type,
          role: newMembersRole,
          icon: newMember.ui.type === USER_ROLE ? <User /> : <Users />,
          modification: 'post',
          actionElement: createRef()
        })
      }
    })

    setNewMembers([])
    setNewMembersRole(initialNewMembersRole)
    setInviteNewMembers(false)

    setMembersData(state => ({ ...state, members: membersCopy }))
  }

  const applyMembersChanges = () => {
    const changesBody = {
      data: {
        attributes: {
          metadata: {
            project_ids: [membersData.projectInfo.id],
            notify_by_email: notifyByEmail
          },
          requests: []
        }
      }
    }
    const rolesData = {}
    const modifiedRoles = Array.from(
      membersData.members.reduce((prevValue, member) => {
        if (member.modification) {
          prevValue.add(member.role)

          if (member.initialRole) {
            prevValue.add(member.initialRole)
          }
        }

        return prevValue
      }, new Set())
    )
    const groupedVisibleMembers = groupBy(
      membersData.members.filter(member => member.modification !== DELETE_MODIFICATION),
      item => item.role
    )

    membersState.projectAuthorizationRoles.forEach(roleData => {
      rolesData[roleData.attributes.name] = roleData
    })

    changesBody.data.attributes.requests = modifiedRoles.map(modifiedRole => {
      const membersCopy = groupedVisibleMembers[modifiedRole] ?? []

      return {
        method: 'put',
        resource: `project_authorization_roles/${rolesData[modifiedRole].id}`,
        body: {
          data: {
            type: rolesData[modifiedRole].type,
            attributes: {
              name: modifiedRole,
              permissions: rolesData[modifiedRole].attributes.permissions
            },
            relationships: {
              project: {
                data: {
                  type: 'project',
                  id: membersData.projectInfo.id
                }
              },
              principal_users: {
                data: membersCopy
                  .filter(member => member.type === USER_ROLE)
                  .map(member => {
                    return { id: member.id, type: member.type }
                  })
              },
              principal_user_groups: {
                data: membersCopy
                  .filter(member => member.type === 'user_group')
                  .map(member => {
                    return { id: member.id, type: member.type }
                  })
              }
            }
          }
        }
      }
    })

    membersDispatch({
      type: membersActions.SET_MEMBERS,
      payload: membersData.members
    })

    projectsIguazioApi
      .updateProjectMembers(changesBody)
      .then(response => {
        const validMember = membersData.members?.some(
          member =>
            member.modification !== DELETE_MODIFICATION &&
            (member.id === membersData.activeUser.data?.id ||
              (member.type === USER_GROUP_ROLE &&
                membersData.activeUser.data?.relationships?.user_groups?.data?.some?.(
                  group => group.id === member.id
                )))
        )
        const userIsProjectSecurityAdmin =
          membersData.activeUser.data?.attributes?.user_policies_collection?.has(
            'Project Security Admin'
          ) ?? false

        if (validMember || userIsProjectSecurityAdmin) {
          changeMembersCallback(response.data.data.id)
        } else {
          navigate('/projects/')
        }
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

  const changeMemberRole = (roleOption, memberToEdit) => {
    const membersCopy = cloneDeep(membersData.members)
    const member = membersCopy.find(member => member.id === memberToEdit.id)

    if (member.initialRole) {
      member.modification = member.initialRole !== roleOption ? 'put' : ''
    }
    member.role = roleOption

    setMembersData(state => ({ ...state, members: membersCopy }))
  }

  const closeMemberPopUp = event => {
    if (areChangesMade()) {
      setConfirmDiscard(true)
    } else {
      discardChanges(event)
    }
  }

  const deleteMember = memberToDelete => {
    let membersCopy = cloneDeep(membersData.members)

    if (memberToDelete.initialRole) {
      membersCopy.find(member => member.id === memberToDelete.id).modification = DELETE_MODIFICATION
    } else {
      membersCopy = membersCopy.filter(member => member.id !== memberToDelete.id)
    }

    setMembersData(state => ({ ...state, members: membersCopy }))
    setDeleteMemberId('')
  }

  const discardChanges = event => {
    event.stopPropagation()
    setMembersData(membersState)
    handleOnClose()
  }

  const generateUsersSuggestionList = debounce(searchQuery => {
    const requiredIgzVersion = '3.5.3'
    let paramsScrubbedUsers = {
      'filter[username]': `[$match-i]^.*${searchQuery}.*$`,
      'page[size]': 200
    }
    let paramsUserGroups = { 'filter[name]': `[$match-i]^.*${searchQuery}.*$`, 'page[size]': 200 }

    if (isIgzVersionCompatible(requiredIgzVersion)) {
      paramsScrubbedUsers['filter[username]'] = `[$contains_istr]${searchQuery}`
      paramsUserGroups['filter[name]'] = `[$contains_istr]${searchQuery}`
    }

    const getUsersPromise = projectsIguazioApi.getScrubbedUsers({
      params: paramsScrubbedUsers
    })
    const getUserGroupsPromise = projectsIguazioApi.getScrubbedUserGroups({
      params: paramsUserGroups
    })
    const suggestionList = []

    Promise.all([getUsersPromise, getUserGroupsPromise])
      .then(response => {
        response.forEach(identityResponse => {
          identityResponse.data.data.forEach(identity => {
            const existingMember = membersData.members.find(
              member => member.id === identity.id && member.modification !== DELETE_MODIFICATION
            )

            suggestionList.push({
              label:
                identity.type === USER_ROLE
                  ? identity.attributes.username
                  : identity.attributes.name,
              id: identity.id,
              subLabel: existingMember?.role ?? '',
              disabled: Boolean(existingMember),
              icon:
                identity.type === USER_ROLE ? (
                  <i data-identity-type="user">
                    <User />
                  </i>
                ) : (
                  <i data-identity-type="user_group">
                    <Users />
                  </i>
                ),
              ui: {
                type: identity.type
              }
            })
          })
        })

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
            <ChipInput
              className="new-member-name"
              placeholder="Type to add members..."
              addChip={suggestionItem => {
                setNewMembers([...newMembers, suggestionItem])
              }}
              removeChip={chipIndex => {
                setNewMembers(newMembers.filter((member, index) => index !== chipIndex))
              }}
              onInputChange={generateUsersSuggestionList}
              elements={newMembers}
              suggestionList={newMembersSuggestionList}
              isDeleteMode
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
                variant={SECONDARY_BUTTON}
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
              <div
                className={membersTableRowClassNames}
                key={`${member.name}${member.role}${member.type}`}
              >
                <div className="member-info">
                  <div className={`member-status ${member.modification ? 'visible' : ''}`} />
                  <div className="member-symbol">{member.name[0]?.toUpperCase()}</div>
                  <div className={`member-icon ${member.type}`}>{member.icon}</div>
                  <div className="member-name">{member.name}</div>
                </div>
                <div className="member-roles">
                  <Select
                    density="dense"
                    label="Role"
                    disabled={member.role === OWNER_ROLE || inviteNewMembers}
                    floatingLabel
                    onClick={roleOption => changeMemberRole(roleOption, member)}
                    options={getRoleOptions(member.role)}
                    selectedId={member.role}
                  />
                </div>
                <div className="member-actions actions">
                  <button
                    disabled={member.role === OWNER_ROLE || inviteNewMembers}
                    ref={member.actionElement}
                    onClick={() => setDeleteMemberId(member.id)}
                  >
                    <Delete />
                  </button>
                </div>
                {deleteMemberId === member.id && (
                  <ConfirmDialog
                    className="delete-member__pop-up"
                    closePopUp={() => setDeleteMemberId('')}
                    confirmButton={{
                      handler: () => deleteMember(member),
                      label: 'Remove member',
                      variant: DANGER_BUTTON
                    }}
                    customPosition={{
                      element: member.actionElement,
                      position: 'top-right'
                    }}
                    header="Are you sure?"
                    isOpen={deleteMemberId === member.id}
                    message="Removing a member will provoke all access."
                  />
                )}
              </div>
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
            variant={LABEL_BUTTON}
            label="Discard"
            className="pop-up-dialog__btn_cancel"
            onClick={closeMemberPopUp}
          />
          <Button
            variant={SECONDARY_BUTTON}
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
            variant: LABEL_BUTTON
          }}
          closePopUp={() => setConfirmDiscard(false)}
          confirmButton={{
            handler: discardChanges,
            label: 'Discard',
            variant: PRIMARY_BUTTON
          }}
          header="Discard all pending changes?"
          isOpen={confirmDiscard}
        />
      )}
    </div>
  )
}

MembersPopUp.propTypes = {
  changeMembersCallback: PropTypes.func.isRequired,
  membersDispatch: PropTypes.func.isRequired,
  membersState: PropTypes.shape({}).isRequired
}

export default MembersPopUp
