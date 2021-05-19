import inputGroup from '../components/input-group.component'
const { By } = require('selenium-webdriver')

const commonCancelButton = By.css(
  'div.pop-up-dialog button.pop-up-dialog__btn_cancel'
)
const commonCrossCancelButton = By.css(
  'div.pop-up-dialog div.pop-up-dialog__header-close'
)

function generateInputGroup(root, label = false, hint = false) {
  const structure = { elements: {} }
  structure.root = root
  structure.elements.input = 'input'
  if (label) {
    structure.elements.label = 'label'
  }
  if (hint) {
    structure.elements.hint = 'div.tip-container svg'
  }
  return structure
}

module.exports = {
  createNewProject: {
    Title: By.css('div.pop-up-dialog div.pop-up-dialog__header-text'),
    Name_Input: inputGroup(
      generateInputGroup(
        'div.pop-up-dialog div.input-wrapper:nth-of-type(1)',
        true,
        true
      )
    ),
    Description_Input: inputGroup(
      generateInputGroup(
        'div.pop-up-dialog div.input-wrapper:nth-of-type(2)',
        true,
        false
      )
    ),
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Create_Button: By.css('div.pop-up-dialog button.btn-secondary'),
    Error_Message: By.css('div.pop-up-dialog div.error-container')
  },
  archiveProject: {
    Title: By.css('div.pop-up-dialog div.pop-up-dialog__header-text'),
    Description: By.css('div.pop-up-dialog > div:not([class])'),
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Archive_Button: By.css('div.pop-up-dialog button.btn-primary')
  },
  deleteProject: {
    Title: By.css('div.pop-up-dialog div.pop-up-dialog__header-text'),
    Description: By.css('div.pop-up-dialog > div:not([class])'),
    Cross_Cancel_Button: commonCrossCancelButton,
    Cancel_Button: commonCancelButton,
    Delete_Button: By.css('div.pop-up-dialog button.btn-danger')
  },
  registerDataset: {
    Title: By.css('div.pop-up-dialog div.pop-up-dialog__header-text'),
    Cross_Cancel_Button: commonCrossCancelButton,
    Name_Input: inputGroup(
      generateInputGroup(
        'div.pop-up-dialog div.artifact-register-form div.input-wrapper:nth-of-type(1)',
        true,
        true
      )
    ),
    Target_Path_Input: inputGroup(
      generateInputGroup(
        'div.pop-up-dialog div.artifact-register-form div.input-wrapper:nth-of-type(2)',
        true,
        false
      )
    ),
    Description_Input: inputGroup(
      generateInputGroup(
        'div.pop-up-dialog div.artifact-register-form div.input-wrapper:nth-of-type(3)',
        true,
        false
      )
    ),
    Cancel_Button: commonCancelButton,
    Archive_Button: By.css('div.pop-up-dialog button.btn-primary')
  }
}
