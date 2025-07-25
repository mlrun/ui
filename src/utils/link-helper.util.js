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
import { DETAILS_OVERVIEW_TAB } from '../constants'
import { VIEW_SEARCH_PARAMETER } from 'igz-controls/constants'
import { generateUrlFromRouterPath } from 'igz-controls/utils/common.util'
import { getFilteredSearchParams } from 'igz-controls/utils/filter.util'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

export const isPageTabValid = (pageTab, tabs, navigate, location) => {
  if (!tabs.includes(pageTab)) {
    // Change invalid "tab" part of the link to a valid one
    navigate([...location.pathname.split('/').slice(0, 4)].join('/'))
  }
}

export const isProjectValid = (navigate, projects, currentProjectName, dispatch) => {
  if (
    projects.length > 0 &&
    currentProjectName &&
    !projects.some(project => project?.metadata?.name === currentProjectName)
  ) {
    navigate('/projects', { replace: true })
    showErrorNotification(dispatch, {}, '', 'This project does not exist')
  }
}

export const getCloseDetailsLink = (paramName, ignoreOrigin, objectName) => {
  let pathname = window.location.pathname

  if (ignoreOrigin && pathname.startsWith(import.meta.env.VITE_PUBLIC_URL)) {
    pathname = pathname.slice(import.meta.env.VITE_PUBLIC_URL.length)
  }

  let linkParts =
    pathname
      .split('/')
      .splice(0, pathname.split('/').lastIndexOf(paramName) + 1)
      
  if (objectName && paramName === objectName && linkParts[linkParts.length - 1] === objectName) linkParts.pop()

  const link = linkParts.join('/') + getFilteredSearchParams(window.location.search, [VIEW_SEARCH_PARAMETER])

  return ignoreOrigin ? link : generateUrlFromRouterPath(link)
}

export const getDefaultCloseDetailsLink = (params, page, tab) => {
  return `/projects/${params.projectName}/${page.toLowerCase()}${
    params.pageTab ? `/${params.pageTab}` : tab ? `/${tab}` : ''
  }${window.location.search}`
}

export const generateLinkToDetailsPanel = (
  project,
  screen,
  tab,
  key,
  version,
  detailsTab,
  uid,
  iter,
  itemName
) =>
  `/projects/${project}/${screen.toLowerCase()}${tab ? `/${tab}` : ''}${
    itemName ? `/${itemName}` : ''
  }/${key}${version ? `/${version}` : uid ? `/${uid}` : ''}${
    isNaN(parseInt(iter)) ? '' : `/${iter}`
  }/${detailsTab.toLowerCase()}${window.location.search}`

export const parseFunctionUri = functionUri => {
  let [project, rest] = functionUri.split('/')
  let name = rest
  let hash = null
  let tag = null
  let nameWithHash = null
  let nameWithUid = null
  let uid = null

  if (rest.includes('@')) {
    ;[name, hash] = rest.split('@')
    nameWithHash = `${name}@${hash}`
  } else if (rest.includes(':')) {
    ;[name, tag] = rest.split(':')
  }

  return { project, name, hash, tag, nameWithHash, uid, nameWithUid }
}

export const generateFunctionDetailsLink = (uri = '') => {
  // remove 'latest' when function_uri will contain hash or tag
  //
  // 'my_proj/func_name@func_hash' -> projects/my_proj/functions/func_hash/overview
  // 'my_proj/func_name' -> projects/my_proj/functions/func_name/latest/overview
  // 'my_proj/func_name:custom_tag' -> projects/my_proj/functions/func_name/custom_tag/overview
  let generatedLink = ''

  if (uri) {
    const { project, name, nameWithHash, tag } = parseFunctionUri(uri)

    if (project && (name || nameWithHash)) {
      generatedLink = `/projects/${project}/functions/${nameWithHash ? nameWithHash : name}${nameWithHash ? '' : '/' + (tag ?? 'latest')}/overview`
    }
  }

  return generatedLink
}

export const isDetailsTabExists = (tab, tabsList, navigate, location) => {
  if (!tabsList.find(el => el.id === tab && !el.hidden)) {
    const newUrlArray = location.pathname.split('/')
    newUrlArray[newUrlArray.length - 1] = DETAILS_OVERVIEW_TAB
    const newUrl =
      newUrlArray.join('/') +
      getFilteredSearchParams(window.location.search, [VIEW_SEARCH_PARAMETER])

    navigate(newUrl, { replace: true })
  }
}
