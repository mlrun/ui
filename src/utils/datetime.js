export const formatDatetime = datetime => {
  return datetime
    ? new Intl.DateTimeFormat('en-GB', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(new Date(datetime))
    : datetime
}
