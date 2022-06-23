import { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'

export const usePods = (fetchJobPods, removePods, selectedJob) => {
  const params = useParams()

  useEffect(() => {
    if (!isEmpty(selectedJob)) {
      fetchJobPods(params.projectName, selectedJob.uid)

      const interval = setInterval(() => {
        fetchJobPods(params.projectName, selectedJob.uid)
      }, 30000)

      return () => {
        removePods()
        clearInterval(interval)
      }
    }
  }, [fetchJobPods, params.projectName, removePods, selectedJob])
}
