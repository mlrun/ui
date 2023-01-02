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
import React, { useMemo } from 'react'

import {
  //   Button,
  //   FormCheckBox,
  //   FormInput,
  //   FormRadio,
  FormSelect
  //   FormTextarea
} from 'igz-controls/components'

import { generateFunctionPriorityLabel } from '../../../utils/generateFunctionPriorityLabel'

const JobFunctionWizardStep3 = ({ appStore, formState }) => {
  const validFunctionPriorityClassNames = useMemo(() => {
    return (appStore.frontendSpec.valid_function_priority_class_names ?? []).map(className => ({
      id: className,
      label: generateFunctionPriorityLabel(className)
    }))
  }, [appStore.frontendSpec.valid_function_priority_class_names])

  return (
    <>
      <div className="form-row">
        <h5 className="form__step-title">Resources</h5>
      </div>
      <div className="form-row">
        {validFunctionPriorityClassNames.length > 0 && (
          <div className="form-col-auto">
            <FormSelect
              label="Pods priority"
              name="spec.priority_class_name"
              options={validFunctionPriorityClassNames}
            />
          </div>
        )}
        <div className="form-col-auto"></div>
      </div>
      <pre>{JSON.stringify(formState, null, 2)}</pre>
    </>
  )
}

export default JobFunctionWizardStep3
