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
import { useMemo, useRef, useEffect } from 'react'
import classnames from 'classnames'

import { scrollToElement } from '../utils/scroll.util'
import { DROPDOWN_TYPES } from './../constants'

const getItemConfig = (
  urlPart,
  urlParts,
  nextItem,
  index,
  params,
  isParam,
  isRealTimeFunctionNameStep,
  isScreenStep
) => {
  let label = urlPart
  if (!isParam && !isRealTimeFunctionNameStep) {
    label = isScreenStep
      ? urlParts.screen?.label || urlPart
      : urlPart.charAt(0).toUpperCase() + urlPart.slice(1)
  }

  const getDropdownType = () => {
    if (nextItem === urlParts.screen?.id) {
      return DROPDOWN_TYPES.SCREENS
    }
    if (index === 0 && nextItem === params.projectName) {
      return DROPDOWN_TYPES.PROJECTS
    }
    if (
      urlParts.screen?.id === 'real-time-functions' &&
      urlPart === urlParts.screen?.id &&
      urlParts.functionName &&
      nextItem === urlParts.functionName
    ) {
      return DROPDOWN_TYPES.FUNCTIONS
    }
    return null
  }

  return { label, dropdownType: getDropdownType() }
}

export const useBreadcrumbsStep = ({
  index,
  urlPart,
  urlParts,
  params,
  dropdownState,
  options
}) => {
  const projectListRef = useRef()

  const isParam = Object.values(params ?? {}).includes(urlPart)
  const isScreenStep = urlPart === urlParts.screen?.id
  const isRealTimeFunctionNameStep =
    urlParts.screen?.id === 'real-time-functions' &&
    index === urlParts.pathItems.length - 1 &&
    urlParts.pathItems.length > 3 &&
    !isParam

  const isLastStep = index === urlParts.pathItems.length - 1
  const to = `/${urlParts.pathItems.slice(0, index + 1).join('/')}`
  const nextItem = urlParts.pathItems[index + 1]

  const { label, dropdownType } = getItemConfig(
    urlPart,
    urlParts,
    nextItem,
    index,
    params,
    isParam,
    isRealTimeFunctionNameStep,
    isScreenStep
  )

  const isSeparatorActive = dropdownState.active === dropdownType
  const separatorClassNames = classnames(
    'breadcrumbs__separator',
    Boolean(dropdownType) && 'breadcrumbs__separator_tumbler',
    isSeparatorActive && 'breadcrumbs__separator_active'
  )

  const functionsList = useMemo(() => {
    if (!Array.isArray(options?.functions)) {
      return []
    }

    return options.functions.map(func => {
      const functionId = func?.metadata?.name || ''
      const functionPath = urlParts?.functionPath?.length
        ? `/${urlParts.functionPath.join('/')}`
        : ''

      return {
        id: functionId,
        label: functionId,
        linkTo: `${to}/${functionId}${functionPath}`
      }
    })
  }, [options?.functions, to, urlParts?.functionPath])

  useEffect(() => {
    if (dropdownState.active === DROPDOWN_TYPES.PROJECTS && projectListRef.current) {
      scrollToElement(projectListRef, `#${params.projectName}`, dropdownState.search)
    }
  }, [dropdownState.active, dropdownState.search, params.projectName])

  return {
    projectListRef,
    isLastStep,
    to,
    label,
    dropdownType,
    isSeparatorActive,
    separatorClassNames,
    functionsList
  }
}
