import React from 'react'
import PropTypes from 'prop-types'

import FormDataInputsTable from '../../../../elements/FormDataInputsTable/FormDataInputsTable'
import { FormInput } from 'igz-controls/components'

const JobWizardDataInputs = ({ formState }) => {
  return (
    <div className="job-wizard__data-inputs form">
      <div className="form-row">
        <h5 className="form-step-title">Data Inputs</h5>
      </div>
      <div className="form-row">
        This is a paragraph explaining what the user will find here and what he or she should do
        next, here we can throw in all the jargon words that normal people would glaze over.
      </div>
      <div className="form-row">
        <FormDataInputsTable
          className="form-col-1"
          fieldsPath="dataInputs.dataInputsTable"
          formState={formState}
        />
      </div>
      <div className="form-row">
        <div className="form-col-1">
          <FormInput name="dataInputs.inputPath" label="Default input path" />
        </div>
        <div className="form-col-1">
          <FormInput name="dataInputs.outputPath" label="Default artifact path" required />
        </div>
      </div>
    </div>
  )
}

JobWizardDataInputs.propTypes = {
  formState: PropTypes.shape({}).isRequired
}

export default JobWizardDataInputs
