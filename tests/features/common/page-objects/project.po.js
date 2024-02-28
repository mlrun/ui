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
  generateCheckboxGroup
} from '../../common-tools/common-tools'
import inputGroup from '../components/input-group.component'
import checkboxComponent from '../components/checkbox.component'

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
  root: '.main-info__statistics-section:nth-of-type(4) .project-data-card:nth-of-type(1)',
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
  root: '.main-info__statistics-section:nth-of-type(3)',
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

const advancedEnvironmentVariablesTable = {
  root: '.wizard-form__content .form-table',
  header: {},
  body: {
    add_row_btn: '.form-table__action-row button',
    row: {
      root: '.form-table__row',
      fields: {
        edit_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(1)',
        apply_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(1)',
        delete_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(2)',
        discard_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(2)',
        checkbox: '.form-field-checkbox input',
        name_input: '.form-field-input input',
        name_verify: '.form-table__cell_2',
        type_dropdown: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.form-table__cell_1 .form-field-select', 
            '.form-field__icons', 
            '.pop-up-dialog .options-list__body .select__item', 
            false, 
            false)  
        },
        type_dropdown_verify: '.form-table__cell_1 .data-ellipsis', 
        value_input: '.form-table__cell_3 .form-field__control input',
        value_verify: '.form-table__cell_3 .data-ellipsis',
        value_input_key: '.form-table__cell_3 .form-field-input:nth-of-type(2) .form-field__control input' 
      }
    }
  }
}

const commonAccessKeyCheckbox = checkboxComponent(
  generateCheckboxGroup('.job-wizard__advanced .access-key-checkbox input', false, false, false)
)

const commonAccessKeyInput = inputGroup(
  generateInputGroup(
    '.align-stretch .form-field-input',
    true,
    false,
    '.tooltip-wrapper svg'
  )
)

module.exports = {
  project: {
    Create_New: createNewObject,
    Refresh_Button: By.css('.main-info__toolbar [data-testid="refresh"]'),
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
    Add_Source_URL_Label: By.css('.general-info .general-info__source')
  },
  demoProject: {
    Header_Name_Label: labelComponent(
      generateLabelGroup(
        '.project-overview .project-overview__header .project-details__title',
        ' ',
        ' '//'.status-icon'
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