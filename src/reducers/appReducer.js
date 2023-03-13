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
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import appApi from '../api/app-api'
import { openPopUp } from 'igz-controls/utils/common.util'
import { ConfirmDialog } from 'igz-controls/components'
import { GATEWAY_TIMEOUT_STATUS_CODE } from 'igz-controls/constants'
import { isEmpty } from 'lodash'

const initialState = {
  frontendSpec: {},
  frontendSpecPopupIsOpened: false
}

export const fetchFrontendSpec = createAsyncThunk(
  'fetchFrontendSpec',
  ({ frontendSpec, frontendSpecPopupIsOpened }) => {
    const headers = {}
    const mlrunVersion = localStorage.getItem('mlrunVersion')

    if (mlrunVersion) {
      headers['x-mlrun-ui-version'] = mlrunVersion
    }

    return appApi
      .getFrontendSpec({ headers })
      .then(({ data, headers }) => {
        if (headers['x-mlrun-be-version']) {
          localStorage.setItem('mlrunVersion', headers['x-mlrun-be-version'])
        }

        if (headers['x-mlrun-ui-clear-cache']) {
          window.location.reload(true)
        }

        return data
      })
      .catch(error => {
        if (
          error.response.status === GATEWAY_TIMEOUT_STATUS_CODE &&
          isEmpty(frontendSpec) &&
          !frontendSpecPopupIsOpened
        ) {
          openPopUp(ConfirmDialog, {
            header: 'Something went wrong.',
            message: `There is a problem fetching the data. Check your network connection and try to refresh the browser.${
              window.localStorage.getItem('mlrunUi.headerHidden') === 'true'
                ? ' If the problem persists, contact customer support.'
                : ''
            }`
          })
        }

        throw error
      })
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleFrontendSpecPopup(state, action) {
      state.frontendSpecPopupIsOpened = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchFrontendSpec.fulfilled, (state, { payload }) => {
      state.frontendSpec = payload
    })
    builder.addCase(fetchFrontendSpec.rejected, (state, action) => {
      state.frontendSpecPopupIsOpened = true
    })
  }
})

export default appSlice.reducer
