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
