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
import checkboxComponent from '../components/checkbox.component'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import actionMenu from '../components/action-menu.component'
import datepicker from '../components/date-picker.component'
import inputGroup from '../components/input-group.component'
import inputWithAutocomplete from '../components/input-with-autocomplete.component'
import labelComponent from '../components/label.component'
import graph from '../components/graph.component'
import {
  generateInputGroup,
  generateDropdownGroup,
  generateLabelGroup
} from '../../common-tools/common-tools'

// Monitor tab
const tabSelector = {
  root: '.content .content-menu',
  header: {},
  body: {
    root: '.content-menu__list',
    row: {
      root: '.content-menu__item',
      fields: {
        key: 'a'
      }
    }
  }
}

const resultsTable = {
  root: '.table-body__cell:nth-of-type(7)',
  header: {},
  body: {
    root: '.chips-wrapper',
    row: {
      root: '.chip-block',
      field: {
        label: '.chip__content'
      }
    }
  }
}

const actionMenuStructure = {
  root: '.actions-menu__container',
  menuElements: {
    open_button: 'button',
    options: '.actions-menu__body .actions-menu__option'
  }
}

const jobsMonitorTable = {
  root: '.table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      type: '.table-head__item:nth-of-type(2) .data-ellipsis',
      duration: '.table-head__item:nth-of-type(3) .data-ellipsis',
      owner: '.table-head__item:nth-of-type(4) .data-ellipsis',
      labels: '.table-head__item:nth-of-type(5) .data-ellipsis',
      parameters: '.table-head__item:nth-of-type(6) .data-ellipsis',
      results: '.table-head__item:nth-of-type(7) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-row',
      fields: {
        name: '.table-body__cell:nth-of-type(1) a .link',
        status: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table-body__cell:nth-of-type(1) .status',
            'i',
            false,
            '.tooltip .tooltip__text span'
          )
        },
        datetime:
          '.table-body__cell:nth-of-type(1) a .date-uid-row .link-subtext:nth-of-type(1)',
        uid:
          '.table-body__cell:nth-of-type(1) a .date-uid-row .link-subtext:nth-of-type(2)',
        type: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table-body__cell:nth-of-type(2)',
            '.data-ellipsis ',
            true,
            '.tooltip .tooltip__text span'
          )
        },
        duration: '.table-body__cell:nth-of-type(3) .data-ellipsis',
        owner: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        labels: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.table-body__cell:nth-of-type(5)',
            '.chip-block span.chips_button',
            '.chip-block-hidden_visible .data-ellipsis.tooltip-wrapper',
            false,
            false
          )
        },
        parameters: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.table-body__cell:nth-of-type(6)',
            '.chip-block span.chips_button',
            '.chip-block .chip-block-hidden_visible .data-ellipsis.tooltip-wrapper',
            false,
            true // options_in_root ?
          )
        },
        results: {
          componentType: commonTable,
          structure: resultsTable
        },
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const workflowsMonitorTable = {
  root: '.table__flex .table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      created: '.table-head__item:nth-of-type(2) .data-ellipsis',
      finished: '.table-head__item:nth-of-type(3) .data-ellipsis',
      duration: '.table-head__item:nth-of-type(4) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-row',
      fields: {
        status: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table-body__cell:nth-of-type(1) .status',
            'i',
            true,
            '.tooltip .tooltip__text span'
          )
        },
        name: '.table-body__cell:nth-of-type(1) .item-name',
        created: '.table-body__cell:nth-of-type(2) .data-ellipsis',
        finished: '.table-body__cell:nth-of-type(3) .data-ellipsis',
        duration: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const monitorWorkflowGraph = {
  root: '.react-flow',
  elements: {
    workflowGraphNodesTable: {
      componentType: commonTable,
      structure: {
        root: '',
        header: {},
        body: {
          root: '.react-flow__nodes',
          row: {
            root: '.selectable',
            fields: {
              name: '.react-flow__node-label .data-ellipsis .data-ellipsis',
              top_handler: '.data-ellipsis .react-flow__handle-top',
              bottom_handler: '.data-ellipsis .react-flow__handle-bottom'
            }
          }
        }
      }
    },
    workflowGraphConnectionsTable: {
      componentType: commonTable,
      structure: {
        root: '',
        header: {},
        body: {
          root: '.react-flow__edges g[transform]',
          row: {
            root: '.react-flow__edge',
            fields: {
              path: '.react-flow__edge-path'
            }
          }
        }
      }
    },
    svg: '.react-flow__edges',
    zoomPane: '.react-flow__nodes'
  }
}

const scheduleMonitorTable = {
  root: '.table__flex .table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      type: '.table-head__item:nth-of-type(2) .data-ellipsis',
      nextRun: '.table-head__item:nth-of-type(3) .data-ellipsis',
      schedule: '.table-head__item:nth-of-type(4) .data-ellipsis',
      labels: '.table-head__item:nth-of-type(5) .data-ellipsis',
      lastRun: '.table-head__item:nth-of-type(6) .data-ellipsis',
      createdTime: '.table-head__item:nth-of-type(7) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-row',
      fields: {
        name: '.table-body__cell:nth-of-type(1) a',
        type: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table-body__cell:nth-of-type(2)',
            '.data-ellipsis',
            true,
            '.tooltip .tooltip__text span'
          )
        },
        nextRun: '.table-body__cell:nth-of-type(3) .data-ellipsis',
        schedule: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        labels: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.table-body__cell:nth-of-type(5)',
            '.chip-block span.chips_button',
            '.chip-block-hidden_visible .data-ellipsis.tooltip-wrapper',
            false,
            false          
          )
        },
        lastRun: '.table-body__cell:nth-of-type(6) .data-ellipsis',
        createdTime: '.table-body__cell:nth-of-type(7) .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

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

// Create job
const selectFunctionFromDropdown = {
  root:
    '.create-container .create-container__data  .accordion__container.functions-wrapper .data-header__select',
  dropdownElements: {
    open_button: '.select__header .select__value',
    options: '.select__body .select__item',
    option_name: '.data-ellipsis .data-ellipsis'
  }
}

const selectedFunctionsTemplates = {
  root:
    '.create-container .create-container__data  .accordion__container.functions-wrapper .create-container__data-list',
  header: {},
  body: {
    row: {
      root: '.card-template',
      fields: {
        name: '.card-template__header'
      }
    }
  }
}

const predefinedFunctionsTemplates = {
  root: '.create-container__data-list',
  header: {},
  body: {
    row: {
      root: '.card-template',
      fields: {
        name: '.card-template__header',
        description: '.card-template__description'
      }
    }
  }
}

const functionsTemplates = {
  root:
    '.create-container .create-container__data > .accordion__container:nth-of-type(3) .accordion__body .data-wrapper .templates-container',
  header: {},
  body: {
    row: {
      root: '.accordion__container',
      fields: {
        expand_btn: 'button',
        name: '.accordion__body > h6',
        templates_list: {
          componentType: commonTable,
          structure: predefinedFunctionsTemplates
        }
      }
    }
  }
}

// Common components
const pageHeaderButton = By.css(
  '.content__header .page-actions-container button'
)
const jobsTabSelector = commonTable(tabSelector)
const tableRefreshButton = By.css(
  '.content .content__action-bar-wrapper [data-testid="refresh"]'
)
const commonStatusFilter = dropdownComponent(
  generateDropdownGroup(
    '.content__action-bar-wrapper .filters [data-testid="select"]',
    '.select__header', // Open Component
    '.select__body .select__item', // Options
    '.data-ellipsis .data-ellipsis' // Option value
  )
)
const commonStartTimeFilter = dropdownComponent(
  generateDropdownGroup(
    '.content__action-bar-wrapper .filters .date-picker-container',
    'input.date-picker__input',
    '.date-picker__pop-up .select__item',
    '.data-ellipsis .data-ellipsis',
    false // options_in_root ?
  )
)

module.exports = {
  JobsMonitorTab: {
    Jobs_Tab_Selector: jobsTabSelector,
    Batch_Run_Button: pageHeaderButton,
    Arrow_Back: By.css('.link-back__icon'),
    Resource_Monitoring_Button: By.css(
      '.content__action-bar-wrapper .action-bar button'
    ),
    Auto_Refresh_Checkbox: checkboxComponent({
      root: '.content__action-bar-wrapper .checkbox',
      elements: {
        checkbox: 'svg', 
        name: '',
        icon: ''
      }
    }),
    Table_Refresh_Button: tableRefreshButton,
    Status_Filter_Dropdown: commonStatusFilter,
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '.content__action-bar-wrapper .filter-column:nth-of-type(2) .input-wrapper',
        true,
        false
      )
    ),
    Table_Labels_Filter_Input: inputGroup(
      generateInputGroup(
        '.content__action-bar-wrapper .filter-column:nth-of-type(3) .input-wrapper',
        true,
        false
      )
    ),
    Start_Time_Filter_Dropdown: commonStartTimeFilter,
    Date_Time_Picker: datepicker(dateTimePickerCalendars),
    Jobs_Monitor_Table: commonTable(jobsMonitorTable)
  },
  WorkflowsMonitorTab: {
    Status_Filter_Dropdown: commonStatusFilter,
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '.content__action-bar-wrapper .filter-column:nth-of-type(2) .input-wrapper',
        true,
        false
      )
    ),
    Start_Time_Filter_Dropdown: commonStartTimeFilter,
    Date_Time_Picker: datepicker(dateTimePickerCalendars),
    Workflows_Monitor_Table: commonTable(workflowsMonitorTable),
    Toggle_View_Button: By.css('.workflow-container .actions .toggle-view-btn'),
    Workflow_List_View_Table: commonTable(jobsMonitorTable),
    Workflow_Graph: graph(monitorWorkflowGraph),
    Table_Refresh_Button: tableRefreshButton
  },
  ScheduleMonitorTab: {
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '.content__action-bar-wrapper .filter-column:nth-of-type(1) .input-wrapper',
        true,
        false
      )
    ),
    Table_Labels_Filter_Input: inputGroup(
      generateInputGroup(
        '.content__action-bar-wrapper .filter-column:nth-of-type(2) .input-wrapper',
        true,
        false
      )
    ),
    Table_Refresh_Button: tableRefreshButton,
    Schedule_Monitor_Table: commonTable(scheduleMonitorTable)
  },
  CreateJob: {
    Back_Arrow_Button: By.css(
      '.create-container .create-container__header .header-link a.header-link__icon'
    ),
    Create_Job_Header: By.css(
      '.create-container .create-container__header .header-link h3.header-link__title'
    ),
    Search_Input: inputWithAutocomplete({
      root: '.create-container .create-container__data .search-container',
      elements: {
        input: 'input',
        options: '.search-matches .search-matches__item',
        option_name: ''
      }
    }),
    Select_Functions_From_Accordion: {
      Accordion_Header: By.css(
        '.create-container .create-container__data .accordion__container.functions-wrapper h5.data-header__title span'
      ),
      Collapse_Button: By.css(
        '.create-container .create-container__data .accordion__container.functions-wrapper .accordion__icon'
      ),
      Select_Function_From_Dropdown: dropdownComponent(
        selectFunctionFromDropdown
      ),
      Selected_Functions_Templates: commonTable(selectedFunctionsTemplates)
    },
    Function_Templates_Accordion: {
      Accordion_Header: By.css(
        '.create-container .create-container__data > .accordion__container:nth-of-type(3) h5.data-header__title'
      ),
      Collapse_Button: By.css(
        '.create-container .create-container__data > .accordion__container:nth-of-type(3) > .accordion__icon'
      ),
      Functions_Templates_Table: commonTable(functionsTemplates)
    }
  }
}
