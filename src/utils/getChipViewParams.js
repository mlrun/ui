const chipViewParameters = [
  {
    type: 'labels',
    boldValues: false,
    background: 'purple',
    border: 'none',
    density: 'dense',
    font: 'purple',
    form: 'square'
  },
  {
    type: 'metrics',
    boldValues: false,
    background: 'grey',
    border: 'none',
    density: 'dense',
    font: 'grey',
    form: 'square'
  },
  {
    type: 'parameters',
    boldValues: false,
    background: 'orange',
    border: 'none',
    density: 'dense',
    font: 'orange',
    form: 'square'
  },
  {
    type: 'results',
    boldValues: false,
    background: 'grey',
    border: 'none',
    density: 'dense',
    font: 'primary',
    form: 'square'
  },
  {
    type: 'relations',
    boldValues: false,
    background: 'orange',
    border: 'none',
    density: 'dense',
    font: 'orange',
    form: 'square'
  }
]

export const getChipViewParams = variant =>
  chipViewParameters.find(item => item.type === variant) ?? {}
