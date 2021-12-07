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
        action_menu: {
          componentType: actionMenu,
          structure: {
            root: 'div.project-card__actions-menu',
            menuElements: {
              open_button: 'button',
              options: 'div.actions-menu__container div.actions-menu__option'
            }
          }
        }
      }
    }
  }
}

module.exports = {
  New_Project_Button: By.css('div.projects button.btn'),
  Refresh_Projects_Button: By.css(
    'div.projects-content-header div.data-ellipsis button'
  ),
  Projects_Table: commonTable(ProjectsTableSelector),
  Projects_Dropdown: dropdownComponent(
    generateDropdownGroup(
      'div.projects-content-header div.project-types-select',
      false, // Default Open Component
      false, // Default Options
      false // Default Option value
    )
  ),
  Projects_Sorter: By.css(
    'div.projects-content-header-item div.sort div.sort__header button > svg'
  ),
  Projects_Sort_Dropdown: dropdownComponent(
    generateDropdownGroup(
      '.projects-content-header-item .sort',
      '.sort__header > div', // Open Component
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
