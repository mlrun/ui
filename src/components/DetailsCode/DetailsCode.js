/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useEffect, useState, useCallback } from 'react'
import Prism from 'prismjs'
import { Base64 } from 'js-base64'

import NoData from '../../common/NoData/NoData'

const DetailsCode = ({ code = '' }) => {
  const [decoded, setDecoded] = useState('')

  const decodeCode = useCallback(() => {
    setDecoded(Base64.decode(code ?? ''))
  }, [code])

  useEffect(() => {
    decodeCode()
  }, [decodeCode])

  const html = Prism.highlight(decoded, Prism.languages.py, 'py')

  return (
    <div className="table__item_code">
      {decoded.length > 0 ? (
        <div className="table__item_code__content">
          <pre>
            <code dangerouslySetInnerHTML={{ __html: html }} />
          </pre>
        </div>
      ) : (
        <NoData />
      )}
    </div>
  )
}

export default DetailsCode
