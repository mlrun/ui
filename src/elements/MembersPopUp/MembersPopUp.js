import React, { createRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { cloneDeep, debounce } from 'lodash'

import Button from '../../common/Button/Button'
import CheckBox from '../../common/CheckBox/CheckBox'
import Input from '../../common/Input/Input'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Select from '../../common/Select/Select'
import Tip from '../../common/Tip/Tip'
import ChipInput from '../../common/ChipInput/ChipInput'
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import { ReactComponent as Close } from '../../images/close.svg'

import projectsIguazioApi from '../../api/projects-iguazio-api'
import { getRoleOptions, initialNewMembersRole } from './membersPopUp.util'
import { membersActions } from './membersReducer'
import {
  DANGER_BUTTON,
  LABEL_BUTTON,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON
} from '../../constants'

import { ReactComponent as Add } from '../../images/add.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'
import { ReactComponent as Filter } from '../../images/filter.svg'
import { ReactComponent as User } from '../../images/user.svg'
import { ReactComponent as Users } from '../../images/users.svg'

import './membersPopUp.scss'

const MembersPopUp = ({
  changeMembersCallback,
  closePopUp,
  membersDispatch,
  membersState
}) => {
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
  const inviteMembersBtnClassNames = classnames(
    'invite-new-members-btn',
    inviteNewMembers && 'disabled'
  )
  const membersTableClassNames = classnames(
    'members-table',
    inviteNewMembers && 'inactive'
  )

  const addNewMembers = () => {
    const membersCopy = cloneDeep(membersState.members)

    newMembers.forEach(newMember => {
      const existingMember = membersCopy.find(
        member => member.id === newMember.id
      )

      if (existingMember) {
        existingMember.modification =
          newMembersRole !== existingMember.initialRole ? 'put' : ''
        existingMember.role = newMembersRole
      } else {
        membersCopy.push({
          name: newMember.label,
          id: newMember.id,
          type: newMember.ui.type,
          role: newMembersRole,
          icon: newMember.ui.type === 'user' ? <User /> : <Users />,
          modification: 'post',
          actionElement: createRef()
        })
      }
    })

    setNewMembers([])
    setNewMembersRole(initialNewMembersRole)
    setInviteNewMembers(false)

    membersDispatch({
      type: membersActions.SET_MEMBERS,
      payload: membersCopy
    })
  }

  const applyMembersChanges = () => {
    const changesBody = {
      data: {
        attributes: {
          metadata: {
            project_ids: [membersState.projectInfo.id],
            notify_by_email: notifyByEmail
          },
          requests: []
        }
      }
    }
    const rolesData = {}

    membersState.projectAuthorizationRoles.forEach(roleData => {
      rolesData[roleData.attributes.name] = roleData
    })

    changesBody.data.attributes.requests = membersState.modifiedRoles.map(
      modifiedRole => {
        const members = membersState.groupedVisibleMembers[modifiedRole] ?? []

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
                    id: membersState.projectInfo.id
                  }
                },
                principal_users: {
                  data: members
                    .filter(member => member.type === 'user')
                    .map(member => {
                      return { id: member.id, type: member.type }
                    })
                },
                principal_user_groups: {
                  data: members
                    .filter(member => member.type === 'user_group')
                    .map(member => {
                      return { id: member.id, type: member.type }
                    })
                }
              }
            }
          }
        }
      }
    )

    projectsIguazioApi.updateProjectMembers(changesBody).then(() => {
      changeMembersCallback()
    })

    closePopUp()
  }

  const areChangesMade = () => {
    return membersState.members.some(member => member.modification !== '')
  }

  const changeMemberRole = (roleOption, memberToEdit) => {
    const membersCopy = cloneDeep(membersState.members)
    const member = membersCopy.find(member => member.id === memberToEdit.id)

    if (member.initialRole) {
      member.modification = member.initialRole !== roleOption ? 'put' : ''
    }
    member.role = roleOption

    membersDispatch({
      type: membersActions.SET_MEMBERS,
      payload: membersCopy
    })
  }

  const closeMemberPopUp = event => {
    if (areChangesMade()) {
      setConfirmDiscard(true)
    } else {
      discardChanges(event)
    }
  }

  const deleteMember = memberToDelete => {
    let membersCopy = cloneDeep(membersState.members)

    if (memberToDelete.initialRole) {
      membersCopy.find(member => member.id === memberToDelete.id).modification =
        'delete'
    } else {
      membersCopy = membersCopy.filter(
        member => member.id !== memberToDelete.id
      )
    }

    membersDispatch({
      type: membersActions.SET_MEMBERS,
      payload: membersCopy
    })
    setDeleteMemberId('')
  }

  const discardChanges = event => {
    event.stopPropagation()
    membersDispatch({
      type: membersActions.SET_MEMBERS,
      payload: membersState.membersOriginal
    })
    closePopUp()
  }

  const generateUsersSuggestionList = debounce(() => {
    const getUsersPromise = projectsIguazioApi.getScrubbedUsers()
    const getUserGroupsPromise = projectsIguazioApi.getScrubbedUserGroups()
    const suggestionList = []

    Promise.all([getUsersPromise, getUserGroupsPromise]).then(response => {
      response.forEach(identityResponse => {
        identityResponse.data.data.forEach(identity => {
          const existingMember = membersState.members.find(
            member =>
              member.id === identity.id && member.modification !== 'delete'
          )

          suggestionList.push({
            label:
              identity.type === 'user'
                ? identity.attributes.username
                : identity.attributes.name,
            id: identity.id,
            subLabel: existingMember?.role ?? '',
            disabled: Boolean(existingMember),
            icon:
              identity.type === 'user' ? (
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
  }, 200)

  return (
    <>
      <PopUpDialog
        className="manage-members__pop-up"
        closePopUp={closeMemberPopUp}
        headerText="Members"
      >
        <div className="info-row">
          <div className="members-overview">
            <span className="member-overview">
              <span className="member-count">
                {membersState.groupedOriginalMembers.Editor?.length ?? 0}
              </span>
              &nbsp;editors,&nbsp;
            </span>
            <span className="member-overview">
              <span className="member-count">
                {membersState.groupedOriginalMembers.Viewer?.length ?? 0}
              </span>
              &nbsp;viewers,&nbsp;
            </span>
            <span className="member-overview">
              <span className="member-count">
                {membersState.groupedOriginalMembers.Admin?.length ?? 0}
              </span>
              &nbsp;admins&nbsp;
            </span>
            <Tip text="Some of the members might be user groups" />
          </div>
          <div
            className={inviteMembersBtnClassNames}
            onClick={() => setInviteNewMembers(true)}
          >
            <Add className="add-icon" />
            Invite new members
          </div>
        </div>
        {inviteNewMembers && (
          <div className="invite-new-members">
            <div className="new-members-title">
              <span>Invite new members</span>
              <div className="close-icon">
                <Tooltip template={<TextTooltipTemplate text="Close" />}>
                  <Close
                    data-testid="pop-up-close-btn"
                    onClick={() => setInviteNewMembers(false)}
                  />
                </Tooltip>
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
                  setNewMembers(
                    newMembers.filter((member, index) => index !== chipIndex)
                  )
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
        <div className={membersTableClassNames}>
          <div className="table-header">
            <div className="member-info">
              <Filter />
              <Input
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
                density="dense"
                withoutBorder
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
            {membersState.members
              .filter(member => {
                return (
                  (!filters.name || member.name.startsWith(filters.name)) &&
                  (filters.role === 'All' || member.role === filters.role) &&
                  member.modification !== 'delete'
                )
              })
              .map(member => (
                <div className="table-row" key={`${member.name}${member.role}`}>
                  <div className="member-info">
                    <div
                      className={`member-status ${
                        member.modification ? 'visible' : ''
                      }`}
                    />
                    <div className="member-symbol">
                      {member.name[0].toUpperCase()}
                    </div>
                    <div className={`member-icon ${member.type}`}>
                      {member.icon}
                    </div>
                    <div className="member-name">{member.name}</div>
                  </div>
                  <div className="member-roles">
                    <Select
                      density="dense"
                      label="Role"
                      disabled={member.role === 'Owner'}
                      floatingLabel
                      onClick={roleOption =>
                        changeMemberRole(roleOption, member)
                      }
                      options={getRoleOptions(member.role)}
                      selectedId={member.role}
                    />
                  </div>
                  <div className="member-actions actions">
                    <button
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
                      message="Removing a member will provoke all access."
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
        <p className="footer-annotation">
          Note that adding users to the project doesn't mean they can access the
          project data. In order to access the project data they need to set
          access permission for the project folder.{' '}
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
      </PopUpDialog>
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
        />
      )}
    </>
  )
}

MembersPopUp.propTypes = {
  changeMembersCallback: PropTypes.func.isRequired,
  closePopUp: PropTypes.func.isRequired,
  membersDispatch: PropTypes.func.isRequired,
  membersState: PropTypes.shape({}).isRequired
}

export default MembersPopUp
