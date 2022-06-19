import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import appApi from '../api/app-api'

const initialState = {
  frontendSpec: {}
}

export const fetchFrontendSpec = createAsyncThunk('fetchFrontendSpec', () => {
  return appApi.getFrontendSpec().then(({ data }) => {
    return data
  })
})

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchFrontendSpec.fulfilled, (state, { type, payload }) => {
      state.frontendSpec = payload
    })
  }
})
export const { fetchFrontendSpecSuccess } = appSlice.actions

export default appSlice.reducer
