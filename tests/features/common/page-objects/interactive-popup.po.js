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

import {
  generateLabelGroup,
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

// Common components

const commonCancelButton = By.css('.pop-up-dialog button.pop-up-dialog__btn_cancel')

const commonDeleteButton = By.css('.pop-up-dialog .btn-danger')

const commonDescription = By.css('.pop-up-dialog .confirm-dialog__message')

const commonCrossCancelButton = By.css('.pop-up-dialog .pop-up-dialog__btn_close svg')
const commonNameInput = generateInputGroup(
  '.form .form-row:nth-of-type(2) .form-field__wrapper-normal',
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
const commonFormText = By.css('.form-text span')
const commonFormSubtext = By.css('.form-text div p')

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
        '.pop-up-dialog .input-wrapper:nth-of-type(1)',
        true,
        '.input__warning svg',
        true
      )
    ),
    Description_Input: inputGroup(
      generateInputGroup('.pop-up-dialog .input-wrapper:nth-of-type(2)', true, false, true)
    ),
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Create_Button: By.css('.pop-up-dialog .btn-secondary'),
    Error_Message: By.css('.pop-up-dialog .error__message')
  },
  commonPopup: {
    Title: commonTitle,
    Description: commonDescription,
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Confirm_Button: By.css('.confirm-dialog__btn-container button:not(.pop-up-dialog__btn_cancel)'),
    Delete_Button: commonDeleteButton
  },
  trainModel:{
    Title: By.css('.modal .modal__header-title'),
    Cross_Cancel_Button: By.css('.modal .modal__header-button')
  },
  registerDataset: {
    Title: commonPopupTitle,
    Form_Text: commonFormText,
    Form_Subtext: commonFormSubtext,
    Cross_Cancel_Button: commonCloseButton,
    Name_Input: inputGroup(commonNameInput),
    Target_Path: {
      Path_Scheme_Combobox: comboBox(
        '.form .form-row:nth-of-type(4) .form-field__wrapper',
        true
      )
    },
    Description_Input: textAreaGroup(commonDescriptionTextArea),
    Cancel_Button: commonFormCancelButton,
    Register_Button: commonFormConfirmButton
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
  }
}
