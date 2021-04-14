import { FEATURE_SETS_TAB, FEATURE_VECTORS_TAB } from '../constants'

export const generateUsageSnippets = pageTab => {
  let snippetsData = {}

  if (pageTab === FEATURE_SETS_TAB) {
    snippetsData = {
      title: 'Get offline features for training:',
      code: `features = [
              "<feature set>.*",
             ]
             vector = FeatureVector(features=features)
             resp = get_offline_features(
              vector, entity_rows=<entity>, entity_timestamp_column="<entity timestamp column"
             )
             print(resp.to_dataframe())
             print(vector.get_stats_table())
             resp.to_parquet("./out.parquet")`
    }
  }

  if (pageTab === FEATURE_VECTORS_TAB) {
    snippetsData = {
      title: 'Getting online features:',
      code: `svc = get_online_feature_service(vector_uri)
              resp = svc.get([{"key": "value"}, {"key": "value"}])
              print(resp)
              
              
              resp = svc.get([{"key": "value"}], as_list=True)
              print(resp)`
    }
  }

  return snippetsData
}
