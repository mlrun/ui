import { getArtifactReference } from './resources'
import {
  AZURE_STORAGE_INPUT_PATH_SCHEME,
  GOOGLE_STORAGE_INPUT_PATH_SCHEME,
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  S3_INPUT_PATH_SCHEME,
  V3IO_INPUT_PATH_SCHEME
} from '../constants'

export const generateProjectsList = (projectsList, currentProject) =>
  projectsList
    .map(projectItem => ({
      label:
        projectItem.metadata.name === currentProject
          ? 'Current project'
          : projectItem.metadata.name,
      id: projectItem.metadata.name
    }))
    .sort((prevProject, nextProject) => {
      return prevProject.id === currentProject
        ? -1
        : nextProject.id === currentProject
        ? 1
        : prevProject.id.localeCompare(nextProject.id)
    })

export const generateArtifactsList = artifacts =>
  artifacts
    .map(artifact => {
      const key = artifact.link_iteration
        ? artifact.link_iteration.db_key
        : artifact.key ?? ''
      return {
        label: key,
        id: key
      }
    })
    .filter(artifact => artifact.label !== '')
    .sort((prevArtifact, nextArtifact) =>
      prevArtifact.id.localeCompare(nextArtifact.id)
    )

export const generateArtifactsReferencesList = artifacts =>
  artifacts
    .map(artifact => {
      const artifactReference = getArtifactReference(artifact)

      return {
        label: artifactReference,
        id: artifactReference,
        customDelimiter: artifactReference[0]
      }
    })
    .filter(reference => reference.label !== '')
    .sort((prevRef, nextRef) => {
      const [prevRefIter, prevRefTree] = prevRef.id.split('@')
      const [nextRefIter, nextRefTree] = nextRef.id.split('@')

      if (prevRefTree === nextRefTree) {
        return prevRefIter.localeCompare(nextRefIter)
      } else {
        return prevRefTree.localeCompare(nextRefTree)
      }
    })

export const pathPlaceholders = {
  [MLRUN_STORAGE_INPUT_PATH_SCHEME]: 'artifacts/my-project/my-artifact:my-tag',
  [S3_INPUT_PATH_SCHEME]: 'bucket/path',
  [GOOGLE_STORAGE_INPUT_PATH_SCHEME]: 'bucket/path',
  [AZURE_STORAGE_INPUT_PATH_SCHEME]: 'container/path',
  [V3IO_INPUT_PATH_SCHEME]: 'container-name/file'
}
