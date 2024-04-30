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
import getState from './getState'
import { page } from '../components/FunctionsPage/functions.util'
import { getFunctionIdentifier } from './getUniqueIdentifier'
import { parseKeyValues } from './object'

export const parseFunction = (func, projectName, customState) => {
  const item = {
    access_key: func.metadata.credentials?.access_key ?? '',
    application_image: func.status?.application_image ?? '',
    args: func.spec?.args ?? [],
    base_spec: func.spec?.base_spec ?? {},
    build: func.spec?.build ?? {},
    command: func.spec?.command,
    container_image: func?.status?.container_image ?? '',
    default_class: func.spec?.default_class ?? '',
    default_handler: func.spec?.default_handler ?? '',
    description: func.spec?.description ?? '',
    disable_auto_mount: func.spec?.disable_auto_mount ?? true,
    env: func.spec?.env ?? [],
    error_stream: func.spec?.error_stream ?? '',
    graph: func.spec?.graph ?? {},
    hash: func.metadata?.hash ?? '',
    image: func.spec?.image ?? '',
    internal_invocation_urls: func.status?.internal_invocation_urls ?? [],
    internal_application_port: func.spec?.internal_application_port ?? '',
    labels: func.metadata?.labels ?? {},
    max_replicas: func.spec?.max_replicas ?? '',
    min_replicas: func.spec?.min_replicas ?? '',
    name: func.metadata?.name ?? '',
    node_selector: parseKeyValues(func.spec?.node_selector || {}),
    nuclio_name: func.status?.nuclio_name ?? '',
    parameters: func.spec?.parameters ?? {},
    preemption_mode: func.spec?.preemption_mode ?? '',
    priority_class_name: func.spec?.priority_class_name ?? '',
    project: func.metadata?.project || projectName,
    resources: func.spec?.resources ?? {},
    secret_sources: func.spec?.secret_sources ?? [],
    state: getState(customState || func.status?.state, page, 'function'),
    tag: func.metadata?.tag ?? '',
    track_models: func.spec?.track_models ?? false,
    type: func.kind,
    updated: new Date(func.metadata?.updated ?? ''),
    volume_mounts: func.spec?.volume_mounts ?? [],
    volumes: func.spec?.volumes ?? []
  }

  item.ui = {
    originalContent: func,
    identifier: getFunctionIdentifier(item),
    identifierUnique: getFunctionIdentifier(item, true)
  }

  return item
}
