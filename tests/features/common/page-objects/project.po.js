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

const quickActionsObject = dropdownComponent(
  generateDropdownGroup(
    '.main-info__toolbar .create-new-menu',
    '.select__header',
    '[data-testid="select-body"] [data-testid="select-option"] .tooltip-wrapper',
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

const realtimeFunctionsNuclioTable = {
  root: '.d-flex:nth-of-type(2) .project-data-card',
  header: {
    root: '.project-data-card__header',
    sorters: {
      title: '.project-data-card__header-text a',
      running_counter_number: '.project-data-card__statistics-item:nth-of-type(1) .project-data-card__statistics-value .tooltip-wrapper',
      running_counter_subtitle: '.project-data-card__statistics-item:nth-of-type(1) .project-data-card__statistics-label span',
      running_counter_icon: '.project-data-card__statistics-item:nth-of-type(1) .project-data-card__statistics-label i',
      failed_counter_number: '.project-data-card__statistics-item:nth-of-type(2) .project-data-card__statistics-value .tooltip-wrapper',
      failed_counter_subtitle: '.project-data-card__statistics-item:nth-of-type(2) .project-data-card__statistics-label span',
      failed_counter_icon: '.project-data-card__statistics-item:nth-of-type(2) .project-data-card__statistics-label i',
      api_gateways_counter_number: '.project-data-card__statistics-item:nth-of-type(3) .project-data-card__statistics-value .tooltip-wrapper',
      api_gateways_counter_subtitle: '.project-data-card__statistics-item:nth-of-type(3) .project-data-card__statistics-label span',
      consumer_groups_counter_number: '.project-data-card__statistics-item:nth-of-type(4) .project-data-card__statistics-value .tooltip-wrapper',
      consumer_groups_counter_subtitle: '.project-data-card__statistics-item:nth-of-type(4) .project-data-card__statistics-label span',
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
      
const runsTable = {
  root: '.d-flex:nth-of-type(1) .project-data-card',
  header: {
    root: '.project-data-card__header',
    sorters: {
      title: '.project-data-card__header-text span a',
      time_period: '.project-data-card__header-info span',
      in_process_counter_number: '.project-data-card__statistics-item:nth-of-type(1) .project-data-card__statistics-value',
      in_process_counter_subtitle: '.project-data-card__statistics-item:nth-of-type(1) .project-data-card__statistics-label span',
      in_process_counter_icon: '.project-data-card__statistics-item:nth-of-type(1) .project-data-card__statistics-label i',
      failed_counter_number: '.project-data-card__statistics-item:nth-of-type(2) .project-data-card__statistics-value',
      failed_counter_subtitle: '.project-data-card__statistics-item:nth-of-type(2) .project-data-card__statistics-label span',
      failed_counter_icon: '.project-data-card__statistics-item:nth-of-type(2) .project-data-card__statistics-label i',
      succeeded_counter_number: '.project-data-card__statistics-item:nth-of-type(3) .project-data-card__statistics-value',
      succeeded_counter_subtitle: '.project-data-card__statistics-item:nth-of-type(3) .project-data-card__statistics-label span',
      succeeded_counter_icon: '.project-data-card__statistics-item:nth-of-type(3) .project-data-card__statistics-label i',
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
    Project_Name: By.css('.main-info .project-details__header'),
    Created_Details: By.css('.project-details__details-label:nth-of-type(1)'),
    Owner_Details: By.css('.project-details__details-label:nth-of-type(2)'),
    Info_Baner: By.css('.main-info__toolbar .main-info__toolbar-banner'),
    Quick_Actions: quickActionsObject,
    Refresh_Button: By.css('[data-testid="refresh"]'),
    Mono_Values_Cards: By.css('.projects-monitoring-container .projects-monitoring-stats'),
    Artifacts_Stats_Container: {
      Artifacts_Stats_Title: By.css('.projects-monitoring-stats > div:nth-child(1) .stats-card__title .tooltip-wrapper'),
      Artifacts_Stats_Counter: By.css('.projects-monitoring-stats > div:nth-child(1) [data-testid="data_total_counter"] .stats__counter'),
      Datasets_Counter_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(1) .stats-card__row:nth-of-type(1) h6'),
      Datasets_Counter_Number: By.css('.projects-monitoring-stats > div:nth-child(1) .stats-card__row:nth-of-type(1) .stats__counter'),
      Documents_Counter_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(1) .stats-card__row:nth-of-type(2) h6'),
      Documents_Counter_Number: By.css('.projects-monitoring-stats > div:nth-child(1) .stats__details .stats-card__row:nth-of-type(2) .stats__counter'),
      LLM_Prompts_Counter_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(1) .stats-card__row:nth-of-type(3) h6'),
      LLM_Prompts_Counter_Number: By.css('.projects-monitoring-stats > div:nth-child(1) .stats-card__row:nth-of-type(3) .stats__counter'),
      Other_Artifacts_Counter_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(1) .stats-card__row:nth-of-type(4) h6'),
      Other_Artifacts_Counter_Number: By.css('.projects-monitoring-stats > div:nth-child(1) .stats-card__row:nth-of-type(4) .stats__counter')
    },
    Workflows_Stats_Container: {
      Workflows_Stats_Title: By.css('.projects-monitoring-stats > div:nth-child(2) .stats-card__title .tooltip-wrapper'),
      Filtering_Time_Period: By.css('.projects-monitoring-stats > div:nth-child(2) .project-card__info span'),
      Workflows_Stats_Counter: By.css('.projects-monitoring-stats > div:nth-child(2) [data-testid="scheduled_total_counter"] .stats__counter'),
      In_Process_Counter_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(2) .stats-card__row:nth-of-type(1) h6'),
      In_Process_Counter_Status_Icon: By.css('.projects-monitoring-stats > div:nth-child(2) .stats-card__row:nth-of-type(1) i.state-running'),
      In_Process_Counter_Number: By.css('.projects-monitoring-stats > div:nth-child(2) .stats__details .stats-card__row:nth-of-type(1) div:nth-child(2)'),
      Failed_Counter_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(2) .stats-card__row:nth-of-type(2) h6'),
      Failed_Counter_Status_Icon: By.css('.projects-monitoring-stats > div:nth-child(2) .stats-card__row:nth-of-type(2) i.state-failed'),
      Failed_Counter_Number: By.css('.projects-monitoring-stats > div:nth-child(2) .stats-card__row:nth-of-type(2) div:nth-child(2)'),
      Succeeded_Counter_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(2) .stats-card__row:nth-of-type(3) h6'),
      Succeeded_Counter_Status_Icon: By.css('.projects-monitoring-stats > div:nth-child(2) .stats-card__row:nth-of-type(3) i.state-completed'),
      Succeeded_Counter_Number: By.css('.projects-monitoring-stats > div:nth-child(2) .stats-card__row:nth-of-type(3) div:nth-child(2)')
    },
    Scheduled_Stats_Container: {
      Scheduled_Stats_Title: By.css('.projects-monitoring-stats > div:nth-child(3) .stats-card__title .tooltip-wrapper'),
      Filtering_Time_Period: By.css('.projects-monitoring-stats > div:nth-child(3) .project-card__info span'),
      Scheduled_Stats_Counter: By.css('.projects-monitoring-stats > div:nth-child(3) [data-testid="scheduled_total_counter"] .stats__counter'),
      Jobs_Counter_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(3) .stats-card__row:nth-of-type(1) h6'),
      Jobs_Counter_Number: By.css('.projects-monitoring-stats > div:nth-child(3) .stats__details .stats-card__row:nth-of-type(1) div:nth-child(2)'),
      Workflows_Counter_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(3) .stats-card__row:nth-of-type(2) h6'),
      Workflows_Counter_Number: By.css('.projects-monitoring-stats > div:nth-child(3) .stats-card__row:nth-of-type(2) div:nth-child(2)')
    },
    Models_Stats_Container: {
      Models_Stats_Title: By.css('.card__small-container > div.stats-card.monitoring-stats .stats-card__title .tooltip-wrapper'),
      Model_Stats_Counter: By.css('.projects-monitoring-stats [data-testid="models_total_counter"] .stats__counter')
    },
    Monitoring_App_Stats_Container: {
      Monitoring_App_Stats_Title: By.css('.projects-monitoring-stats .application-card .stats-card__title .tooltip-wrapper'),
      Monitoring_App_Succeeded_Stats_Counter: By.css('.projects-monitoring-stats .application-card .stats__container:nth-of-type(1) .stats__counter'),
      Monitoring_App_Succeeded_Counter_Subtitle: By.css('.projects-monitoring-stats .application-card .stats__container:nth-of-type(1) .stats__label'),
      Monitoring_App_Succeeded_Counter_Status_Icon: By.css('.projects-monitoring-stats .application-card .stats__container:nth-of-type(1) .stats__label .state-completed'),
      Monitoring_App_Failed_Stats_Counter: By.css('.projects-monitoring-stats .application-card .stats__container:nth-of-type(2) .stats__counter'),
      Monitoring_App_Failed_Counter_Subtitle: By.css('.projects-monitoring-stats .application-card .stats__container:nth-of-type(2) .stats__label'),
      Monitoring_App_Failed_Counter_Status_Icon: By.css('.projects-monitoring-stats .application-card .stats__container:nth-of-type(2) .stats__label .state-failed')
    },
    Alerts_Stats_Container: {
      Alerts_Stats_Title: By.css('.projects-monitoring-stats > div:nth-child(5) .stats-card__title .tooltip-wrapper'),
      Alerts_Stats_Title_Icon: By.css('.projects-monitoring-stats > div:nth-child(5) .stats-card__title-icon'),
      Filtering_Time_Period: By.css('.projects-monitoring-stats > div:nth-child(5) .project-card__info span'),
      Alerts_Stats_Counter: By.css('.projects-monitoring-stats > div:nth-child(5) [data-testid="alerts_total_counter"]'),
      Alerts_Stats_Endpoint_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(5) .stats-card__row:nth-of-type(1) h6'),
      Alerts_Stats_Endpoint_Counter: By.css('.projects-monitoring-stats > div:nth-child(5) .stats__details .stats-card__row:nth-of-type(1) div:nth-child(2)'),
      Alerts_Stats_Jobs_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(5) .stats-card__row:nth-of-type(2) h6'),
      Alerts_Stats_Jobs_Counter: By.css('.projects-monitoring-stats > div:nth-child(5) .stats-card__row:nth-of-type(2) div:nth-child(2)'),
      Alerts_Stats_Application_Subtitle: By.css('.projects-monitoring-stats > div:nth-child(5) .stats-card__row:nth-of-type(3) .stats__subtitle'),
      Alerts_Stats_Application_Counter: By.css('.projects-monitoring-stats > div:nth-child(5) .stats-card__row:nth-of-type(3) div:nth-child(2)')
    },
    Runs_Statistic_Table: commonTable(runsTable),
    Runs_Statistic_Section_Container: {
      Runs_Statistic_Section_Title_Tip: By.css('.d-flex:nth-of-type(1) [data-testid="tip"]'),
      In_Process_Counter_Subtitle: By.css('.d-flex:nth-of-type(1) .project-data-card__statistics-item:nth-of-type(1) .project-data-card__statistics-label span'),
      Failed_Counter_Subtitle: By.css('.d-flex:nth-of-type(1) .project-data-card__statistics-item:nth-of-type(2) .project-data-card__statistics-label span'),
      Succeeded_Counter_Subtitle: By.css('.d-flex:nth-of-type(1) .project-data-card__statistics-item:nth-of-type(3) .project-data-card__statistics-label span'),
      Recent_Text: By.css('.d-flex:nth-of-type(1) .project-data-card .project-data-card__recent-text span'),
      Recent_Text_Sm: By.css('.d-flex:nth-of-type(1) .project-data-card .project-data-card__recent-text .text-sm'),
      All_Jobs_Link: By.css('.d-flex:nth-of-type(1) .project-data-card__see-all-link')
    },
    Realtime_Functions_Nuclio_Table: commonTable(realtimeFunctionsNuclioTable),
    Realtime_Functions_Nuclio_Statistic_Section: {
      ConsumerGroups_Stats_Counter: By.css('.d-flex:nth-of-type(2) .project-data-card__header .project-data-card__statistics-item:nth-of-type(4) .project-data-card__statistics-value'),
      Recent_Text: By.css('.d-flex:nth-of-type(2) .project-data-card__recent-text span'),
      All_Realtime_Functions_Link: By.css('.d-flex:nth-of-type(2) .project-data-card__see-all-link')
    }
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