/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
