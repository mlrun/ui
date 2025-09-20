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
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import {
  generateDropdownGroup,
  generateInputGroup
} from '../../common-tools/common-tools'
import datepicker from '../components/date-picker.component'
import inputGroup from '../components/input-group.component'

const commonDatePickerFilter = dropdownComponent(
  generateDropdownGroup(
    '[data-testid="date-picker-container"]',
    '[data-testid="date-picker-input"]',
    '.date-picker__pop-up .select__item',
    '.data-ellipsis .data-ellipsis',
    false
  )
)
const commonCustomRangeFilter = dropdownComponent(
  generateDropdownGroup(
    '[data-testid="date-picker-container"]',
    '[data-testid="date-picker-input"] input',
    '.date-picker__pop-up .select__item',
    '.data-ellipsis .data-ellipsis',
    false
  )
)

// date picker start
const calendarTable = {
  root: '',
  header: {
    root: '.date-picker__weeks',
    sorters: {
      Sunday: '.date-picker__weeks-day:nth-of-type(1)',
      Monday: '.date-picker__weeks-day:nth-of-type(1)',
      Tuesday: '.date-picker__weeks-day:nth-of-type(1)',
      Wednesday: '.date-picker__weeks-day:nth-of-type(1)',
      Thursday: '.date-picker__weeks-day:nth-of-type(1)',
      Friday: '.date-picker__weeks-day:nth-of-type(1)',
      Saturday: '.date-picker__weeks-day:nth-of-type(1)'
    }
  },
  body: {
    offset: 3,
    row: {
      root: '.date-picker__week',
      fields: {
        Sunday: '.date-picker__week-day-wrapper:nth-of-type(1)',
        Monday: '.date-picker__week-day-wrapper:nth-of-type(2)',
        Tuesday: '.date-picker__week-day-wrapper:nth-of-type(3)',
        Wednesday: '.date-picker__week-day-wrapper:nth-of-type(4)',
        Thursday: '.date-picker__week-day-wrapper:nth-of-type(5)',
        Friday: '.date-picker__week-day-wrapper:nth-of-type(6)',
        Saturday: '.date-picker__week-day-wrapper:nth-of-type(7)'
      }
    }
  }
}

const dateTimePickerCalendars = {
  root: '.date-picker__pop-up',
  apply_button: 'button.date-picker__apply-btn',
  error_message: '.error',
  fromDatePicker: {
    root: '.date-picker__calendars .date-picker__calendar:nth-of-type(1)',
    elements: {
      month_prev_btn:
        '.date-picker__header svg.date-picker__header-previous-month',
      month_next_btn: '.date-picker__header svg.date-picker__header-next-month',
      month_label: '.date-picker__header div .date-picker__header-month',
      year_label: '.date-picker__header div .date-picker__header-year',
      time_input: '.date-picker__time input',
      calendar: {
        componentType: commonTable,
        structure: calendarTable
      }
    }
  },
  toDatePicker: {
    root: '.date-picker__calendars .date-picker__calendar:nth-of-type(2)',
    elements: {
      month_prev_btn:
        '.date-picker__header svg.date-picker__header-previous-month',
      month_next_btn: '.date-picker__header svg.date-picker__header-next-month',
      month_label: '.date-picker__header div .date-picker__header-month',
      year_label: '.date-picker__header div .date-picker__header-year',
      time_input: '.date-picker__time input',
      calendar: {
        componentType: commonTable,
        structure: calendarTable
      }
    }
  }
}
// datepicker end

const operatingFunctionsTable = {
  root: '.monitoring-apps .monitoring-app__section-item .section-table',
  header: {
    root: '.section-table__table-header',
    sorters: {
      name: '.table-cell_big .data-ellipsis',
      status: '.table-cell_small(1) .data-ellipsis',
      started_at: '.table-cell_medium .data-ellipsis',
      lag: '.table-cell_small(2) .data-ellipsis',
      commited_offset: '.table-cell_small(3) .data-ellipsis'
    }
  },
  body: {
    root: '.section-table__table-body',
    row: {
      root: '.section-table__table-row',
      fields: {
        name: '.table-cell_big a .data-ellipsis',
        status: '.table-cell_small:nth-of-type(2) .data-ellipsis',
        started_at: '.table-cell_medium .data-ellipsis'
      }
    }
  }
}

const allApplicationsTable = {
  root: '.monitoring-apps #main-table',
  header: {
    root: '.table-header',
    sorters: {
      name: '[data-testid="name"] span',
      lag: '[data-testid="lag"] span',
      commited_offset: '[data-testid="commitedOffset"] span',
      detections: '[data-testid="detections"] span',
      possible_detections: '[data-testid="possibleDetections"] span',
      class: '[data-testid="class"] span',
      startedAt: '[data-testid="startedAt"] span',
      updated: '[data-testid="updated"] span',
      nuclioFunction: '[data-testid="nuclioFunction"] span'
    }
  },
  body: {
    root: '#main-table-body',
    row: {
      root: '.table-row',
      fields: {
        name: '[data-testid="name"] a .data-ellipsis',
        nuclioFunction: '[data-testid="nuclioFunction"] .link .item-name',
        nuclioFunctionStatus: '[data-testid="nuclioFunction"] .link .status',
        open_metrics: '[data-testid="quick-link-open-metrics"]'
      }
    }
  }
}

const artifactsTable = {
  root: '.monitoring-app__section:nth-of-type(1) .section-table',
  header: {
    root: '.section-table__table-header',
    sorters: {
      name: '.section-table__table-cell:nth-of-type(1) .data-ellipsis'
    }
  },
  body: {
    root: '.section-table__table-body',
    row: {
      root: '.section-table__table-row',
      fields: {
        name: '.section-table__table-cell:nth-of-type(1) .data-ellipsis',
        labels: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.table-cell_medium',
            '',
            '',
            false,
            false
          )
        }
      }
    }
  }
}

const resultsTable = {
  root: '.monitoring-app__section.section_small:nth-of-type(2) .monitoring-app__section-item:nth-of-type(1) .section-table',
  header: {
    root: '.section-table__table-header',
    sorters: {
      name: '.section-table__table-cell:nth-of-type(1) .data-ellipsis'
    }
  },
  body: {
    root: '.section-table__table-body',
    row: {
      root: '.section-table__table-row',
      fields: {
        name: '.section-table__table-cell:nth-of-type(1) .data-ellipsis'
      }
    }
  }
}

const metricsTable = {
  root: '.monitoring-app__section.section_small:nth-of-type(2) .monitoring-app__section-item:nth-of-type(2) .section-table',
  header: {
    root: '.section-table__table-header',
    sorters: {
      name: '.section-table__table-cell:nth-of-type(1) .data-ellipsis'
    }
  },
  body: {
    root: '.section-table__table-body',
    row: {
      root: '.section-table__table-row',
      fields: {
        name: '.section-table__table-cell:nth-of-type(1) .data-ellipsis'
      }
    }
  }
}

const shardsPartitionsStatusTable = {
  root: '.monitoring-app__section.section_small:nth-of-type(3) .monitoring-app__section-item:nth-of-type(1) .section-table',
  header: {
    root: '.section-table__table-header',
    sorters: {
      name: '.section-table__table-cell:nth-of-type(1) .data-ellipsis'
    }
  },
  body: {
    root: '.section-table__table-body',
    row: {
      root: '.section-table__table-row',
      fields: {
        name: '.section-table__table-cell:nth-of-type(1) .data-ellipsis'
      }
    }
  }
}

const endpointsListTable = {
  root: '.list-view .list-view__section:nth-of-type(1) .list-view__section-list__items-wrapper',
  header: {},
  body: {
    root: '#LIST_ID',
    row: {
      root: 'li',
      fields: {
        name: '.data-ellipsis'
      }
    }
  }
}

const searchByEndpointFilterInput = inputGroup(
  generateInputGroup(
    '.application-metrics-container .list-view .list-view__section:nth-of-type(1) .list-view__section-list__search__name-filter',
    true,
    false
  )
)

export default {
  monitoringApp: {
    Refresh_Button: By.css('[data-testid="refresh"] [data-testid="refresh-tooltip-wrapper"]'),
    Date_Picker_Filter_Dropdown: commonDatePickerFilter,
    Custom_Range_Filter_Dropdown: commonCustomRangeFilter,
    Date_Time_Picker: datepicker(dateTimePickerCalendars),
    Applications_Stats_Title: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(1) .stats-card__row:nth-of-type(1) .stats-card__title .data-ellipsis.tooltip-wrapper'),
    Applications_Stats_Counter: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(1) .stats-card__row:nth-of-type(2) .stats__counter'),
    Apps_Status_Title: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(2) .stats-card__row:nth-of-type(1) .stats-card__title .data-ellipsis.tooltip-wrapper'),
    Apps_Status_Running_SubTitle: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(2) .stats-card__row:nth-of-type(2) [data-testid="running_status"] .stats__subtitle'),
    Apps_Status_Failed_SubTitle: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(2) .stats-card__row:nth-of-type(2) [data-testid="failed_status"] .stats__subtitle'),
    Apps_Status_Running_Counter: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(2) .stats-card__row:nth-of-type(2) [data-testid="monitoring-app-running"] .stats__counter'),
    Apps_Status_Failed_Counter: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(2) .stats-card__row:nth-of-type(2) [data-testid="monitoring-app-failed"] .stats__counter'),
    Apps_Status_Running_Tip: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(2) .stats-card__row:nth-of-type(2) [data-testid="running_status"] i'),
    Apps_Status_Failed_Tip: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(2) .stats-card__row:nth-of-type(2) [data-testid="failed_status"] i'),
    Endpoints_Stats_Title: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(3) .stats-card__row:nth-of-type(1) .stats-card__title .data-ellipsis.tooltip-wrapper'),
    Endpoints_Batch_SubTitle: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(3) .stats-card__row:nth-of-type(2) [data-testid="batch_status"] .stats__subtitle'),
    Endpoints_RealTime_SubTitle: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(3) .stats-card__row:nth-of-type(2) [data-testid="realTime_status"] .stats__subtitle'),
    Endpoints_Batch_Counter: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(3) .stats-card__row:nth-of-type(2) [data-testid="monitoring-app-batch"] .stats__counter'),
    Endpoints_RealTime_Counter: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(3) .stats-card__row:nth-of-type(2) [data-testid="monitoring-app-realTime"] .stats__counter'),
    RunningFrequency_Stats_Title: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(4) .stats-card__row:nth-of-type(1) .stats-card__title .data-ellipsis.tooltip-wrapper'),
    RunningFrequency_Value_Title: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(4) .stats-card__row:nth-of-type(2) [data-testid="monitoring-app-interval"] .stats__counter'),
    Model_Endpoint_Detections_Title: By.css('.monitoring-apps .monitoring-app__section:nth-of-type(1) .monitoring-app__section-item:nth-of-type(1) .section-item_title span'),
    Model_Endpoint_Detections_Tip: By.css('.monitoring-apps .monitoring-app__section:nth-of-type(1) .monitoring-app__section-item:nth-of-type(1) .section-item_title [data-testid="tip"]'),
    Model_Endpoint_Detections_Chart: By.css('.monitoring-apps .monitoring-app__section:nth-of-type(1) .monitoring-app__section-item:nth-of-type(1) .section-item_chart-wrapper .chart-container'),
    Operating_Functions_Title: By.css('.monitoring-apps .monitoring-app__section:nth-of-type(1) .monitoring-app__section-item:nth-of-type(2) .section-item_title span'),
    Operating_Functions_Tip: By.css('.monitoring-apps .monitoring-app__section:nth-of-type(1) .monitoring-app__section-item:nth-of-type(2) .section-item_title [data-testid="tip"]'),
    Operating_Functions_Table: commonTable(operatingFunctionsTable),
    Operating_Functions_Lag_Tip: By.css('.monitoring-apps .monitoring-app__section-item .section-table .table-cell_small:nth-of-type(4) [data-testid="tip"] svg'),
    Operating_Functions_Commited_Offset_Tip: By.css('.monitoring-apps .monitoring-app__section-item .section-table .table-cell_small:nth-of-type(5) [data-testid="tip"] svg'),
    All_Applications_Title: By.css('.monitoring-apps .monitoring-app__section:nth-of-type(2) .section-item_title span'),
    All_Applications_Table: commonTable(allApplicationsTable),
    All_Applications_Lag_Tip: By.css('.monitoring-apps #main-table [data-testid="lag"] [data-testid="tip"] svg'),
    All_Applications_Commited_Offset_Tip: By.css('.monitoring-apps #main-table [data-testid="commitedOffset"] [data-testid="tip"] svg'),
  },
  applicationMonitoring: {
    Back_Button: By.css('.content__action-bar-wrapper .table-top .link-back__icon button'),
    Application_Name: By.css('.content__action-bar-wrapper .table-top .link-back__title .data-ellipsis'),
    Date_Picker_Filter_Dropdown: commonDatePickerFilter,
    Custom_Range_Filter_Dropdown: commonCustomRangeFilter,
    Date_Time_Picker: datepicker(dateTimePickerCalendars),
    Application_Metrics_Button: By.css('.action-bar [data-testid="btn"] span'),
    Refresh_Button: By.css('.action-bar [data-testid="refresh"] button'),
    App_Status_Title: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(1) .stats-card__title .data-ellipsis.tooltip-wrapper'),
    App_Status_SubTitle: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(1) [data-testid="monitoring-app-appStatus"] .stats__counter'),
    Endpoints_Title: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(2) .stats-card__title .data-ellipsis.tooltip-wrapper'),
    Endpoints_Tip: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(2) [data-testid="tip"] svg'),
    Endpoints_Counter: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(2) [data-testid="monitoring-app-endpoints"] .stats__counter'),
    Detections_Title: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(3) .stats-card__title .data-ellipsis.tooltip-wrapper'),
    Detections_Counter: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(3) [data-testid="monitoring-app-detections"] .stats__counter'),
    Possible_Detections_Title: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(4) .stats-card__title .data-ellipsis.tooltip-wrapper'),
    Possible_Detections_Counter: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(4) [data-testid="monitoring-app-possibleDetections"] .stats__counter'),
    Lag_Title: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(5) .stats-card__title .data-ellipsis.tooltip-wrapper'),
    Lag_Tip: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(5) [data-testid="tip"] svg'),
    Lag_Counter: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(5) [data-testid="monitoring-app-lag"] .stats__counter'),
    Commited_Offset_Title: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(6) .stats-card__title .data-ellipsis.tooltip-wrapper'),
    Commited_Offset_Tip: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(6) [data-testid="tip"] svg'),
    Commited_Offset_Counter: By.css('.monitoring-application__statistics-section .stats-card:nth-of-type(6) [data-testid="monitoring-app-commitedOffset"]  .stats__counter'),
    Artifacts_Title: By.css('.monitoring-app__section .section-item_title span'),
    Artifacts_Table: commonTable(artifactsTable),
    See_All_Link: By.css('.monitoring-app__section-item .monitoring-app__see-all-link'),
    Results_Title: By.css('.monitoring-app__section.section_small:nth-of-type(2) .monitoring-app__section-item:nth-of-type(1) .section-item_title span'),
    Results_Table: commonTable(resultsTable),
    Metrics_Title: By.css('.monitoring-app__section.section_small:nth-of-type(2) .monitoring-app__section-item:nth-of-type(2) .section-item_title span'),
    Metrics_Tip: By.css('.monitoring-app__section.section_small:nth-of-type(2) .monitoring-app__section-item:nth-of-type(2) [data-testid="tip"] svg'),
    Metrics_Table: commonTable(metricsTable),
    Shards_Partitions_Status_Title: By.css('.monitoring-app__section.section_small:nth-of-type(3) .monitoring-app__section-item:nth-of-type(1) .section-item_title span'),
    Shards_Partitions_Status_Tip: By.css('.monitoring-app__section.section_small:nth-of-type(3) .monitoring-app__section-item:nth-of-type(1) [data-testid="tip"] svg'),
    Shards_Partitions_Status_Table: commonTable(shardsPartitionsStatusTable),
    Partitions_Status_Lag_Tip: By.css('.monitoring-app__section.section_small:nth-of-type(3) .monitoring-app__section-item:nth-of-type(1) .section-table .section-table__table-cell:nth-of-type(2) [data-testid="tip"] svg'),
    Partitions_Status_Commited_Offset_Tip: By.css('.monitoring-app__section.section_small:nth-of-type(3) .monitoring-app__section-item:nth-of-type(1) .section-table .section-table__table-cell:nth-of-type(3) [data-testid="tip"] svg'),
  },
  applicationMetrics: {
    Back_Button: By.css('.content__action-bar-wrapper .history-back-link [data-testid="history-back-link-btn"]'),
    Applications_Metrics_Title: By.css('.content__action-bar-wrapper .history-back-link .history-back-link__title [data-testid="version-history"]'),
    Application_Name: By.css('.content__action-bar-wrapper .history-back-link .history-back-link__title .data-ellipsis'),
    Application_Monitoring_Button: By.css('.action-bar [data-testid="btn"] span'),
    Refresh_Button: By.css('[data-testid="refresh"] [data-testid="refresh-tooltip-wrapper"]'),
    Endpoints_List_Section: By.css('.application-metrics-container .list-view .list-view__section:nth-of-type(1)'),
    Search_By_Endpoint_Filter_Input: searchByEndpointFilterInput,
    Search_Endpoints_Counter: By.css('.application-metrics-container .list-view .list-view__section:nth-of-type(1) .list-view__section-list__search_endpoints-counter'),
    Endpoints_List_Table: commonTable(endpointsListTable),
  }
}
