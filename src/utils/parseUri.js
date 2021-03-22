/**
 * Parses a URI of MLRun store and returns an object with the different URI parts.
 * @param {string} [uri=''] - The store URI to parse.
 * @returns {Object} an Object with `kind`, `project`, `key`, `iteration`, `tag`, and `uid` properties, with empty
 *   strings where an optional part is omitted.
 */
const parseUri = (uri = '') =>
  uri.match(
    /^store:\/\/(?<kind>.+?)\/(?<project>.+?)\/(?<key>.+?)(#(?<iteration>.+?))?(:(?<tag>.+?))?(@(?<uid>.+))?$/
  )?.groups ?? {}

export { parseUri }
