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
import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import DetailsAnalysis from '../../DetailsAnalysis/DetailsAnalysis'
import DetailsArtifacts from '../../DetailsArtifacts/DetailsArtifacts'
import DetailsCode from '../../DetailsCode/DetailsCode'
import DetailsDriftAnalysis from '../../DetailsDriftAnalysis/DetailsDriftAnalysis'
import DetailsFeatureAnalysis from '../../DetailsFeaturesAnalysis/DetailsFeaturesAnalysis'
import DetailsInfo from '../../DetailsInfo/DetailsInfo'
import DetailsInputs from '../../DetailsInputs/DetailsInputs'
import DetailsLogs from '../../DetailsLogs/DetailsLogs'
import DetailsMetadata from '../../DetailsMetadata/DetailsMetadata'
import DetailsMetrics from '../../DetailsMetrics/DetailsMetrics'
import DetailsPods from '../../DetailsPods/DetailsPods'
import DetailsPreview from '../../DetailsPreview/DetailsPreview'
import DetailsRequestedFeatures from '../../DetailsRequestedFeatures/DetailsRequestedFeatures'
import DetailsResults from '../../DetailsResults/DetailsResults'
import DetailsStatistics from '../../DetailsStatistics/DetailsStatistics'
import DetailsTransformations from '../../DetailsTransformations/DetailsTransformations'
import NoData from '../../../common/NoData/NoData'

import { isJobKindDask, JOB_STEADY_STATES } from '../../Jobs/jobs.util'

import {
  DETAILS_ANALYSIS_TAB,
  DETAILS_ARTIFACTS_TAB,
  DETAILS_BUILD_LOG_TAB,
  DETAILS_CODE_TAB,
  DETAILS_DRIFT_ANALYSIS_TAB,
  DETAILS_FEATURES_ANALYSIS_TAB,
  DETAILS_FEATURES_TAB,
  DETAILS_INPUTS_TAB,
  DETAILS_LOGS_TAB,
  DETAILS_METADATA_TAB,
  DETAILS_METRICS_TAB,
  DETAILS_OVERVIEW_TAB,
  DETAILS_PODS_TAB,
  DETAILS_PREVIEW_TAB,
  DETAILS_REQUESTED_FEATURES_TAB,
  DETAILS_RESULTS_TAB,
  DETAILS_RETURNED_FEATURES_TAB,
  DETAILS_STATISTICS_TAB,
  DETAILS_TRANSFORMATIONS_TAB
} from '../../../constants'

const DetailsTabsContent = ({
  applyChangesRef,
  formState,
  handlePreview,
  pageData,
  selectedItem,
  setChanges,
  setChangesCounter,
  setChangesData,
  setIteration,
  setIterationOption
}) => {
  const detailsStore = useSelector(store => store.detailsStore)
  const params = useParams()

  switch (params.tab) {
    case DETAILS_OVERVIEW_TAB:
      return (
        <DetailsInfo
          detailsStore={detailsStore}
          formState={formState}
          pageData={pageData}
          ref={applyChangesRef}
          selectedItem={selectedItem}
          setChangesCounter={setChangesCounter}
          setChangesData={setChangesData}
        />
      )
    case DETAILS_DRIFT_ANALYSIS_TAB:
      return <DetailsDriftAnalysis />
    case DETAILS_PODS_TAB:
      return (
        !isJobKindDask(selectedItem?.labels) && (
          <DetailsPods
            noDataMessage={
              selectedItem.reason
                ? selectedItem.reason
                : `Pods not found, it is likely because Kubernetes removed these pods listing ${
                    JOB_STEADY_STATES.includes(selectedItem.state.value)
                      ? 'after their completion'
                      : ''
                  }`
            }
          />
        )
      )
    case DETAILS_FEATURES_ANALYSIS_TAB:
      return <DetailsFeatureAnalysis />
    case DETAILS_METRICS_TAB:
      return <DetailsMetrics />
    case DETAILS_PREVIEW_TAB:
      return <DetailsPreview artifact={selectedItem} handlePreview={handlePreview} />
    case DETAILS_INPUTS_TAB:
      return <DetailsInputs inputs={selectedItem.inputs} />
    case DETAILS_ARTIFACTS_TAB:
      return (
        <DetailsArtifacts
          allowSortBy={['name', 'updated']}
          defaultSortBy="name"
          defaultDirection="asc"
          iteration={detailsStore.iteration}
          selectedItem={selectedItem}
          setIteration={setIteration}
          setIterationOption={setIterationOption}
        />
      )
    case DETAILS_RESULTS_TAB:
      return (
        <DetailsResults
          defaultSortBy={0}
          defaultDirection="asc"
          excludeSortBy="state"
          job={selectedItem}
        />
      )
    case DETAILS_LOGS_TAB:
    case DETAILS_BUILD_LOG_TAB:
      return (
        <DetailsLogs
          item={selectedItem}
          refreshAdditionalLogs={pageData.details.refreshAdditionalLogs}
          refreshLogs={pageData.details.refreshLogs}
          removeAdditionalLogs={pageData.details.removeAdditionalLogs}
          removeLogs={pageData.details.removeLogs}
          withLogsRefreshBtn={pageData.details.withLogsRefreshBtn}
        />
      )
    case DETAILS_CODE_TAB:
      return (
        <DetailsCode
          code={
            selectedItem.build.functionSourceCode ??
            selectedItem.base_spec.spec?.build?.functionSourceCode
          }
        />
      )
    case DETAILS_METADATA_TAB:
    case DETAILS_FEATURES_TAB:
    case DETAILS_RETURNED_FEATURES_TAB:
      return detailsStore.modelFeatureVectorData.features ??
        (selectedItem.schema ||
          selectedItem.entities ||
          selectedItem.features ||
          selectedItem.inputs ||
          selectedItem.outputs) ? (
        <DetailsMetadata
          selectedItem={
            selectedItem.schema ||
            selectedItem.entities ||
            selectedItem.features ||
            selectedItem.inputs ||
            selectedItem.outputs ||
            !detailsStore.modelFeatureVectorData.features
              ? selectedItem
              : detailsStore.modelFeatureVectorData
          }
        />
      ) : null
    case DETAILS_TRANSFORMATIONS_TAB:
      return <DetailsTransformations selectedItem={selectedItem} />
    case DETAILS_ANALYSIS_TAB:
      if ((selectedItem.kind === 'dataset' && selectedItem.extra_data) || selectedItem.analysis) {
        return <DetailsAnalysis artifact={selectedItem} />
      } else return <NoData />
    case DETAILS_STATISTICS_TAB:
      if (
        detailsStore.modelFeatureVectorData.stats ||
        selectedItem.stats ||
        selectedItem.feature_stats
      ) {
        return (
          <DetailsStatistics
            selectedItem={
              selectedItem?.stats ||
              selectedItem.feature_stats ||
              !detailsStore.modelFeatureVectorData.stats
                ? selectedItem
                : detailsStore.modelFeatureVectorData.stats
            }
          />
        )
      } else return <NoData />
    case DETAILS_REQUESTED_FEATURES_TAB:
      return (
        <DetailsRequestedFeatures
          changes={detailsStore.changes}
          formState={formState}
          selectedItem={selectedItem}
          setChanges={setChanges}
          setChangesData={setChangesData}
          setChangesCounter={setChangesCounter}
        />
      )
    default:
      return null
  }
}

DetailsTabsContent.propTypes = {
  handlePreview: PropTypes.func.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setChanges: PropTypes.func.isRequired,
  setChangesCounter: PropTypes.func.isRequired,
  setChangesData: PropTypes.func.isRequired,
  setIteration: PropTypes.func.isRequired,
  setIterationOption: PropTypes.func.isRequired
}

export default React.memo(DetailsTabsContent)
