import React from 'react'

import Input from '../../common/Input/Input'
import RadioButtons from '../../common/RadioButtons/RadioButtons'
import UploadFile from '../../common/UploadFile/UploadFile'

import { FILES, TABULAR } from '../../constants'

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
                      accept={pageData.type === TABULAR ? '.parquet' : ''}
                      changeFile={file => handleFormData(`${pageData.type}.file`, file)}
                      id={`${pageData.type}-file-upload`}
                      isValid={validation[pageData.type].file}
                      file={form[pageData.type].file}
                      multiple
                      variant="input"
                    />
                  ) : pageData.type === FILES ? (
                    <>
                      <Input
                        floatingLabel
                        label="URL address"
                        value={form.files.store.url ?? ''}
                        onChange={url =>
                          handleFormData(`${pageData.type}.${pageData.config?.type}.url`, url)
                        }
                      />
                      <Input floatingLabel label="Access key" />
                      <RadioButtons
                        elements={pageData.elements}
                        onChangeCallback={setSourceType}
                        selectedValue={pageData.type}
                      />
                    </>
                  ) : (
                    'hello'
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
            onChange={target => handleFormData('files.targetPath', target)}
            tip="TBD"
            value={form.files.targetPath || frontendSpec?.default_artifact_path || ''}
          />
        </div>
      )}
    </form>
  )
}

export default UploadDataForm
