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
// prototype-pollution-safe assignment, path-traversal-safe file resolution,
// filesystem-route rate limiting).
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

// Guards against prototype pollution when the assignment key comes from request data
// (e.g. a '__proto__'/'constructor'/'prototype' string would otherwise alter Object.prototype).
const UNSAFE_OBJECT_KEYS = ['__proto__', 'constructor', 'prototype']

export function safeAssign(obj, key, value) {
  if (UNSAFE_OBJECT_KEYS.includes(key)) {
    return
  }
  obj[key] = value
}

// Resolves a mock function YAML file path from a user-supplied function name, rejecting
// anything that would escape the intended data directory (e.g. via '..' path traversal).
const FUNCTIONS_DATA_DIR = path.resolve('./tests/mockServer/data/mlrun/functions')

export function resolveFunctionYAMLPath(rawName) {
  if (typeof rawName !== 'string' || !rawName) {
    return null
  }
  const safeName = path.basename(rawName)
  if (safeName !== rawName) {
    return null
  }
  const resolved = path.resolve(FUNCTIONS_DATA_DIR, safeName, `${safeName}.yaml`)
  if (!resolved.startsWith(FUNCTIONS_DATA_DIR + path.sep)) {
    return null
  }
  return resolved
}

// Throttles the routes that touch the filesystem, so repeated requests can't be used
// to exhaust disk/CPU resources.
export const fsAccessLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false
})
