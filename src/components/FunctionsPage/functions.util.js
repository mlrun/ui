export const detailsMenu = ['overview', 'code', 'logs']
export const FUNCTIONS_FAILED_STATES = ['failed', 'error']
export const page = 'FUNCTIONS'
export const tableHeaders = [
  {
    header: 'Name',
    class: 'functions_medium'
  },
  {
    header: 'Kind',
    class: 'functions_small'
  },
  {
    header: 'Hash',
    class: 'functions_small'
  },
  {
    header: 'Updated',
    class: 'functions_small'
  },
  {
    header: 'Command',
    class: 'functions_big'
  },
  {
    header: 'Image',
    class: 'functions_big'
  },
  {
    header: 'Description',
    class: 'functions_small'
  },
  {
    header: '',
    class: 'action_cell'
  }
]
export const infoHeaders = [
  { label: 'Name', id: 'name' },
  { label: 'Kind', id: 'type' },
  { label: 'Hash', id: 'hash' },
  { label: 'Code origin', id: 'codeOrigin' },
  { label: 'Updated', id: 'updated' },
  { label: 'Command', id: 'command' },
  { label: 'Image', id: 'image' },
  { label: 'Description', id: 'description' },
  { label: 'State', id: 'state' }
]
export const filters = [{ type: 'name', label: 'Name:' }]

export const TRANSIENT_FUNCTION_STATUSES = ['pending', 'running']
