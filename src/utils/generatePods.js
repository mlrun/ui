import React from 'react'

export const generatePods = (project, uid, pods) => {
  const podsList = pods?.[project]?.[uid]?.pod_resources ?? []
  const podsTooltip = podsList.map((value, index) => (
    <p key={index}>
      {value?.name}
      {value?.status?.phase?.toLowerCase?.() === 'pending'
        ? ' (pending...)'
        : ''}
    </p>
  ))
  const podsPending = podsList.filter(
    pod => pod?.status?.phase?.toLowerCase?.() === 'pending'
  )

  return {
    podsList,
    podsPending,
    podsTooltip
  }
}
