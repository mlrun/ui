export const entryOptions = [{ label: 'Source code', id: 'source-code' }]

export const DEFAULT_ENTRY = 'source-code'
export const DEFAULT_HANDLER = 'handler'
export const DEFAULT_IMAGE = 'mlrun/mlrun'
export const DEFAULT_SOURCE_CODE =
  'ZGVmIGhhbmRsZXIoY29udGV4dCk6CiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKCdIZWxsbyB3b3JsZCcp'

export const NEW_IMAGE = 'newImage'
export const EXISTING_IMAGE = 'existingImage'

export const codeOptions = [
  {
    value: EXISTING_IMAGE,
    label: 'Use an existing image'
  },
  {
    value: NEW_IMAGE,
    label: 'Build a new image'
  }
]
