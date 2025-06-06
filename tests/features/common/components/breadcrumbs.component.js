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
import inputWithAutocomplete from './input-with-autocomplete.component'

export default {
  root: By.css('nav.breadcrumbs'),
  projectsPageLabel: By.css('.breadcrumbs__item:nth-of-type(1)'),
  projectLabel: By.css('.breadcrumbs__item:nth-of-type(3)'),
  tabLabel: By.css('.breadcrumbs__item:nth-of-type(5)'),
  crossLabel: By.css('.breadcrumbs__item:nth-of-type(3)'),
  project: {
    open_button: By.css('.breadcrumbs__item:nth-of-type(2) button'),
    options: By.css('a.breadcrumbs__dropdown-item'),
    option: function(index) {
      return By.css(`a.breadcrumbs__dropdown-item:nth-of-type(${index})`)
    }
  },
  searchInput: inputWithAutocomplete({
    root: '.breadcrumbs__dropdown-search',
    elements: {
      input: 'input',
      options: 'a.breadcrumbs__dropdown-item',
      option_name: '.data-ellipsis'
    }
  }),
  tab: {
    open_button: By.css('.breadcrumbs__item:nth-of-type(4) button'),
    options: By.css('a.breadcrumbs__dropdown-item'),
    option: function(index) {
      return By.css(`.breadcrumbs__dropdown-item:nth-of-type(${index})`)
    }
  },
  crossTab: {
    open_button: By.css('.breadcrumbs__item:nth-of-type(2) button'),
    options: By.css('a.breadcrumbs__dropdown-item'),
    option: function(index) {
      return By.css(`.breadcrumbs__dropdown-item:nth-of-type(${index})`)
    }
  }
}
