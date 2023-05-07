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
import { useLocation } from 'react-router-dom'

import ContentMenu from '../../../elements/ContentMenu/ContentMenu'

import { tabs } from '../modelsPage.util'

import {
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE,
  MODELS_TAB,
  REAL_TIME_PIPELINES_TAB
} from '../../../constants'

const ModelsPageTabs = () => {
  const location = useLocation()

  return (
    <ContentMenu
      activeTab={
        location.pathname.includes(REAL_TIME_PIPELINES_TAB)
          ? REAL_TIME_PIPELINES_TAB
          : location.pathname.includes(MODEL_ENDPOINTS_TAB)
          ? MODEL_ENDPOINTS_TAB
          : MODELS_TAB
      }
      screen={MODELS_PAGE}
      tabs={tabs}
    />
  )
}

export default ModelsPageTabs
