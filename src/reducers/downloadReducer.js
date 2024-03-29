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
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  downloadList: [],
  showDownloadsList: false
}

const downloadSlice = createSlice({
  name: 'download',
  initialState,
  reducers: {
    setDownloadItem(state, { payload }) {
      if (payload.error) {
        /* eslint-disable-next-line no-console */
        console.error(payload.error)
      }

      state.downloadList.push(payload)
    },
    setShowDownloadsList(state, { payload }) {
      state.showDownloadsList = payload
    },
    removeDownloadItem(state, { payload }) {
      state.downloadList = state.downloadList.filter(item => item.id !== payload)
    }
  }
})

export const { setDownloadItem, setShowDownloadsList, removeDownloadItem } = downloadSlice.actions

export default downloadSlice.reducer
