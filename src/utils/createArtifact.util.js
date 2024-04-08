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
const artifactSubTitle =
  'Assign it a unique combination of name and tag, and specify its path (for example, s3://mybucket/path).'

export const createArtifactMessages = {
  artifact: {
    title:
      'Register an artifact in MLRun so it can be used, for example, by functions, jobs, and pipelines.',
    subTitle: artifactSubTitle,
    overwriteConfirmTitle: 'Overwrite artifact?',
    overwriteConfirmMessage:
      'That combination of artifact name and artifact tag is already in use. If you continue, the current artifact will be overwritten.'
  },
  dataset: {
    title:
      'Register a dataset as an artifact in MLRun so it can be used, for example, by functions, jobs, and pipelines.',
    subTitle: artifactSubTitle,
    overwriteConfirmTitle: 'Overwrite dataset?',
    overwriteConfirmMessage:
      'That combination of dataset name and dataset tag is already in use. If you continue, the current dataset will be overwritten.'
  }
}

export const createModelMessages = {
  overwriteConfirmTitle: 'Overwrite model?',
  overwriteConfirmMessage:
    'That combination of model name and model tag is already in use. If you continue, the current model will be overwritten.'
}
