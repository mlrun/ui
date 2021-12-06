export const formatDatetime = (datetime, invalidDateMessage) =>
  typeof datetime !== 'object' || !(datetime instanceof Date) || isNaN(datetime)
    ? invalidDateMessage
    : new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(new Date(datetime))

export const getFormatTime = time => {
  const [hour, minute] = time.split(':')
  if (!minute) {
    return {
      hour: '0',
      minute: '0'
    }
  }
  return {
    hour: hour.replace(/_/g, '0'),
    minute: minute.replace(/_/g, '0')
  }
}
