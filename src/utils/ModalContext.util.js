import React, { createContext, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'

import qs from 'query-string'

import ModalContainer from 'react-modal-promise'

import useRouter from '../hooks/useRouter'

export const ModalContext = createContext(null)

const ModalProvider = ({ children }) => {
  const navigate = useNavigate()
  const router = useRouter()
  const ref = useRef(null)

  const hasInstance = id => ref.current.hasInstance(id)
  const resolveInstance = id => ref.current.resolve(id)
  const rejectInstance = id => ref.current.reject(id)

  const onOpen = (id, instance) => {
    if (!router.query[id] && (instance.props.controlled || instance.props.instanceId)) {
      navigate({
        pathname: router.pathname,
        search: qs.stringify({
          ...router.query,
          [id]: 'open'
        })
      })
    }
  }

  const onRemove = id => {
    const { [id]: _, ...query } = router.query
    navigate({
      pathname: router.pathname,
      search: qs.stringify(query)
    })
  }

  return (
    <ModalContext.Provider value={{ hasInstance, resolveInstance, rejectInstance }}>
      {ReactDOM.createPortal(
        <ModalContainer onOpen={onOpen} onRemove={onRemove} ref={ref} isAppendIntances />,
        document.getElementById('overlay_container')
      )}
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider
