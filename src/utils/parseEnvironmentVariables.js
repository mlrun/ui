import { ENV_VARIABLE_TYPE_SECRET, ENV_VARIABLE_TYPE_VALUE } from '../constants'

export const parseEnvVariables = envVariables => {
  return envVariables.map(envVariable => {
    let type = envVariable.value
      ? ENV_VARIABLE_TYPE_VALUE
      : ENV_VARIABLE_TYPE_SECRET
    let value = envVariable.value ?? ''

    if (envVariable?.valueFrom?.secretKeyRef) {
      type = ENV_VARIABLE_TYPE_SECRET
      value = `${envVariable.valueFrom.secretKeyRef.name ?? ''}:${envVariable
        .valueFrom.secretKeyRef.key ?? ''}`
    }

    return { name: envVariable.name, type, value }
  })
}
