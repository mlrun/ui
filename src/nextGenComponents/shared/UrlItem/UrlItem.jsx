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
import { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { URL_ITEM_VARIANT, toHref } from './urlItem.constants'
import Copy from 'igz-controls/images/copy-to-clipboard-icon.svg?react'
import Check from 'igz-controls/images/double-check.svg?react'

const UrlItem = ({
  url,
  allowCopy = false,
  openInNewTab = false,
  asPlainText = false,
  isCopied,
  onCopy,
  variant = URL_ITEM_VARIANT.DEFAULT
}) => {
  const isDark = variant === URL_ITEM_VARIANT.DARK
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="flex items-center gap-1 min-w-0 leading-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid="url-item"
    >
      {asPlainText ? (
        <span
          className={classnames(
            'truncate text-[15px] leading-5',
            isDark ? 'text-white/90!' : 'text-igz-primary'
          )}
          data-testid="url-path"
        >
          {url}
        </span>
      ) : (
        <a
          href={openInNewTab ? toHref(url) : url}
          {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={classnames(
            'truncate text-[15px] leading-5 hover:underline',
            isDark ? 'text-white/90!' : 'text-igz-link!'
          )}
          data-testid="url-link"
        >
          {url}
        </a>
      )}

      {allowCopy && (
        <button
          type="button"
          onClick={() => onCopy?.(url)}
          className={classnames(
            'p-0.5 rounded shrink-0',
            isDark
              ? classnames(
                  'inline-flex transition-opacity',
                  isHovered ? 'opacity-100' : 'opacity-0',
                  'text-white/80 hover:text-white'
                )
              : asPlainText
                ? classnames(
                    'text-igz-secondary hover:opacity-80',
                    isHovered ? 'inline-flex' : 'hidden'
                  )
                : classnames('text-igz-link hover:opacity-80', isHovered ? 'inline-flex' : 'hidden')
          )}
          aria-label={isCopied ? 'Copied!' : 'Copy URL'}
          data-testid="copy-button"
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5 *:fill-current" data-testid="check-icon" />
          ) : (
            <Copy className="h-3.5 w-3.5 *:fill-current" data-testid="copy-icon" />
          )}
        </button>
      )}
    </div>
  )
}

UrlItem.propTypes = {
  allowCopy: PropTypes.bool,
  asPlainText: PropTypes.bool,
  isCopied: PropTypes.bool,
  onCopy: PropTypes.func,
  openInNewTab: PropTypes.bool,
  url: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(Object.values(URL_ITEM_VARIANT))
}

export default UrlItem
