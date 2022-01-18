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

// Common components

const commonCancelButton = By.css(
  'div.pop-up-dialog button.pop-up-dialog__btn_cancel'
)

const commonDeleteButton = By.css('div.pop-up-dialog button.btn-danger')

const commonDescription = By.css(
  'div.pop-up-dialog div.confirm-dialog__message'
)

const commonCrossCancelButton = By.css(
  'div.pop-up-dialog div.pop-up-dialog__btn_close svg'
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

const commonTitle = By.css('div.pop-up-dialog div.pop-up-dialog__header-text')

module.exports = {
  createNewProject: {
    Title: commonTitle,
    Name_Input: inputGroup(
      generateInputGroup(
        'div.pop-up-dialog div.input-wrapper:nth-of-type(1)',
        true,
        true,
        true
      )
    ),
    Description_Input: inputGroup(
      generateInputGroup(
        'div.pop-up-dialog div.input-wrapper:nth-of-type(2)',
        true,
        false,
        true
      )
    ),
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Create_Button: By.css('div.pop-up-dialog button.btn-secondary'),
    Error_Message: By.css('div.pop-up-dialog div.error-container')
  },
  archiveProject: {
    Title: commonTitle,
    Description: commonDescription,
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Archive_Button: commonConfirmButton
  },
  deleteProject: {
    Title: commonTitle,
    Description: commonDescription,
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Delete_Button: commonDeleteButton
  },
  deleteFunction: {
    Title: commonTitle,
    Description: commonDescription,
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: By.css('div.pop-up-dialog button.btn-label'),
    Delete_Button: commonDeleteButton
  },
  deleteScheduledJob: {
    Title: commonTitle,
    Description: commonDescription,
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
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
  createFeatureSetPopupDialog: {
    Cross_Cancel_Button: commonCrossCancelButton,
    Description: commonDescription,
    OK_Button: commonConfirmButton
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
    Deploy_Model_Table: commonTable(deployModelTable),
    Cancel_Button: commonCancelButton,
    Deploy_Button: commonConfirmButton
  },
  viewYamlPopup: {
    Title: By.css('div.pop-up-dialog div.pop-up-dialog__header'),
    Cross_Cancel_Button: commonCrossCancelButton,
    YAML_Modal_Container: By.css(
      'div.pop-up-dialog div.yaml-modal-container pre'
    )
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
    Cancel_Button: By.css('div.pop-up-dialog button.btn-label'),
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
    Labels_Input: By.css('.pop-up-dialog .labels-container .chips-wrapper'),
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
  }
}
