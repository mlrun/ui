import { FILES, SECONDARY_BUTTON, TABULAR, TERTIARY_BUTTON } from '../../constants'

const modalAction = type => {
  switch (type) {
    case FILES:
      return [
        {
          disabled: true,
          id: 'files_upload_and_view',
          label: 'Upload and view',
          onClick: () => {},
          variant: TERTIARY_BUTTON
        },
        {
          disabled: true,
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
          disabled: true,
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

export const initialPageData = {
  actions: modalAction(FILES),
  elements: [
    {
      label: 'Tabular',
      value: TABULAR
    },
    {
      label: 'Files',
      value: FILES
    }
  ],
  type: null
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
