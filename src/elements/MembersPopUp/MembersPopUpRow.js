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
import React, { useRef, useState } from 'react'
import classnames from 'classnames'
import { cloneDeep } from 'lodash'

import { ConfirmDialog } from 'igz-controls/components'
import Select from '../../common/Select/Select'

import { DELETE_MODIFICATION, getRoleOptions } from './membersPopUp.util'
import { DANGER_BUTTON } from 'igz-controls/constants'
import { OWNER_ROLE } from '../../constants'

import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

const MembersPopUpRow = ({ inviteNewMembers, member, membersData, setMembersData }) => {
  const memberRef = useRef()
  const [deleteMemberId, setDeleteMemberId] = useState('')

  const membersTableRowClassNames = classnames('table-row', inviteNewMembers && 'inactive')

  const changeMemberRole = (roleOption, memberToEdit) => {
    const membersCopy = cloneDeep(membersData.members)
    const member = membersCopy.find(member => member.id === memberToEdit.id)

    if (member.initialRole) {
      member.modification = member.initialRole !== roleOption ? 'put' : ''
    }
    member.role = roleOption

    setMembersData(state => ({ ...state, members: membersCopy }))
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

  return (
    <div className={membersTableRowClassNames}>
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
          ref={memberRef}
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
            element: memberRef,
            position: 'top-right'
          }}
          header="Are you sure?"
          isOpen={deleteMemberId === member.id}
          message="Removing a member will revoke all access."
        />
      )}
    </div>
  )
}

export default MembersPopUpRow
