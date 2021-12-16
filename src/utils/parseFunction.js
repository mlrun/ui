import getState from './getState'
import { page } from '../components/FunctionsPage/functions.util'

export const parseFunction = (func, projectName, customState) => ({
  access_key: func.metadata.credentials?.access_key ?? '',
  args: func.spec?.args ?? [],
  base_spec: func.spec?.base_spec ?? {},
  build: func.spec?.build ?? {},
  command: func.spec?.command,
  default_class: func.spec?.default_class ?? '',
  default_handler: func.spec?.default_handler ?? '',
  description: func.spec?.description ?? '',
  env: func.spec?.env ?? [],
  error_stream: func.spec?.error_stream ?? '',
  graph: func.spec?.graph ?? {},
  hash: func.metadata?.hash ?? '',
  image: func.spec?.image ?? '',
  labels: func.metadata?.labels ?? {},
  name: func.metadata?.name ?? '',
  nuclio_name: func.status?.nuclio_name ?? '',
  parameters: func.spec?.parameters ?? {},
  project: func.metadata?.project || projectName,
  resources: func.spec?.resources ?? {},
  secret_sources: func.spec?.secret_sources ?? [],
  state: getState(customState || func.status?.state, page, 'function'),
  tag: func.metadata?.tag ?? '',
  track_models: func.spec?.track_models ?? false,
  type: func.kind,
  volume_mounts: func.spec?.volume_mounts ?? [],
  volumes: func.spec?.volumes ?? [],
  updated: new Date(func.metadata?.updated ?? ''),
  ui: {
    originalContent: func
  }
})
