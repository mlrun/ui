/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
