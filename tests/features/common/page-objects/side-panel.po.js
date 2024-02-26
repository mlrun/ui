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
import inputGroup from '../components/input-group.component'
import numberInputGroup from '../components/number-input-group.component'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import checkboxComponent from '../components/checkbox.component'
import radiobuttonComponent from '../components/radio-button.component'
import labelComponent from '../components/label.component'
import actionMenu from '../components/action-menu.component'
import comboBox from '../components/combo-box.component'
import singleDatepicker from '../components/single-date-picker.component'
import textAreaGroup from '../components/text-area.component'
import {
  generateInputGroup,
  generateNumberInputGroup,
  generateLabelGroup,
  generateDropdownGroup,
  generateCheckboxGroup,
  generateTextAreaGroup
} from '../../common-tools/common-tools'
const { By } = require('selenium-webdriver')

const actionMenuStructure = {
  root: '.table__cell-actions',
  menuElements: {
    open_button: 'button',
    options: '.actions-menu__body .data-ellipsis'
  }
}

const labelsTable = {
  root: '.panel-title__labels-container .panel-title__labels-wrapper',
  header: {},
  body: {
    root: '.chips-wrapper',
    add_row_btn: 'button.button-add',
    row: {
      root: '.chip-block',
      fields: {
        key_input: 'input.input-label-key',
        value_input: 'input.input-label-value',
        label: '.chip',
        remove_btn: '.item-icon-close'
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

const startDateTimePickerCalendar = {
  root:
    '.feature-set-panel .accordion__container:nth-of-type(1) .panel-section__body .data-source__inputs-container .date-picker-container:nth-of-type(2)',
  apply_button: 'button.date-picker__apply-btn',
  error_message: '.error-message',
  datePicker: {
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
  }
}

const endDateTimePickerCalendar = {
  root:
    '.feature-set-panel .accordion__container:nth-of-type(1) .panel-section__body .data-source__inputs-container .date-picker-container:nth-of-type(3)',
  apply_button: '.date-picker__apply-btn',
  error_message: '.error-message',
  datePicker: {
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
  }
}
// Datepicker end

// New job components
const dataSourceInputSourcesTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(1) .panel-section__body',
  header: {
    root: 'table__header',
    sorters: {
      input_name: '.table__cell:nth-of-type(1)',
      path: '.table__cell:nth-of-type(2)'
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.table__row .add-input',
    row: {
      root: 'div[class=table__row]',
      fields: {
        input_name_input: '.input-row-wrapper',
        path_combobox: '.combobox',
        add_btn: '.btn-add',
        input_name_label: '.table__cell:nth-of-type(1)',
        path_label: '.table__cell:nth-of-type(2)',
        delete_btn: '.table__cell-actions .btn_delete'
      }
    }
  }
}

const jobPredefinedParametersTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .job-panel__parameters-table',
  header: {
    root: '.table__header',
    sorters: {
      name: '.table__cell:nth-of-type(2)',
      type: '.table__cell:nth-of-type(3)',
      simple_hyper: '.table__cell:nth-of-type(4)',
      values: '.table__cell:nth-of-type(5)'
    }
  },
  body: {
    root: 'div:not([class]):nth-of-type(2)',
    offset: 1,
    row: {
      root: 'div[class^=table__row]',
      fields: {
        checkbox: '.checkbox',
        name: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table__cell_disabled:nth-of-type(1)',
            false,
            true
          )
        },
        type: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table__cell_disabled:nth-of-type(2)',
            false,
            false
          )
        },
        simple_hyper: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table__cell:nth-of-type(3)',
            false,
            false
          )
        },
        values: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table__cell:nth-of-type(4)',
            false,
            false
          )
        },
        simple_hyper_dropdown: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.select',
            '.select__header .select__value',
            '.select__body .select__item',
            '.data-ellipsis > .data-ellipsis'
          )
        },
        values_input: {
          componentType: inputGroup,
          structure: generateInputGroup('.table__cell:nth-of-type(4)', false)
        },
        apply_edit_btn: '.table__cell:nth-of-type(5) .apply-edit-btn'
      }
    }
  }
}

const jobCustomParametersTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .job-panel__parameters-table',
  header: {
    root: '.table__header',
    sorters: {
      name: '.table__cell:nth-of-type(2)',
      type: '.table__cell:nth-of-type(3)',
      simple_hyper: '.table__cell:nth-of-type(4)',
      values: '.table__cell:nth-of-type(5)'
    }
  },
  body: {
    add_row_btn: '.add-input',
    offset: 1,
    row: {
      root: 'div:not([class]):nth-of-type(3) div[class^=table__row]',
      fields: {
        checkbox: '.checkbox',
        name: '.parameter-name',
        type: '.table__cell:nth-of-type(2)',
        simple_hyper: '.table__cell:nth-of-type(3)',
        values: '.table__cell:nth-of-type(4)',
        simple_hyper_dropdown: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.select',
            '.select__header .select__value',
            '.select__body .select__item',
            '.data-ellipsis > .data-ellipsis'
          )
        },
        values_input: {
          componentType: inputGroup,
          structure: generateInputGroup('.table__cell:nth-of-type(4)', false)
        },
        apply_edit_btn: '.table__cell:nth-of-type(5) .apply-edit-btn',
        delete_btn: '.table__cell-actions button.btn_delete'
      }
    }
  }
}

// TODO: Wait for some details
const volumePathsTable = {
  root:
    '.modal__content .form-row:nth-of-type(7)',
  header: {
    root: '.form-table__header-row',
    sorters: {
      type: '.form-table__cell:nth-of-type(1)',
      volume_name: '.form-table__cell:nth-of-type(2)',
      path: '.form-table__cell:nth-of-type(3)',
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.form-table__action-row button',
    row: {
      root: 'div[class=table__row]',
      fields: {
        type: '.table__cell:nth-of-type(1) .data-ellipsis',
        volume_name: '.table__cell:nth-of-type(2) .data-ellipsis',
        path: '.table__cell:nth-of-type(3) .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const resourcesNodeSelectorTable = {
  root:
    '.wizard-form__content .job-wizard__resources .form-key-value-table',
  header: {
    sorters: {
      key: '.form-table__cell_1:nth-of-type(1)',
      value: '.form-table__cell_1:nth-of-type(2)',
    }
  },
  body: {
    add_row_btn: '.form-table__action-row button',
    row: {
      root: '.form-table__row',
      fields: {
        key: '.form-table__cell_1:nth-of-type(1)',
        value: '.form-table__cell_1:nth-of-type(2)',
        delete_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(2)',
        edit_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(1)',
        apply_edit_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(1)',
        key_input: {
          componentType: inputGroup,
          structure: generateInputGroup('.form-table__cell_1:nth-of-type(1)', true, false, false)
        },
        value_input: {
          componentType: inputGroup,
          structure: generateInputGroup(
            '.form-table__cell_1:nth-of-type(2)',
            true,
            false,
            false
          )
        }
      }
    }
  }
}

const advancedEnvironmentVariablesTable_old = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(4) .panel-section',
  header: {
    root: '.table__header',
    sorters: {
      name: '.table__cell:nth-of-type(1)',
      value: '.table__cell:nth-of-type(2)'
    }
  },
  body: {
    add_row_btn: '.table-row .add-new-item-btn',
    row: {
      root: 'div[class^=table-row]',
      fields: {
        name: '.table-cell:nth-of-type(1) .data-ellipsis',
        value: '.table-cell:nth-of-type(2) .data-ellipsis',
        edit_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(1)',
        apply_edit_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(1)',
        delete_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(2)',
        name_input: {
          componentType: inputGroup,
          structure: generateInputGroup(
            '.table-cell__key',
            true,
            false,
            false
          )
        },
        value_input: {
          componentType: inputGroup,
          structure: generateInputGroup(
            '.table-cell__value',
            true,
            false,
            false
          )
        }
      }
    }
  }
}

const advancedEnvironmentVariablesDemoTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(4) .key-value-table',
  header: {
    root: '.table__header',
    sorters: {
      name: '.table-cell__key',
      type: '.table-cell__type',
      value: '.table-cell__value'
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.table__row .add-input',
    row: {
      root: '.table__row',
      fields: {
        name: '.table-cell__key .data-ellipsis',
        type: '.table-cell__type .data-ellipsis',
        value: '.table-cell__value .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const advancedSecretsTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(4) .panel-section:nth-of-type(2) .secrets',
  header: {
    root: '.table__header',
    sorters: {
      kind: '.table__cell:nth-of-type(1)',
      value: '.table__cell:nth-of-type(2)'
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.table__row .add-input',
    row: {
      root: 'div[class^=table__row]',
      fields: {
        kind: '.table__cell:nth-of-type(1) .data-ellipsis',
        value: '.table__cell:nth-of-type(2) .data-ellipsis',
        edit_btn: '.table__cell:nth-of-type(2) .data-ellipsis',
        apply_edit_btn: '.apply-edit-btn',
        delete_btn: '.table__cell:nth-of-type(3) .btn_delete',
        kind_dropdown: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.select',
            '.select__header .select__value',
            '.select__body .select__item',
            '.data-ellipsis'
          )
        },
        value_input: {
          componentType: inputGroup,
          structure: generateInputGroup('.input-wrapper', true, false, false)
        },
        add_row_btn: 'button svg'
      }
    }
  }
}

// New Function Complex elements descriptions
const newFunctionLabelsTable = {
  root:
    '.new-item-side-panel .accordion__container:nth-of-type(1) .accordion__body .panel-section__body .general__labels-container',
  header: {},
  body: {
    root: '.chips-wrapper',
    add_row_btn: '.button-add',
    row: {
      root: '.chip-block',
      fields: {
        key_input: 'input.input-label-key',
        value_input: 'input.input-label-value',
        label: '.chip',
        remove_btn: '.item-icon-close'
      }
    }
  }
}

const functionVolumePathsTable = {
  root:
    '.new-item-side-panel .accordion__container:nth-of-type(3) .functions-panel__item > .panel-section:nth-of-type(3) .panel-section__body',
  header: {
    root: '.table__header',
    sorters: {
      type: '.table__cell:nth-of-type(1)',
      volume_name: '.table__cell:nth-of-type(2)',
      path: '.table__cell:nth-of-type(3)'
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.no-hover .add-input',
    row: {
      root: '.table__row',
      fields: {
        type: '.table__cell:nth-of-type(1) .data-ellipsis',
        volume_name: '.table__cell:nth-of-type(2) .data-ellipsis',
        path: '.table__cell:nth-of-type(3) .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const functionEnvironmentVariablesTable = {
  root:
    '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table',
  header: {
    root: '.table-row__header',
    sorters: {
      name: '.table-cell__key',
      value: '.table-cell__value'
    }
  },
  body: {
    add_row_btn: '.add-input',
    save_row_btn: '.btn-add',
    row: {
      root: '.table__body',
      fields: {
        name: '.input-row-wrapper .input-wrapper:nth-of-type(1) input',
        value: '.input-row-wrapper .input-wrapper:nth-of-type(3) input',
        edit_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(1)',
        apply_edit_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(1)',
        delete_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(2)',
        name_input: {
          componentType: inputGroup,
          structure: generateInputGroup(
            '.input-row-wrapper .input-wrapper:nth-of-type(1)',
            true,
            false,
            false
          )
        },
        value_input: {
          componentType: inputGroup,
          structure: generateInputGroup(
            '.input-row-wrapper .input-wrapper:nth-of-type(3)',
            true,
            false,
            false
          )
        }
      }
    }
  }
}

const functionEnvironmentVariablesDemoTable = {
  root:
    '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table',
  header: {
    root: '.table-row__header',
    sorters: {
      name: '.table-cell__key',
      value: '.table-cell__value'
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.add-input',
    row: {
      root: '.table__row',
      fields: {
        name: '.table-cell__key .data-ellipsis',
        type: '.table-cell__type .data-ellipsis',
        value: '.table-cell__value .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

// MLFunction Serving Runtime Configuration Accordion
const servingRuntimeConfigurationModelTable = {
  root:
    '.new-item-side-panel .accordion__container:nth-of-type(5) .topology .model-table',
  header: {
    root: '.table__header',
    sorters: {
      name: '.table__cell:nth-of-type(1)',
      class: '.table__cell:nth-of-type(2)',
      path: '.table__cell:nth-of-type(3)'
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.table__row .add-input',
    row: {
      root: '.table__row',
      fields: {
        name: '.table__cell:nth-of-type(1)',
        class: '.table__cell:nth-of-type(2)',
        path: '.table__cell:nth-of-type(3)',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const secretRuntimeConfigurationTable = {
  root:
    '.new-item-side-panel .accordion__container:nth-of-type(5) .secrets .secrets__table',
  header: {
    root: '.table-row__header',
    sorters: {
      kind: '.table-cell:nth-of-type(1)',
      value: '.table-cell:nth-of-type(2)'
    }
  },
  body: {
    add_row_btn: '.add-new-item-btn',
    save_row_btn: '.btn-add',
    row: {
      root: '.table-row:not(.table-row__header)',
      fields: {
        kind: '.table-cell__key',
        value: '.table-cell__value',
        edit_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(1)',
        apply_edit_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(1)',
        delete_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(2)',
        kind_dropdown: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.select',
            '.select__value',
            '.select__body .select__item',
            '.data-ellipsis'
          )
        },
        value_input: {
          componentType: inputGroup,
          structure: generateInputGroup('.input-wrapper', true, false, true)
        }
      }
    }
  }
}

const parametersRuntimeConfigurationTable = {
  root:
    '.new-item-side-panel .accordion__container:nth-of-type(5) .advanced .panel-section__body',
  header: {
    root: '.table__header',
    sorters: {
      name: '.table__cell:nth-of-type(1)',
      type: '.table__cell:nth-of-type(2)',
      value: '.table__cell:nth-of-type(3)'
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.table__row .add-input',
    row: {
      root: '.table__row',
      fields: {
        name: '.table__cell:nth-of-type(1)',
        type: '.table__cell:nth-of-type(2)',
        value: '.table__cell:nth-of-type(3)',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

// common components
const commonCrossCloseButton = By.css(
  'div.new-item-side-panel .panel-title__btn_close'
)

const commonVolumePathsTableTypeDropdown = dropdownComponent(
  generateDropdownGroup(
    '.new-item-side-panel .accordion__container:nth-of-type(3) .panel-section:nth-of-type(3) .panel-section__body .table__body .input-row-wrapper:nth-of-type(1) .select',
    '.select__value',
    '.select__body .select__item',
    '.data-ellipsis .data-ellipsis'
  )
)

const commonPodsPriorityDropdown = dropdownComponent(
  generateDropdownGroup(
    '.modal__content .modal__body .job-wizard__resources .resources__select',
    '.form-field-select .form-field__wrapper-normal', 
    '.options-list__body .select__item-label',
    '.data-ellipsis'
  )
)

function resourcesTableCommonInput(accordionIndx, rowIndx, inputIndx) {
  return generateInputGroup(
    `.new-item-side-panel .accordion__container:nth-of-type(${accordionIndx}) .panel-section:nth-of-type(3) .panel-section__body .table__body .input-row-wrapper:nth-of-type(${rowIndx}) .input-wrapper:nth-of-type(${inputIndx})`,
    true,
    true,
    true
  )
}

const commonAddNewRowButton = By.css(
  '.new-item-side-panel .accordion__container:nth-of-type(3) .panel-section:nth-of-type(3) .panel-section__body .table__body button.btn-add'
)
const commonDeleteNewRowButton = By.css(
  '.new-item-side-panel .accordion__container:nth-of-type(3) .panel-section:nth-of-type(3) .panel-section__body .table__body button:not([class])'
)

const commonAccessKeyCheckbox = checkboxComponent(
  generateCheckboxGroup('.new-item-side-panel .access-key', true, false, false)
)
const commonAccessKeyInput = inputGroup(
  generateInputGroup(
    '.new-item-side-panel .access-key__input',
    true,
    false,
    true
  )
)

module.exports = {
  newFeatureSet: {
    Cross_Close_Button: commonCrossCloseButton,
    Feature_Set_Name_Input: inputGroup(
      generateInputGroup(
        '.feature-set-panel .panel-title .name',
        true,
        '.input__warning svg',
        true
      )
    ),
    Version_Input: inputGroup(
      generateInputGroup(
        '.feature-set-panel .panel-title .version',
        true,
        '.input__warning svg',
        true
      )
    ),
    Description_Input: textAreaGroup(generateTextAreaGroup('.feature-set-panel .panel-title .text-area-wrapper', '.text-area__counter')),
    Labels_Table: commonTable(labelsTable),
    Passthrough_Checkbox: checkboxComponent(
      generateCheckboxGroup(
        '.feature-set-panel .panel-title .checkbox',
        true,
        false,
        true
      )
    ),
    Passthrough_Checkbox_State: By.css(
      '.feature-set-panel .panel-title .checkbox'
    ),
    Passthrough_PopUp_Dialog:{
      Dialog_PopUp: By.css('#overlay_container .pop-up-dialog'),
      Close_Button: By.css('.pop-up-dialog .pop-up-dialog__header .pop-up-dialog__btn_close'),
      Dialog_Message: By.css('.pop-up-dialog .confirm-dialog__message'), 
      Keep_Online_Target_Set_Button: By.css('.pop-up-dialog .confirm-dialog__btn-container .btn-tertiary'),
      Unset_Online_Target_Button: By.css('.pop-up-dialog .confirm-dialog__btn-container .btn-secondary')
    },
    Offline_Checkbox_State: By.css(
      '.feature-set-panel .accordion__container:nth-of-type(3) .accordion__body .target-store__item:nth-of-type(2) .checkbox'
    ),
    Online_Checkbox_State: By.css(
      '.feature-set-panel .accordion__container:nth-of-type(3) .accordion__body .target-store__item:nth-of-type(1) .checkbox'
    ),
    NOSQL_Kind_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.target-store__inputs-container .select-medium',
        '.select__header',
        '.select__options-list .select__item'
      )
    ),
    Offline_Partition_Checkbox_State: By.css(
      '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .target-store__inputs-container .checkbox'
    ),
    External_Offline_Checkbox_State: By.css(
      '.feature-set-panel .accordion__container:nth-of-type(3) .accordion__body .target-store__item:nth-of-type(3) .checkbox'
    ),
    Data_Source_Accordion: {
      Accordion_Header: By.css(
        '.feature-set-panel .accordion__container:nth-of-type(1) h5'
      ),
      Collapse_Button: By.css(
        '.feature-set-panel .accordion__container:nth-of-type(1) .new-item-side-panel__expand-icon'
      ),
      URL_Combobox: comboBox(
        '.feature-set-panel .accordion__container:nth-of-type(1) .panel-section__body .combobox'
      ),
      Kind_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.feature-set-panel .accordion__container:nth-of-type(1) .panel-section__body .select',
          '.select__header .select__value',
          '.select__body .select__item',
          '.data-ellipsis'
        )
      ),
      Attributes_Input: inputGroup(
        generateInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(1) .panel-section__body .input-wrapper',
          true,
          false,
          true
        )
      ),
      Parquet_Timestamp_Column_Input: inputGroup(
        generateInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(1) .panel-section__body .data-source__inputs-item.input-wrapper',
          true,
          true,
          true
        )
      ),
      Start_Date_Time_Picker: singleDatepicker(startDateTimePickerCalendar),
      Start_Date_Time_Hint: labelComponent(
        generateLabelGroup(
          '.feature-set-panel .accordion__container:nth-of-type(1) .panel-section__body .data-source__inputs-container .date-picker-container:nth-of-type(2)',
          false,
          true
        )
      ),
      End_Date_Time_Picker: singleDatepicker(endDateTimePickerCalendar),
      End_Date_Time_Hint: labelComponent(
        generateLabelGroup(
          '.feature-set-panel .accordion__container:nth-of-type(1) .panel-section__body .data-source__inputs-container .date-picker-container:nth-of-type(3)',
          false,
          true
        )
      ),
      Set_Schedule_Button: By.css(
        '.feature-set-panel .accordion__container:nth-of-type(1)  button.schedule-tumbler'
      )
    },
    Schema_Accordion: {
      Accordion_Header: By.css(
        '.feature-set-panel .accordion__container:nth-of-type(2) h5'
      ),
      Collapse_Button: By.css(
        '.feature-set-panel .accordion__container:nth-of-type(2) .new-item-side-panel__expand-icon'
      ),
      Entities_Input: inputGroup(
        generateInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(2) .input-wrapper:nth-of-type(1)',
          true,
          false,
          true
        )
      ),
      Timestamp_Input: inputGroup(
        generateInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(2) .input-wrapper:nth-of-type(2)',
          true,
          true,
          true
        )
      )
    },
    Target_Store_Accordion: {
      Accordion_Header: By.css(
        '.feature-set-panel .accordion__container:nth-of-type(3) h5'
      ),
      Collapse_Button: By.css(
        '.feature-set-panel .accordion__container:nth-of-type(3) .new-item-side-panel__expand-icon'
      ),
      // online group
      Online_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .accordion__body .target-store__item:nth-of-type(1) .checkbox',
          true,
          false,
          true
        )
      ),
      Online_Checkbox_Hint: labelComponent(
        generateLabelGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .accordion__body .target-store__item:nth-of-type(1) .checkbox',
          false,
          true
        )
      ),
      Online_Path: By.css('.target-store__item:nth-of-type(1) .online-path'),
      Online_Path_Input: inputGroup(
        generateInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(1) .input-wrapper',
          true,
          false,
          true
        )
      ),
      Edit_Online_Path_Button: By.css('.target-store__item:nth-of-type(1) .target-store__path-actions .round-icon-cp'),
      Apply_Online_Path_Button: By.css('.target-store__item:nth-of-type(1) .target-store__path-actions.editable .round-icon-cp:nth-of-type(1)'),
      Discard_Online_Path_Button: By.css('.target-store__item:nth-of-type(1) .target-store__path-actions.editable .round-icon-cp:nth-of-type(2)'),
      // Offline group
      Offline_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .accordion__body .target-store__item:nth-of-type(2) .checkbox',
          true,
          false,
          true
        )
      ),
      Offline_Checkbox_Hint: labelComponent(
        generateLabelGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .accordion__body .target-store__item:nth-of-type(2) .checkbox',
          false,
          true
        )
      ),
      Offline_Path: By.css('.target-store__item:nth-of-type(2) .offline-path'),
      Offline_Path_Input: inputGroup(
        generateInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .input-wrapper',
          true,
          false,
          true
        )
      ),
      Edit_Offline_Path_Button: By.css('.target-store__item:nth-of-type(2) .target-store__path-actions .round-icon-cp'),
      Apply_Offline_Path_Button: By.css('.target-store__item:nth-of-type(2) .target-store__path-actions.editable .round-icon-cp:nth-of-type(1)'),
      Discard_Offline_Path_Button: By.css('.target-store__item:nth-of-type(2) .target-store__path-actions.editable .round-icon-cp:nth-of-type(2)'),
      Offline_Partition_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .target-store__inputs-container .checkbox',
          true,
          false,
          true
        )
      ),
      Offline_Partition_ShowHide_Link: By.css(
        '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .target-store__inputs-container .partition-fields .link'
      ),
      Offline_Partition_By_Key_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .target-store__inputs-container .partition-fields .partition-fields__checkbox-container .checkbox:nth-of-type(1)',
          true,
          false,
          false
        )
      ),
      Offline_Partition_By_Time_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .target-store__inputs-container .partition-fields .partition-fields__checkbox-container .checkbox:nth-of-type(2)',
          true,
          false,
          false
        )
      ),
      Offline_Partition_By_Columns_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .target-store__inputs-container .partition-fields .partition-fields__checkbox-container .checkbox:nth-of-type(3)',
          true,
          false,
          false
        )
      ),
      Offline_Partition_Distinct_Keys_Radiobutton: radiobuttonComponent({
        root:
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .target-store__inputs-container .partition-fields .radio-buttons-container .radio-buttons__content:nth-of-type(1)',
        elements: {
          radiobutton: 'label.radio-button input',
          mark: 'label.radio-button .checkmark',
          name: 'span.radio-button__label',
          description: 'span.radio-button__info'
        }
      }),
      Offline_Partition_Number_Of_Buckets_Radiobutton: radiobuttonComponent({
        root:
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .target-store__inputs-container .partition-fields .radio-buttons-container .radio-buttons__content:nth-of-type(2)',
        elements: {
          radiobutton: 'label.radio-button input',
          mark: 'label.radio-button .checkmark',
          name: 'span.radio-button__label',
          description: 'span.radio-button__info'
        }
      }),
      Offline_Partition_Key_Bucketing_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .target-store__inputs-container .range-normal',
          false,
          true,
          true,
          false
        )
      ),
      Offline_Partition_Columns_Input: inputGroup(
        generateInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .target-store__inputs-container .partition-fields__inputs-container .partition-cols.input-wrapper',
          true,
          false,
          false
        )
      ),
      Offline_Partition_Granularity_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(2) .select',
          '.select__header .select__value',
          '.select__body .select__item',
          '.data-ellipsis > .data-ellipsis'
        )
      ),
      // Other group
      External_Offline_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .accordion__body .target-store__item:nth-of-type(3) .checkbox',
          true,
          false,
          true
        )
      ),
      External_Offline_Checkbox_Hint: labelComponent(
        generateLabelGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .accordion__body .target-store__item:nth-of-type(3) .checkbox',
          false,
          true
        )
      ),
      File_Type_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(3) .select',
          '.select__header .select__value',
          '.select__body .select__item'        )
      ),
      URL_Combobox: comboBox(
        '.target-store__item .target-store__inputs-container .combobox'
      ),
      URL_Input: inputGroup(
        generateInputGroup(
          '.target-store__item .target-store__inputs-container .url',
          true,
          false,
          false
        )
      ),
      External_Offline_Partition_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(3) .target-store__inputs-container .checkbox',
          true,
          false,
          true
        )
      ),
      External_Offline_Partition_ShowHide_Link: By.css(
        '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(3) .target-store__inputs-container .partition-fields .link'
      ),
      External_Offline_Partition_By_Key_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(3) .target-store__inputs-container .partition-fields .partition-fields__checkbox-container .checkbox:nth-of-type(1)',
          true,
          false,
          false
        )
      ),
      External_Offline_Partition_By_Time_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(3) .target-store__inputs-container .partition-fields .partition-fields__checkbox-container .checkbox:nth-of-type(2)',
          true,
          false,
          false
        )
      ),
      External_Offline_Partition_By_Columns_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(3) .target-store__inputs-container .partition-fields .partition-fields__checkbox-container .checkbox:nth-of-type(3)',
          true,
          false,
          false
        )
      ),
      External_Offline_Partition_Distinct_Keys_Radiobutton: radiobuttonComponent(
        {
          root:
            '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(3) .target-store__inputs-container .partition-fields .radio-buttons-container .radio-buttons__content:nth-of-type(1)',
          elements: {
            radiobutton: 'label.radio-button input',
            mark: 'label.radio-button .checkmark',
            name: 'span.radio-button__label',
            description: 'span.radio-button__info'
          }
        }
      ),
      External_Offline_Partition_Number_Of_Buckets_Radiobutton: radiobuttonComponent(
        {
          root:
            '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(3) .target-store__inputs-container .partition-fields .radio-buttons-container .radio-buttons__content:nth-of-type(2)',
          elements: {
            radiobutton: 'label.radio-button input',
            mark: 'label.radio-button .checkmark',
            name: 'span.radio-button__label',
            description: 'span.radio-button__info'
          }
        }
      ),
      External_Offline_Partition_Key_Bucketing_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(3) .target-store__inputs-container .range-normal',
          false,
          true,
          true,
          false
        )
      ),
      External_Offline_Partition_Columns_Input: inputGroup(
        generateInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(3) .target-store__inputs-container .partition-fields__inputs-container .partition-cols.input-wrapper',
          true,
          false,
          false
        )
      ),
      External_Offline_Partition_Granularity_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.feature-set-panel .accordion__container:nth-of-type(3) .panel-section__body .target-store__item:nth-of-type(3) .partition-fields__inputs-container .select',
          '.select__header .select__value',
          '.select__body .select__item',
          '.data-ellipsis > .data-ellipsis'
        )
      ),
      Error_Message: By.css(
        '.feature-set-panel .accordion__container:nth-of-type(3) .error'
      )
    },
    Access_Key_Checkbox: commonAccessKeyCheckbox,
    Access_Key_Input: commonAccessKeyInput,
    Cancel_Button: By.css(
      '.feature-set-panel .new-item-side-panel__buttons-container .pop-up-dialog__btn_cancel'
    ),
    Save_Button: By.css(
      '.feature-set-panel .new-item-side-panel__buttons-container .btn-secondary:nth-of-type(2)'
    ),
    Save_And_Ingest_Button: By.css(
      '.feature-set-panel .new-item-side-panel__buttons-container .btn-secondary:nth-of-type(3)'
    )
  },
  newJobTemplateEdit: {
    Cross_Close_Button: commonCrossCloseButton,
    Name_Edit_Button: By.css(
      '.new-item-side-panel .panel-title__container .accordion__container button'
    ),
    Job_Name_Input: inputGroup(
      generateInputGroup(
        '.new-item-side-panel .panel-title__container .accordion__container .input-wrapper',
        true,
        '.input__warning svg',
        true
      )
    ),
    Job_Method_Dropdown: dropdownComponent(
        generateDropdownGroup('.new-item-side-panel .job-panel__title-select-container .job-methods')
    ),
    Job_Method_Apply: By.css('.job-panel__title-buttons-container .btn-primary'),
    Job_Method_Cancel: By.css('.job-panel__title-buttons-container .btn-tertiary'),
    Data_Inputs_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(1) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(1) .new-item-side-panel__expand-icon'
      ),
      Data_Source_Input_Sources_Table: commonTable(dataSourceInputSourcesTable),
      Default_Input_Path_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(1) .panel-section:nth-of-type(2) .input-wrapper:nth-of-type(1)',
          true,
          false,
          true
        )
      ),
      Default_Artifact_Path_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(1) .panel-section:nth-of-type(2) .input-wrapper:nth-of-type(2)',
          true,
          false,
          true
        )
      ),
      Data_Inputs_Table_Name_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(1) .table__row-add-item .input-wrapper',
          true,
          false,
          true
        )
      ),
      Edit_Data_Inputs_Table_Name_Input: inputGroup(
          generateInputGroup('.new-item-side-panel__body .accordion__container:nth-of-type(1) .edit-row .table__cell_edit:nth-of-type(1)')
      ),
      Add_Input_Button: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(1) .add-input'
      ),
      Add_Row_Button: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(1) .table__row-add-item .btn-add'
      ),
      Apply_Edit_Button: By.css('.new-item-side-panel__body .accordion__container:nth-of-type(1) .apply-edit-btn'),
      URL_Combobox: comboBox(
        '.new-item-side-panel__body .accordion__container:nth-of-type(1) .combobox'
      )
    },
    Parameters_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(2) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(2) .new-item-side-panel__expand-icon'
      ),
      Parameters_Additional_Settings_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .parameters-additional-settings-container .parameters-additional-settings:nth-of-type(2) .input-wrapper',
          true,
          false,
          true
        )
      ),
      Result_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .parameters-additional-settings-container .parameters-additional-settings:nth-of-type(3) .input-wrapper',
          true,
          false,
          true
        )
      ),
      Turning_Strategy_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .parameters-additional-settings-container .parameters-additional-settings:nth-of-type(2) .select',
          '.select__label',
          '.select__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      Criteria_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .parameters-additional-settings-container .parameters-additional-settings:nth-of-type(3) .select',
          '.select__label',
          '.select__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      Job_Custom_Parameters_Table: commonTable(jobCustomParametersTable),
      Job_Predefined_Parameters_Table: commonTable(
        jobPredefinedParametersTable
      ),
      Parameters_Table_Name_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .panel-section__body .input-row-wrapper .input-wrapper:nth-of-type(1)',
          true,
          false,
          true
        )
      ),
      Edit_Parameters_Table_Name_Input: inputGroup(generateInputGroup('.job-panel__parameters-table .edit-row .table__cell_edit:nth-of-type(1)')),
      Parameters_Table_Type_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .panel-section__body .input-row-wrapper .select:nth-of-type(2)',
          '.select__label',
          false,
          '.data-ellipsis'
        )
      ),
      Parameter_Table_Simple_Hyper_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .panel-section__body .input-row-wrapper .select:nth-of-type(3)',
          '.select__label',
          false,
          '.data-ellipsis'
        )
      ),
      Edit_Parameter_Table_Simple_Hyper_Dropdown: dropdownComponent(
          generateDropdownGroup(
              '.job-panel__parameters-table .edit-row .table__cell_edit:nth-of-type(3) .select',
              '.select__label',
              false,
              '.data-ellipsis'
          )
      ),
      Parameters_Table_Value_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .panel-section__body .input-row-wrapper .input-wrapper:nth-of-type(4)',
          true,
          false,
          true
        )
      ),
      Edit_Parameters_Table_Value_Input: inputGroup(
          generateInputGroup('.job-panel__parameters-table .edit-row .table__cell_edit:nth-of-type(4)')
      ),
      Add_New_Row_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(2) .panel-section .panel-section__body button.add-input'
      ),
      Apply_New_Row_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(2) .panel-section .panel-section__body button.btn-add'
      ),
      Discard_New_Row_Button: By.css(
        '.new-item-side-panel__body .accordion__container .table__row-add-item .table__cell-actions button:not([class])'
      ),
      Apply_Edit_Button: By.css('.job-panel__parameters-table .apply-edit-btn'),
    },
    Resources_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(3) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(3) .new-item-side-panel__expand-icon'
      ),
      Pods_Priority_Dropdown: commonPodsPriorityDropdown,
      Pods_Toleration_Dropdown: dropdownComponent(
          generateDropdownGroup(
              '.new-item-side-panel .accordion__container:nth-of-type(3) .volume-toleration',
              '.select__value',
              '.select__body .select__item',
              '.data-ellipsis .data-ellipsis'
          )
      ),
      Volumes_Subheader: labelComponent(
        generateLabelGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(3) .panel-section:nth-of-type(3)',
          'h5',
          true
        )
      ),
      // Volume Path inputs
      Volume_Paths_Table_Type_Dropdown: commonVolumePathsTableTypeDropdown,
      Volume_Paths_Table_Volume_Name_Input: inputGroup(
        resourcesTableCommonInput(3, 1, 2)
      ),
      Volume_Paths_Table_Path_Input: inputGroup(
        resourcesTableCommonInput(3, 1, 3)
      ),
      Volume_Paths_Table_Container_Input: inputGroup(
        resourcesTableCommonInput(3, 2, 1)
      ),
      Volume_Paths_Table_Config_Map_Input: inputGroup(
        resourcesTableCommonInput(3, 2, 1)
      ),
      Volume_Paths_Table_Secret_Name_Input: inputGroup(
        resourcesTableCommonInput(3, 2, 1)
      ),
      Volume_Paths_Table_Claime_Name_Input: inputGroup(
        resourcesTableCommonInput(3, 2, 1)
      ),
      Volume_Paths_Table_Access_Key_Input: inputGroup(
        resourcesTableCommonInput(3, 2, 2)
      ),
      Volume_Paths_Table_Resource_Path_Input: inputGroup(
        resourcesTableCommonInput(3, 3, 1)
      ),
      Edit_Volume_Name_Input: inputGroup(generateInputGroup('.volumes-table .edit-row:not(.no-border_top) .table__cell-input:nth-of-type(2)')),
      Edit_Volume_Path_Input: inputGroup(generateInputGroup('.volumes-table .edit-row:not(.no-border_top) .table__cell-input:nth-of-type(3)')),
      Add_New_Row_Button: commonAddNewRowButton,
      Delete_New_Row_Button: commonDeleteNewRowButton,
      Apply_Edit_Button: By.css('.volumes-table .apply-edit-btn'),
      Volume_Paths_Table: commonTable(volumePathsTable),
      Memory_Request_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .resources__inputs .memory .resources__input:nth-of-type(1) .select',
          '.select__value',
          '.select__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      Memory_Request_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .resources__inputs .memory .resources__input:nth-of-type(1) .range-dense',
          {
            inc_btn: '.range__buttons button[class*=increase]',
            dec_btn: '.range__buttons button[class*=decrease]'
          },
          true,
          false,
          true
        )
      ),
      Memory_Limit_Dropdown: dropdownComponent(
          generateDropdownGroup(
              '.new-item-side-panel__body .accordion__container:nth-of-type(3) .resources__inputs .memory .resources__input:nth-of-type(2) .select',
              '.select__value',
              '.select__body .select__item',
              '.data-ellipsis .data-ellipsis'
          )
      ),
      Memory_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .resources__inputs .memory .resources__input:nth-of-type(2) .range-dense',
          false,
          true,
          false,
          true
        )
      ),
      CPU_Request_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .resources__inputs .cpu .resources__input:nth-of-type(1) .select',
          '.select__value',
          '.select__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      CPU_Request_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .resources__inputs .cpu .resources__input:nth-of-type(1) .range-dense',
          false,
          true,
          false,
          true
        )
      ),
      CPU_Limit_Dropdown: dropdownComponent(
          generateDropdownGroup(
              '.new-item-side-panel__body .accordion__container:nth-of-type(3) .resources__inputs .cpu .resources__input:nth-of-type(2) .select',
              '.select__value',
              '.select__body .select__item',
              '.data-ellipsis .data-ellipsis'
          )
      ),
      CPU_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .resources__inputs .cpu .resources__input:nth-of-type(2) .range-dense',
          false,
          true,
          false,
          true
        )
      ),
      GPU_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .resources__inputs .section-gpu .range-dense',
          false,
          true,
          false,
          true
        )
      ),
      Resources_Node_Selector_Table: commonTable(resourcesNodeSelectorTable)
    },
    Advanced_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(4) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(4) .new-item-side-panel__expand-icon'
      ),
      Advanced_Environment_Variables_Table: commonTable(
        advancedEnvironmentVariablesTable_old
      ),
      Advanced_Secrets_Table: commonTable(advancedSecretsTable),
      Advanced_Environment_Variables_Demo_Table: commonTable(
        advancedEnvironmentVariablesDemoTable
      ),
      Environment_Variables_Name_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(4) .panel-section .input-wrapper:nth-of-type(1)',
          true,
          false,
          true
        )
      ),
      Environment_Variables_Demo_Name_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body .input-row-wrapper .input-wrapper:nth-of-type(1)',
          true,
          false,
          true
        )
      ),
      Edit_Environment_Variables_Demo_Name_Input: inputGroup(
          generateInputGroup('.env-variables-table .edit-row .table-cell__key')
      ),
      Environment_Variables_Type_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body .input-row-wrapper .select',
          false,
          false,
          false
        )
      ),
      Edit_Environment_Variables_Type_Dropdown: dropdownComponent(
          generateDropdownGroup(
              '.env-variables-table .edit-row .table-cell__type .select')
      ),
      Environment_Variables_Value_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(4) .panel-section .table-cell__value .input-wrapper',
          true,
          false,
          true
        )
      ),
      Environment_Variables_Demo_Value_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body .input-row-wrapper .input-wrapper:nth-of-type(3)',
          true,
          false,
          true
        )
      ),
      Edit_Environment_Variables_Demo_Value_Input: inputGroup(
          generateInputGroup(
              '.env-variables-table .edit-row .table-cell__value')
      ),
      Environment_Variables_Secret_Name_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body .input-row__item-secret .input-wrapper:nth-of-type(1)',
          true,
          true,
          true
        )
      ),
      Edit_Environment_Variables_Secret_Name_Input: inputGroup(
          generateInputGroup(
              '.env-variables-table .edit-row .table-cell__secret .input-wrapper:nth-of-type(1)',
          )
      ),
      Environment_Variables_Secret_Key_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body .input-row__item-secret .input-wrapper:nth-of-type(2)',
          true,
          true,
          true
        )
      ),
      Edit_Environment_Variables_Secret_Key_Input: inputGroup(
          generateInputGroup(
              '.env-variables-table .edit-row .table-cell__secret .input-wrapper:nth-of-type(2)',
          )
      ),
      Add_Row_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .btn-add:nth-of-type(1)'
      ),
      Discard_Row_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .btn-add:nth-of-type(2)'
      ),
      Demo_Discard_Row_Button: By.css(
          '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .variables-table__btn:nth-of-type(2)'
      ),
      Apply_Edit_Button: By.css('.env-variables-table .apply-edit-btn')
    },
    Schedule_For_Later: {
      Schedule_Button: By.css('.jobs-panel__schedule .btn__schedule'),
      Schedule_Days_Dropdown: dropdownComponent(generateDropdownGroup('.repeat_container .select:nth-of-type(1)')),
      Schedule_Time_Dropdown: dropdownComponent(generateDropdownGroup('.schedule-repeat .select')),
    },
    Access_Key_Checkbox: commonAccessKeyCheckbox,
    Access_Key_Input: commonAccessKeyInput,
    Schedule_For_Later_Button: By.css(
      '.new-item-side-panel__body .new-item-side-panel__buttons-container .btn-tertiary .data-ellipsis:nth-of-type(1)'
    ),
    Run_Now_Button: By.css(
      '.new-item-side-panel__body .new-item-side-panel__buttons-container .btn-secondary .data-ellipsis:nth-of-type(1)'
    ),
    Error_Message: By.css('.new-item-side-panel__buttons-container .error')
  },
  newFunction: {
    Cross_Close_Button: By.css('.new-item-side-panel .panel-title__btn_close'),
    General_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(1) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(1) .new-item-side-panel__expand-icon'
      ),
      Function_Name: By.css('.general__required-info .name span'),
      Function_Tag: By.css('.general__required-info .tag span'),
      Function_Runtime: By.css('.general__required-info .runtime span'),
      Function_Description_Input: textAreaGroup(
          generateTextAreaGroup(
              '.new-item-side-panel .accordion__container:nth-of-type(1) .accordion__body .panel-section__body .description',
              '.text-area__counter'
          )
      ),
      Labels_Table: commonTable(newFunctionLabelsTable)
    },
    Code_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(2) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(2) .new-item-side-panel__expand-icon'
      ),
      New_Function_Code_Entry_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .select',
          false,
          false,
          false
        )
      ),
      New_Function_Handler_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .handler.input-wrapper',
          true,
          true,
          true
        )
      ),
      New_Function_Default_Class_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .code__default-class .input-wrapper',
          true,
          true,
          true
        )
      ),
      Use_An_Existing_Image_Radiobutton: radiobuttonComponent({
        root:
          '.new-item-side-panel .accordion__container:nth-of-type(2) .radio-buttons__block .radio-buttons__content:nth-of-type(1)',
        elements: {
          radiobutton: 'label.radio-button input',
          mark: 'label.radio-button .checkmark',
          name: 'span.radio-button__label',
          description: 'span.radio-button__info'
        }
      }),
      Build_A_New_Image_Radiobutton: radiobuttonComponent({
        root:
          '.new-item-side-panel .accordion__container:nth-of-type(2) .radio-buttons__block .radio-buttons__content:nth-of-type(2)',
        elements: {
          radiobutton: 'label.radio-button input',
          mark: 'label.radio-button .checkmark',
          name: 'span.radio-button__label',
          description: 'span.radio-button__info'
        }
      }),
      New_Function_Image_Name_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .code__images-inputs .image-name.input-wrapper',
          true,
          true,
          true
        )
      ),
      New_Function_Resulting_Image_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .code__images-inputs .build-image.input-wrapper',
          true,
          true,
          true
        )
      ),
      New_Function_Base_Image_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .code__images-inputs .base-image.input-wrapper',
          true,
          true,
          true
        )
      ),
      New_Requirements_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .requirements.input-wrapper',
          true,
          true,
          true
        )
      ),
      New_Function_Build_Commands_Text_Area: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(2) .commands.text-area-wrapper .text-area'
      ),
      Force_Build_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(2) .code__force-build',
          true,
          false,
          false
        )
      )
    },
    Resources_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(3) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(3) .new-item-side-panel__expand-icon'
      ),
      Pods_Priority_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.functions-panel .resources .pods .panel-section__body',
          '[data-testid="select-header"]', 
          '.pop-up-dialog .select__item-label',
          '.data-ellipsis'
        )
      ),
      Volumes_Subheader: labelComponent(
        generateLabelGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(3) .panel-section:nth-of-type(3)',
          'h5',
          true
        )
      ),
      New_Function_Volume_Mount_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(3) .panel-section:nth-of-type(3) .panel-section__body .select.volume-mount',
          false,
          false,
          false
        )
      ),
      Volume_Paths_Table: commonTable(functionVolumePathsTable),
      // Volume Path inputs
      Volume_Paths_Table_Type_Dropdown: commonVolumePathsTableTypeDropdown,
      Volume_Paths_Table_Volume_Name_Input: inputGroup(
        resourcesTableCommonInput(3, 1, 2)
      ),
      Volume_Paths_Table_Path_Input: inputGroup(
        resourcesTableCommonInput(3, 1, 3)
      ),
      Volume_Paths_Table_Container_Input: inputGroup(
        resourcesTableCommonInput(3, 2, 1)
      ),
      Volume_Paths_Table_Config_Map_Input: inputGroup(
        resourcesTableCommonInput(3, 2, 1)
      ),
      Volume_Paths_Table_Secret_Name_Input: inputGroup(
        resourcesTableCommonInput(3, 2, 1)
      ),
      Volume_Paths_Table_Claime_Name_Input: inputGroup(
        resourcesTableCommonInput(3, 2, 1)
      ),
      Volume_Paths_Table_Access_Key_Input: inputGroup(
        resourcesTableCommonInput(3, 2, 2)
      ),
      Volume_Paths_Table_Resource_Path_Input: inputGroup(
        resourcesTableCommonInput(3, 3, 1)
      ),
      Edit_Volume_Name_Input: inputGroup(generateInputGroup('.volumes-table .edit-row:not(.no-border_top) .table__cell-input:nth-of-type(2)')),
      Edit_Volume_Path_Input: inputGroup(generateInputGroup('.volumes-table .edit-row:not(.no-border_top) .table__cell-input:nth-of-type(3)')),
      Add_New_Row_Button: commonAddNewRowButton,
      Delete_New_Row_Button: commonDeleteNewRowButton,
      Apply_Edit_Button: By.css('.volumes-table .apply-edit-btn'),
      // Number input groups
      Memory_Request_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(3) .resources__inputs .memory .resources__input:nth-of-type(1) .select',
          '.select__value',
          '.select__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      Memory_Request_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(3) .resources__inputs .memory .resources__input:nth-of-type(1) .range-dense',
          {
            inc_btn: '.range__buttons button[class*=increase]',
            dec_btn: '.range__buttons button[class*=decrease]'
          },
          true,
          false,
          true
        )
      ),
      Memory_Limit_Dropdown: dropdownComponent(
          generateDropdownGroup(
              '.new-item-side-panel .accordion__container:nth-of-type(3) .resources__inputs .memory .resources__input:nth-of-type(2) .select',
              '.select__value',
              '.select__body .select__item',
              '.data-ellipsis .data-ellipsis'
          )
      ),
      Memory_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(3) .resources__inputs .memory .resources__input:nth-of-type(2) .range-dense',
          false,
          true,
          false,
          true
        )
      ),
      CPU_Request_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(3) .resources__inputs .cpu .resources__input:nth-of-type(1) .select',
          '.select__value',
          '.select__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      CPU_Request_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(3) .resources__inputs .cpu .resources__input:nth-of-type(1) .range-dense',
          false,
          true,
          false,
          true
        )
      ),
      CPU_Limit_Dropdown: dropdownComponent(
          generateDropdownGroup(
              '.new-item-side-panel .accordion__container:nth-of-type(3) .resources__inputs .cpu .resources__input:nth-of-type(2) .select',
              '.select__value',
              '.select__body .select__item',
              '.data-ellipsis .data-ellipsis'
          )
      ),
      CPU_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(3) .resources__inputs .cpu .resources__input:nth-of-type(2) .range-dense',
          false,
          true,
          false,
          true
        )
      ),
      GPU_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(3) .resources__inputs .section-gpu .range-dense',
          false,
          true,
          false,
          true
        )
      )
    },
    Environment_Variables_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(4) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(4) .new-item-side-panel__expand-icon'
      ),
      Function_Environment_Variables_Table: commonTable(
        functionEnvironmentVariablesTable
      ),
      Function_Environment_Variables_Demo_Table: commonTable(
        functionEnvironmentVariablesDemoTable
      ),
      Function_Environment_Variables_Name_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body .input-row-wrapper .input-wrapper:nth-of-type(1)',
          true,
          false,
          true
        )
      ),
      Edit_Function_Environment_Variables_Name_Input: inputGroup(
          generateInputGroup(
              '.env-variables-table .edit-row .table-cell__key'
          )
      ),
      Function_Environment_Variables_Type_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body .input-row-wrapper .select',
          false,
          false,
          false
        )
      ),
      Edit_Function_Environment_Variables_Type_Dropdown: dropdownComponent(
          generateDropdownGroup(
              '.env-variables-table .edit-row .table-cell__type .select',
          )
      ),
      Function_Environment_Variables_Value_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body .input-row-wrapper .input-wrapper:nth-of-type(3)',
          true,
          false,
          true
        )
      ),
      Edit_Function_Environment_Variables_Value_Input: inputGroup(
          generateInputGroup(
              '.env-variables-table .edit-row .table-cell__value',
          )
      ),
      Function_Environment_Variables_Secret_Name_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body .input-row__item-secret .input-wrapper:nth-of-type(1)',
          true,
          true,
          true
        )
      ),
      Edit_Function_Environment_Variables_Secret_Name_Input: inputGroup(
          generateInputGroup(
              '.env-variables-table .edit-row .table-cell__secret .input-wrapper:nth-of-type(1)',
          )
      ),
      Function_Environment_Variables_Secret_Key_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body .input-row__item-secret .input-wrapper:nth-of-type(2)',
          true,
          true,
          true
        )
      ),
      Edit_Function_Environment_Variables_Secret_Key_Input: inputGroup(
          generateInputGroup(
              '.env-variables-table .edit-row .table-cell__secret .input-wrapper:nth-of-type(2)',
          )
      ),
      Add_Row_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body .variables-table__btn.btn-add'
      ),
      Discard_Row_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(4) .panel-section__body .env-variables-table .table__body button[class=variables-table__btn]'
      ),
      Apply_Edit_Button: By.css('.env-variables-table .apply-edit-btn'),
    },
    Serving_Runtime_Configuration_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(5) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(5) .new-item-side-panel__expand-icon'
      ),
      Topology_Router_Type_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .topology .select',
          false,
          false,
          false
        )
      ),
      Serving_Runtime_Configuration_Model_Table: commonTable(
        servingRuntimeConfigurationModelTable
      ),
      Model_Table_Name_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .topology .model-table .table__body-column .input-wrapper:nth-of-type(1)',
          true,
          false,
          true
        )
      ),
      Edit_Model_Table_Name_Input: inputGroup(
          generateInputGroup(
              '.model-table .edit-row .table__cell:nth-of-type(1)'
          )
      ),
      Model_Table_Class_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .topology .model-table .table__body-column .input-wrapper:nth-of-type(2)',
          true,
          false,
          true
        )
      ),
      Edit_Model_Table_Class_Input: inputGroup(
          generateInputGroup(
              '.model-table .edit-row .table__cell:nth-of-type(2)'
          )
      ),
      Model_Table_Path_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .topology .model-table .table__body-column .input-wrapper:nth-of-type(3)',
          true,
          false,
          true
        )
      ),
      Edit_Model_Table_Path_Input: inputGroup(
          generateInputGroup(
              '.model-table .edit-row .table__cell:nth-of-type(3)'
          )
      ),
      Add_Model_Table_Row_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(5) .topology .model-table .btn-add'
      ),
      Discard_Model_Table_Row_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(5) .topology .model-table button:nth-of-type(2)'
      ),
      Apply_Edit_Button: By.css('.new-item-side-panel .accordion__container:nth-of-type(5) .apply-edit-btn'),
      Model_Tracking_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .topology .checkbox.topology__model-tracking',
          true,
          false,
          false
        )
      ),
      Secrets_Runtime_Configuration_Table: commonTable(
        secretRuntimeConfigurationTable
      ),
      Secrets_Table_Value_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .secrets .secrets__table .table-row .input-wrapper',
          true,
          false,
          true
        )
      ),
      Apply_Secrets_Table_Row_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(5) .secrets .secrets__table .table-cell__actions [data-testid="key-value-table-apply"]'
      ),
      Stream_Path_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .advanced .panel-section__body > .input-wrapper',
          true,
          true,
          true
        )
      ),
      Parameters_Runtime_Configuration_Table: commonTable(
        parametersRuntimeConfigurationTable
      ),
      Parameters_Table_Name_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .advanced .panel-section__body .table__body .input-row-wrapper .input-wrapper:nth-of-type(1)',
          true,
          false,
          true
        )
      ),
      Edit_Parameters_Table_Name_Input: inputGroup(
          generateInputGroup(
              '.parameters-table .edit-row .table__cell:nth-of-type(1)',

          )
      ),
      Parameters_Table_Type_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .advanced .panel-section__body .table__body .input-row-wrapper .select',
          false,
          false,
          false
        )
      ),
      Edit_Parameters_Table_Type_Dropdown: dropdownComponent(
          generateDropdownGroup(
              '.parameters-table .edit-row .table__cell:nth-of-type(2) .select'
          )
      ),
      Parameters_Table_Value_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .advanced .panel-section__body .table__body .input-row-wrapper .input-wrapper:nth-of-type(3)',
          true,
          false,
          true
        )
      ),
      Edit_Parameters_Table_Value_Input: inputGroup(
          generateInputGroup(
              '.parameters-table .edit-row .table__cell:nth-of-type(3)'
          )
      ),
      Parameters_Table_Value_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .advanced .panel-section__body .table__body .input-row-wrapper .range.range-normal',
          false,
          true,
          false,
          true
        )
      ),
      Parameters_Table_Value_Checkbox: checkboxComponent(
        generateCheckboxGroup(
          '.new-item-side-panel .accordion__container:nth-of-type(5) .advanced .panel-section__body .table__body .input-row-wrapper .checkbox',
          true,
          false,
          false
        )
      ),
      Add_Parameter_Table_Row_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(5) .advanced .panel-section__body .table__body .parameters-table__btn.btn-add'
      ),
      Remove_Parameter_Table_Row_Button: By.css(
        '.new-item-side-panel .accordion__container:nth-of-type(5) .advanced .panel-section__body .table__body button[class=parameters-table__btn]'
      )
    },
    Access_Key_Checkbox: commonAccessKeyCheckbox,
    Access_Key_Input: commonAccessKeyInput,
    Cancel_Button: By.css(
      '.new-item-side-panel .new-item-side-panel__buttons-container .btn-label'
    ),
    Save_Button: By.css(
      '.new-item-side-panel .new-item-side-panel__buttons-container .btn-tertiary' 
    ),
    Deploy_Button: By.css(
      '.new-item-side-panel .new-item-side-panel__buttons-container .btn-secondary' 
    ),
    Create_Button: By.css(
      '.new-item-side-panel .new-item-side-panel__buttons-container .btn-secondary' 
    )
  }
}
