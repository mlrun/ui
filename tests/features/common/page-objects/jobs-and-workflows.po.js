import { By } from 'selenium-webdriver'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import actionMenu from '../components/action-menu.component'
import datepicker from '../components/date-picker.component'
import inputGroup from '../components/input-group.component'
import inputWithAutocomplete from '../components/input-with-autocomplete.component'
import labelComponent from '../components/label.component'
import {
  generateInputGroup,
  generateDropdownGroup,
  generateLabelGroup
} from '../../common-tools/common-tools'

// Monitor tab
const tabSelector = {
  root: 'div.content_with-menu div.content-menu',
  header: {},
  body: {
    root: 'ul.content-menu__list',
    row: {
      root: 'li.content-menu__item',
      fields: {
        tab: 'a'
      }
    }
  }
}

const resultsTable = {
  root: 'div.table-body__cell:nth-of-type(7)',
  header: {},
  body: {
    root: 'div.chips-wrapper',
    row: {
      root: 'div.chip-block',
      field: {
        label: 'div.chip__content'
      }
    }
  }
}

const actionMenuStructure = {
  root: 'div.actions-menu__container',
  menuElements: {
    open_button: 'button',
    options: 'div.actions-menu__body div.actions-menu__option'
  }
}

const jobsMonitorTable = {
  root: 'div.table div.table__content',
  header: {
    root: 'div.table-head',
    sorters: {
      name: 'div.table-head__item:nth-of-type(1) div.data-ellipsis',
      type: 'div.table-head__item:nth-of-type(2) div.data-ellipsis',
      duration: 'div.table-head__item:nth-of-type(3) div.data-ellipsis',
      owner: 'div.table-head__item:nth-of-type(4) div.data-ellipsis',
      labels: 'div.table-head__item:nth-of-type(5) div.data-ellipsis',
      parameters: 'div.table-head__item:nth-of-type(6) div.data-ellipsis',
      results: 'div.table-head__item:nth-of-type(7) div.data-ellipsis'
    }
  },
  body: {
    root: 'div.table-body',
    row: {
      root: 'div.table-body__row',
      fields: {
        expand_btn: 'div.table-body__cell:nth-of-type(1) svg',
        status: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            'div.table-body__cell:nth-of-type(1) .status',
            'i',
            true,
            '.tooltip .tooltip__text span'
          )
        },
        name: 'div.table-body__cell:nth-of-type(1) a span.link .data-ellipsis',
        datetime:
          'div.table-body__cell:nth-of-type(1) a div.date__uid_row span:nth-of-type(1)',
        uid:
          'div.table-body__cell:nth-of-type(1) a div.date__uid_row span:nth-of-type(2)',
        type: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            'div.table-body__cell:nth-of-type(2)',
            'div.data-ellipsis ',
            true,
            '.tooltip .tooltip__text span'
          )
        },
        duration: 'div.table-body__cell:nth-of-type(3) div.data-ellipsis',
        owner: 'div.table-body__cell:nth-of-type(4) div.data-ellipsis',
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
  root: 'div.table div.table__content',
  header: {
    root: 'div.table-head',
    sorters: {
      name: 'div.table-head__item:nth-of-type(1) div.data-ellipsis',
      created: 'div.table-head__item:nth-of-type(2) div.data-ellipsis',
      finished: 'div.table-head__item:nth-of-type(3) div.data-ellipsis',
      duration: 'div.table-head__item:nth-of-type(4) div.data-ellipsis'
    }
  },
  body: {
    root: 'div.table-body',
    row: {
      root: 'div.table-body__row',
      fields: {
        status: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            'div.table-body__cell:nth-of-type(1) .status',
            'i',
            true,
            '.tooltip .tooltip__text span'
          )
        },
        name: 'div.table-body__cell:nth-of-type(1) a span.link',
        created: 'div.table-body__cell:nth-of-type(2) div.data-ellipsis',
        finished: 'div.table-body__cell:nth-of-type(3) div.data-ellipsis',
        duration: 'div.table-body__cell:nth-of-type(4) div.data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const scheduleMonitorTable = {
  root: 'div.table div.table__content',
  header: {
    root: 'div.table-head',
    sorters: {
      name: 'div.table-head__item:nth-of-type(1) div.data-ellipsis',
      type: 'div.table-head__item:nth-of-type(2) div.data-ellipsis',
      nextRun: 'div.table-head__item:nth-of-type(3) div.data-ellipsis',
      schedule: 'div.table-head__item:nth-of-type(4) div.data-ellipsis',
      labels: 'div.table-head__item:nth-of-type(5) div.data-ellipsis',
      lastRun: 'div.table-head__item:nth-of-type(6) div.data-ellipsis',
      createdTime: 'div.table-head__item:nth-of-type(7) div.data-ellipsis'
    }
  },
  body: {
    root: 'div.table-body',
    row: {
      root: 'div.table-body__row',
      fields: {
        name: 'div.table-body__cell:nth-of-type(1) a span.link',
        type: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            'div.table-body__cell:nth-of-type(2)',
            '.data-ellipsis',
            true,
            '.tooltip .tooltip__text span'
          )
        },
        nextRun: 'div.table-body__cell:nth-of-type(3) div.data-ellipsis',
        schedule: 'div.table-body__cell:nth-of-type(4) div.data-ellipsis',
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
        lastRun: 'div.table-head__item:nth-of-type(6) div.data-ellipsis',
        createdTime: 'div.table-head__item:nth-of-type(7) div.data-ellipsis',
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
    root: 'div.date-picker__weeks',
    sorters: {
      Sunday: 'div.date-picker__weeks-day:nth-of-type(1)',
      Monday: 'div.date-picker__weeks-day:nth-of-type(1)',
      Tuesday: 'div.date-picker__weeks-day:nth-of-type(1)',
      Wednesday: 'div.date-picker__weeks-day:nth-of-type(1)',
      Thursday: 'div.date-picker__weeks-day:nth-of-type(1)',
      Friday: 'div.date-picker__weeks-day:nth-of-type(1)',
      Saturday: 'div.date-picker__weeks-day:nth-of-type(1)'
    }
  },
  body: {
    offset: 3,
    row: {
      root: 'div.date-picker__week',
      fields: {
        Sunday: 'div.date-picker__week-day-wrapper:nth-of-type(1)',
        Monday: 'div.date-picker__week-day-wrapper:nth-of-type(2)',
        Tuesday: 'div.date-picker__week-day-wrapper:nth-of-type(3)',
        Wednesday: 'div.date-picker__week-day-wrapper:nth-of-type(4)',
        Thursday: 'div.date-picker__week-day-wrapper:nth-of-type(5)',
        Friday: 'div.date-picker__week-day-wrapper:nth-of-type(6)',
        Saturday: 'div.date-picker__week-day-wrapper:nth-of-type(7)'
      }
    }
  }
}

const dateTimePickerCalendars = {
  root: 'div.date-picker-container',
  apply_button: 'button.date-picker__apply-btn',
  error_message: 'div.error-message',
  fromDatePicker: {
    root: 'div.date-picker__calendars div.date-picker__calendar:nth-of-type(1)',
    elements: {
      month_prev_btn:
        'div.date-picker__header svg.date-picker__header-previous-month',
      month_next_btn:
        'div.date-picker__header svg.date-picker__header-next-month',
      month_label: 'div.date-picker__header div span.date-picker__header-month',
      year_label: 'div.date-picker__header div span.date-picker__header-year',
      time_input: 'div.date-picker__time input',
      calendar: {
        componentType: commonTable,
        structure: calendarTable
      }
    }
  },
  toDatePicker: {
    root: 'div.date-picker__calendars div.date-picker__calendar:nth-of-type(2)',
    elements: {
      month_prev_btn:
        'div.date-picker__header svg.date-picker__header-previous-month',
      month_next_btn:
        'div.date-picker__header svg.date-picker__header-next-month',
      month_label: 'div.date-picker__header div span.date-picker__header-month',
      year_label: 'div.date-picker__header div span.date-picker__header-year',
      time_input: 'div.date-picker__time input',
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
    'div.create-container div.create-container__data  div.accordion__container.functions-wrapper div.data-header__select',
  dropdownElements: {
    open_button: 'div.select__header div.select__value',
    options: 'div.select__body div.select__item',
    option_name: 'div.data-ellipsis div.data-ellipsis'
  }
}

const selectedFunctionsTemplates = {
  root:
    'div.create-container div.create-container__data  div.accordion__container.functions-wrapper div.create-container__data-list',
  header: {},
  body: {
    row: {
      root: 'div.card-template',
      fields: {
        name: '.card-template__header'
      }
    }
  }
}

const predefinedFunctionsTemplates = {
  root: 'div.create-container__data-list',
  header: {},
  body: {
    row: {
      root: 'div.card-template',
      fields: {
        name: '.card-template__header',
        description: '.card-template__description'
      }
    }
  }
}

const functionsTemplates = {
  root:
    'div.create-container div.create-container__data > div.accordion__container:nth-of-type(3) div.accordion__body div.data-wrapper div.templates-container',
  header: {},
  body: {
    row: {
      root: 'div.accordion__container',
      fields: {
        expand_btn: 'button',
        name: 'div.accordion__body > h6',
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
  'div.content__header div.page-actions-container button'
)
const jobsTabSelector = commonTable(tabSelector)
const tableRefreshButton = By.css(
  'div.content__action-bar div.data-ellipsis:nth-of-type(1) button[id=refresh]'
)

module.exports = {
  JobsMonitorTab: {
    Jobs_Tab_Selector: jobsTabSelector,
    New_Job_Button: pageHeaderButton,
    Resource_Monitoring_Button: By.css(
      'div.content__action-bar > div.data-ellipsis:nth-of-type(2) button'
    ),
    Table_Refresh_Button: tableRefreshButton,
    Table_Expand_Rows_Button: By.css(
      'div.content__action-bar div.actions div.round-icon-cp:nth-of-type(2) button'
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
        'div.content__action-bar div.filters div.select:nth-of-type(3)',
        'div.select__header', // Open Component
        'div.select__body div.select__item', // Options
        'div.data-ellipsis div.data-ellipsis' // Option value
      )
    ),
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        'div.content__action-bar div.filters > div.input-wrapper:nth-of-type(4)',
        true,
        false
      )
    ),
    Table_Labels_Filter_Input: inputGroup(
      generateInputGroup(
        'div.content__action-bar div.filters > div.input-wrapper:nth-of-type(5)',
        true,
        false
      )
    ),
    Start_Time_Filter_Dropdown: dropdownComponent(
      generateDropdownGroup(
        'div.content__action-bar div.filters div.date-picker-container',
        'input.date-picker__input',
        'div.date-picker__pop-up div.select__item',
        'div.data-ellipsis div.data-ellipsis',
        true // options_in_root ?
      )
    ),
    Date_Time_Picker: datepicker(dateTimePickerCalendars),
    Jobs_Monitor_Table: commonTable(jobsMonitorTable)
  },
  WorkflowsMonitorTab: {
    Workflows_Monitor_Table: commonTable(workflowsMonitorTable),
    Toggle_View_Button: By.css('.workflow-header .actions .toggle-view-btn'),
    Workflow_List_View_Table: commonTable(jobsMonitorTable)
  },
  ScheduleMonitorTab: {
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        'div.content__action-bar div.filters > div.input-wrapper:nth-of-type(1)',
        true,
        false
      )
    ),
    Table_Labels_Filter_Input: inputGroup(
      generateInputGroup(
        'div.content__action-bar div.filters > div.input-wrapper:nth-of-type(2)',
        true,
        false
      )
    ),
    Table_Refresh_Button: tableRefreshButton,
    Schedule_Monitor_Table: commonTable(scheduleMonitorTable)
  },
  CreateJob: {
    Back_Arrow_Button: By.css(
      'div.create-container div.create-container__header div.header-link a.header-link__icon'
    ),
    Create_Job_Header: By.css(
      'div.create-container div.create-container__header div.header-link h3.header-link__title'
    ),
    Search_Input: inputWithAutocomplete({
      root:
        'div.create-container div.create-container__data  div.search-container',
      elements: {
        input: 'input',
        options: 'ul.search-matches li.search-matches__item',
        option_name: ''
      }
    }),
    Select_Functions_From_Accordion: {
      Accordion_Header: By.css(
        'div.create-container div.create-container__data div.accordion__container.functions-wrapper h5.data-header__title span'
      ),
      Collapse_Button: By.css(
        'div.create-container div.create-container__data div.accordion__container.functions-wrapper button.accordion__icon'
      ),
      Select_Function_From_Dropdown: dropdownComponent(
        selectFunctionFromDropdown
      ),
      Selected_Functions_Templates: commonTable(selectedFunctionsTemplates)
    },
    Function_Templates_Accordion: {
      Accordion_Header: By.css(
        'div.create-container div.create-container__data > div.accordion__container:nth-of-type(3) h5.data-header__title'
      ),
      Collapse_Button: By.css(
        'div.create-container div.create-container__data > div.accordion__container:nth-of-type(3) > button.accordion__icon'
      ),
      Functions_Templates_Table: commonTable(functionsTemplates)
    }
  }
}
