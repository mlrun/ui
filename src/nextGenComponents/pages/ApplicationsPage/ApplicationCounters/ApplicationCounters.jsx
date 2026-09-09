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
import PropTypes from 'prop-types'
import { StatsCard, Tooltip, TooltipContent, TooltipTrigger } from 'igz-controls/nextGenComponents'
import { Loader2 } from 'lucide-react'

const FAILED_TOOLTIP_TEXT = 'Error, Unhealthy'

const ApplicationCounters = ({ counters, isLoading }) => {
  const spinner = <Loader2 size={18} className="animate-spin text-igz-secondary" />

  return (
    <div className="flex gap-5 mt-6" data-testid="application-counters">
      <div data-testid="applications-card">
        <StatsCard className="flex-none bg-background border border-solid border-border rounded-lg shadow-card">
          <div className="p-5 pr-14 flex flex-col gap-3">
            <span className="text-[15px] font-bold text-igz-primary">Applications</span>
            <span
              className="text-[28px] font-bold text-igz-primary leading-none"
              data-testid="total-count"
            >
              {isLoading ? spinner : counters.total}
            </span>
          </div>
        </StatsCard>
      </div>

      <div data-testid="applications-status-card">
        <StatsCard className="flex-none bg-background border border-solid border-border rounded-lg shadow-card">
          <div className="p-5 pr-14 flex flex-col gap-3">
            <span className="text-[15px] font-bold text-igz-primary">Applications status</span>
            <div className="flex items-baseline gap-6">
              <div className="flex items-end gap-1.5">
                <span
                  className="text-[28px] font-bold text-igz-primary leading-none"
                  data-testid="running-count"
                >
                  {isLoading ? spinner : counters.running}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-igz-secondary">Running</span>
                  <div className="w-2 h-2 rounded-full bg-status-running" />
                </div>
              </div>

              <div className="flex items-end gap-1.5">
                <span
                  className="text-[28px] font-bold text-igz-primary leading-none"
                  data-testid="failed-count"
                >
                  {isLoading ? spinner : counters.failed}
                </span>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-default">
                      <span className="text-sm text-igz-secondary">Failed</span>
                      <div className="w-2 h-2 rounded-full bg-status-failed" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{FAILED_TOOLTIP_TEXT}</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-end gap-1.5">
                <span
                  className="text-[28px] font-bold text-igz-primary leading-none"
                  data-testid="building-count"
                >
                  {isLoading ? spinner : counters.building}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-igz-secondary">Deploying</span>
                  <div className="w-2 h-2 rounded-full bg-status-deploying" />
                </div>
              </div>
            </div>
          </div>
        </StatsCard>
      </div>
    </div>
  )
}

ApplicationCounters.propTypes = {
  counters: PropTypes.shape({
    total: PropTypes.number.isRequired,
    running: PropTypes.number.isRequired,
    failed: PropTypes.number.isRequired,
    building: PropTypes.number.isRequired
  }).isRequired,
  isLoading: PropTypes.bool.isRequired
}

export default ApplicationCounters
