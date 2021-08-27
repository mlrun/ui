import { LIMITS, REQUESTS } from '../JobsPanel/jobsPanel.util'

export const setRangeInputValidation = (
  data,
  setValidation,
  value,
  type,
  kind,
  validationField
) => {
  if (type === REQUESTS && data[`limits${kind}`].length > 0) {
    setValidation(prevState => ({
      ...prevState,
      [validationField]: value <= Number.parseInt(data[`limits${kind}`])
    }))
  } else if (type === LIMITS && data[`requests${kind}`].length > 0) {
    setValidation(prevState => ({
      ...prevState,
      [validationField]: value >= Number.parseInt(data[`requests${kind}`])
    }))
  }
}
