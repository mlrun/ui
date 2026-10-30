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
import { redirect } from 'react-router'

import { IS_MF_MODE, PROJECTS_PAGE_PATH } from '../constants'

// Loaders for the catch-all (`*`) routes, they redirect unknown paths before anything is rendered.
// The targets are absolute: since react-router v7 relative paths in splat routes are resolved against the full URL,
// so `<Navigate to="models" />` from `.../models/INVALID` would redirect to `.../models/INVALID/models` endlessly.
// Absolute paths are resolved within the router `basename`.

export const redirectToPath = path => () => redirect(path)

// In MF mode the host owns every URL outside /projects (e.g. /airun, /admin, /). The host fires a
// synthetic popstate after its own navigations, so this router briefly sees those URLs while it is
// still mounted; redirecting there would rewrite the host URL back to /projects.
export const redirectUnknownPathToProjects = ({ request }) => {
  if (IS_MF_MODE && !new URL(request.url).pathname.startsWith(`/${PROJECTS_PAGE_PATH}`)) {
    return null
  }

  return redirect(`/${PROJECTS_PAGE_PATH}`)
}

export const redirectToProjectPageTab =
  (pagePath, tab) =>
  ({ params }) =>
    redirect(`/${PROJECTS_PAGE_PATH}/${encodeURIComponent(params.projectName)}/${pagePath}/${tab}`)
