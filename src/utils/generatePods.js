import React from 'react'
import { map } from 'lodash'

export const generatePods = (uid, pods) => {
  let podsData = {}
  let podsPending = []
  let podsList = []
  let podsTooltip = []

  if (pods && pods[uid]) {
    podsList = pods[uid].pod_resources
    podsTooltip = map(podsList, (value, index) => (
      <p key={index}>
        {value.name}
        {value.status.phase.toLowerCase() === 'pending' ? ' (pending...)' : ''}
      </p>
    ))
    podsPending = podsList.filter(
      pod => pod.status.phase.toLowerCase() === 'pending'
    )
  }

  if (podsPending.length > 0) {
    podsData = {
      podsList,
      podsPending,
      podsTooltip
    }
  }

  return podsData
}
