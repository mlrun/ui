import yaml from 'js-yaml'
import { useCallback, useState } from 'react'

export const useYaml = initialState => {
  const [yamlContent, setYamlContent] = useState(initialState)

  const toggleYamlContent = useCallback(item => {
    if (!item?.ui) {
      return setYamlContent('')
    }

    const json = item.ui?.originalContent ?? {}

    setYamlContent(yaml.dump(json, { lineWidth: -1 }))
  }, [])

  return [yamlContent, toggleYamlContent]
}
