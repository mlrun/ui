import { By } from 'selenium-webdriver'

import breadcrumbsComponent from '../components/breadcrumbs.component'
import commonTable from '../components/table.component'

const generalInfoQuickLinks = {
  root: '.navbar .navbar__body .navbar-links',
  header: {},
  body: {
    row: {
      root: '.nav-link',
      fields: {
        link: '.nav-link__button span'
      }
    }
  }
}

module.exports = {
  loader: By.css('.loader-wrapper .loader'),
  See_On_Github: By.css('header.header a.header__link'),
  Common_Hint: By.css('#overlay_container .tip'),
  Common_Tolltip: By.css('#overlay_container .tooltip'),
  Common_Options: By.css(
    '#overlay_container .options-menu .options-menu__body'
  ),
  MLRun_Logo: By.css('.header .header__logo'),
  No_Data_Message: By.css('.no-data-block h3'),
  Breadcrumbs: breadcrumbsComponent,
  General_Info_Quick_Links: commonTable(generalInfoQuickLinks),
  Project_Navigation_Toggler: By.css(
    '.navbar .navbar__toggler-button .navbar__toggler-icon'
  ),
  Project_Settings_Button: By.css(
    '.navbar .navbar__body .navbar__additional .navbar-links .nav-link__button'
  ),
  Pin_Quick_linck_Button: By.css(
    '.navbar .navbar__body .tooltip-wrapper button.round-icon-cp__circle'
  ),
  Navigation_Bar: By.css('.app .navbar')
}
