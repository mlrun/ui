import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'

import functionsData from './functionsData'
import createFunctionsContent from '../../utils/createFunctionsContent'
import functionsActions from '../../actions/functionsActions'

const Functions = ({ fetchFunctions, functionsStore, match, history }) => {
  const [convertedYaml, setConvertedYaml] = useState()

  const [functions, setFunctions] = useState([])
  const [tableContent, setTableContent] = useState([])
  const [selectedFunction, setSelectedFunction] = useState({})

  const [stateFilter, setStateFilter] = useState(
    functionsData.initialStateFilter
  )
  // const [groupFilter, setGroupFilter] = useState(jobsData.initialGroupFilter)

  // const [groupedByName, setGroupedByName] = useState({})
  // const [expand, setExpand] = useState(false)
  // const [expandedItems, setExpandedItems] = useState([])

  // const groupLatestJob = tableContent.map(group => {
  //   if (Array.isArray(group)) {
  //     return group.reduce((prev, curr) => {
  //       return new Date(prev.updated.value).getTime() >
  //       new Date(curr.updated.value).getTime()
  //         ? prev
  //         : curr
  //     })
  //   } else return group
  // })

  const refreshFunctions = useCallback(() => {
    fetchFunctions(
      match.params.projectName,
      stateFilter !== functionsData.initialStateFilter && stateFilter
    ).then(functions => {
      const newFunctions = functions.map(func => ({
        name: func.metadata.name,
        type: func.kind,
        hash: func.metadata.hash,
        updated: new Date(func.metadata.updated),
        command: func.spec.command,
        image: func.spec.image,
        description: func.spec.description,
        state: func.status ? func.status.state : ''
      }))
      return setFunctions(newFunctions)
    })
  }, [fetchFunctions, match.params.projectName, stateFilter])

  const createContent = useCallback(() => {
    // let content = []
    // if (functions.length > 0) {
    //   content =
    //     Object.keys(groupedByName).length > 0
    //       ? Object.values(groupedByName).map(group => {
    //         return createJobsContent(group)
    //       })
    //       : createJobsContent(jobs)
    // }
    setTableContent(createFunctionsContent(functions))
  }, [functions])

  useEffect(() => {
    history.push(`/projects/${match.params.projectName}/functions`)
    setSelectedFunction({})

    // if (expand) {
    //   setExpand(false)
    // }

    refreshFunctions()

    return () => {
      setSelectedFunction({})
      // setExpand(false)
      setFunctions([])
    }
  }, [history, match.params.projectName, refreshFunctions])

  useEffect(() => {
    createContent()
    return () => {
      setTableContent([])
    }
  }, [createContent])

  useEffect(() => {
    if (match.params.functionId && Object.keys(selectedFunction).length === 0) {
      let item = functionsStore.functions.find(
        item => item.uid === match.params.functionId
      )

      setSelectedFunction(item)
    }
  }, [functionsStore.functions, match.params.functionId, selectedFunction])

  // useEffect(() => {
  //   if (groupFilter === 'Name') {
  //     const groupedJobs = {}
  //
  //     jobs.forEach(job => {
  //       groupedJobs[job.name]
  //         ? groupedJobs[job.name].push(job)
  //         : (groupedJobs[job.name] = [job])
  //     })
  //
  //     setGroupedByName(groupedJobs)
  //   } else if (groupFilter === jobsData.initialGroupFilter) {
  //     const rows = [...document.getElementsByClassName('parent-row')]
  //     rows.forEach(row => row.classList.remove('parent-row-expanded'))
  //     setExpand(false)
  //     setGroupedByName({})
  //   }
  //
  //   return () => {
  //     setGroupedByName({})
  //   }
  // }, [groupFilter, setGroupedByName, jobs])

  const handleSelectFunction = item => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
    setSelectedFunction(item)
  }

  const handleCancel = () => {
    setSelectedFunction({})
  }

  const convertToYaml = item => {
    document.getElementById('yaml_modal').style.display = 'flex'
    const functionJson = functionsStore.functions.filter(
      func => func.metadata.hash === item.hash
    )
    setConvertedYaml(
      yaml.safeDump(functionJson, {
        lineWidth: 1000
      })
    )
  }

  // const handleExpandRow = (e, item) => {
  //   if (e.target.className === 'expand-arrow') {
  //     const parentRow = e.target.closest('.parent-row')
  //     if (parentRow.classList.contains('parent-row-expanded')) {
  //       const newArray = expandedItems.filter(
  //         expanded => expanded.name.value !== item.name.value
  //       )
  //       parentRow.classList.remove('parent-row-expanded')
  //       return setExpandedItems(newArray)
  //     } else {
  //       setExpandedItems([...expandedItems, item])
  //       parentRow.classList.add('parent-row-expanded')
  //     }
  //   }
  // }
  //
  // const handleExpandAll = () => {
  //   if (groupFilter === 'Name') {
  //     const rows = [...document.getElementsByClassName('parent-row')]
  //     if (expand) {
  //       setExpand(false)
  //       rows.forEach(row => row.classList.remove('parent-row-expanded'))
  //     } else {
  //       setExpand(true)
  //       rows.forEach(row => row.classList.add('parent-row-expanded'))
  //     }
  //   }
  // }

  return (
    <>
      {functionsStore.loading && <Loader />}
      <Content
        content={functions}
        convertToYaml={convertToYaml}
        convertedYaml={convertedYaml}
        detailsMenu={functionsData.detailsMenu}
        filters={functionsData.filters}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectFunction}
        match={match}
        page={functionsData.page}
        selectedItem={selectedFunction}
        refresh={refreshFunctions}
        tableHeaders={functionsData.tableHeaders}
        tableContent={tableContent}
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
      />
    </>
  )
}

Functions.propTypes = {
  fetchFunctions: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  functionsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(
  functionsStore => functionsStore,
  functionsActions
)(React.memo(Functions))
