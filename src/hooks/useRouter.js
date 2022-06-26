import { useLocation } from 'react-router-dom'
import qs from 'query-string'

function useRouter() {
  const location = useLocation()

  return {
    ...location,
    query: qs.parse(location.search)
  }
}

export default useRouter
