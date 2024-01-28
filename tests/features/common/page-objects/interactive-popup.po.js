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
import dropdownComponent from '../components/dropdown.component'
import commonTable from '../components/table.component'
import labelComponent from '../components/label.component'
import checkboxComponent from '../components/checkbox.component'
import textAreaGroup from '../components/text-area.component'
import comboBox from '../components/combo-box.component'
import numberInputGroup from '../components/number-input-group.component'
import actionMenu from '../components/action-menu.component'

import {
  generateLabelGroup,
  generateNumberInputGroup,
  generateInputGroup,
  generateDropdownGroup,
  generateTextAreaGroup
} from '../../common-tools/common-tools'
import inputWithAutocomplete from '../components/input-with-autocomplete.component'

const { By } = require('selenium-webdriver')

const memberOverviewLabelsTable = {
  root: '.settings__members',
  header: {},
  body: {
    row: {
      root: '.info-row',
      fields: {
        editors: '.members-overview .member-overview:nth-of-type(1) .member-count',
        viewers: '.members-overview .member-overview:nth-of-type(2) .member-count',
        admins: '.members-overview .member-overview:nth-of-type(3) .member-count'
      }
    }
  }
}

const membersTable = {
  root: '.members-table',
  header: {},
  body: {
    root: '.table-body',
    offset: 0,
    row: {
      root: '.table-row',
      fields: {
        name: '.member-name',
        role: '.member-roles .select__value',
        role_dropdown: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup('.member-roles .select', false, false, false)
        },
        delete_btn: '.member-actions button'
      }
    }
  }
}

const inviteNewMemberLabelTable = {
  root: '.invite-new-members',
  header: {},
  body: {
    root: '.chips-input-container',
    add_row_btn: '.new-member-btn .btn-secondary',
    row: {
      root: '.chip',
      fields: {
        label: '.chip__label',
        remove_btn: '.item-icon-close'
      }
    }
  }
}

const deployModelTable = {
  root: '.deploy-model .form-key-value-table',
  header: {
    root: '.table-row__header ',
    sorters: {
      name: '.table-cell__inputs-wrapper .table-cell__key',
      value: '.table-cell__inputs-wrapper .table-cell__value'
    }
  },
  body: {
    offset: 0,
    add_row_btn: 'button',
    row: {
      root: '.table-row',
      fields: {
        name: '.table-cell__key .data-ellipsis',
        value: '.table-cell__value .data-ellipsis',
        edit_btn: '.key-value-table__btn:nth-of-type(1)',
        delete_btn: '.key-value-table__btn:nth-of-type(2)'
      }
    }
  }
}

const artifactsPreviewHeader = {
  root: '.pop-up-dialog .preview-body',
  header: {
    root: '',
    sorters: {}
  },
  body: {
    row: {
      root: '.preview-item',
      fields: {
        name: '.item-data__name',
        path: '.item-data__path',
        size: '.item-data:nth-of-type(3)',
        data: '.item-data:nth-of-type(4)',
        download_btn: '.preview-body__download'
      }
    }
  }
}

const createFeatureVectorLabelsTable = {
  root: '.new-feature-vector__labels-row .chips-cell',
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

const artifactsLabelsTable = {
  root: '.modal',
  header: {},
  body: {
    root: '.chips-wrapper',
    add_row_btn: 'button.button-add',
    row: {
      root: '.chip-block',
      fields: {
        key_input: 'input.input-label-key',
        value_input: 'input.input-label-value',
        key_verify: '.edit-chip-container input.input-label-key',
        value_verify: '.edit-chip-container input.input-label-value',
        remove_btn: '.edit-chip__icon-close'
      }
    }
  }
}

const labelsTable = {
  root:
    '.job-wizard__run-details .form-row:nth-of-type(4) .chips',
  header: {},
  body: {
    root: '.chips-wrapper',
    add_row_btn: '.button-add',
    row: {
      root: '.chip-block',
      fields: {
        key_input: 'input.input-label-key',
        value_input: 'input.input-label-value',
        key_verify: '.edit-chip-container input.input-label-key',
        value_verify: '.edit-chip-container input.input-label-value',
        remove_btn: '.edit-chip__icon-close'
      }
    }
  }
}

const newProjectLabelsTable = {
  root:
    '.create-project-dialog .form-row:nth-of-type(4) .chips',
  header: {},
  body: {
    root: '.chips-wrapper',
    add_row_btn: '.button-add',
    row: {
      root: '.chip-block',
      fields: {
        key_input: 'input.input-label-key',
        value_input: 'input.input-label-value',
        key_verify: '.edit-chip-container input.input-label-key',
        value_verify: '.edit-chip-container input.input-label-value',
        remove_btn: '.edit-chip__icon-close'
      }
    }
  }
}

const dataInputsHeaders = {
  root: '.wizard-form__content [data-testid="dataInputs.dataInputsTable"]',  
  header: {},
  body: {
    root: '.form-table__header-row', 
    row: {
      root: '.form-table__cell',
      fields: {
        key: 'div'
      }
    }
  }
}

const parametersHeaders = {
  root: '.wizard-form__content [data-testid="parameters.parametersTable"]',  
  header: {},
  body: {
    root: '.form-table__header-row', 
    row: {
      root: '.form-table__cell',
      fields: {
        key: 'div'
      }
    }
  }
}

const podsPriorityDropdown = dropdownComponent(
  generateDropdownGroup(
    '.modal__content .modal__body .job-wizard__resources .resources__select',
    '.form-field-select .form-field__wrapper-normal', 
    '.options-list__body .select__item-label',
    '.data-ellipsis'
  )
)

const resourcesNodeSelectorTable = {
  root:
    '.wizard-form__content [data-testid="resources.nodeSelectorTable"]',
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

const actionMenuStructure = {
  root: '.table__cell-actions',
  menuElements: {
    open_button: 'button',
    options: '.actions-menu__body .data-ellipsis'
  }
}

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

const dataInputsTable = {
  root: '.wizard-form__content [data-testid="dataInputs.dataInputsTable"]',
  header: {},
  body: {
    add_row_btn: '.form-table__action-row button',
    row: {
      root: '.form-table__row',
      fields: {
        name_verify: '.form-table__name-cell',
        edit_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(1)',
        apply_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(1)',
        delete_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(2)',
        name_input: '.form-field-input input',
        path_dropdown: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.form-table__cell_1:nth-of-type(3) .form-field-combobox', 
            '.form-field__icons:nth-of-type(1)', 
            '.form-field-combobox__dropdown-list-option', 
            false, 
            false)  
        },
        path_input: 'input.form-field-combobox__input',
        path_verify: '.form-table__cell_1:nth-of-type(3)' 
      }
    }
  }
}

const parametersTable = {
  root: '.wizard-form__content [data-testid="parameters.parametersTable"]',
  header: {},
  body: {
    add_row_btn: '.form-table__action-row button',
    row: {
      root: '.form-table__row',
      fields: {
        name_verify: '.form-table__cell_2',
        edit_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(1)',
        apply_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(1)',
        delete_btn: '.form-table__actions-cell .round-icon-cp:nth-of-type(2)',
        name_input: '.form-table__cell_2 .form-field-input input',
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
        value_verify: '.form-table__cell_3 .data-ellipsis' 
      }
    }
  }
}

const advancedEnvironmentVariablesTable = {
  root: '.wizard-form__content [data-testid="advanced.environmentVariablesTable"]',
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

// Common components

const commonCancelButton = By.css('.pop-up-dialog button.pop-up-dialog__btn_cancel')

const commonDeleteButton = By.css('.pop-up-dialog .btn-danger')

const commonDescription = By.css('.pop-up-dialog .confirm-dialog__message')

const commonCrossCancelButton = By.css('.pop-up-dialog .pop-up-dialog__btn_close svg')
const commonNameInput = generateInputGroup(
  '.form [data-testid="metadata.key-form-field-input"] .form-field__wrapper-normal',
  true,
  '.form-field__warning',
  '.form-field__warning'
)

const commonTagInput = generateInputGroup(
  '.form [data-testid="metadata.tag-form-field-input"] .form-field__wrapper-normal',
  true,
  true,
  '.form-field__warning'
)

const commonDescriptionTextArea = generateTextAreaGroup(
  '.form .form-row:nth-of-type(3) .form-field-textarea',
  '.form-field__counter'
)

const commonConfirmButton = By.css('.pop-up-dialog .btn.btn-primary')

const commonTitle = By.css('.pop-up-dialog .pop-up-dialog__header-text')

const commonPopupTitle = By.css('.modal__header-title')
const commonCloseButton = By.css('.modal__header-button button')
const commonFormCancelButton = By.css('.modal__footer-actions .btn-tertiary')
const commonFormConfirmButton = By.css('.modal__footer-actions .btn-secondary')
const commonRegisterErrorMessage = By.css('[data-testid="error-message"] .error__message')
const commonFormText = By.css('.form-text span')
const commonFormSubtext = By.css('.form-text div p')
const commonScheduleButton = By.css('.modal__content [data-testid="schedule-btn"]')
const commonRunSaveButton = By.css('.modal__content [data-testid="run-btn"]')

const commonLabelFilterInput = inputGroup(
  generateInputGroup(
    '#overlay_container .form-field__wrapper',
    true,
    false,
    true
  )
)

const commonTableTreeFilterDropdown = dropdownComponent(
  generateDropdownGroup(
    '#overlay_container .form-tag-filter .form-tag-filter__input-wrapper',
    '.form-tag-filter__dropdown-button',
    '.form-tag-filter__dropdown .form-tag-filter__dropdown-item'
  )
)

module.exports = {
  createNewProject: {
    Title: commonTitle,
    Name_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog [data-testid="name-form-field-input"]',
        true,
        '.input__warning svg',
        true
      )
    ),
    Description_Input: textAreaGroup(
      generateTextAreaGroup('.pop-up-dialog .form-row:nth-of-type(3) .form-field-textarea')
    ),
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Create_Button: By.css('.pop-up-dialog .btn-secondary'),
    Error_Message: By.css('.pop-up-dialog .error__message'),
    New_Project_Labels_Table: commonTable(newProjectLabelsTable),
    Add_Label_Button: By.css('.create-project-dialog .form-row:nth-of-type(4) .chips .chips-wrapper button'),
    Close_Label_Button: By.css('.create-project-dialog .form-row:nth-of-type(4) .chips .chips-wrapper .edit-chip__icon-close'),
    Run_Details_Labels_Key: inputGroup(
      generateInputGroup(
        '.create-project-dialog .form-row:nth-of-type(4) .chips .chips-wrapper',
        false,
        true,
        '.pop-up-dialog'
      )
    ),
    Run_Details_Labels_Value: By.css ('.create-project-dialog .form-row:nth-of-type(4) .chips-wrapper [id="labels[0].value"]')
  },
  commonPopup: {
    Title: commonTitle,
    Description: commonDescription,
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Confirm_Button: By.css('.confirm-dialog__btn-container button:not(.pop-up-dialog__btn_cancel)'),
    Delete_Button: commonDeleteButton
  },
  modalWizardForm:{
    Title: By.css('.modal .modal__header-title'),
    Cross_Cancel_Button: By.css('.modal .modal__header-button'),
    Function_Title: By.css(
      '.modal .modal__content h6.modal__header-sub-title'
    ),
    Hyperparameter_Checkbox: checkboxComponent({
      root: '#overlay_container .form-field-checkbox',
      elements: {
        checkbox: 'input', 
        name: 'label',
        icon: ''
      }
    }),
    Next_Button: By.css('.modal__content [data-testid="wizard-btn-next"]'),
    Back_Button: By.css('.modal__content [data-testid="wizard-btn-back"]'),
    Run_Training_Now_Button: commonRunSaveButton,
    Schedule_Training_Job_Button: commonScheduleButton,
    Schedule_For_Later_Button: commonScheduleButton,
    Save_Button: commonRunSaveButton,
    Run_Name_Input: inputGroup(
      generateInputGroup(
        '.form-row .form-field-input .form-field__wrapper',
        false,
        true,
        '.form-field__icons svg'
      )
    ),
    Version_Tag_Dropdown: By.css('[data-testid="runDetails.version-form-field-select"] [data-testid="select-header"]'),
    Handler_Dropdown: dropdownComponent(
      generateDropdownGroup('.form-col-1:nth-of-type(3)', '[data-testid="runDetails.handler-form-field-select"]', '.select__item-main-label', false, false)
    ),
    Handler_Edit_Job: By.css('.form-col-1:nth-of-type(2) [data-testid="runDetails.handler-form-input"]'),
    Labels_Table: commonTable(labelsTable),
    Add_Label_Button: By.css('.job-wizard__run-details .form-row:nth-of-type(4) .chips .chips-wrapper .button-add'),
    Run_Details_Labels_Key: inputGroup(
      generateInputGroup(
        '.job-wizard__run-details .form-row:nth-of-type(4) .chips-wrapper',
        false,
        true,
        '.pop-up-dialog'
      )
    ),
    Run_Details_Labels_Value: By.css ('.job-wizard__run-details .form-row:nth-of-type(4) .chips-wrapper [id="runDetails.labels[0].value"]'),
    Close_Label_Button: By.css('.job-wizard__run-details .form-row:nth-of-type(4) .chips .chips-wrapper .edit-chip__icon-close'),
    Image_Name_Input_Run_Details: inputGroup(
      generateInputGroup(
        '.job-wizard__run-details > div.form-field-input .form-field__wrapper',
        true,
        false,
        '.form-field__warning svg'
      )
    ),
    Image_Name_Text_Run_Details: By.css('.job-wizard__run-details .warning-text'),
    Data_Inputs_Headers: commonTable(dataInputsHeaders),
    Data_Inputs_Table: commonTable(dataInputsTable),
    Parameters_Headers: commonTable(parametersHeaders),
    Parameters_Table: commonTable(parametersTable),
    Resources_Accordion: {
      Pods_Priority_Dropdown: podsPriorityDropdown,
      Node_Selection_Subheader: By.css('  .modal__content .wizard-form__content-container .job-wizard__resources .form-row:nth-child(3)'),
      Volumes_Subheader: labelComponent(
        generateLabelGroup(
          '.modal__content .wizard-form__content-container .form-row:nth-child(6)',
          false,
          true
        )
      ),
      // Volume Path inputs
      Volume_Paths_Table_Type_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.form-table__volume-row .form-table__volume-cell:nth-of-type(1) .form-field__wrapper .form-field__select',
          '.form-field__select-value',
          '.options-list__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      Volume_Paths_Table_Volume_Name_Input: inputGroup(
        generateInputGroup(
          '.form-table__volume-row .form-table__volume-cell:nth-of-type(2) .form-field__wrapper',
          true,
          true,
          '.form-field__warning svg'
        )
      ),
      Volume_Paths_Table_Path_Input: inputGroup(
        generateInputGroup(
          '.form-table__volume-row .form-table__volume-cell:nth-of-type(3) .form-field__wrapper',
          true,
          true,
          '.form-field__warning svg'
        )
      ),
      Volume_Paths_Table_Container_Input: inputGroup(
        generateInputGroup(
          '.form-table__volume-row .form-table__volume-cell:nth-of-type(4) .form-field__wrapper',
          true,
          true,
          true
        )
      ),
      Volume_Paths_Table_Config_Map_Input: inputGroup(
        generateInputGroup(
          '.form-table__volume-row .form-table__volume-cell:nth-of-type(4) .form-field__wrapper',
          true,
          true,
          '.form-field__warning svg'
        )
      ),
      Volume_Paths_Table_Secret_Name_Input: inputGroup(
        generateInputGroup(
          '.form-table__volume-row .form-table__volume-cell:nth-of-type(4) .form-field__wrapper',
          true,
          true,
          '.form-field__warning svg'
        )
      ),
      Volume_Paths_Table_Claime_Name_Input: inputGroup(
        generateInputGroup(
          '.form-table__volume-row .form-table__volume-cell:nth-of-type(4) .form-field__wrapper',
          true,
          true,
          '.form-field__warning svg'
        )
      ),
      Volume_Paths_Table_Access_Key_Input: inputGroup(
        generateInputGroup(
          '.form-table__volume-row .form-table__volume-cell:nth-of-type(5) .form-field__wrapper',
          true,
          true,
          '.form-field__warning svg'
        )
      ),
      Volume_Paths_Table_Resource_Path_Input: inputGroup(
        generateInputGroup(
          '.form-table__volume-row .form-table__volume-cell:nth-of-type(6) .form-field__wrapper',
          true,
          true,
          true
        )
      ),
      Edit_Volume_Name_Input: inputGroup(generateInputGroup('.volumes-table .edit-row:not(.no-border_top) .table__cell-input:nth-of-type(2)')),
      Edit_Volume_Path_Input: inputGroup(generateInputGroup('.volumes-table .edit-row:not(.no-border_top) .table__cell-input:nth-of-type(3)')),
      Add_New_Row_Button: By.css('[data-testid="resources.volumesTable"] .form-table__actions-cell .round-icon-cp:nth-of-type(1)'),
      Delete_New_Row_Button: By.css('[data-testid="resources.volumesTable"] .form-table__actions-cell .round-icon-cp:nth-of-type(2)'),
      Apply_Edit_Button: By.css('.volumes-table .apply-edit-btn'),
      Volume_Paths_Table: commonTable(volumePathsTable),
      Memory_Request_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.wizard-form__content-container .resources-units .form-col-1:nth-of-type(1) .resources-card__fields:nth-child(2)',
          '.resources-card__fields-select',
          '.options-list__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      Memory_Request_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.wizard-form__content-container .resources-units .form-col-1:nth-of-type(1) .resources-card__fields:nth-child(2) .form-field-input',
          {
            inc_btn: '.range__buttons button[class*=increase]',
            dec_btn: '.range__buttons button[class*=decrease]'
          },
          true,
          false,
          '.form-field__icons svg'
        )
      ),
      Memory_Limit_Dropdown: dropdownComponent(
          generateDropdownGroup(
              '.wizard-form__content-container .resources-units .form-col-1:nth-of-type(1) .resources-card__fields:nth-child(3)',
              '.resources-card__fields-select',
              '.options-list__body .select__item',
              '.data-ellipsis .data-ellipsis'
          )
      ),
      Memory_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.wizard-form__content-container .resources-units .form-col-1:nth-of-type(1) .resources-card__fields:nth-child(3) .form-field-input',
          false,
          true,
          false,
          '.form-field__icons svg'
        )
      ),
      CPU_Request_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.wizard-form__content-container .resources-units .form-col-1:nth-of-type(2) .resources-card__fields:nth-child(2)',
          '.resources-card__fields-select',
          '.options-list__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      CPU_Request_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.wizard-form__content-container .resources-units .form-col-1:nth-of-type(2) .resources-card__fields:nth-child(2) .form-field-input',
          false,
          true,
          false,
          '.form-field__icons svg'
        )
      ),
      CPU_Limit_Dropdown: dropdownComponent(
          generateDropdownGroup(
              '.wizard-form__content-container .resources-units .form-col-1:nth-of-type(2) .resources-card__fields:nth-child(3)',
              '.resources-card__fields-select',
              '.options-list__body .select__item',
              '.data-ellipsis .data-ellipsis'
          )
      ),
      CPU_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.wizard-form__content-container .resources-units .form-col-1:nth-of-type(2) .resources-card__fields:nth-child(3) .form-field-input',
          false,
          true,
          false,
          '.form-field__icons svg'
        )
      ),
      GPU_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.wizard-form__content-container .resources-units .form-col-1:nth-of-type(3) .resources-card__fields .form-field-input',
          false,
          true,
          false,
          '.form-field__icons svg'
        )
      ),
      Resources_Node_Selector_Table: commonTable(resourcesNodeSelectorTable)
    },
    Accordion_Subheader: By.css('.modal__body .job-wizard__advanced .form-table-title'),
    Advanced_Environment_Variables_Table: commonTable(advancedEnvironmentVariablesTable)
  },
  trainModel:{
    Ranking_Subheader: By.css('.job-wizard__hyperparameter-strategy .ranking-title-grid-item'),
    Ranking_Result_Input: inputGroup(
      generateInputGroup(
        '.job-wizard__hyperparameter-strategy .result-grid-item .form-field-input .form-field__wrapper',
        false,
        true,
        false
      )
    ),
    Ranking_Criteria_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.job-wizard__hyperparameter-strategy .criteria-grid-item', 
        '[data-testid="hyperparameterStrategy.criteria-form-field-select"]', 
        '.options-list .select__item', 
        false, 
        false
      )
    ),
    Stop_Condition_Subheader: By.css('.job-wizard__hyperparameter-strategy .stop-condition-title-grid-item'),
    Stop_Condition_Input: inputGroup(
      generateInputGroup(
        '.job-wizard__hyperparameter-strategy .stop-condition-grid-item .form-field__control',
        false,
        true,
        false
      )
    ),
    Parallelism_Subheader: By.css('.job-wizard__hyperparameter-strategy .parallelism-title-grid-item'),
    Parallel_Runs_Number_Input: numberInputGroup(
      generateNumberInputGroup(
        '.job-wizard__hyperparameter-strategy .parallel-runs-grid-item .form-field-input',
        false,
        true,
        false,
        false
      )
    ),
    Dask_Clutter_URL_Input: inputGroup(
      generateInputGroup(
        '.job-wizard__hyperparameter-strategy .dask-cluster-uri-grid-item .form-field__control',
        false,
        true,
        false
      )
    ),
    Teardown_Checkbox: checkboxComponent({
      root: '.job-wizard__hyperparameter-strategy .teardown-dask-grid-item .form-field-checkbox',
      elements: {
        checkbox: 'input', 
        name: 'label',
        icon: ''
      }
    })
  },
  registerDataset: {
    Title: commonPopupTitle,
    Form_Text: commonFormText,
    Form_Subtext: commonFormSubtext,
    Cross_Cancel_Button: commonCloseButton,
    Name_Input: inputGroup(commonNameInput),
    Tag_Input: inputGroup(commonTagInput),
    Target_Path: {
      Path_Scheme_Combobox: comboBox(
        '.form .form-row:nth-of-type(4) .form-field__wrapper',
        true
      )
    },
    Description_Input: textAreaGroup(commonDescriptionTextArea),
    Cancel_Button: commonFormCancelButton,
    Register_Button: commonFormConfirmButton,
    Register_Error_Message: commonRegisterErrorMessage
  },
  createMLFunctionPopup: {
    Cross_Cancel_Button: commonCrossCancelButton,
    Title: commonTitle,
    New_Function_Name_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .new-function__pop-up-inputs .name.input-wrapper',
        true,
        '.input__warning svg',
        true
      )
    ),
    New_Function_Tag_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .new-function__pop-up-inputs .tag.input-wrapper',
        true,
        '.input__warning svg',
        true
      )
    ),
    New_Function_Runtime_Dropdown: dropdownComponent(
      generateDropdownGroup('.pop-up-dialog .select', false, false, false)
    ),
    Cancel_Button: commonCancelButton,
    Continue_Button: commonConfirmButton
  },
  registerFilePopup: {
    Title: commonPopupTitle,
    Form_Text: commonFormText,
    Form_Subtext: commonFormSubtext,
    Cross_Cancel_Button: commonCloseButton,
    New_File_Info: By.css('.form-text'),
    New_File_Name_Input: inputGroup(commonNameInput),
    Tag_Input: inputGroup(commonTagInput),
    Register_Error_Message: commonRegisterErrorMessage,
    Target_Path: {
      Path_Scheme_Combobox: comboBox(
        '.form .form-row:nth-of-type(4) .form-field__wrapper',
        true
      )
    },
    New_File_Description_Input: textAreaGroup(commonDescriptionTextArea),
    New_File_Type_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.form .form-row:nth-of-type(2) .form-field-select',
        '.form-field__select',
        '.select__item'
      )
    ),
    Cancel_Button: commonFormCancelButton,
    Register_Button: commonFormConfirmButton
  },
  RegisterModelModal: {
    Title: commonPopupTitle,
    Cross_Cancel_Button: commonCloseButton,
    New_File_Name_Input: inputGroup(
      generateInputGroup(
        '.modal__body .form-row:nth-of-type(1) .form-field__wrapper-normal',
        true,
        true,
        '.form-field__warning'
      )
    ),
    Target_Path: {
      Path_Scheme_Combobox: comboBox(
        '.form .form-row:nth-of-type(3) .form-field__wrapper',
        true
      )
    },
    New_File_Description_Input: textAreaGroup(
      generateTextAreaGroup(
        '.modal__body .form-row:nth-of-type(2) .form-field-textarea',
        '.form-field__counter'
      )
    ),
    Labels_Table: commonTable(artifactsLabelsTable),
    Cancel_Button: commonFormCancelButton,
    Register_Button: commonFormConfirmButton
  },
  deployModelPopup: {
    Title: commonPopupTitle,
    Cross_Cancel_Button: commonCloseButton,
    Serving_Function_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.modal__body .form-col-2 .form-field-select',
        '.form-field__select-value',
        '.select__item'
      )
    ),
    Tag_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.modal__body .form-col-1 .form-field-select',
        '.form-field__select-value',
        '.select__item'
      )
    ),
    Model_Name_Input: inputGroup(
      generateInputGroup(
        '.modal__body .form-row:nth-of-type(2) .form-field-input .form-field__wrapper-normal',
        true,
        true,
        '.form-field__warning'
      )
    ),
    Class_Name_Input: inputGroup(
      generateInputGroup(
        '.modal__body .form-row:nth-of-type(1) .form-field-input .form-field__wrapper-normal',
        true,
        false,
        '.form-field__warning'
      )
    ),
    Deploy_Model_Table: {
      Key_Value_Table: commonTable(deployModelTable),
      Class_Argument_Name_Input: inputGroup(
        generateInputGroup(
          '.deploy-model .table-row_edit .table-cell__key',
          true,
          false,
          '.form-field__warning'
        )
      ),
      Class_Argument_Value_Input: inputGroup(
        generateInputGroup(
          '.deploy-model .table-row_edit .table-cell__value',
          true,
          false,
          '.form-field__warning'
        )
      ),
      Add_New_Row_Button: By.css(
        '.deploy-model .table-row_edit .table-cell__actions .key-value-table__btn:nth-of-type(1)'
      ),
      Delete_New_Row_Button: By.css(
        '.deploy-model .table-row_edit .table-cell__actions .key-value-table__btn:nth-of-type(2)'
      )
    },
    Cancel_Button: commonFormCancelButton,
    Deploy_Button: commonFormConfirmButton
  },
  viewYamlPopup: {
    Title: By.css('.pop-up-dialog .pop-up-dialog__header'),
    Cross_Cancel_Button: commonCrossCancelButton,
    YAML_Modal_Container: By.css('.pop-up-dialog .yaml-modal-container pre')
  },
  deleteConfirmPopup: {
    Title: By.css('.pop-up-dialog .pop-up-dialog__header'),
    Cross_Cancel_Button: commonCrossCancelButton,
    Confirm_Dialog_Message: By.css('.confirm-dialog .confirm-dialog__message'),
    Cancel_Button: By.css('.confirm-dialog .pop-up-dialog__btn_cancel'),
    Delete_Button: By.css('.confirm-dialog .btn-danger')
  },
  previewPopup:{
    Title: By.css('.pop-up-dialog .pop-up-dialog__header'),
    Cross_Cancel_Button: commonCrossCancelButton,
    Preview_Modal_Container: By.css('.pop-up-dialog .item-artifacts__modal-preview'),
    Download_Button: By.css('.pop-up-dialog .preview-item .preview-body__download')
  },
  changeProjectOwnerPopup: {
    Cross_Cancel_Button: commonCrossCancelButton,
    Title: commonTitle,
    Owner_Name: By.css('.settings__owner .row-name'),
    Search_Input_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.pop-up-dialog .members-list',
        '.input-wrapper .input', //open component subLocator
        '.member-row', // options sublocator
        '.member-name' // option name subLocator
      )
    ),
    Search_Input: inputWithAutocomplete({
      root: '.owner-table .search-input',
      elements: {
        input: '.input-wrapper .input',
        options: '.search-dropdown',
        option_name: '.member-name'
      }
    }),
    Discard_Button: By.css('.apply-discard-buttons .pop-up-dialog__btn_cancel'),
    Apply_Button: By.css('.apply-discard-buttons button.btn-secondary')
  },
  projectMembersPopup: {
    Cross_Cancel_Button: commonCrossCancelButton,
    Title: commonTitle,
    Member_Overview_Labels_Table: commonTable(memberOverviewLabelsTable),
    Member_Overview_Tooltip: labelComponent(
      generateLabelGroup(
        '.members-overview', // root
        '', // empty sublocator
        true // for single hint
      )
    ),
    Members_Summary: By.css('.settings__members-summary'),
    Invite_New_Members_Button: By.css('.info-row .invite-new-members-btn'),
    Invite_New_Members_Labels_Table: commonTable(inviteNewMemberLabelTable),
    New_Member_Name_Input: inputWithAutocomplete({
      root: '.invite-new-members',
      elements: {
        input: 'input',
        options: '.suggestion-list .suggestion-row',
        option_name: '.suggestion-row-label'
      }
    }),
    New_Member_Name_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.invite-new-members .new-member-name',
        'input',
        '.suggestion-row',
        '.suggestion-row-label',
        true
      )
    ),
    New_Member_Role_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.invite-new-members .new-member-role',
        false,
        '.select__item',
        '.data-ellipsis'
      )
    ),
    New_Member_Add_Button: By.css('.invite-new-members .new-member-btn'),
    Members_Table: commonTable(membersTable),
    Members_Filter_Input: inputGroup(
      generateInputGroup('.members-table .table-header .input-wrapper', true, false, false)
    ),
    Role_Filter_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.member-roles .select', //root
        false, // open component default subLocator
        false, // options default sublocator
        false // option name default subLocator
      )
    ),
    Notify_by_Email_Checkbox: checkboxComponent({
      root: '.footer-actions .notify-by-email',
      elements: {
        checkbox: 'svg[class]',
        name: '',
        icon: ''
      }
    }),
    Discard_Button: By.css('.apply-discard-buttons .pop-up-dialog__btn_cancel'),
    Apply_Button: By.css('.apply-discard-buttons button.btn-secondary'),
    Footer_Annotation_Label: By.css('.footer-annotation')
  },
  createNewSecretPopup: {
    Title: commonTitle,
    Cross_Cancel_Button: commonCrossCancelButton,
    New_Secret_Key_Input: inputGroup(
      generateInputGroup('.settings__secrets .table-cell__key .input-wrapper', true, false, true)
    ),
    New_Secret_Value_Input: inputGroup(
      generateInputGroup('.settings__secrets .table-cell__value .input-wrapper', true, false, true)
    ),
    Cancel_Button: By.css('.pop-up-dialog .btn-label'),
    Save_Button: By.css('.pop-up-dialog .secrets__footer-container .btn.btn-primary')
  },
  addToFeatureVectorPopup: {
    Title: commonTitle,
    Cross_Cancel_Button: commonCrossCancelButton,
    Project_Name_Dropdown: dropdownComponent(
      generateDropdownGroup('.pop-up-dialog .select-row .project-name')
    ),
    Vector_Name_Dropdown: dropdownComponent(
      generateDropdownGroup('.pop-up-dialog .select-row .vector-name')
    ),
    Vector_Tag_Dropdown: dropdownComponent(
      generateDropdownGroup('.pop-up-dialog .select-row .vector-tag')
    ),
    Cancel_Button: commonCancelButton,
    Select_Button: commonConfirmButton,
    Create_Feature_Vector_Button: By.css('.pop-up-dialog .create-feature-vector__btn')
  },
  createFeatureVectorPopup: {
    Title: commonTitle,
    Cross_Cancel_Button: commonCrossCancelButton,
    Name_Input: inputGroup(
      generateInputGroup('.pop-up-dialog .vector-name-wrapper', true, '.input__warning svg', true)
    ),
    Tag_Input: inputGroup(
      generateInputGroup('.pop-up-dialog .vector-tag-wrapper', true, '.input__warning svg', true)
    ),
    Description_Input: textAreaGroup(generateTextAreaGroup('.pop-up-dialog .text-area-wrapper', '.text-area__counter')),
    Labels_Table: commonTable(createFeatureVectorLabelsTable),
    Cancel_Button: commonCancelButton,
    Create_Button: commonConfirmButton
  },
  featureSetSchedulePopup: {
    Title: By.css('.feature-set-panel__schedule .schedule-title'),
    Repeat_Dropdown: dropdownComponent(
      generateDropdownGroup('.feature-set-panel__schedule .repeat_container .select:nth-of-type(1)')
    ),
    Time_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.feature-set-panel__schedule .repeat_container .schedule-repeat .select'
      )
    ),
    Schedule_Button: By.css('.feature-set-panel__schedule .btn__schedule')
  },
  artifactPreviewPopup: {
    Cross_Cancel_Button: commonCrossCancelButton,
    Preview_Header: commonTable(artifactsPreviewHeader),
    Download_Button: By.css('.pop-up-dialog .preview-body .preview-item .preview-body__download')
  },
  removeMemberPopup: {
    Title: By.css('.delete-member__pop-up .pop-up-dialog__header-text'),
    Remove_Member_Button: By.css('.delete-member__pop-up .btn-danger')
  },
  discardChangesPopup: {
    Title: By.css('.pop-up-dialog .pop-up-dialog__header-text'),
    No_Button: By.css('.pop-up-dialog .pop-up-dialog__btn_cancel'),
    Discard_Button: commonConfirmButton
  },
  artifactsFilterByPopup: {
    Title: By.css('#overlay_container .artifacts-filters__wrapper h3'),
    Table_Label_Filter_Input: commonLabelFilterInput,
    Table_Tree_Filter_Dropdown: commonTableTreeFilterDropdown,
    Show_Iterations_Checkbox: checkboxComponent({
      root: '#overlay_container .form-field-checkbox input',
      elements: {
        checkbox: '', 
        name: '',
        icon: ''
      }
    }),
    Checkbox_Label: By.css('#overlay_container .form-field-checkbox label'),
    Clear_Button: By.css('#overlay_container .btn-tertiary'),
    Apply_Button: By.css('#overlay_container .btn-secondary')
  },
  downloadsPopUp: {
    Download_Pop_Up: By.css('[data-testid="download-container"]'),
    Download_Pop_Up_Cross_Cancel_Button: By.css('[data-testid="download-container"] .notification_body_close_icon'),
    Header_Download_Pop_Up: By.css('[data-testid="download-container"] .download-container__header')
  },
  notificationPopUp: {
    Notification_Pop_Up: By.css('.notification_container .notification_body'),
    Notification_Pop_Up_Cross_Close_Button: By.css('.notification_container .notification_body_close_icon')
  }
}
