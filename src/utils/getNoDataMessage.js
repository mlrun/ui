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
import { isEqual} from 'lodash'
import {
    ADD_TO_FEATURE_VECTOR_TAB,
    DATASETS_PAGE,
    DATE_FILTER_ANY_TIME,
    DATE_RANGE_TIME_FILTER,
    FEATURE_SETS_TAB,
    FEATURE_VECTORS_TAB,
    FEATURES_TAB, FILES_PAGE, FUNCTIONS_PAGE,
    GROUP_BY_FILTER,
    GROUP_BY_NONE,
    ITERATIONS_FILTER, JOBS_PAGE,
    LABELS_FILTER, MODEL_ENDPOINTS_TAB, MODELS_TAB,
    NAME_FILTER, REAL_TIME_PIPELINES_TAB,
    SHOW_ITERATIONS,
    SHOW_UNTAGGED_FILTER,
    SHOW_UNTAGGED_ITEMS,
    STATE_FILTER_ALL_ITEMS,
    STATUS_FILTER,
    TAG_FILTER,
    TAG_FILTER_ALL_ITEMS
} from '../constants'

const messageNamesList = {
    [ADD_TO_FEATURE_VECTOR_TAB]: {
        single: 'Feature',
        plural: 'Features'
    },
    [DATASETS_PAGE]: {
        single: 'Dataset',
        plural: 'Datasets'
    },
    [FEATURE_SETS_TAB]: {
        single: 'Feature-Set',
        plural: 'Feature-Sets'
    },
    [FEATURE_VECTORS_TAB]: {
        single: 'Feature-Vector',
        plural: 'Feature-Vectors'
    },
    [FEATURES_TAB]: {
        single: 'Feature',
        plural: 'Features'
    },
    [FILES_PAGE]: {
        single: 'File',
        plural: 'Files'
    },
    [FUNCTIONS_PAGE]: {
        single: 'Function',
        plural: 'Functions'
    },
    [JOBS_PAGE]: {
        single: 'Job',
        plural: 'Jobs'
    },
    [MODELS_TAB]: {
        single: 'Model',
        plural: 'Models'
    },
    [MODEL_ENDPOINTS_TAB]: {
        single: 'Model-endpoint',
        plural: 'Model-endpoints'
    },
    [REAL_TIME_PIPELINES_TAB]: {
        single: 'Real-time pipeline',
        plural: 'Real-time pipelines'
    },
    default: ''
}

export const getNoDataMessage = (filtersStore, filters, page, tab) => {
    const messageNames = messageNamesList[tab] || messageNamesList[page] || messageNamesList.default

    if (!messageNames) {
        return 'No data to show'
    } else {
        const changedFiltersList = getChangedFiltersList(filters, filtersStore)

        return changedFiltersList.length > 0 ?
            generateNoEntriesFoundMessage(changedFiltersList, filtersStore, messageNames) :
            generateEmptyListMessage(messageNames, tab)
    }
}

const generateEmptyListMessage = (messageNames, tab) => {
    if ([MODEL_ENDPOINTS_TAB, REAL_TIME_PIPELINES_TAB].includes(tab)) {
        return 'No data to show'
    }

    if ([FEATURES_TAB, ADD_TO_FEATURE_VECTOR_TAB].includes(tab)) {
        return 'No features yet. Go to "Feature Sets" tab to create your first Feature Set.'
    }

    return `No ${messageNames.plural} yet. Create your first ${messageNames.single} now.`
}

const generateNoEntriesFoundMessage = (changedFilters, filtersStore, messageNames) => {
    return changedFilters.reduce((message, filter, index) => {
        const label = [ITERATIONS_FILTER, SHOW_UNTAGGED_ITEMS].includes(filter.type) ? `${filter.label}:` :
            filter.type === DATE_RANGE_TIME_FILTER ? 'Date:' : filter.label
        const value = [ITERATIONS_FILTER, SHOW_UNTAGGED_ITEMS].includes(filter.type) ? 'true' :
            filter.type === DATE_RANGE_TIME_FILTER ? 'Selected time' : filter.type === STATUS_FILTER ?
                filtersStore['state'] : filtersStore[filter.type]
        const isLastElement = index === changedFilters.length - 1

        return message + `${label} ${value}${isLastElement ? '"' : ', '}`
    }, `There is no ${messageNames.plural} data to show for "`)
}

const getChangedFiltersList = (filters, filtersStore) => {
    if (!filters || !filtersStore) {
        return []
    }

    return filters.filter(({ type }) => {
        return (
            ((type === TAG_FILTER) &&
                filtersStore.tag !== TAG_FILTER_ALL_ITEMS) ||
            ((type === NAME_FILTER || type === LABELS_FILTER) && filtersStore[type].length > 0) ||
            (type === STATUS_FILTER && filtersStore.state !== STATE_FILTER_ALL_ITEMS) ||
            (type === DATE_RANGE_TIME_FILTER &&
                !isEqual(filtersStore.dates.value, DATE_FILTER_ANY_TIME)) ||
            (type === ITERATIONS_FILTER && filtersStore.iter === SHOW_ITERATIONS) ||
            (type === SHOW_UNTAGGED_FILTER && filtersStore.showUntagged !== SHOW_UNTAGGED_ITEMS) ||
            (type === GROUP_BY_FILTER && filtersStore.groupBy !== GROUP_BY_NONE)
        )
    })
}
