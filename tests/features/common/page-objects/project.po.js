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
import { By } from 'selenium-webdriver'
import actionMenu from '../components/action-menu.component'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import labelComponent from '../components/label.component'
import {
  generateInputGroup,
  generateLabelGroup,
  generateDropdownGroup,
} from '../../common-tools/common-tools'
import inputGroup from '../components/input-group.component'

const createNewObject = dropdownComponent(
  generateDropdownGroup(
    '.main-info__toolbar .create-new-menu',
    '.select__header',
    false,
    false
  )
)

const actionMenuStructure = {
  root: '.actions-menu__container',
  menuElements: {
    open_button: 'button',
    options: '.actions-menu__body .actions-menu__option'
  }
}

const projectDashboardRealtimeFunctionsTable = {
  root: '.main-info__statistics-section .d-flex:nth-of-type(2) .project-data-card',
  header: {
    root: '.project-data-card__table-header',
    sorters: {
      name: '.table-header__item:nth-of-type(1) .data-ellipsis',
      status: '.table-header__item:nth-of-type(2) .data-ellipsis'
    }
  },
  body: {
    root: '.section-table__table-body',
    row: {
      root: '.section-table__table-row',
      fields: {
        name: '.table-cell_big .data-ellipsis',
        status: '.status-cell .data-ellipsis'
      }
    }
  }
}

const projectJobsAndWorkflows = {
  root: '.main-info__statistics-section:nth-of-type(4) .d-flex:nth-of-type(1) .project-data-card',
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
    root: '.section-table__table-body',
    row: {
      root: '.section-table__table-row',
      fields: {
        name: '.table-cell_big:nth-of-type(1) .data-ellipsis',
        type: '.table-cell_small .data-ellipsis',
        status: '.status-cell .data-ellipsis',
        started_at:
          '.table-cell_big:nth-of-type(4) .data-ellipsis',
        duration: '.table-cell_medium:nth-of-type(5) .data-ellipsis'
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
  root: '.main-info__statistics-section .d-flex:nth-of-type(2) .project-data-card',
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
      root: 
      '.project-overview-actions__item',
      fields: {
        name: 
        '.link'
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

const consumerGroupsTable = {
  root: '.page-content .table',
  header: {
    root: '.table-head',
    sorters: {
      consumer_group_name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      stream: '.table-head__item:nth-of-type(2) .data-ellipsis',
      function: '.table-head__item:nth-of-type(3) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-row',
      fields: {
        consumer_group_name: '.table-body__cell:nth-of-type(1) a.data-ellipsis',
        stream: '.table-body__cell:nth-of-type(2) .data-ellipsis',
        function: '.table-body__cell:nth-of-type(3) a.data-ellipsis'
      }
    }
  }
}

const shardLagsTable = {
  root: '.page-content .table',
  header: {
    root: '.table-head',
    sorters: {
      shard_name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      lag: '.table-head__item:nth-of-type(2) .data-ellipsis',
      last_sequence: '.table-head__item:nth-of-type(3) .data-ellipsis',
      committed_offset: '.table-head__item:nth-of-type(4) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-row',
      fields: {
        shard_name: '.table-body__cell:nth-of-type(1) .data-ellipsis',
        lag: '.table-body__cell:nth-of-type(2) .data-ellipsis',
        last_sequence: '.table-body__cell:nth-of-type(3) .data-ellipsis',
        committed_offset: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

export default {
  project: {
    Create_New: createNewObject,
    Refresh_Button: By.css('.main-info__toolbar [data-testid="refresh"]'),
    Dashboard_Realtime_Functions_Table: commonTable(
      projectDashboardRealtimeFunctionsTable
    ),
    Jobs_And_Workflows: commonTable(projectJobsAndWorkflows),
    Recent_text: By.css('.project-data-card .project-data-card__recent-text'), 
    See_All_Jobs_Link: By.css(
      '.project-data-card:nth-of-type(1) .project-data-card__see-all-link'
    ),
    Mono_Values_Cards: By.css('.main-info__statistics-section:nth-of-type(3)'),
    Model_Stats_Title: By.css('.main-info__statistics-section_left .stats-card:nth-of-type(1) .stats-card__row:nth-of-type(1) .stats-card__title span'),
    Model_Stats_Tip: By.css('.stats-card:nth-of-type(1) .stats-card__row:nth-of-type(1) [data-testid="tip"]'),
    Model_Stats_Counter: By.css('.stats-card:nth-of-type(1) .stats-card__row:nth-of-type(2) [data-testid="monitoring-Models"] .stats__counter'),
    FeatureSets_Stats_Title: By.css('.main-info__statistics-section_left .stats-card:nth-of-type(2) .stats-card__row:nth-of-type(1) .stats-card__title span'),
    FeatureSets_Stats_Tip: By.css('.stats-card:nth-of-type(2) .stats-card__row:nth-of-type(1) [data-testid="tip"]'),
    FeatureSets_Stats_Counter: By.css('.stats-card:nth-of-type(2) .stats-card__row:nth-of-type(2) [data-testid="monitoring-Feature sets"] .stats__counter'),
    Artifacts_Stats_Title: By.css('.main-info__statistics-section_left .stats-card:nth-of-type(3) .stats-card__row:nth-of-type(1) .stats-card__title span'),
    Artifacts_Stats_Tip: By.css('.stats-card:nth-of-type(3) .stats-card__row:nth-of-type(1) [data-testid="tip"]'),
    Artifacts_Stats_Counter: By.css('.stats-card:nth-of-type(3) .stats-card__row:nth-of-type(2) [data-testid="monitoring-Artifacts"] .stats__counter'),
    ConsumerGroups_Stats_Title: By.css('.main-info__statistics-section:nth-of-type(4) .d-flex:nth-of-type(2) .project-data-card__header .project-data-card__statistics-item:nth-of-type(4) .project-data-card__statistics-label'),
    ConsumerGroups_Stats_Counter: By.css('.main-info__statistics-section:nth-of-type(4) .d-flex:nth-of-type(2) .project-data-card__header .project-data-card__statistics-item:nth-of-type(4) .project-data-card__statistics-value'),
    Alerts_Stats_Title: By.css('.main-info__statistics-section_right .stats-card__title span'),
    Alerts_Stats_Total_Title: By.css('.main-info__statistics-section_right [data-testid="alerts_total_counter"] span'),
    Alerts_Stats_Total_Number: By.css('.main-info__statistics-section_right [data-testid="alerts_total_counter"] .stats__counter'),
    Alerts_Stats_Endpoint_Number: By.css('.main-info__statistics-section_right [data-testid="alerts_endpoint_counter"] .stats__counter'),
    Alerts_Stats_Endpoint_Title: By.css('.main-info__statistics-section_right [data-testid="alerts_endpoint_counter"] .stats__subtitle'),
    Alerts_Stats_Jobs_Number: By.css('.main-info__statistics-section_right [data-testid="alerts_jobs_counter"] .stats__counter'),
    Alerts_Stats_Jobs_Title: By.css('.main-info__statistics-section_right [data-testid="alerts_jobs_counter"] .stats__subtitle'),
    Alerts_Stats_Application_Number: By.css('.main-info__statistics-section_right [data-testid="alerts_application_counter stats__counter-large"] .stats__counter'),
    Alerts_Stats_Application_Title: By.css('.main-info__statistics-section_right [data-testid="alerts_application_counter stats__counter-large"] .stats__subtitle'),
    Jobs_Info_Card_Statistics: commonTable(generalInfoJobsCardStat),
    Real_Time_Functions_Card_Statistics: commonTable(
      generalInfoRealTimeFunctionsCardStat
    ),
    Add_Source_URL_Label: By.css('.general-info .general-info__source')
  },
  demoProject: {
    Header_Name_Label: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__header .project-details__title',
        ' ',
        ' '
      )
    ),
    Header_Created_Time: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__header .project-details__title',
        'div:nth-of-type(1)'
      )
    ),
    Header_Project_Description: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__header .project-details__description',
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
      '.project-overview .project-overview__content .project-overview-card:nth-of-type(1) .project-overview-card__actions'
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
  },
  consumerGroups: {
    Arrow_Back: By.css('button > .page-header__back-btn'),
    Title: By.css('.page-header__title-wrapper .page-header__title'),
    Description: By.css(
      '.page-header__title-wrapper .page-header__description'
    ),
    Search_Input: inputGroup(
      generateInputGroup('.page-actions .search-container')
    ),
    Consumer_Groups_Table: commonTable(consumerGroupsTable),
    Shard_Lags_Table: commonTable(shardLagsTable),
    Refresh_Button: By.css('.page-actions .round-icon-cp')
  }
}