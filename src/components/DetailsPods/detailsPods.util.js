export const generatePods = (pods = {}) => {
  return pods.podsList
    ? pods.podsList.map(pod => {
        return {
          value: pod.name,
          className: 'link',
          status: pod.status,
          pending: pods.podsPending.some(item => item.name === pod.name)
        }
      })
    : []
}
