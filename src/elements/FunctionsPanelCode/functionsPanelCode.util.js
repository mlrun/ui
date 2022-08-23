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
export const entryOptions = [{ label: 'Source code', id: 'source-code' }]

export const DEFAULT_ENTRY = 'source-code'
export const DEFAULT_IMAGE = 'mlrun/mlrun'
export const sourceCodeInBase64 = {
  job:
    'ZGVmIGhhbmRsZXIoY29udGV4dCk6CiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKCdIZWxsbyB3b3JsZCcp',
  serving:
    'ZnJvbSBjbG91ZHBpY2tsZSBpbXBvcnQgbG9hZAppbXBvcnQgbnVtcHkgYXMgbnAKZnJvbSB0eXBpbmcgaW1wb3J0IExpc3QKaW1wb3J0IG1scnVuCgpjbGFzcyBDbGFzc2lmaWVyTW9kZWwobWxydW4uc2VydmluZy5WMk1vZGVsU2VydmVyKToKICAgIGRlZiBsb2FkKHNlbGYpOgogICAgICAgICIiImxvYWQgYW5kIGluaXRpYWxpemUgdGhlIG1vZGVsIGFuZC9vciBvdGhlciBlbGVtZW50cyIiIgogICAgICAgIG1vZGVsX2ZpbGUsIGV4dHJhX2RhdGEgPSBzZWxmLmdldF9tb2RlbCgnLnBrbCcpCiAgICAgICAgc2VsZi5tb2RlbCA9IGxvYWQob3Blbihtb2RlbF9maWxlLCAncmInKSkKCiAgICBkZWYgcHJlZGljdChzZWxmLCBib2R5OiBkaWN0KSAtPiBMaXN0OgogICAgICAgICIiIkdlbmVyYXRlIG1vZGVsIHByZWRpY3Rpb25zIGZyb20gc2FtcGxlLiIiIgogICAgICAgIGZlYXRzID0gbnAuYXNhcnJheShib2R5WydpbnB1dHMnXSkKICAgICAgICByZXN1bHQ6IG5wLm5kYXJyYXkgPSBzZWxmLm1vZGVsLnByZWRpY3QoZmVhdHMpCiAgICAgICAgcmV0dXJuIHJlc3VsdC50b2xpc3QoKQ=='
}

export const NEW_IMAGE = 'newImage'
export const EXISTING_IMAGE = 'existingImage'
export const FORCE_BUILD = 'forceBuild'

export const generateCodeOptions = mode => [
  {
    value: EXISTING_IMAGE,
    label: 'Use an existing image'
  },
  {
    value: NEW_IMAGE,
    label: 'Build a new image'
  }
  // {
  //   value: FORCE_BUILD,
  //   label: 'Force build',
  //   tip:
  //     'When enabled this forces an image rebuild, if not the same image is used.',
  //   hidden: mode === PANEL_CREATE_MODE
  // }
]
