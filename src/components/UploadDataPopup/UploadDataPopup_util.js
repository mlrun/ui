import lodash from 'lodash'
import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { FILES, TABULAR } from '../../constants'

const modalAction = type => {
  switch (type) {
    case FILES:
      return [
        {
          id: 'files_upload_and_view',
          label: 'Upload and view',
          onClick: () => {},
          variant: TERTIARY_BUTTON
        },
        {
          id: 'files_upload',
          label: 'Upload',
          onClick: () => {},
          variant: SECONDARY_BUTTON
        }
      ]
    default:
      return [
        // {
        //   disabled: true,
        //   id: 'tabular_upload_and_view',
        //   label: 'Upload and view',
        //   onClick: () => {},
        //   variant: TERTIARY_BUTTON
        // },
        {
          id: 'tabular_create_feature_set',
          label: 'Create feature set',
          onClick: () => {},
          variant: SECONDARY_BUTTON
        }
      ]
  }
}

const filesConfig = {
  elements: [
    { label: 'Load File', value: 'file' },
    {
      label: 'Remote object store',
      value: 'store'
    }
  ],
  type: 'file'
}
const tabularConfig = {
  elements: [
    { label: 'Load File', value: 'file' },
    {
      label: 'Remote object store',
      value: 'store'
    }
  ],
  type: 'file'
}

export const generatePageData = type => {
  const data = {
    actions: modalAction(type),
    ...(type && {
      config: type === TABULAR ? { ...tabularConfig } : { ...filesConfig }
    }),
    type
  }

  return data
}

export const initialPageData = {
  elements: [
    {
      label: 'Files',
      value: FILES
    },
    {
      label: 'Tabular',
      value: TABULAR
    }
  ],
  ...generatePageData(FILES)
}

export const checkValidation = (path, value, setValidations, pageData) => {
  let isValid = true
  if (value && pageData.type === TABULAR && pageData.config.type === 'file') {
    setValidations(oldState =>
      lodash
        .chain(oldState)
        .cloneDeep()
        .set(path, value.name.includes('.parquet') || value.type.includes('.parquet'))
        .value()
    )
  }
  return isValid
}
