import { generateProjectActionsMenu } from './projects.util'

const createProject = name => ({ metadata: { name }, status: { state: 'online' } })

const getDeleteAction = (projects, deletingProjects, name) =>
  generateProjectActionsMenu(projects, deletingProjects)[name][0].find(
    action => action.label === 'Delete'
  )

describe('generateProjectActionsMenu', () => {
  it('should disable (not hide) the Delete action for the "default" project', () => {
    const deleteAction = getDeleteAction([createProject('default')], {}, 'default')

    expect(deleteAction.disabled).toBe(true)
    expect(deleteAction.hidden).toBeFalsy()
  })

  it('should keep the Delete action enabled for other projects', () => {
    const deleteAction = getDeleteAction([createProject('my-project')], {}, 'my-project')

    expect(deleteAction.disabled).toBe(false)
  })

  it('should disable the Delete action for a project that is being deleted', () => {
    const deleteAction = getDeleteAction(
      [createProject('my-project')],
      { task1: 'my-project' },
      'my-project'
    )

    expect(deleteAction.disabled).toBe(true)
  })
})
