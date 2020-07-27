export const formatDatetime = (datetime, invalidDateMessage) =>
  typeof datetime !== 'object' || !(datetime instanceof Date) || isNaN(datetime)
    ? invalidDateMessage
    : new Intl.DateTimeFormat('en-GB', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(datetime)
