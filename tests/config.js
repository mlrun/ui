module.exports = {
  timeout: 60000,
  browser: 'chrome',
  headless: false,
  screen_size: { width: 1600, height: 900 },
  report: 'tests/reports/cucumber_report',
  test_url: 'localhost',
  test_port: '3000'
}
