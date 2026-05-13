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
export const commonLanguages = {
  cpp: 'cpp',
  c: 'cpp',
  h: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  hpp: 'cpp',
  hh: 'cpp',
  hxx: 'cpp',
  csharp: 'csharp',
  cs: 'csharp',
  go: 'go',
  java: 'java',
  javascript: 'javascript',
  js: 'javascript',
  jsx: 'javascript',
  python: 'python',
  py: 'python',
  r: 'r',
  ruby: 'ruby',
  rb: 'ruby',
  scala: 'scala',
  shell: 'shell',
  sh: 'shell',
  bash: 'shell',
  sql: 'sql',
  mysql: 'sql',
  pgsql: 'sql',
  typescript: 'typescript',
  ts: 'typescript',
  tsx: 'typescript'
}

export const getEditorLanguage = (fileFormat, descriptiveLanguage) => {
  if (commonLanguages[fileFormat]) {
    return commonLanguages[fileFormat]
  }

  if (descriptiveLanguage) {
    return descriptiveLanguage.split(':')[0]
  }

  return 'plaintext'
}
