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
  Pin_Quick_Link_Button: By.css(
    '.navbar .navbar__body .tooltip-wrapper button.round-icon-cp__circle'
  ),
  Navigation_Bar: By.css('.ml-app .navbar')
}
