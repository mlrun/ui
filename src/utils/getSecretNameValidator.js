export const getSecretNameValidator = (projectName, initialSecretName) => {
  return {
    name: 'secretProhibitedNames',
    label: "Secret name is not deprecated and it doesn't include the name of another project",
    pattern: secretName => {
      // if prohibited secret was set before (we get it from BE) we accept it as valid
      if (secretName && secretName === initialSecretName) return true

      if (secretName.startsWith('mlrun-auth-secrets.')) return false

      const correctPatternBeginning = 'mlrun-project-secrets-' // mlrun-project-secrets-{project-name}

      if (secretName.startsWith(correctPatternBeginning)) {
        const secretProjectName = secretName.slice(correctPatternBeginning.length)

        return secretProjectName === projectName
      }

      return true
    }
  }
}

