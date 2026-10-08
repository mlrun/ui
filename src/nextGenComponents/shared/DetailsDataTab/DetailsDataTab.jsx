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
import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { DataTable, Loader } from 'igz-controls/nextGenComponents'

import ActionBar from '../ActionBar/ActionBar'
import NoData from '../NoData/NoData'
import { getInitialFiltersByConfig } from '../../../hooks/useFiltersFromSearchParams.hook'

const DEFAULT_NO_DATA_MESSAGE = 'No data to show'

const DetailsDataTab = ({
  columns,
  data,
  filtersConfig,
  filterFn,
  initialSorting,
  isLoading = false,
  noDataMessage = DEFAULT_NO_DATA_MESSAGE,
  onRefresh,
  renderFilters,
  rowActions,
  showRefreshButton = true
}) => {
  const [filters, setFilters] = useState(() => getInitialFiltersByConfig(filtersConfig))

  const filteredData = useMemo(() => {
    const safeData = data ?? []
    return filterFn ? filterFn(safeData, filters) : safeData
  }, [data, filters, filterFn])

  if (isLoading) {
    return <Loader section />
  }

  return (
    <div className="flex flex-col h-full gap-2" data-testid="details-data-tab">
      {renderFilters && (
        <ActionBar
          persistToUrl={false}
          filtersConfig={filtersConfig}
          filters={filters}
          setFilters={setFilters}
          onRefresh={onRefresh}
          showRefreshButton={showRefreshButton}
        >
          {renderFilters}
        </ActionBar>
      )}

      <div className="flex-1 min-h-[200px] flex flex-col [&_thead_tr]:z-[1]">
        {filteredData.length === 0 ? (
          <NoData message={noDataMessage} />
        ) : (
          <DataTable
            data={filteredData}
            columns={columns}
            initialSorting={initialSorting}
            rowActions={rowActions}
          />
        )}
      </div>
    </div>
  )
}

DetailsDataTab.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  filtersConfig: PropTypes.objectOf(
    PropTypes.shape({
      initialValue: PropTypes.any,
      label: PropTypes.string
    })
  ),
  filterFn: PropTypes.func,
  initialSorting: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      desc: PropTypes.bool
    })
  ),
  isLoading: PropTypes.bool,
  noDataMessage: PropTypes.string,
  onRefresh: PropTypes.func,
  renderFilters: PropTypes.func,
  rowActions: PropTypes.func,
  showRefreshButton: PropTypes.bool
}

export default DetailsDataTab
