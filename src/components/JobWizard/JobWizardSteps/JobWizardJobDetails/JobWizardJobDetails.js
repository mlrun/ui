import React from 'react'

import { FormInput, FormSelect } from 'igz-controls/components'

import './jobWizardJobDetails.scss'

const JobWizardJobDetails = ({ jobAdditionalData, formState }) => {
  return (
    <div className="job-wizard__job-details form">
      <div className="form-row">
        <h5 className="form-step-title">Job Details</h5>
      </div>
      <div className="form-row">
        This is a paragraph explaining what the user will find here and what he or she should do
        next, here we can throw in all the jargon words that normal people would glaze over.
      </div>
      <div className="form-row">
        <div className="form-col-2">
          <FormInput name="jobDetails.name" label="Name" required />
        </div>
        {jobAdditionalData.versionOptions.length !== 0 && (
          <div className="form-col-1">
            <FormSelect
              name="jobDetails.version"
              label="Version"
              options={jobAdditionalData.versionOptions}
            />
          </div>
        )}
        {jobAdditionalData.methodOptions.length !== 0 && (
          <div className="form-col-1">
            <FormSelect
              name="jobDetails.method"
              label="Method"
              options={jobAdditionalData.methodOptions}
            />
          </div>
        )}
      </div>
    </div>
  )
}

JobWizardJobDetails.defaultProps = {}

JobWizardJobDetails.propTypes = {}

export default JobWizardJobDetails
