import inputGroup from '../components/input-group.component'
import dropdownComponent from '../components/dropdown.component'
import commonTable from '../components/table.component'
import labelComponent from '../components/label.component'
import checkboxComponent from '../components/checkbox.component'

import {
  generateLabelGroup,
  generateInputGroup,
  generateDropdownGroup
} from '../../common-tools/common-tools'
import inputWithAutocomplete from '../components/input-with-autocomplete.component'

const { By } = require('selenium-webdriver')

const memberOverviewLabelsTable = {
  root: '#overlay_container .pop-up-dialog .info-row',
  header: {},
  body: {
    root: 'members-overview',
    row: {
      root: '.member-overview',
      fields: {
        name: ''
      }
    }
  }
}

const membersTable = {
  root: ' #overlay_container .pop-up-dialog .members-table',
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
          structure: generateDropdownGroup(
            '.member-roles .select',
            false,
            false,
            false
          )
        },
        delete_btn: '.member-actions button'
      }
    }
  }
}

const inviteNewMemberLabelTable = {
  root: '#overlay_container .pop-up-dialog .invite-new-members',
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
  root: '.deploy-model .key-value-table',
  header: {
    root: '.table-row__header ',
    sorters: {
      name: '.table-cell__inputs-wrapper .table-cell__key',
      value: '.table-cell__inputs-wrapper .table-cell__value'
    }
  },
  body: {
    offset: 1,
    add_row_btn: 'button.add-new-item-btn',
    row: {
      root: '.table-row',
      fields: {
        name: '.table-cell__key .data-ellipsis',
        value: '.table-cell__value .data-ellipsis',
        delete_btn: '.key-value-table__btn'
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

// Common components

const commonCancelButton = By.css(
  '.pop-up-dialog button.pop-up-dialog__btn_cancel'
)

const commonDeleteButton = By.css('.pop-up-dialog .btn-danger')

const commonDescription = By.css('.pop-up-dialog .confirm-dialog__message')

const commonCrossCancelButton = By.css(
  '.pop-up-dialog .pop-up-dialog__btn_close svg'
)
const commonNameInput = generateInputGroup(
  '.pop-up-dialog .artifact-register-form .input-wrapper:nth-of-type(2)',
  true,
  true,
  true
)

const commonTargetPathInput = generateInputGroup(
  '.pop-up-dialog .artifact-register-form .input-wrapper:nth-of-type(3)',
  true,
  false,
  true
)

const commonDescriptionInput = generateInputGroup(
  '.pop-up-dialog .artifact-register-form .input-wrapper:nth-of-type(4)',
  true,
  false,
  true
)

const commonConfirmButton = By.css('.pop-up-dialog .btn.btn-primary')

const commonTitle = By.css('.pop-up-dialog .pop-up-dialog__header-text')

module.exports = {
  createNewProject: {
    Title: commonTitle,
    Name_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .input-wrapper:nth-of-type(1)',
        true,
        true,
        true
      )
    ),
    Description_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .input-wrapper:nth-of-type(2)',
        true,
        false,
        true
      )
    ),
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Create_Button: By.css('.pop-up-dialog .btn-secondary'),
    Error_Message: By.css('.pop-up-dialog .error-message')
  },
  commonPopup: {
    Title: commonTitle,
    Description: commonDescription,
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Confirm_Button: commonConfirmButton,
    Delete_Button: commonDeleteButton
  },
  registerDataset: {
    Title: commonTitle,
    Cross_Cancel_Button: commonCrossCancelButton,
    Name_Input: inputGroup(commonNameInput),
    Target_Path_Input: inputGroup(commonTargetPathInput),
    Description_Input: inputGroup(commonDescriptionInput),
    Cancel_Button: commonCancelButton,
    Register_Button: commonConfirmButton
  },
  createMLFunctionPopup: {
    Cross_Cancel_Button: commonCrossCancelButton,
    Title: commonTitle,
    New_Function_Name_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .new-function__pop-up-inputs .name.input-wrapper',
        true,
        true,
        true
      )
    ),
    New_Function_Tag_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .new-function__pop-up-inputs .tag.input-wrapper',
        true,
        false,
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
    Title: commonTitle,
    Cross_Cancel_Button: commonCrossCancelButton,
    New_File_Name_Input: inputGroup(commonNameInput),
    New_File_Target_Path_Input: inputGroup(commonTargetPathInput),
    New_File_Description_Input: inputGroup(commonDescriptionInput),
    New_File_Type_Dropdown: dropdownComponent(
      generateDropdownGroup('.pop-up-dialog .artifact-register-form .select')
    ),
    Cancel_Button: commonCancelButton,
    Register_Button: commonConfirmButton
  },
  registerModelPopup: {
    Title: commonTitle,
    Cross_Cancel_Button: commonCrossCancelButton,
    New_File_Name_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .artifact-register-form .input-wrapper:nth-of-type(1)',
        true,
        true,
        true
      )
    ),
    New_File_Target_Path_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .artifact-register-form .input-wrapper:nth-of-type(2)',
        true,
        true,
        true
      )
    ),
    New_File_Description_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .artifact-register-form .input-wrapper:nth-of-type(3)',
        true,
        true,
        true
      )
    ),
    Cancel_Button: commonCancelButton,
    Register_Button: commonConfirmButton
  },
  deployModelPopup: {
    Title: commonTitle,
    Cross_Cancel_Button: commonCrossCancelButton,
    Serving_Function_Dropdown: dropdownComponent(
      generateDropdownGroup('.pop-up-dialog .select-row .select:nth-of-type(1)')
    ),
    Tag_Dropdown: dropdownComponent(
      generateDropdownGroup('.pop-up-dialog .select-row .select:nth-of-type(2)')
    ),
    Model_Name_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .input-row .input-wrapper:nth-of-type(1)',
        true,
        true,
        false
      )
    ),
    Class_Name_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .input-row .input-wrapper:nth-of-type(2)',
        true,
        false,
        false
      )
    ),
    Deploy_Model_Table: {
      Key_Value_Table: commonTable(deployModelTable),
      Class_Argument_Name_Input: inputGroup(
        generateInputGroup(
          '.deploy-model .key-value-table .input-wrapper:nth-of-type(1)',
          true,
          false,
          true
        )
      ),
      Class_Argument_Value_Input: inputGroup(
        generateInputGroup(
          '.deploy-model .key-value-table .input-wrapper:nth-of-type(2)',
          true,
          false,
          true
        )
      ),
      Add_New_Row_Button: By.css(
        '.deploy-model .key-value-table .table-cell__actions .btn-add'
      ),
      Delete_New_Row_Button: By.css(
        '.deploy-model .key-value-table .table-cell__actions button:nth-of-type(2)'
      )
    },
    Cancel_Button: commonCancelButton,
    Deploy_Button: commonConfirmButton
  },
  viewYamlPopup: {
    Title: By.css('.pop-up-dialog .pop-up-dialog__header'),
    Cross_Cancel_Button: commonCrossCancelButton,
    YAML_Modal_Container: By.css('.pop-up-dialog .yaml-modal-container pre')
  },
  changeProjectOwnerPopup: {
    Cross_Cancel_Button: commonCrossCancelButton,
    Title: commonTitle,
    Search_Input_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.pop-up-dialog .owner-table',
        '.input-wrapper .input', //open component subLocator
        '.members-list .member-row', // options sublocator
        '.member-name' // option name subLocator
      )
    ),
    Discard_Button: commonCancelButton,
    Apply_Button: By.css('.pop-up-dialog .data-ellipsis button.btn-secondary'),
    Footer_Annotation_Label: By.css(
      '.change-owner__pop-up > .pop-up-dialog .footer-annotation'
    )
  },
  projectMembersPopup: {
    Cross_Cancel_Button: commonCrossCancelButton,
    Title: commonTitle,
    Member_Overview_Labels_Table: commonTable(memberOverviewLabelsTable),
    Member_Overview_Tooltip: labelComponent(
      generateLabelGroup(
        '#overlay_container .pop-up-dialog .info-row', // root
        '', // empty sublocator
        true // for single hint
      )
    ),
    Invite_New_Members_Button: By.css(
      ' #overlay_container .pop-up-dialog .info-row .invite-new-members-btn'
    ),
    Invite_New_Members_Labels_Table: commonTable(inviteNewMemberLabelTable),
    New_Member_Name_Input: inputWithAutocomplete({
      root: '#overlay_container .pop-up-dialog .invite-new-members',
      elements: {
        input: 'input',
        options: '.suggestion-list .suggestion-row',
        option_name: '.suggestion-row-label'
      }
    }),
    New_Member_Name_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '#overlay_container .pop-up-dialog .invite-new-members .new-member-name',
        'input',
        '.suggestion-row',
        '.suggestion-row-label'
      )
    ),
    New_Member_Role_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '#overlay_container .pop-up-dialog .invite-new-members .new-member-role',
        false,
        '.select__item',
        '.data-ellipsis'
      )
    ),
    New_Member_Add_Button: By.css(
      '#overlay_container .pop-up-dialog .invite-new-members .new-member-btn'
    ),
    Members_Table: commonTable(membersTable),
    Members_Filter_Input: inputGroup(
      generateInputGroup(
        ' #overlay_container .pop-up-dialog .members-table .table-header .input-wrapper',
        true,
        false,
        false
      )
    ),
    Role_Filter_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.member-roles .select', //root
        false, // open component default subLocator
        false, // options default sublocator
        false // option name default subLocator
      )
    ),
    Notify_by_Email_Checbox: checkboxComponent({
      root:
        '#overlay_container .pop-up-dialog .footer-actions .notify-by-email',
      elements: {
        checkbox: 'svg[class]',
        name: '',
        icon: ''
      }
    }),
    Discard_Button: commonCancelButton,
    Apply_Button: By.css(
      ' #overlay_container .pop-up-dialog .data-ellipsis button.btn-secondary'
    ),
    Footer_Annotation_Label: By.css(
      ' #overlay_container .pop-up-dialog .footer-annotation'
    )
  },
  createNewSecretPopup: {
    Title: commonTitle,
    Cross_Cancel_Button: commonCrossCancelButton,
    New_Secret_Key_Input: inputGroup(
      generateInputGroup(
        '.secrets__form-input:nth-of-type(2) .input-wrapper',
        true,
        false,
        true
      )
    ),
    New_Secret_Value_Input: inputGroup(
      generateInputGroup(
        '.secrets__form-input:nth-of-type(3) .input-wrapper',
        true,
        false,
        true
      )
    ),
    Cancel_Button: By.css('.pop-up-dialog .btn-label'),
    Save_Button: By.css(
      '.pop-up-dialog .secrets__footer-container .btn.btn-primary'
    )
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
    Create_Feature_Vector_Button: By.css(
      '.pop-up-dialog .create-feature-vector__btn'
    )
  },
  createFeatureVectorPopup: {
    Title: commonTitle,
    Cross_Cancel_Button: commonCrossCancelButton,
    Name_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .vector-name-wrapper',
        true,
        true,
        true
      )
    ),
    Tag_Input: inputGroup(
      generateInputGroup(
        '.pop-up-dialog .vector-tag-wrapper',
        true,
        false,
        true
      )
    ),
    Description_Input: By.css('.pop-up-dialog .text-area-wrapper textarea'),
    Labels_Table: commonTable(createFeatureVectorLabelsTable),
    Cancel_Button: commonCancelButton,
    Create_Button: commonConfirmButton
  },
  featureSetSchedulePopup: {
    Title: By.css('.feature-set-panel__schedule .schedule-title'),
    Repeat_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.feature-set-panel__schedule .repeat_container .select:nth-of-type(1)',
        false,
        true,

        '.data-ellipsis > .data-ellipsis'
      )
    ),
    Time_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.feature-set-panel__schedule .repeat_container .schedule-repeat .select',
        false,
        false,
        '.data-ellipsis > .data-ellipsis'
      )
    ),
    Schedule_Button: By.css('.feature-set-panel__schedule .btn__schedule')
  },
  artifactPreviewPopup: {
    Cross_Cancel_Button: commonCrossCancelButton,
    Preview_Header: commonTable(artifactsPreviewHeader)
  },
  removeMemberPopup: {
    Title: By.css('.delete-member__pop-up .pop-up-dialog__header-text'),
    Remove_Member_Button: By.css('.delete-member__pop-up .btn-danger')
  },
  discardChangesPopup: {
    Title: By.css(
      '.pop-up-dialog__overlay:nth-of-type(2) .pop-up-dialog__header-text'
    ),
    No_Button: By.css(
      '.pop-up-dialog__overlay:nth-of-type(2) .pop-up-dialog__btn_cancel'
    ),
    Discard_Button: commonConfirmButton
  }
}
