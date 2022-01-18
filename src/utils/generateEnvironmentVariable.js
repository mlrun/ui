import { ENV_VARIABLE_TYPE_SECRET, ENV_VARIABLE_TYPE_VALUE } from '../constants'

export const generateEnvVariable = variable => {
  if (variable.type === ENV_VARIABLE_TYPE_VALUE) {
    return {
      name: variable.name,
      value: variable.value
    }
  } else if (
    variable.type === ENV_VARIABLE_TYPE_SECRET &&
    variable.value.length === 0
  ) {
    return {
      name: variable.name,
      valueFrom: {
        secretKeyRef: {
          name: variable.secretName,
          key: variable.secretKey
        }
      }
    }
  } else if (
    variable.type === ENV_VARIABLE_TYPE_SECRET &&
    variable.value.length > 0
  ) {
    const [name, key] = variable.value.split(':')

    return {
      name: variable.name,
      valueFrom: {
        secretKeyRef: { name, key }
      }
    }
  }
}
