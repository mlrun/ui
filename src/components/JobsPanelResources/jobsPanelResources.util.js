import { LIMITS, REQUESTS } from '../JobsPanel/jobsPanel.util'

export const setRangeInputValidation = (
  data,
  setValidation,
  value,
  type,
  validationField,
  kind
) => {
  value = Number.parseInt(value)
  const limitsValue = parseInt(data[`limits${kind}`])
  const requestsValue = parseInt(data[`requests${kind}`])
  let isValid =
    type === REQUESTS
      ? value <= limitsValue && limitsValue > 0
      : value >= requestsValue && requestsValue > 0

  if (value > 0) {
    if (
      (type === REQUESTS && requestsValue > 0) ||
      (type === LIMITS && limitsValue > 0)
    ) {
      setValidation(prevState => ({
        ...prevState,
        [`is${kind}RequestValid`]: isValid,
        [`is${kind}LimitValid`]: isValid
      }))
    } else {
      setValidation(prevState => ({ ...prevState, [validationField]: true }))
    }
  } else if (value === 0) {
    setValidation(prevState => ({
      ...prevState,
      [`is${kind}RequestValid`]:
        type === REQUESTS || !requestsValue ? true : requestsValue > 0,
      [`is${kind}LimitValid`]:
        type === LIMITS || !limitsValue ? true : limitsValue > 0
    }))
  } else {
    setValidation(prevState => ({ ...prevState, [validationField]: false }))
  }
}
