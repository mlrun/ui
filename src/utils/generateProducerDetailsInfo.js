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
import { MONITOR_JOBS_TAB } from '../constants'
import { capitalize } from 'lodash'
import { isEveryObjectValueEmpty } from './isEveryObjectValueEmpty'

import DetailsInfoItem from '../elements/DetailsInfoItem/DetailsInfoItem'

export const generateProducerDetailsInfo = selectedItem => {
  if (!isEveryObjectValueEmpty(selectedItem) && selectedItem.producer) {
    return Object.entries(selectedItem.producer).map(([key, value]) => {
      let url = ''
      if (key === 'uri') {
        // value is in the form of: project/uid-iteration
        const [project, rest] = value.split('/')
        const [uid] = rest?.split('-') ?? []
        if (uid) {
          url = `/projects/${project}/jobs/${MONITOR_JOBS_TAB}/${uid}/overview`
        }
      }
      return (
        <li className="details-item" key={key}>
          <div className="details-item__header">{capitalize(key)}</div>
          <DetailsInfoItem link={url} info={value} />
        </li>
      )
    })
  }
}
