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
import yaml from 'js-yaml'
import { useCallback, useState } from 'react'
import { set, cloneDeep, omit } from 'lodash'

export const useYaml = initialState => {
  const [yamlContent, setYamlContent] = useState(initialState)

  const toggleYamlContent = useCallback(item => {
    if (!item?.ui) {
      return setYamlContent('')
    }

    const json = cloneDeep(item.ui?.originalContent) ?? {}

    if (json) {
      // removes "model_spec.yaml" from "spec.extra_data"
      set(json, 'spec.extra_data', omit(json.spec.extra_data, 'model_spec.yaml'))
    }

    setYamlContent(yaml.dump(json, { lineWidth: -1 }))
  }, [])

  return [yamlContent, toggleYamlContent]
}
