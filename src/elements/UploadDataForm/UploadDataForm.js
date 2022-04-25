import React from 'react'

import Input from '../../common/Input/Input'
import RadioButtons from '../../common/RadioButtons/RadioButtons'
import UploadFile from '../../common/UploadFile/UploadFile'

import { FILES } from '../../constants'

import './UploadDataForm.scss'

const UploadDataForm = ({
  form,
  frontendSpec,
  handlePageData,
  handleFormData,
  pageData,
  project,
  setSourceType,
  validation
}) => {
  return (
    <form noValidate className="upload-data-form">
      <div>
        <section className="upload-data-form__section">
          <h4>Source</h4>
          <div className="upload-data-form__row">
            <RadioButtons
              elements={pageData.elements}
              onChangeCallback={setSourceType}
              selectedValue={pageData.type}
            />
          </div>
        </section>
        {pageData.type && (
          <section className="upload-data-form__section">
            <div className="upload-data-form__row">
              <RadioButtons
                elements={pageData.config.elements || []}
                onChangeCallback={value => handlePageData('config.type', value)}
                selectedValue={pageData.config.type || 'file'}
              />
              {pageData.type && (
                <div className="upload-data-form__col">
                  {pageData.config?.type === 'file' ? (
                    <UploadFile
                      changeFile={file => handleFormData(`${pageData.type}.file`, file)}
                      id={`${pageData.type}-file-upload`}
                      isValid={validation[pageData.type].file}
                      file={form[pageData.type].file}
                      variant="input"
                    />
                  ) : (
                    <>
                      <Input floatingLabel label="URL address" />
                      <Input floatingLabel label="Access key" />
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
      {pageData.type === FILES && (
        <div className="upload-data-form__target">
          <Input
            floatingLabel
            label="Target path"
            tip="TBD"
            value={project.data?.spec.artifact_path ?? frontendSpec?.default_artifact_path ?? ''}
          />
        </div>
      )}
    </form>
  )
}

export default UploadDataForm
