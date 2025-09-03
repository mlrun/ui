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
import React from 'react'

export function highlightMatches(template, regex, activeIndex = 0) {
  let current = 0

  const processText = (text, keyPrefix = '') => {
    const parts = text.split(regex)

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const isActive = current === activeIndex
        const highlighted = (
          <mark
            key={`${keyPrefix}-highlight-${current}`}
            data-index={current}
            style={{
              background: isActive ? '#FFAE4E' : '#FFE37E',
              color: '#483f56'
            }}
          >
            {part}
          </mark>
        )

        current++

        return highlighted
      }

      return part
    })
  }

  const processElement = (element, keyPrefix = '') => {
    if (typeof element === 'string') {
      return processText(element, keyPrefix)
    }

    if (React.isValidElement(element)) {
      const children = element.props.children

      let newChildren

      if (typeof children === 'string') {
        newChildren = processText(children, `${keyPrefix}-str`)
      } else if (Array.isArray(children)) {
        newChildren = children.map((child, index) => processElement(child, `${keyPrefix}-${index}`))
      } else if (React.isValidElement(children)) {
        newChildren = processElement(children, `${keyPrefix}-child`)
      } else {
        newChildren = children
      }

      return React.cloneElement(element, { ...element.props, key: keyPrefix }, newChildren)
    }

    return element
  }

  return template.map((el, index) => processElement(el, `root-${index}`))
}

export function countMatchesInTemplate(template, regex) {
  let count = 0

  const traverse = node => {
    if (typeof node === 'string') {
      count += (node.match(regex) || []).length
    } else if (Array.isArray(node)) {
      node.forEach(child => traverse(child))
    } else if (React.isValidElement(node)) {
      traverse(node.props.children)
    }
  }

  template.forEach(el => traverse(el))

  return count
}
