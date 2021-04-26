export const parseFeatureTemplate = (featureTemplate, defaultProjectName) => {
  const { project, featureSet, tag, feature, alias } =
    featureTemplate.match(
      /^((?<project>.+?)\/)?(?<featureSet>.+?)(:(?<tag>.+?))?\.(?<feature>.+?)(\s+as\s+(?<alias>.*))?$/
    )?.groups ?? {}

  return {
    project: project ?? defaultProjectName ?? '',
    featureSet: featureSet ?? '',
    tag: tag ?? '',
    feature: feature ?? '',
    alias: alias ?? '',
    originalTemplate: featureTemplate
  }
}
