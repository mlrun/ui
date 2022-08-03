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

const NewFunctionModalStep3 = ({ appStore, formState }) => {
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

export default NewFunctionModalStep3
