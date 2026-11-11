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

// breadcrumbs separators are not clickable anymore, navigation between
// projects and screens is done via the sidebar (see sidebar.component.js)
export default {
  root: 'nav.breadcrumbs',
  projectsPageLabel: '.breadcrumbs__item:nth-of-type(1)',
  projectLabel: '.breadcrumbs__item:nth-of-type(3)',
  tabLabel: '.breadcrumbs__item:nth-of-type(5)',
  crossLabel: '.breadcrumbs__item:nth-of-type(3)'
}
