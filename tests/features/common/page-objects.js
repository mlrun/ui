import { By } from 'selenium-webdriver'
import commonTable from './components/table.component'
import dropdownComponent from './components/dropdown.component'

let ProjectsTableSelector = {
  root: 'div.projects-content',
  header: {},
  body: {
    row: {
      root: 'div.project-card',
      fields: {
        name: 'div.project-card__header div.data-ellipsis',
        description: 'div.project-card_description',
        running: 'div.project-card__statistic div.statistics_running',
        failed: 'div.project-card__statistic div.statistics_failed',
        models:
          'div.project-card__statistic div.project-data-card__statistics-item:nth-of-type(3) div.statistics_default',
        features:
          'div.project-card__statistic div.project-data-card__statistics-item:nth-of-type(4) div.statistics_default',
        ml_functions:
          'div.project-card__statistic div.project-data-card__statistics-item:nth-of-type(5) div.statistics_default',
        action_menu: 'div.project-card__actions-menu'
      }
    }
  }
}

let projectsTypeDropdown = {
  root: 'div.projects-content-header div.project-types-select',
  dropdownElements: {
    open_button: 'div.select__value',
    options: 'div.select__body div.select__item'
  }
}

module.exports = {
  Projects: {
    loader: By.css('div.loader-wrapper div.loader'),
    New_Project_Button: By.css('div.projects button.btn'),
    Refresh_Projects_Button: By.css(
      'div.projects-content-header div.data-ellipsis button'
    ),
    Projects_Table: commonTable(ProjectsTableSelector),
    Projects_Dropdown: dropdownComponent(projectsTypeDropdown)
  },
  Create_New_Project: {
    Title: By.css('div.pop-up-dialog div.pop-up-dialog__header-text'),
    Name_Input: By.css('div.pop-up-dialog input[pattern]'),
    Description_Input: By.css('div.pop-up-dialog input:not([pattern])'),
    Cross_Cancel_Button: By.css(
      'div.pop-up-dialog .pop-up-dialog__header-close'
    ),
    Cancel_Button: By.css('div.pop-up-dialog button.pop-up-dialog__btn_cancel'),
    Create_Button: By.css('div.pop-up-dialog button.btn-secondary'),
    Error_Message: By.css('div.pop-up-dialog div.error-container')
  },
  Archive_Project: {
    Title: By.css('div.pop-up-dialog div.pop-up-dialog__header-text'),
    Description: By.css('div.pop-up-dialog div.pop-up-dialog__header-text'),
    Cross_Cancel_Button: By.css(
      'div.pop-up-dialog div.pop-up-dialog__header-close'
    ),
    Cancel_Button: By.css('div.pop-up-dialog button.pop-up-dialog__btn_cancel'),
    Archive_Button: By.css('div.pop-up-dialog button.btn-primary')
  },
  Delete_Project: {
    Title: By.css('div.pop-up-dialog div.pop-up-dialog__header-text'),
    Description: By.css('div.pop-up-dialog div.pop-up-dialog__header-text'),
    Cross_Cancel_Button: By.css(
      'div.pop-up-dialog div.pop-up-dialog__header-close'
    ),
    Cancel_Button: By.css('div.pop-up-dialog button.pop-up-dialog__btn_cancel'),
    Delete_Button: By.css('div.pop-up-dialog button.btn-danger')
  }
}
