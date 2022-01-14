import { By } from 'selenium-webdriver'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import { generateDropdownGroup } from '../../common-tools/common-tools'

const createNewObject = dropdownComponent(
  generateDropdownGroup(
    '.main-info__toolbar .create-new-menu',
    '.select__header',
    false,
    false
  )
)

const projectDashboardRealtimeFunctionsTable = {
  root: '.project-data-card:nth-of-type(2) .project-data-card__table',
  header: {
    root: '.project-data-card__table-header',
    sorters: {
      name: '.table-header__item:nth-of-type(1) .data-ellipsis',
      status: '.table-header__item:nth-of-type(2) .data-ellipsis'
    }
  },
  body: {
    root: '.project-data-card__table-body',
    row: {
      root: '.project-data-card__table-row',
      fields: {
        name: '.project-data-card__table-cell:nth-of-type(1) .data-ellipsis',
        status: '.project-data-card__table-cell:nth-of-type(2) .data-ellipsis'
      }
    }
  }
}

const projectJobsAndWorkflows = {
  root: '.project-data-card:nth-of-type(1) .project-data-card__table',
  header: {
    root: '.project-data-card__table-header',
    sorters: {
      name: '.table-header__item:nth-of-type(1) .data-ellipsis',
      type: '.table-header__item:nth-of-type(2) .data-ellipsis',
      status: '.table-header__item:nth-of-type(3) .data-ellipsis',
      started_at: '.table-header__item:nth-of-type(4) .data-ellipsis',
      duration: '.table-header__item:nth-of-type(5) .data-ellipsis'
    }
  },
  body: {
    root: '.project-data-card__table-body',
    row: {
      root: '.project-data-card__table-row',
      fields: {
        name: '.project-data-card__table-cell:nth-of-type(1) .data-ellipsis',
        type: '.project-data-card__table-cell:nth-of-type(2) .data-ellipsis',
        status: '.project-data-card__table-cell:nth-of-type(2) .data-ellipsis',
        started_at:
          '.project-data-card__table-cell:nth-of-type(2) .data-ellipsis',
        duration: '.project-data-card__table-cell:nth-of-type(2) .data-ellipsis'
      }
    }
  }
}

const generalInfoMonoValueCards = {
  root: '.main-info__statistics-section:nth-of-type(2)',
  header: {},
  body: {
    row: {
      root: '.project-data-card',
      fields: {
        name: '.project-data-card__header-text',
        value: '.project-data-card__statistics'
      }
    }
  }
}

const generalInfoJobsCardStat = {
  root: '.main-info__statistics-section .project-data-card:nth-of-type(1)',
  header: {},
  body: {
    root: '.project-data-card__statistics',
    row: {
      root: '.project-data-card__statistics-item',
      fields: {
        name: '.project-data-card__statistics-label',
        value: '.project-data-card__statistics-value'
      }
    }
  }
}

const generalInfoRealTimeFunctionsCardStat = {
  root: '.main-info__statistics-section .project-data-card:nth-of-type(2)',
  header: {},
  body: {
    root: '.project-data-card__statistics',
    row: {
      root: '.project-data-card__statistics-item',
      fields: {
        name: '.project-data-card__statistics-label',
        value: '.project-data-card__statistics-value'
      }
    }
  }
}

const generalInfoQuickLinks = {
  root: '.general-info .general-info__links',
  header: {},
  body: {
    row: {
      root: '.link',
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
  Refresh_Button: By.css('.main-info__toolbar .refresh button[id=refresh]'),
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
