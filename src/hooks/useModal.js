import { useEffect, useContext, useCallback, useState } from 'react'

import useRouter from './useRouter'
import { openPopUp } from 'igz-controls/utils/common.util'

import { ModalContext } from '../utils/ModalContext.util'

export const useModal = () => {
  const [instanceId, setInstanceId] = useState('')
  const router = useRouter()

  const { hasInstance, resolveInstance, rejectInstance } = useContext(ModalContext)

  const createModal = useCallback((component, props) => {
    openPopUp(component, props)
    setInstanceId(props.instanceId)
  }, [])

  const resolveModal = useCallback(() => resolveInstance(instanceId), [resolveInstance, instanceId])

  const rejectModal = useCallback(() => rejectInstance(instanceId), [rejectInstance, instanceId])

  useEffect(() => {
    if (router.query[instanceId]) {
      !hasInstance(instanceId) && createModal()
    } else {
      resolveModal()
      setInstanceId('')
    }
  }, [router.query[instanceId]])

  return {
    createModal,
    resolveModal,
    rejectModal
  }
}
