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
export const isPageTabValid = (pageTab, tabs, navigate, location) => {
  if (!tabs.includes(pageTab)) {
    // Change invalid "tab" part of the link to a valid one
    navigate([...location.pathname.split('/').slice(0, 4)].join('/'))
  }
}

export const isProjectValid = (navigate, projectsNames, currentProjectName) => {
  if (projectsNames.length > 0 && currentProjectName && !projectsNames.some(project => project === currentProjectName)) {
    navigate('/projects')
  }
}
