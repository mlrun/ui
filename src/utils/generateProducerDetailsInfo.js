import { MONITOR_JOBS_TAB } from '../constants'
import { capitalize } from 'lodash'
import { isEveryObjectValueEmpty } from './isEveryObjectValueEmpty'

import DetailsInfoItem from '../elements/DetailsInfoItem/DetailsInfoItem'

export const generateProducerDetailsInfo = selectedItem => {
  if (!isEveryObjectValueEmpty(selectedItem) && selectedItem.item.producer) {
    return Object.entries(selectedItem.item.producer).map(([key, value]) => {
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
