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
export const selectOptions = {
  repeatInterval: [
    { label: 'Minute', id: 'minute' },
    { label: 'Hourly', id: 'hour' },
    { label: 'Daily', id: 'day' },
    { label: 'Weekly', id: 'week' },
    { label: 'Monthly', id: 'month' }
  ],
  repeatEnd: [
    { label: 'Never', id: 'never' },
    { label: 'On date', id: 'onDate' },
    { label: 'After', id: 'after' }
  ],
  minute: [
    { label: '10', id: '10' },
    { label: '15', id: '15' },
    { label: '20', id: '20' },
    { label: '30', id: '30' }
  ],
  hour: [
    { label: '1', id: '1' },
    { label: '2', id: '2' },
    { label: '3', id: '3' },
    { label: '4', id: '4' },
    { label: '6', id: '6' },
    { label: '12', id: '12' }
  ]
}
