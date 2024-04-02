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
import { ADMIN_ROLE, ALL_ROLES, EDITOR_ROLE, OWNER_ROLE, VIEWER_ROLE } from '../../constants'

export const DELETE_MODIFICATION = 'delete'
export const initialNewMembersRole = VIEWER_ROLE
export const getRoleOptions = (memberRole = '', allOption = false) => {
  return [
    { id: ALL_ROLES, label: ALL_ROLES, hidden: !allOption },
    { id: OWNER_ROLE, label: OWNER_ROLE, hidden: memberRole !== OWNER_ROLE },
    { id: VIEWER_ROLE, label: VIEWER_ROLE },
    { id: EDITOR_ROLE, label: EDITOR_ROLE },
    { id: ADMIN_ROLE, label: ADMIN_ROLE }
  ]
}
