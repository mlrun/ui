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
// Hardening helpers for mock.js request handlers (bounded collection growth,
// path-traversal-safe file resolution, filesystem-route rate limiting).
import path from 'path'
import { rateLimit } from 'express-rate-limit'

// Upper bound for mock collections that grow from incoming requests (e.g. funcs.funcs),
// so their .length stays capped instead of growing indefinitely with request volume.
const MAX_MOCK_COLLECTION_SIZE = 5000

export function capCollectionSize(collection) {
  if (collection.length > MAX_MOCK_COLLECTION_SIZE) {
    collection.splice(0, collection.length - MAX_MOCK_COLLECTION_SIZE)
  }
}

// Bounds an array right before it's iterated/sorted/chunked, so a sink can't be driven
// by an arbitrarily large collection even if it was built up from many prior requests.
// Non-arrays are rejected to avoid trusting an attacker-controlled `.length`.
export function boundArray(arr) {
  if (!Array.isArray(arr)) {
    return []
  }
  return arr.length > MAX_MOCK_COLLECTION_SIZE ? arr.slice(0, MAX_MOCK_COLLECTION_SIZE) : arr
}

// Resolves `relativePath` under `baseDir`, rejecting anything that would escape baseDir
// (e.g. via '..' path traversal) once the two are combined.
function resolveWithinDir(baseDir, relativePath) {
  const resolved = path.resolve(baseDir, relativePath)
  return resolved === baseDir || resolved.startsWith(baseDir + path.sep) ? resolved : null
}

const FUNCTIONS_DATA_DIR = path.resolve('./tests/mockServer/data/mlrun/functions')

export function resolveFunctionYAMLPath(rawName) {
  if (typeof rawName !== 'string' || !rawName || path.basename(rawName) !== rawName) {
    return null
  }
  return resolveWithinDir(FUNCTIONS_DATA_DIR, path.join(rawName, `${rawName}.yaml`))
}

// Throttles the routes that touch the filesystem, so repeated requests can't be used
// to exhaust disk/CPU resources.
export const fsAccessLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false
})
