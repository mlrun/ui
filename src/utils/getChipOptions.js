const chipOptions = [
  {
    type: 'labels',
    boldValue: false,
    background: 'purple',
    borderColor: 'transparent',
    density: 'dense',
    font: 'purple',
    borderRadius: 'primary'
  },
  {
    type: 'metrics',
    boldValue: false,
    background: 'grey',
    borderColor: 'transparent',
    borderRadius: 'primary',
    density: 'dense',
    font: 'primary'
  },
  {
    type: 'parameters',
    boldValue: false,
    background: 'orange',
    borderColor: 'transparent',
    borderRadius: 'primary',
    density: 'dense',
    font: 'orange'
  },
  {
    type: 'results',
    boldValue: false,
    background: 'grey',
    borderColor: 'transparent',
    borderRadius: 'primary',
    density: 'dense',
    font: 'primary'
  },
  {
    type: 'relations',
    boldValue: false,
    background: 'orange',
    borderColor: 'transparent',
    borderRadius: 'primary',
    density: 'dense',
    font: 'orange'
  }
]

export const getChipOptions = variant =>
  chipOptions.find(item => item.type === variant)
