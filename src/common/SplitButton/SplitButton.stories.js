import React from 'react'
import { SplitButton } from './SplitButton.js'
import Select from '../Select/Select'

export default {
  title: 'Example/SplitBtn',
  component: SplitButton,
  subcomponents: { Select }
}
let options = [
  {
    id: 1,
    text: 'text1',
    handler: function() {
      console.log(this.text)
    }
  },
  {
    id: 2,
    text: 'text2',
    handler: function() {
      console.log(this.text)
    }
  },
  {
    id: 3,
    text: 'text3',
    handler: function() {
      console.log(this.text)
    }
  },
  {
    id: 4,
    text: 'text4',
    handler: function() {
      console.log(this.text)
    }
  }
]
let mainEvent = {
  id: 'ev22',
  text: 'Main Event',
  handler: () => console.log('main event')
}

const Template = args => <SplitButton {...args} />

export const PrimarySplit = Template.bind({})
PrimarySplit.args = {
  type: 'primary',
  options: options,
  mainEvent: mainEvent,
  Tag: Select
}

export const SecondarySplit = Template.bind({})
SecondarySplit.args = {
  type: 'secondary',
  options: options,
  mainEvent: mainEvent
}

export const TertiarySplit = Template.bind({})
TertiarySplit.args = {
  type: 'tertiary',
  options: options,
  mainEvent: mainEvent
}
