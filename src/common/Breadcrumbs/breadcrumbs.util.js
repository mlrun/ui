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
import {
  ALERTS_PAGE_PATH,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE_PATH,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
  MONITOR_ALERTS_PAGE,
  JOBS_MONITORING_PAGE,
  PROJECTS_PAGE_PATH,
  PROJECTS_SETTINGS_PAGE_PATH
} from '../../constants'
import { getLinks } from '../../nextGenComponents/shared/Sidebar/navbarList.util'

export const generateMlrunScreens = projectName => {
  const navbarLinks = getLinks(projectName)

  const mlrunScreens = navbarLinks.reduce((list, navbarLink) => {
    if (navbarLink.nestedLinks) {
      navbarLink.nestedLinks.forEach(nestedScreen => list.push(nestedScreen))
    } else {
      list.push(navbarLink)
    }

    return list
  }, [])

  mlrunScreens.push(
    {
      label: 'Feature sets',
      id: FEATURE_SETS_TAB,
      link: `/${PROJECTS_PAGE_PATH}/${projectName}/${FEATURE_STORE_PAGE_PATH}/${FEATURE_SETS_TAB}`
    },
    {
      label: 'Feature vectors',
      id: FEATURE_VECTORS_TAB,
      link: `/${PROJECTS_PAGE_PATH}/${projectName}/${FEATURE_STORE_PAGE_PATH}/${FEATURE_VECTORS_TAB}`
    },
    {
      label: 'Features',
      id: FEATURES_TAB,
      link: `/${PROJECTS_PAGE_PATH}/${projectName}/${FEATURE_STORE_PAGE_PATH}/${FEATURES_TAB}`
    },
    {
      label: 'Alerts',
      id: ALERTS_PAGE_PATH,
      link: `/${PROJECTS_PAGE_PATH}/${projectName}/${ALERTS_PAGE_PATH}`
    },
    {
      label: 'Settings',
      id: PROJECTS_SETTINGS_PAGE_PATH,
      link: `/${PROJECTS_PAGE_PATH}/${projectName}/${PROJECTS_SETTINGS_PAGE_PATH}`
    }
  )

  return projectName
    ? mlrunScreens
    : [
        {
          label: 'Alerts monitoring',
          id: MONITOR_ALERTS_PAGE,
          link: `/${PROJECTS_PAGE_PATH}/*/${MONITOR_ALERTS_PAGE}`
        },
        {
          label: 'Jobs monitoring',
          id: JOBS_MONITORING_PAGE,
          link: `/${PROJECTS_PAGE_PATH}/*/${JOBS_MONITORING_PAGE}`
        }
      ]
}
