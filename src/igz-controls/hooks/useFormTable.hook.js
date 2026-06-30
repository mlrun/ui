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
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { get, omit } from 'lodash'
import { ARRAY_ERROR } from 'final-form'

export const useFormTable = (formState, exitEditModeTriggerItem, onExitEditModeCallback) => {
  // `editingItem` should contain the `data` object with all fields that are used in the `formState`.
  // Properties that aren't used in the `formState` should be placed directly in the `editingItem` object
  // `editingItem` also has an `ui` property which is used internally in this hook
  //
  // e.g.
  // editingItem = {
  //   data: {
  //     <fieldName>: <fieldValue>,
  //     <fieldName2>: <fieldValue2>
  //   },
  //   <anotherProperty>: <anotherPropertyValue>
  //   ui: {
  //     isNew: <true|false>, // `true` if we are creating a new row, if we are editing it's `false`
  //     fieldsPath: <"the.path">, // the path where table data is placed in the `formState`
  //     index: <0|1|...> // index of the editing row
  //   }
  // }
  const [editingItem, setEditingItem] = useState(null)
  const editingItemRef = useRef(null)
  const editingItemErrorsRef = useRef(null)
  const formStateRef = useRef(null)
  const bottomScrollRef = useRef(null)
  const onExitEditModeCallbackRef = useRef(onExitEditModeCallback)

  useLayoutEffect(() => {
    const tableErrors = get(formState?.errors, editingItem?.ui.fieldsPath, [])
    editingItemErrorsRef.current = get(tableErrors, editingItem?.ui.index, null)
  }, [editingItem?.ui.fieldsPath, editingItem?.ui.index, formState?.errors])

  useLayoutEffect(() => {
    formStateRef.current = formState
  }, [formState])

  useLayoutEffect(() => {
    onExitEditModeCallbackRef.current = onExitEditModeCallback
  }, [onExitEditModeCallback])

  const exitEditMode = () => {
    if (editingItemRef.current?.data) {
      Object.entries(editingItemRef.current?.data).forEach(([fieldName]) => {
        formStateRef.current?.form.mutators.setFieldState(
          `${editingItemRef.current?.ui.fieldsPath}[${editingItemRef.current?.ui.index}].data.${fieldName}`,
          {
            modified: false
          }
        )
      })
    }

    editingItemRef.current = null
    setEditingItem(null)
    onExitEditModeCallbackRef?.current && onExitEditModeCallbackRef.current()
  }

  useEffect(() => {
    const applyOrDiscardOrDeleteInEffect = () => {
      if (editingItemRef?.current) {
        if (!editingItemErrorsRef.current) {
          exitEditMode()
        } else {
          if (editingItemRef.current?.ui?.isNew) {
            const values = get(formStateRef.current.values, editingItemRef.current?.ui.fieldsPath)

            if (values?.length > 1) {
              formStateRef.current.form.mutators.remove(
                editingItemRef.current?.ui.fieldsPath,
                editingItemRef.current?.ui.index
              )
            } else {
              formStateRef.current.form.change(editingItemRef.current?.ui.fieldsPath, [])
            }
          } else {
            formStateRef.current.form.mutators.update(
              editingItemRef.current?.ui.fieldsPath,
              editingItemRef.current?.ui.index,
              omit(editingItemRef.current, ['ui'])
            )
          }

          exitEditMode()
        }
      }
    }

    return () => {
      applyOrDiscardOrDeleteInEffect()
    }
  }, [exitEditModeTriggerItem])

  const addNewRow = (event, fields, fieldsPath, newItem) => {
    applyOrDiscardOrDelete(event)
    formStateRef.current.form.mutators.push(fieldsPath, newItem)
    setEditingItem(() => {
      const newEditingItem = {
        ...newItem,
        ui: {
          isNew: true,
          fieldsPath,
          index: fields.value?.length || 0
        }
      }
      editingItemRef.current = newEditingItem

      return newEditingItem
    })

    scrollIntoView()
  }

  const applyChanges = (event, index) => {
    if (editingItemRef.current) {
      if (!editingItemErrorsRef.current) {
        if (editingItemRef.current?.ui.isNew) {
          scrollIntoView()
        }

        exitEditMode()
      } else {
        // Mark all empty fields as `modified` in order to highlight the error if the field is invalid
        Object.entries(editingItemErrorsRef.current?.data).forEach(([fieldName]) => {
          formStateRef.current?.form.mutators.setFieldState(
            `${editingItemRef.current?.ui.fieldsPath}[${index}].data.${fieldName}`,
            {
              modified: true
            }
          )
        })
      }
    }
  }

  const deleteRow = (event, fieldsPath, index) => {
    if (editingItemRef.current && index !== editingItemRef.current.ui.index) {
      applyOrDiscardOrDelete(event)
    }

    const values = get(formStateRef.current.values, fieldsPath)

    if (values?.length > 1) {
      formStateRef.current.form.mutators.remove(fieldsPath, index)
    } else {
      formStateRef.current.form.change(fieldsPath, [])
    }

    exitEditMode()
    event && event.stopPropagation()
  }

  const discardChanges = (event, fieldsPath, index) => {
    formStateRef.current.form.mutators.update(
      fieldsPath,
      index,
      omit(editingItemRef.current, ['ui'])
    )
    exitEditMode()
    event && event.stopPropagation()
  }

  const discardOrDelete = (event, fieldsPath, index) => {
    if (!editingItemRef.current || editingItemRef.current?.ui?.isNew) {
      deleteRow(event, fieldsPath, index)
    } else {
      discardChanges(event, fieldsPath, index)
    }
  }

  const applyOrDiscardOrDelete = (event = null) => {
    if (editingItemRef?.current) {
      if (!editingItemErrorsRef.current) {
        applyChanges(event, editingItemRef.current?.ui.index)
      } else {
        discardOrDelete(
          event,
          editingItemRef.current?.ui.fieldsPath,
          editingItemRef.current?.ui.index
        )
      }
    }
  }

  const enterEditMode = (event, fields, fieldsPath, index) => {
    applyOrDiscardOrDelete(event)

    setTimeout(() => {
      const editItem = fields.value[index]

      setEditingItem(() => {
        const newEditingItem = { ...editItem, ui: { fieldsPath, index } }
        editingItemRef.current = newEditingItem

        return newEditingItem
      })
    })
  }

  const scrollIntoView = () => {
    if (bottomScrollRef.current) {
      setTimeout(() => {
        bottomScrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    }
  }

  const isCurrentRowEditing = rowPath => {
    return (
      editingItemRef?.current &&
      `${editingItemRef.current.ui.fieldsPath}[${editingItemRef.current.ui.index}]` === rowPath
    )
  }

  const getTableArrayErrors = fieldsPath => {
    if (formState.submitFailed && formState.invalid) {
      return get(formState, `errors.${fieldsPath}.${ARRAY_ERROR}`, [])
    } else {
      return []
    }
  }

  return {
    addNewRow,
    applyChanges,
    applyOrDiscardOrDelete,
    bottomScrollRef,
    deleteRow,
    discardChanges,
    discardOrDelete,
    editingItem,
    editingItemRef,
    enterEditMode,
    exitEditMode,
    getTableArrayErrors,
    isCurrentRowEditing
  }
}
