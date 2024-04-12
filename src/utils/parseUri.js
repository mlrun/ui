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
import {
  DATASETS_TAB,
  FEATURE_SETS_TAB,
  FILES_TAB,
  FEATURE_VECTORS_TAB,
  MODELS_TAB,
  MONITOR_JOBS_TAB
} from '../constants'

/**
 * Parses a URI of MLRun store and returns an object with the different URI parts, all as strings.
 * `kind` should be one of: `'artifacts'`, `'models'`, `'datasets'`, `'feature-vectors'`, `'feature-sets'`, `'jobs'` or `'functions'`.
 * Usually, either `tag` or `uid` is present, not both. However, the function will corectly parse both of them if both
 * are present.
 * `iteration` is relevant to `feature-sets` and `feature-vectors` kinds only. Note its value type string, not number.
 * @param {string} [uri=''] - The store URI to parse.
 * @returns {Object.<string>} an Object with `kind`, `project`, `key`, `iteration`, `tag`, and `uid` properties, with
 *   string values, or an `undefined` value where an optional part is omitted.
 * @example
 * parseUri('store://artifacts/my-proj/some-file#4:latest')
 * // => { kind:      'artifacts',
 *         project:   'my-proj',
 *         key:       'some-file',
 *         iteration: '4',
 *         tag:       'latest',
 *         uid:       undefined }
 * @example
 * parseUri('store://models/my-proj/model-name@226dd4edcaea4a7e9edac734670ffbc2')
 * // => { kind:      'models',
 *         project:   'my-proj',
 *         key:       'model-name',
 *         iteration: undefined,
 *         tag:       undefined,
 *         uid:       '226dd4edcaea4a7e9edac734670ffbc2' }
 * @example
 * parseUri('store://datasets/my-proj/table:some-tag')
 * // => { kind:      'datasets',
 *         project:   'my-proj',
 *         key:       'table',
 *         iteration: undefined,
 *         tag:       'some-tag',
 *         uid:       undefined }
 * @example
 * parseUri('store://feature-vectors/my-proj/my-vec:some-tag@24fce79e709f9b3fe5e8251a39e67c678d94c20c')
 * // => { kind:      'feature-vectors',
 *         project:   'my-proj',
 *         key:       'my-vec',
 *         iteration: undefined,
 *         tag:       'some-tag',
 *         uid:       '24fce79e709f9b3fe5e8251a39e67c678d94c20c' }
 * @example
 * parseUri('store://feature-sets/my-proj/my-set@24fce79e709f9b3fe5e8251a39e67c678d94c20c')
 * // => { kind:      'feature-vectors',
 *         project:   'my-proj',
 *         key:       'my-set',
 *         iteration: undefined,
 *         tag:       undefined,
 *         uid:       '24fce79e709f9b3fe5e8251a39e67c678d94c20c' }
 */

const parseUri = uri =>
  (uri ?? '').match(
    /^store:\/\/(?<kind>.+?)\/(?<project>.+?)\/(?<key>.+?)(#(?<iteration>.+?))?(:(?<tag>.+?))?(@(?<uid>.+))?$/
  )?.groups ?? {}

const kindToScreen = {
  artifacts: FILES_TAB,
  datasets: `feature-store/${DATASETS_TAB}`,
  'feature-sets': `feature-store/${FEATURE_SETS_TAB}`,
  'feature-vectors': `feature-store/${FEATURE_VECTORS_TAB}`,
  functions: 'functions',
  jobs: `jobs/${MONITOR_JOBS_TAB}`,
  models: `models/${MODELS_TAB}`
}

const generateLinkPath = (uri = '', ignoreKey = false) => {
  const { kind, project, key, tag, uid } = parseUri(uri)
  const screen = kindToScreen[kind] ?? FILES_TAB
  const reference = tag ?? uid
  return `/projects/${project}/${screen}${ignoreKey ? '' : `/${key}`}${reference ? `/${reference}` : ''}`
}

const generateNuclioLink = pathname => {
  const linkUrl = new URL(`${window.mlrunConfig.nuclioUiUrl}${pathname}`)

  if (window.location.origin !== window.mlrunConfig.nuclioUiUrl) {
    linkUrl.searchParams.set?.('origin', window.location.origin)
  }

  return linkUrl.toString()
}

export { generateLinkPath, generateNuclioLink, parseUri }
