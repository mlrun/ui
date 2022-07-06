import { By } from 'selenium-webdriver'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import actionMenu from '../components/action-menu.component'
import {
  generateDropdownGroup,
  generateInputGroup,
  generateLabelGroup
} from '../../common-tools/common-tools'
import inputGroup from '../components/input-group.component'
import labelComponent from '../components/label.component'

const ProjectsTableSelector = {
  root: '.projects .projects-content',
  header: {},
  body: {
    row: {
      root: '.project-card',
      fields: {
        name:
          '.project-card__general-info .project-card__header .project-card__header-title .data-ellipsis.tooltip-wrapper.project-card__title',
        description:
          '.project-card__general-info .project-card__content .project-card__description .data-ellipsis',
        running: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.project-card__content .project-card__statistic .project-data-card__statistics-item:nth-of-type(1)',
            false,
            false,
            '.tooltip .tooltip__text span'
          )
        },
        failed: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.project-card__content .project-card__statistic .project-data-card__statistics-item:nth-of-type(2)',
            false,
            false,
            '.tooltip .tooltip__text span'
          )
        },
        creation: '.project-card__header-title .project-card__info span',
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
  New_Project_Button: By.css(
    '.projects__wrapper .projects-content-header-item .page-actions-container .btn_register'
  ),
  Refresh_Projects_Button: By.css(
    '.projects-content-header .data-ellipsis button'
  ),
  Projects_Table: commonTable(ProjectsTableSelector),
  Active_Projects_Button: By.css(
    '.projects__wrapper .projects-content-header .projects-content-header-item .content-menu .content-menu__list li[data-testid=active] a'
  ),
  Archive_Projects_Button: By.css(
    '.projects__wrapper .projects-content-header .projects-content-header-item .content-menu .content-menu__list li[data-testid=archived] a'
  ),
  Projects_Sorter: By.css(
    '.projects-content-header-item .sort .split-btn__button:nth-of-type(1) button > svg'
  ),
  Projects_Sort_Dropdown: dropdownComponent(
    generateDropdownGroup(
      '.projects-content-header-item .sort .split-btn__button:nth-of-type(2)',
      'button > svg', // Open Component
      '.select__item', // Options
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
