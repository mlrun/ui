import { By } from 'selenium-webdriver'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import actionMenu from '../components/action-menu.component'
import {
  generateDropdownGroup,
  generateInputGroup
} from '../../common-tools/common-tools'
import inputGroup from '../components/input-group.component'

const ProjectsTableSelector = {
  root: '.projects-content',
  header: {},
  body: {
    row: {
      root: '.project-card',
      fields: {
        name: '.project-card__header .data-ellipsis',
        description: '.project-card_description',
        running: '.project-card__statistic .statistics_running',
        failed: '.project-card__statistic .statistics_failed',
        models:
          '.project-card__statistic .project-data-card__statistics-item:nth-of-type(3) .statistics_default',
        features:
          '.project-card__statistic .project-data-card__statistics-item:nth-of-type(4) .statistics_default',
        ml_functions:
          '.project-card__statistic .project-data-card__statistics-item:nth-of-type(5) .statistics_default',
        action_menu: {
          componentType: actionMenu,
          structure: {
            root: '.project-card__actions-menu',
            menuElements: {
              open_button: 'button',
              options: '#overlay_container .actions-menu__option'
            }
          }
        }
      }
    }
  }
}

module.exports = {
  New_Project_Button: By.css('.projects button.btn'),
  Refresh_Projects_Button: By.css(
    '.projects-content-header .data-ellipsis button'
  ),
  Projects_Table: commonTable(ProjectsTableSelector),
  Projects_Dropdown: dropdownComponent(
    generateDropdownGroup(
      '.projects-content-header .project-types-select',
      false, // Default Open Component
      false, // Default Options
      false // Default Option value
    )
  ),
  Projects_Sorter: By.css(
    '.projects-content-header-item .sort .split-btn__button:nth-of-type(1) button > svg'
  ),
  Projects_Sort_Dropdown: dropdownComponent(
    generateDropdownGroup(
      '.projects-content-header-item .sort .split-btn__button:nth-of-type(2)',
      'button > svg', // Open Component
      '.sort__body .select__item', // Options
      '.data-ellipsis > .tooltip-wrapper' // Option value
    )
  ),
  No_Archived_Projects_Label:
    '.projects .projects__wrapper .projects-content .no-filtered-data',
  Search_Projects_Input: inputGroup(
    generateInputGroup(
      '.projects__wrapper .projects-content-header .search-container'
    )
  )
}
