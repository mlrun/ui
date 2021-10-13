import { ENV_VARIABLE_TYPE_SECRET, ENV_VARIABLE_TYPE_VALUE } from '../constants'

export const parseEnvVariables = envVariables => {
  return envVariables.map(envVariable => {
    let type = envVariable.value
      ? ENV_VARIABLE_TYPE_VALUE
      : ENV_VARIABLE_TYPE_SECRET
    const value =
      envVariable.value ??
      `${envVariable.value_from.secret_key_ref.name}:${envVariable.value_from.secret_key_ref.key}`

    if (envVariable?.value?.value_from?.secret_key_ref) {
      type = ENV_VARIABLE_TYPE_SECRET
    }

    return { name: envVariable.name, type, value }
  })
}
