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
// format data in accordance with ISO 8601 with ms
function formatDate(date) {
    return date.toISOString()
}
// relative dates are recalculated on every update call, so they stay valid during a long regression run
let oneHourAgo, oneDayAgo, next24Hours, nextHour

function refreshDates() {
    const now = new Date()

    // Date picker 'Past hour' (get past 45 min)
    oneHourAgo = new Date(now.getTime() - (45 * 60 * 1000))
    // Date picker 'Past 24h' (get past 20h)
    oneDayAgo = new Date(now.getTime() - (20 * 60 * 60 * 1000))
    // Date picker 'Next 24h' (get next 23h, the UI computes its range before the request arrives)
    next24Hours = new Date(now.getTime() + (23 * 60 * 60 * 1000))
    // Date picker 'Next hour' (get next 45 min)
    nextHour = new Date(now.getTime() + (45 * 60 * 1000))
}

// the update functions change the dates in place: they are called on every request, and replacing the objects
// would drop the changes scenarios make to them (abort run, edit schedule...)
function updateRuns(runs) {
    refreshDates()
    // update start_time and last_update
    runs.runs.forEach(run => {
        if (['cf842616c89347c7bb7bca2c9e840a21', '76f48c8165da473bb4356ef7b196343f','f5751299ee21476e897dfd90d94c49c4', 'dad0fdf93bd949589f6b20f79fa47798', '9723e5a30b0e43b0b7cfda098445c446', '85c3a6bcc292462d89e4d65444d179b1']
            .includes(run.metadata.uid)) {
            run.status.start_time = formatDate(oneDayAgo)
            run.status.last_update = formatDate(oneDayAgo)
        } else if (['1d3a8b0833b74f55b008537b1e19ea57'].includes(run.metadata.uid)) {
            run.status.start_time = formatDate(oneHourAgo)
            run.status.last_update = formatDate(oneHourAgo)
        }
    })
}

function updatePipelines(pipelines) {
    refreshDates()
    // update finished_at
    for (const project in pipelines) {
        pipelines[project].runs.forEach(run => {
            if (['5a5db6e3-7cdd-4d33-971c-d2310b02387c', '1f8b29a5-cdab-4b84-aad7-7f9bc20daf0b'].includes(run.id)) {
                run.finished_at = formatDate(oneDayAgo)
            } else if (['e8c24cbd-187f-44eb-85df-52e003ff9eaa'].includes(run.id)) {
                run.finished_at = formatDate(oneHourAgo)
            }
        })
    }
}

function updatePipelineIDs(pipelineIDs) {
    refreshDates()
    // update created_at and finished_at
    pipelineIDs.forEach(pipeline => {
        if (['5a5db6e3-7cdd-4d33-971c-d2310b02387c', '1f8b29a5-cdab-4b84-aad7-7f9bc20daf0b'].includes(pipeline.run.id)) {
            pipeline.run.created_at = formatDate(oneDayAgo)
            pipeline.run.finished_at = formatDate(oneDayAgo)
        } else if (['e8c24cbd-187f-44eb-85df-52e003ff9eaa'].includes(pipeline.run.id)) {
            pipeline.run.created_at = formatDate(oneHourAgo)
            pipeline.run.finished_at = formatDate(oneHourAgo)
        }
    })
}

function updateSchedules(schedules) {
    refreshDates()
    // update next_run_time
    schedules.schedules.forEach(schedule => {
        if (['clean-data', 'clean-data-test', 'aggregate-test', 'erann-test', 'prep-data', 'sklearn-classifier', 'main3'].includes(schedule.name)) {
            schedule.next_run_time = formatDate(next24Hours)
        } else if (['tf2-serving'].includes(schedule.name)) {
            schedule.next_run_time = formatDate(nextHour)
        }
    })
}

export { updateRuns, updatePipelines, updatePipelineIDs, updateSchedules }