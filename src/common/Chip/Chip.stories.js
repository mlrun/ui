import React from 'react'

import Chip from './Chip'

export default {
  title: 'Example/Chip',
  component: Chip
}

const commonArgs = {
  chip: { value: 'Key: Value' },
  chipOptions: {
    background: 'purple',
    boldValue: false,
    borderRadius: 'primary',
    borderColor: 'transparent',
    density: 'dense',
    font: 'purple'
  }
}

const Template = args => <Chip {...args} />

export const LabelChip = Template.bind({})
LabelChip.args = {
  ...commonArgs,
  chipOptions: {
    background: 'purple',
    boldValue: false,
    borderRadius: 'primary',
    borderColor: 'transparent',
    density: 'dense',
    font: 'purple'
  }
}

export const MetricsChip = Template.bind({})
MetricsChip.args = {
  ...commonArgs,
  chipOptions: {
    background: 'grey',
    boldValue: false,
    borderColor: 'transparent',
    borderRadius: 'primary',
    density: 'dense',
    font: 'primary'
  }
}

export const ParametersChip = Template.bind({})
ParametersChip.args = {
  ...commonArgs,
  chipOptions: {
    background: 'orange',
    boldValue: false,
    borderColor: 'transparent',
    borderRadius: 'primary',
    density: 'dense',
    font: 'orange'
  }
}

export const GreenChip = Template.bind({})
GreenChip.args = {
  ...commonArgs,
  chipOptions: {
    background: 'green',
    boldValue: false,
    borderColor: 'transparent',
    borderRadius: 'primary',
    density: 'dense',
    font: 'green'
  }
}

export const DensePurpleChip = Template.bind({})
DensePurpleChip.args = {
  ...commonArgs,
  chipOptions: {
    background: 'purple',
    boldValue: true,
    borderRadius: 'primary',
    borderColor: 'purple',
    density: 'dense',
    font: 'purple'
  }
}

export const DenseGreyChip = Template.bind({})
DenseGreyChip.args = {
  ...commonArgs,
  chipOptions: {
    background: 'grey',
    boldValue: true,
    borderColor: 'grey',
    borderRadius: 'primary',
    density: 'dense',
    font: 'primary'
  }
}

export const DenseOrangeChip = Template.bind({})
DenseOrangeChip.args = {
  ...commonArgs,
  chipOptions: {
    background: 'orange',
    boldValue: true,
    borderColor: 'orange',
    borderRadius: 'primary',
    density: 'dense',
    font: 'orange'
  }
}

export const DenseGreenChip = Template.bind({})
DenseGreenChip.args = {
  ...commonArgs,
  chipOptions: {
    background: 'green',
    boldValue: true,
    borderColor: 'green',
    borderRadius: 'primary',
    density: 'dense',
    font: 'green'
  }
}

export const DenseAmethystChip = Template.bind({})
DenseAmethystChip.args = {
  ...commonArgs,
  chipOptions: {
    background: 'amethyst',
    boldValue: false,
    borderColor: 'transparent',
    borderRadius: 'primary',
    density: 'dense',
    font: 'white'
  }
}

export const DenseJavaChip = Template.bind({})
DenseJavaChip.args = {
  ...commonArgs,
  chipOptions: {
    background: 'java',
    boldValue: false,
    borderColor: 'transparent',
    borderRadius: 'primary',
    density: 'dense',
    font: 'white'
  }
}

export const DenseSorbusChip = Template.bind({})
DenseSorbusChip.args = {
  ...commonArgs,
  chipOptions: {
    background: 'sorbus',
    boldValue: false,
    borderColor: 'transparent',
    borderRadius: 'primary',
    density: 'dense',
    font: 'white'
  }
}

export const LabelChipNormal = Template.bind({})
LabelChipNormal.args = {
  ...commonArgs,
  chipOptions: {
    background: 'none',
    boldValue: false,
    borderRadius: 'secondary',
    borderColor: 'purple',
    density: 'normal',
    font: 'purple'
  }
}

export const MetricsChipNormal = Template.bind({})
MetricsChipNormal.args = {
  ...commonArgs,
  chipOptions: {
    background: 'none',
    boldValue: false,
    borderColor: 'grey',
    borderRadius: 'secondary',
    density: 'normal',
    font: 'primary'
  }
}

export const ParametersChipNormal = Template.bind({})
ParametersChipNormal.args = {
  ...commonArgs,
  chipOptions: {
    background: 'none',
    boldValue: false,
    borderColor: 'orange',
    borderRadius: 'secondary',
    density: 'normal',
    font: 'orange'
  }
}

export const GreenChipNormal = Template.bind({})
GreenChipNormal.args = {
  ...commonArgs,
  chipOptions: {
    background: 'none',
    boldValue: false,
    borderColor: 'green',
    borderRadius: 'secondary',
    density: 'normal',
    font: 'green'
  }
}

export const LabelChipMedium = Template.bind({})
LabelChipMedium.args = {
  ...commonArgs,
  chipOptions: {
    background: 'purple',
    boldValue: true,
    borderRadius: 'secondary',
    borderColor: 'purple',
    density: 'medium',
    font: 'purple'
  }
}

export const MetricsChipMedium = Template.bind({})
MetricsChipMedium.args = {
  ...commonArgs,
  chipOptions: {
    background: 'grey',
    boldValue: true,
    borderColor: 'grey',
    borderRadius: 'secondary',
    density: 'medium',
    font: 'primary'
  }
}

export const ParametersChipMedium = Template.bind({})
ParametersChipMedium.args = {
  ...commonArgs,
  chipOptions: {
    background: 'orange',
    boldValue: true,
    borderColor: 'orange',
    borderRadius: 'secondary',
    density: 'medium',
    font: 'orange'
  }
}

export const GreenChipMedium = Template.bind({})
GreenChipMedium.args = {
  ...commonArgs,
  chipOptions: {
    background: 'green',
    boldValue: true,
    borderColor: 'green',
    borderRadius: 'secondary',
    density: 'medium',
    font: 'green'
  }
}
