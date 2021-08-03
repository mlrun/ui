export const initialNewMembersRole = 'Viewer'
export const getRoleOptions = (memberRole = '', allOption = false) => {
  return [
    { id: 'All', label: 'All', hidden: !allOption },
    { id: 'Owner', label: 'Owner', hidden: memberRole !== 'Owner' },
    { id: 'Viewer', label: 'Viewer' },
    { id: 'Editor', label: 'Editor' },
    { id: 'Admin', label: 'Admin' }
  ]
}
