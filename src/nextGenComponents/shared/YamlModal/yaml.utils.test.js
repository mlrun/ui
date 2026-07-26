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
import yaml from 'js-yaml'

import { getValidYaml } from './yaml.utils'

// ── Helpers ────────────────────────────────────────────────────────────────────

const dump = obj => yaml.dump(obj, { lineWidth: -1 })

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('getValidYaml', () => {
  describe('input handling', () => {
    it('returns an empty string when given an empty string', () => {
      expect(getValidYaml('')).toBe('')
    })

    it('leaves plain scalar values unchanged', () => {
      const input = dump({ name: 'my-app', version: 1 })
      const result = getValidYaml(input)
      expect(result).toContain('name: my-app')
      expect(result).toContain('version: 1')
    })
  })

  describe('list item collapsing', () => {
    it('collapses list items separated by a newline + indent onto a single line', () => {
      // yaml.dump produces "- \n  value" style for single-element lists of scalars
      const input = 'items:\n  -\n    value1\n  -\n    value2\n'
      const result = getValidYaml(input)
      // After collapsing, list items should not start on the next indented line
      expect(result).not.toMatch(/-\s*\n\s+/)
    })

    it('collapses multiline list of strings from yaml.dump output', () => {
      const input = dump({ commands: ['echo hello', 'ls -la'] })
      const result = getValidYaml(input)
      expect(result).not.toMatch(/-\s*\n\s+/)
    })
  })

  describe('quote normalisation', () => {
    it('collapses escaped double-single-quotes to a single quote', () => {
      // yaml.dump represents a string containing a single quote as '' (escaped)
      const input = dump({ label: "it's a test" })
      const result = getValidYaml(input)
      // The doubled '' should be collapsed to a single '
      expect(result).not.toContain("''")
    })

    it('does not corrupt plain alphanumeric values', () => {
      const input = dump({ key: 'simpleValue', num: 42, flag: true })
      const result = getValidYaml(input)
      expect(result).toContain('key: simpleValue')
      expect(result).toContain('num: 42')
      expect(result).toContain('flag: true')
    })
  })

  describe('nested object preservation', () => {
    it('preserves nested structure from yaml.dump', () => {
      const obj = {
        metadata: { name: 'my-gateway', namespace: 'default' },
        spec: { host: 'example.com', path: 'api/v1' }
      }
      const result = getValidYaml(dump(obj))
      expect(result).toContain('metadata:')
      expect(result).toContain('name: my-gateway')
      expect(result).toContain('spec:')
      expect(result).toContain('host: example.com')
    })

    it('preserves null values', () => {
      const input = dump({ key: null })
      const result = getValidYaml(input)
      expect(result).toContain('key:')
    })
  })

  describe('real-world gateway fixture', () => {
    it('handles a typical API gateway object without throwing', () => {
      const gateway = {
        metadata: {
          name: 'my-gateway',
          namespace: 'my-project',
          labels: { owner: 'alice' }
        },
        spec: {
          host: 'nuclio.example.com',
          path: 'custom-path',
          authenticationMode: 'basicAuth',
          upstreams: [{ nucliofunction: { name: 'my-project/my-fn' }, percentage: 0 }]
        }
      }
      expect(() => getValidYaml(dump(gateway))).not.toThrow()
      const result = getValidYaml(dump(gateway))
      expect(result).toContain('name: my-gateway')
      expect(result).toContain('host: nuclio.example.com')
    })
  })
})
