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
export const messagesByKind = {
  artifact: {
    title: 'This dialog enable users to register an artifact in Iguazio database. Once a artifact is registered it can be consumed by jobs and workflows.',
    subTitle: 'All you need to do is enter the name of the artifact and the URL (e.g. s3://my-bucket/path).',
    nameTip: 'Artifact names in the same project must be unique'
  },
  dataset: {
    title: 'This dialog enable users to register an artifact as a dataset in Iguazio database. Once the dataset is registered it can be consumed by jobs and workflows.',
    subTitle: 'All you need to do is enter the name of the dataset and the URL (e.g. s3://my-bucket/path).',
    nameTip: 'Dataset names in the same project must be unique'
  }
}
