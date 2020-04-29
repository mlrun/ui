export const expandAll = expand => {
  const rows = [...document.getElementsByClassName('parent-row')]

  if (expand) {
    rows.forEach(row => row.classList.remove('parent-row-expanded'))

    return false
  } else {
    rows.forEach(row => row.classList.add('parent-row-expanded'))

    return true
  }
}
