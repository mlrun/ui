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

// same transformation as src/utils/toTestId.js
export const toTestId = label => label.replace(/\s+/g, '-').toLowerCase()

const sidebarLink = label =>
  `[data-testid="sidebar-menu-item-${toTestId(label)}-internal-link"], ` +
  `[data-testid="sidebar-menu-item-${toTestId(label)}-external-link"]`
const sidebarGroupButton = label =>
  `[data-testid="sidebar-collapsible-menu-item-${toTestId(label)}"] [data-sidebar="menu-button"]`

export default {
  root: By.css('nav:has(> [data-testid="sidebar"])'),
  body: By.css('[data-testid="sidebar"]'),
  content: By.css('[data-testid="sidebar"] [data-sidebar="content"]'),
  pinButton: By.css('[data-testid="pin-sidebar-button"]'),
  groupButtons: By.css('[data-testid^="sidebar-collapsible-menu-item-"] [data-sidebar="menu-button"]'),
  link: label => By.css(sidebarLink(label)),
  linkLabel: label => By.css(`[data-testid="sidebar-menu-item-${toTestId(label)}"] a > span`),
  linkIcon: label => By.css(`[data-testid="sidebar-menu-item-${toTestId(label)}"] a > svg`),
  groupButton: label => By.css(sidebarGroupButton(label)),
  groupLabel: label => By.css(`${sidebarGroupButton(label)} > span`),
  groupIcon: label => By.css(`${sidebarGroupButton(label)} > svg`),
  projectDropdown: {
    open_button: By.css('[data-testid="sidebar-project-dropdown-trigger"]'),
    content: By.css('[data-testid="sidebar-project-dropdown-content"]'),
    option: name =>
      By.xpath(
        `//*[@data-testid="sidebar-project-dropdown-content"]//a[normalize-space(.)="${name}"]`
      )
  }
}
