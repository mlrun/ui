import React, { useEffect, useState, useCallback } from 'react'
import { Base64 } from 'js-base64'

import NoData from '../../common/NoData/NoData'

const DetailsCode = ({ code }) => {
  const [decoded, setDecoded] = useState('')

  const decodeCode = useCallback(() => {
    setDecoded(Base64.decode(code))
  }, [code])

  useEffect(() => {
    decodeCode()
  }, [decodeCode])

  return (
    <div className="table__item_code">
      {decoded.length > 0 ? (
        <div className="table__item_code__content">
          <pre>
            <code>{decoded}</code>
          </pre>
        </div>
      ) : (
        <NoData />
      )}
    </div>
  )
}

DetailsCode.defaultProps = {
  code: ''
}

export default DetailsCode
