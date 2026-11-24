/*
Copyright 2022 Iguazio Systems Ltd.
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
import { describe, expect, it } from 'vitest'

import {
  getInvalidParquetPathMessage,
  getParquetPathPattern,
  isParquetPathFormatValid,
  isParquetPathValid
} from './featureSetsPanelTargetStore.util'

const paths = [
  '',
  'dir',
  'dir/',
  'dir.parquet',
  'dir.pq',
  'dir.parquet ',
  'dir.pq  ',
  'dir.PARQUET',
  'dir.csv',
  'dir.parquet.csv',
  'dir.parquet/file',
  's3://bucket/project/FeatureStore/name/parquet/sets/name.parquet',
  's3://bucket/project/FeatureStore/name/parquet/sets/name',
  'v3io:///projects/project/FeatureStore/name/parquet/sets/name.pq'
]

describe('parquet target path rules', () => {
  describe.each([
    { partitioned: '', title: 'file' },
    { partitioned: 'byTime', title: 'partitioned' }
  ])('$title path', ({ partitioned }) => {
    it.each(paths)('keeps the Input pattern in sync with the validity of "%s"', path => {
      const pattern = new RegExp(`^(?:${getParquetPathPattern(partitioned)})$`)
      const expectedValidity = isParquetPathFormatValid(path, partitioned)

      expect(pattern.test(path)).toBe(expectedValidity)
      expect(isParquetPathValid(true, { path, partitioned })).toBe(!expectedValidity)
    })
  })

  it('reports the path as invalid when the validation failed', () => {
    expect(isParquetPathValid(false, { path: 'dir.parquet', partitioned: '' })).toBe(true)
  })

  it('describes why a path is invalid', () => {
    expect(getInvalidParquetPathMessage({ path: 'dir', partitioned: '' })).toContain(
      '.parquet/.pq suffix'
    )
    expect(getInvalidParquetPathMessage({ path: 'dir.parquet', partitioned: 'byTime' })).toContain(
      'must be a directory'
    )
    expect(getInvalidParquetPathMessage({ path: 'dir.parquet', partitioned: '' })).toBe(
      'This field is invalid.'
    )
  })
})
