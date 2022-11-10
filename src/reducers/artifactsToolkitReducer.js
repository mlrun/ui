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
import artifactsApi from '../api/artifacts-api'
import { hideLoading, showLoading } from './redux.util'

const initialState = {
  loading: false
}

export const addTag = createAsyncThunk('addTag', ({ project, tag, data }) => {
  return artifactsApi.addTag(project, tag, data)
})
export const deleteTag = createAsyncThunk('deleteTag', ({ project, tag, data }) => {
  return artifactsApi.deleteTag(project, tag, data)
})
export const editTag = createAsyncThunk('editTag', ({ project, oldTag, tag, data }) => {
  return artifactsApi.addTag(project, tag, data).then(() => {
    if (oldTag) {
      return artifactsApi.deleteTag(project, oldTag, data)
    }
  })
})
export const replaceTag = createAsyncThunk('replaceTag', ({ project, tag, data }) => {
  return artifactsApi.replaceTag(project, tag, data)
})

const artifactsSlice = createSlice({
  name: 'artifactsStore',
  initialState,
  reducers: {},
  extraReducers: {
    [addTag.pending]: showLoading,
    [addTag.fulfilled]: hideLoading,
    [addTag.rejected]: hideLoading,
    [deleteTag.pending]: showLoading,
    [deleteTag.fulfilled]: hideLoading,
    [deleteTag.rejected]: hideLoading,
    [editTag.pending]: showLoading,
    [editTag.fulfilled]: hideLoading,
    [editTag.rejected]: hideLoading
  }
})

export default artifactsSlice.reducer
