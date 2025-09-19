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
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
  MODEL_ENDPOINTS_TAB,
  MONITOR_JOBS_TAB,
  MODELS_TAB,
  MONITOR_ALERTS_PAGE,
  MONITOR_WORKFLOWS_TAB,
  SCHEDULE_TAB,
  REAL_TIME_PIPELINES_TAB,
  JOBS_MONITORING_PAGE,
  PROJECTS_PAGE_PATH,
  PROJECTS_SETTINGS_GENERAL_TAB,
  PROJECTS_SETTINGS_MEMBERS_TAB,
  PROJECTS_SETTINGS_SECRETS_TAB,
  PROJECTS_SETTINGS_PAGE_PATH
} from '../../constants'

import { getNavbarLinks } from '../../elements/NavbarList/navbarlist.util'

export const generateMlrunScreens = (projectName, isDemoMode) => {
  const screens = getNavbarLinks(projectName, isDemoMode)

  const innerScreens = screens.reduce((acc, { link, linkTo, ...screen }) => {
    if (screen.nestedLinks) {
      screen.nestedLinks.forEach(({ link, linkTo, ...nestedScreen }) => acc.push({
        label: nestedScreen.label,
        id: nestedScreen.id,
        link,
        linkTo,
        hidden: nestedScreen.hidden
      }))
    } else {
      acc.push({
        label: screen.label,
        id: screen.id,
        link,
        linkTo,
        hidden: screen.hidden
      })
    }

    return acc
  }, [])

  innerScreens.push({
    label: 'Alerts',
    id: ALERTS_PAGE_PATH,
    link: `/${PROJECTS_PAGE_PATH}/${projectName}/${ALERTS_PAGE_PATH}`
  },
  {
    label: 'Settings',
    id: 'settings',
    link: `/${PROJECTS_PAGE_PATH}/${projectName}/${PROJECTS_SETTINGS_PAGE_PATH}`
  })

  return projectName ? innerScreens : [
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

export const generateTabsList = () => [
  {
    label: MONITOR_JOBS_TAB,
    id: MONITOR_JOBS_TAB
  },
  {
    label: MONITOR_WORKFLOWS_TAB,
    id: MONITOR_WORKFLOWS_TAB
  },
  {
    label: SCHEDULE_TAB,
    id: SCHEDULE_TAB
  },
  {
    label: MODEL_ENDPOINTS_TAB,
    id: MODEL_ENDPOINTS_TAB
  },
  {
    label: REAL_TIME_PIPELINES_TAB,
    id: REAL_TIME_PIPELINES_TAB
  },
  {
    label: MODELS_TAB,
    id: MODELS_TAB
  },
  {
    label: FEATURE_SETS_TAB,
    id: FEATURE_SETS_TAB
  },
  {
    label: FEATURE_VECTORS_TAB,
    id: FEATURE_VECTORS_TAB
  },
  {
    label: PROJECTS_SETTINGS_GENERAL_TAB,
    id: PROJECTS_SETTINGS_GENERAL_TAB
  },
  {
    label: PROJECTS_SETTINGS_MEMBERS_TAB,
    id: PROJECTS_SETTINGS_MEMBERS_TAB
  },
  {
    label: PROJECTS_SETTINGS_SECRETS_TAB,
    id: PROJECTS_SETTINGS_SECRETS_TAB
  },
  {
    label: FEATURES_TAB,
    id: FEATURES_TAB
  },
]
