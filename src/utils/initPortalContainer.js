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
import { setPortalContainer } from 'igz-controls/utils/portalContainer.util'

// Next-gen (Radix) popups render in <body> by default, outside `.mlrun-tw-scope`, so
// they miss mlrun's scoped Tailwind base styles (see tailwind.css). Rendering them
// into an mlrun container keeps those styles scoped to mlrun, also in MF mode.
export const initPortalContainer = () => {
  let container = document.querySelector('[data-mlrun-portal-root]')

  if (!container) {
    container = document.createElement('div')
    container.className = 'mlrun-tw-scope'
    container.setAttribute('data-mlrun-portal-root', '')
    document.body.appendChild(container)
  }

  setPortalContainer(container)
}
