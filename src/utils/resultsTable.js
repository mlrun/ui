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
import { capitalize, isObjectLike } from 'lodash'

export const generateResultsContent = job => {
  let content = []

  if (job.iterationStats && job.iterationStats.length !== 0) {
    const headers = job.iterationStats[0]
    content = job.iterationStats.slice(1).map(iterationStat => {
      const generatedStatData = iterationStat.map((statValue, idx) => {
        const clearHeaderPrefix = String(headers[idx]).replace(/^.+\./, '').toLocaleLowerCase()
        return {
          headerId: headers[idx],
          headerLabel: capitalize(clearHeaderPrefix),
          value: statValue ?? ''
        }
      })

      return [generatedStatData[1], generatedStatData[0]].concat(generatedStatData.slice(2))
    })
  } else if (job.iterations?.length === 0 && Object.keys(job.results ?? {}).length !== 0) {
    content = Object.keys(job.results).map(resultName => {
      const resultValue = isObjectLike(job.results[resultName])
        ? JSON.stringify(job.results[resultName])
        : job.results[resultName]

      return [
        {
          headerId: 'name',
          headerLabel: 'Name',
          value: resultName
        },
        {
          headerId: 'value',
          headerLabel: 'Value',
          value: String(resultValue ?? '')
        }
      ]
    })
  }

  return content
}
