import { By } from 'selenium-webdriver'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import labelComponent from '../components/label.component'
import {
  generateLabelGroup,
  generateDropdownGroup
} from '../../common-tools/common-tools'

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
        name: '.project-data-card__table-cell:nth-of-type(1) .link',
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

const DataCollectionActionsTable = {
  root:
    '.project-overview .project-overview__content .project-overview-card:nth-of-type(1) .project-overview-actions:nth-of-type(1)',
  header: {},
  body: {
    row: {
      root: '.project-overview-actions__item',
      fields: {
        name: '.link'
      }
    }
  }
}

const DataCollectionAdditionalActionsTable = {
  root:
    '.project-overview .project-overview__content .project-overview-card:nth-of-type(1) .project-overview-actions:nth-of-type(2)',
  header: {},
  body: {
    row: {
      root: '.project-overview-actions__item',
      fields: {
        name: '.link'
      }
    }
  }
}

const DevelopmentActionsTable = {
  root:
    '.project-overview .project-overview__content .project-overview-card:nth-of-type(2) .project-overview-card__actions',
  header: {},
  body: {
    root: '.project-overview-actions',
    row: {
      root: '.project-overview-actions__item',
      fields: {
        name: '.link'
      }
    }
  }
}

const DeploymetActionsTable = {
  root:
    '.project-overview .project-overview__content .project-overview-card:nth-of-type(3) .project-overview-card__actions',
  header: {},
  body: {
    root: '.project-overview-actions',
    row: {
      root: '.project-overview-actions__item',
      fields: {
        name: '.link'
      }
    }
  }
}

const DataCollectionLinksTable = {
  root:
    '.project-overview .project-overview__content .project-overview-card:nth-of-type(1) .project-overview-card__bottom',
  header: {},
  body: {
    root: '.additional-links',
    row: {
      root: '.link',
      fields: {
        name: ''
      }
    }
  }
}

const DevelopmentLinksTable = {
  root:
    '.project-overview .project-overview__content .project-overview-card:nth-of-type(2) .project-overview-card__bottom',
  header: {},
  body: {
    root: '.additional-links',
    row: {
      root: '.link',
      fields: {
        name: ''
      }
    }
  }
}

const DeploymetLinksTable = {
  root:
    '.project-overview .project-overview__content .project-overview-card:nth-of-type(3) .project-overview-card__bottom',
  header: {},
  body: {
    root: '.additional-links',
    row: {
      root: '.link',
      fields: {
        name: ''
      }
    }
  }
}

module.exports = {
  project: {
    Create_New: createNewObject,
    Refresh_Button: By.css('.main-info__toolbar .refresh button[id=refresh]'),
    Dashboard_Realtime_Functions_Table: commonTable(
      projectDashboardRealtimeFunctionsTable
    ),
    Jobs_And_Workflows: commonTable(projectJobsAndWorkflows),
    See_All_Jobs_Link: By.css(
      '.project-data-card:nth-of-type(1) .project-data-card__see-all-link'
    ),
    Mono_Values_Cards: commonTable(generalInfoMonoValueCards),
    Jobs_Info_Card_Statistics: commonTable(generalInfoJobsCardStat),
    Real_Time_Functions_Card_Statistics: commonTable(
      generalInfoRealTimeFunctionsCardStat
    ),
    Add_Source_URL_Label: By.css('.general-info .general-info__source'),
    Owner_Link: By.css('.project__content .general-info .owner-row .link'),
    Members_Link: By.css('.project__content .general-info .members-row .link')
  },
  demoProject: {
    Header_Name_Label: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__header .project-overview__header-title',
        ' ',
        '.status-icon'
      )
    ),
    Header_Created_Time: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__header .project-overview__header-subtitle',
        'div:nth-of-type(1)'
      )
    ),
    Header_Project_Description: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__header .project-overview__header-description',
        ' '
      )
    ),
    Data_Collection_Header: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__content .project-overview-card:nth-of-type(1) .project-overview-card__header',
        'h3'
      )
    ),
    Data_Collection_Description: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__content .project-overview-card:nth-of-type(1) .project-overview-card__header',
        '.project-overview-card__header-subtitle'
      )
    ),
    Data_Collection_Actions_Table: commonTable(DataCollectionActionsTable),
    Data_Collection_Additional_Actions_Table: commonTable(
      DataCollectionAdditionalActionsTable
    ),
    Data_Collection_Links_Table: commonTable(DataCollectionLinksTable),
    Data_Collection_Additional_Actions_Button: By.css(
      '.project-overview .project-overview__content .project-overview-card:nth-of-type(1) .project-overview-card__actions .project-overview-card__actions-toogler'
    ),
    Development_Header: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__content .project-overview-card:nth-of-type(2) .project-overview-card__header',
        'h3'
      )
    ),
    Development_Description: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__content .project-overview-card:nth-of-type(2) .project-overview-card__header',
        '.project-overview-card__header-subtitle'
      )
    ),
    Development_Actions_Table: commonTable(DevelopmentActionsTable),
    Development_Links_Table: commonTable(DevelopmentLinksTable),
    Deployment_Header: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__content .project-overview-card:nth-of-type(3) .project-overview-card__header',
        'h3'
      )
    ),
    Deployment_Description: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__content .project-overview-card:nth-of-type(3) .project-overview-card__header',
        '.project-overview-card__header-subtitle'
      )
    ),
    Deployment_Actions_Table: commonTable(DeploymetActionsTable),
    Deployment_Links_Table: commonTable(DeploymetLinksTable)
  }
}
