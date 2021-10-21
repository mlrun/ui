import { ENV_VARIABLE_TYPE_SECRET, ENV_VARIABLE_TYPE_VALUE } from '../constants'

export const parseEnvVariables = envVariables => {
  return envVariables.map(envVariable => {
    let type = envVariable.value
      ? ENV_VARIABLE_TYPE_VALUE
      : ENV_VARIABLE_TYPE_SECRET
    let value = envVariable.value ?? ''

    if (envVariable?.value_from?.secret_key_ref) {
      type = ENV_VARIABLE_TYPE_SECRET
      value = `${envVariable.value_from.secret_key_ref.name ?? ''}:${envVariable
        .value_from.secret_key_ref.key ?? ''}`
    }

    return { name: envVariable.name, type, value }
  })
}
