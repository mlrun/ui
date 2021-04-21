export const generatePods = (pods = {}) => {
  return pods.podsList
    ? pods.podsList.map(pod => {
        return {
          value: pod.name,
          className: 'link',
          status: pod.status,
          pending: !!pods.podsPending.find(item => item.name === pod.name)
        }
      })
    : []
}
