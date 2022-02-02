import { By } from 'selenium-webdriver'
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
  root: '.content_with-menu .content-menu',
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
  root: '.table .table__content',
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
      root: '.table-body__row',
      fields: {
        expand_btn: '.table-body__cell:nth-of-type(1) svg',
        status: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table-body__cell:nth-of-type(1) .status',
            'i',
            true,
            '.tooltip .tooltip__text span'
          )
        },
        name: '.table-body__cell:nth-of-type(1) a .link .data-ellipsis',
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
            '.chip-block .chip-block-hidden_visible .data-ellipsis.tooltip-wrapper',
            false,
            true // options_in_root ?
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
  root: '.table .table__content',
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
      root: '.table-body__row',
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
        name: '.table-body__cell:nth-of-type(1) a .link',
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
              top_hendler: '.data-ellipsis .react-flow__handle-top',
              bottom_hendler: '.data-ellipsis .react-flow__handle-bottom'
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
  root: '.table .table__content',
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
      root: '.table-body__row',
      fields: {
        name: '.table-body__cell:nth-of-type(1) a .link .link',
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
            '.chip-block .chip-block-hidden_visible .data-ellipsis.tooltip-wrapper',
            false,
            true // options_in_root ?
          )
        },
        lastRun: '.table-head__item:nth-of-type(6) .data-ellipsis',
        createdTime: '.table-head__item:nth-of-type(7) .data-ellipsis',
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
  root: '.date-picker-container',
  apply_button: 'button.date-picker__apply-btn',
  error_message: '.error-message',
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
  '.content__action-bar .data-ellipsis:nth-of-type(1) button[id=refresh]'
)

module.exports = {
  JobsMonitorTab: {
    Jobs_Tab_Selector: jobsTabSelector,
    New_Job_Button: pageHeaderButton,
    Resource_Monitoring_Button: By.css(
      '.content__action-bar > .data-ellipsis:nth-of-type(2) button'
    ),
    Table_Refresh_Button: tableRefreshButton,
    Table_Expand_Rows_Button: By.css(
      '.content__action-bar .actions .round-icon-cp:nth-of-type(2) button'
    ),
    Status_Filter_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.content__action-bar .filters .select:nth-of-type(2)',
        '.select__header', // Open Component
        '.select__body .select__item', // Options
        '.data-ellipsis .data-ellipsis' // Option value
      )
    ),
    Group_By_Name_Filter_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.content__action-bar .filters .select:nth-of-type(3)',
        '.select__header', // Open Component
        '.select__body .select__item', // Options
        '.data-ellipsis .data-ellipsis' // Option value
      )
    ),
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '.content__action-bar .filters > .input-wrapper:nth-of-type(4)',
        true,
        false
      )
    ),
    Table_Labels_Filter_Input: inputGroup(
      generateInputGroup(
        '.content__action-bar .filters > .input-wrapper:nth-of-type(5)',
        true,
        false
      )
    ),
    Start_Time_Filter_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.content__action-bar .filters .date-picker-container',
        'input.date-picker__input',
        '.date-picker__pop-up .select__item',
        '.data-ellipsis .data-ellipsis',
        true // options_in_root ?
      )
    ),
    Date_Time_Picker: datepicker(dateTimePickerCalendars),
    Jobs_Monitor_Table: commonTable(jobsMonitorTable)
  },
  WorkflowsMonitorTab: {
    Workflows_Monitor_Table: commonTable(workflowsMonitorTable),
    Toggle_View_Button: By.css('.workflow-header .actions .toggle-view-btn'),
    Workflow_List_View_Table: commonTable(jobsMonitorTable),
    Workflow_Graph: graph(monitorWorkflowGraph)
  },
  ScheduleMonitorTab: {
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '.content__action-bar .filters > .input-wrapper:nth-of-type(1)',
        true,
        false
      )
    ),
    Table_Labels_Filter_Input: inputGroup(
      generateInputGroup(
        '.content__action-bar .filters > .input-wrapper:nth-of-type(2)',
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
      root: '.create-container .create-container__data  .search-container',
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
