export const stringToBoolean = string => {
  switch (string.toLowerCase().trim()) {
    case 'true':
      return true
    case 'false':
    case '0':
    case null:
      return false
    default:
      return Boolean(string)
  }
}
