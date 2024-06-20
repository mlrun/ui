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

export function updateRuns(runs) {
    // Current time
    const now = new Date()

    // Date picker 'Past hour' (get past 45 min)
    const oneHourAgo = new Date(now.getTime() - (45 * 60 * 1000))

    // Date picker 'Past 24h' (get past 20h)
    const oneDayAgo = new Date(now.getTime() - (20 * 60 * 60 * 1000))  

    // update start_time та last_update
    runs.runs = runs.runs.map(run => {
        if (['cf842616c89347c7bb7bca2c9e840a21', '76f48c8165da473bb4356ef7b196343f','f5751299ee21476e897dfd90d94c49c4', 'dad0fdf93bd949589f6b20f79fa47798', '59f8e3d6f3db4dd8ab890c4bf84a0a23' ]
            .includes(run.metadata.uid)) { 
            
            return { ...run, status: { ...run.status, start_time: formatDate(oneDayAgo), last_update: formatDate(oneDayAgo) } 
            } 
        } else if (['1d3a8b0833b74f55b008537b1e19ea57'].includes(run.metadata.uid)) { 
        
            return { ...run, status: { ...run.status, start_time: formatDate(oneHourAgo), last_update: formatDate(oneHourAgo)}
            } 
        } else {
            return run
        }
    })
}
