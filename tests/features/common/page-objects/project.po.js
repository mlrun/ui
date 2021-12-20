import { By } from 'selenium-webdriver'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import { generateDropdownGroup } from '../../common-tools/common-tools'

const createNewObject = dropdownComponent(
  generateDropdownGroup(
    'div.main-info__toolbar div.create-new-menu',
    'div.select__header',
    false,
    false
  )
)

const projectDashboardRealtimeFunctionsTable = {
  root: 'div.project-data-card:nth-of-type(2) div.project-data-card__table',
  header: {
    root: 'div.project-data-card__table-header',
    sorters: {
      name: 'div.table-header__item:nth-of-type(1) div.data-ellipsis',
      status: 'div.table-header__item:nth-of-type(2) div.data-ellipsis'
    }
  },
  body: {
    root: 'div.project-data-card__table-body',
    row: {
      root: 'div.project-data-card__table-row',
      fields: {
        name:
          'div.project-data-card__table-cell:nth-of-type(1) div.data-ellipsis',
        status:
          'div.project-data-card__table-cell:nth-of-type(2) div.data-ellipsis'
      }
    }
  }
}

const projectJobsAndWorkflows = {
  root: 'div.project-data-card:nth-of-type(1) div.project-data-card__table',
  header: {
    root: 'div.project-data-card__table-header',
    sorters: {
      name: 'div.table-header__item:nth-of-type(1) .data-ellipsis',
      type: 'div.table-header__item:nth-of-type(2) .data-ellipsis',
      status: 'div.table-header__item:nth-of-type(3) .data-ellipsis',
      started_at: 'div.table-header__item:nth-of-type(4) .data-ellipsis',
      duration: 'div.table-header__item:nth-of-type(5) .data-ellipsis'
    }
  },
  body: {
    root: 'div.project-data-card__table-body',
    row: {
      root: 'div.project-data-card__table-row',
      fields: {
        name:
          'div.project-data-card__table-cell:nth-of-type(1) div.data-ellipsis',
        type:
          'div.project-data-card__table-cell:nth-of-type(2) div.data-ellipsis',
        status:
          'div.project-data-card__table-cell:nth-of-type(2) div.data-ellipsis',
        started_at:
          'div.project-data-card__table-cell:nth-of-type(2) div.data-ellipsis',
        duration:
          'div.project-data-card__table-cell:nth-of-type(2) div.data-ellipsis'
      }
    }
  }
}

const generalInfoMonoValueCards = {
  root: 'div.main-info__statistics-section:nth-of-type(2)',
  header: {},
  body: {
    row: {
      root: 'a.project-data-card',
      fields: {
        name: 'div.project-data-card__header-text',
        value: 'div.project-data-card__statistics'
      }
    }
  }
}

const generalInfoJobsCardStat = {
  root:
    'div.main-info__statistics-section div.project-data-card:nth-of-type(1)',
  header: {},
  body: {
    root: 'div.project-data-card__statistics',
    row: {
      root: 'div.project-data-card__statistics-item',
      fields: {
        name: 'div.project-data-card__statistics-label',
        value: 'div.project-data-card__statistics-value'
      }
    }
  }
}

const generalInfoRealTimeFunctionsCardStat = {
  root:
    'div.main-info__statistics-section div.project-data-card:nth-of-type(2)',
  header: {},
  body: {
    root: 'div.project-data-card__statistics',
    row: {
      root: 'div.project-data-card__statistics-item',
      fields: {
        name: 'div.project-data-card__statistics-label',
        value: 'div.project-data-card__statistics-value'
      }
    }
  }
}

const generalInfoQuickLinks = {
  root: 'div.general-info div.general-info__links',
  header: {},
  body: {
    row: {
      root: 'a.link',
      fields: {
        link: ''
      }
    }
  }
}

module.exports = {
  Project_Settings_Button: By.css(
    '.project__content .general-info .general-info__main-data-wrapper .general-info__settings'
  ),
  Create_New: createNewObject,
  Refresh_Button: By.css(
    'div.main-info__toolbar div.refresh button[id=refresh]'
  ),
  Dashboard_Realtime_Functions_Table: commonTable(
    projectDashboardRealtimeFunctionsTable
  ),
  Jobs_And_Workflows: commonTable(projectJobsAndWorkflows),
  Mono_Values_Cards: commonTable(generalInfoMonoValueCards),
  Jobs_Info_Card_Statistics: commonTable(generalInfoJobsCardStat),
  Real_Time_Functions_Card_Statistics: commonTable(
    generalInfoRealTimeFunctionsCardStat
  ),
  Add_Source_URL_Label: By.css('.general-info .general-info__source'),
  General_Info_Quick_Links: commonTable(generalInfoQuickLinks),
  Owner_Link: By.css('.project__content .general-info .owner-row .link'),
  Members_Link: By.css('.project__content .general-info .members-row .link')
}
