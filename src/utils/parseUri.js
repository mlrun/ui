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
  artifacts: 'files',
  datasets: 'feature-store/datasets',
  'feature-sets': 'feature-store/feature-sets',
  'feature-vectors': 'feature-store/feature-vectors',
  functions: 'functions',
  jobs: 'jobs/monitor',
  models: 'models/models'
}
const generateLinkPath = (uri = '') => {
  const { kind, project, key, tag, uid } = parseUri(uri)
  const screen = kindToScreen[kind] ?? 'files'
  const reference = tag ?? uid
  return `/projects/${project}/${screen}/${key}${
    reference ? `/${reference}` : ''
  }`
}

export { generateLinkPath, parseUri }
