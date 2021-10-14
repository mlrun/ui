import inputGroup from '../components/input-group.component'
import dropdownComponent from '../components/dropdown.component'

import {
  generateInputGroup,
  generateDropdownGroup
} from '../../common-tools/common-tools'

const { By } = require('selenium-webdriver')

const commonCancelButton = By.css(
  'div.pop-up-dialog button.pop-up-dialog__btn_cancel'
)
const commonCrossCancelButton = By.css(
  'div.pop-up-dialog div.pop-up-dialog__header-close svg'
)

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
    Description: By.css('div.pop-up-dialog > div:not([class])'),
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Archive_Button: By.css('div.pop-up-dialog button.btn-primary')
  },
  deleteProject: {
    Title: commonTitle,
    Description: By.css('div.pop-up-dialog > div:not([class])'),
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Delete_Button: By.css('div.pop-up-dialog button.btn-danger')
  },
  deleteFunction: {
    Title: commonTitle,
    Description: By.css('div.pop-up-dialog > div:not([class])'),
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Delete_Button: By.css('div.pop-up-dialog button.btn-danger')
  },
  registerDataset: {
    Title: commonTitle,
    Cross_Cancel_Button: commonCrossCancelButton,
    Name_Input: inputGroup(
      generateInputGroup(
        'div.pop-up-dialog div.artifact-register-form div.input-wrapper:nth-of-type(1)',
        true,
        true,
        true
      )
    ),
    Target_Path_Input: inputGroup(
      generateInputGroup(
        'div.pop-up-dialog div.artifact-register-form div.input-wrapper:nth-of-type(2)',
        true,
        false,
        true
      )
    ),
    Description_Input: inputGroup(
      generateInputGroup(
        'div.pop-up-dialog div.artifact-register-form div.input-wrapper:nth-of-type(3)',
        true,
        false,
        false
      )
    ),
    Cancel_Button: commonCancelButton,
    Archive_Button: By.css('div.pop-up-dialog button.btn-primary')
  },
  createFeatureSetPopupDialog: {
    Cross_Cancel_Button: commonCrossCancelButton,
    Description: By.css('div.pop-up-dialog > div:not([class])'),
    OK_Button: By.css('div.pop-up-dialog button.btn-primary')
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
    Continue_Button: By.css(
      '.pop-up-dialog .pop-up-dialog__footer-container .btn.btn-primary'
    )
  }
}
