const { By } = require('selenium-webdriver')
const inputWithAutocomplete = require('./input-with-autocomplete.component')

module.exports = {
  root: By.css('nav.breadcrumbs'),
  projectLabel: By.css('.breadcrumbs__item:nth-of-type(3)'),
  tabLabel: By.css('.breadcrumbs__item:nth-of-type(5)'),
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
    options: By.css('.breadcrumbs__dropdown-item'),
    option: function(index) {
      return By.css(`.breadcrumbs__dropdown-item:nth-of-type(${index})`)
    }
  }
}
