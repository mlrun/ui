import React from 'react'
import { chain } from 'lodash'

import { ReactComponent as DataPreparationMini } from '../../images/data-preparation-mini.svg'
import { ReactComponent as ETLMini } from '../../images/etl-mini.svg'
import { ReactComponent as NLPMini } from '../../images/nlp-mini.svg'
import { ReactComponent as MLMini } from '../../images/ml-mini.svg'
import { ReactComponent as ModelServingMini } from '../../images/model-serving-mini.svg'
import { ReactComponent as ModelTrainingMini } from '../../images/model-training-mini.svg'
import { ReactComponent as DataAnalysisMini } from '../../images/data-analytics-mini.svg'
import { ReactComponent as SimulatorsMini } from '../../images/simulator-mini.svg'
import { ReactComponent as AlertsMini } from '../../images/alerts-mini.svg'
import { ReactComponent as DLMini } from '../../images/dl-mini.svg'
import { ReactComponent as DataPreparation } from '../../images/data-preperation.svg'
import { ReactComponent as ETL } from '../../images/etl.svg'
import { ReactComponent as NLP } from '../../images/nlp.svg'
import { ReactComponent as ML } from '../../images/ml.svg'
import { ReactComponent as ModelServing } from '../../images/model-serving.svg'
import { ReactComponent as ModelTraining } from '../../images/model-training.svg'
import { ReactComponent as DataAnalysis } from '../../images/data-analytics.svg'
import { ReactComponent as Simulators } from '../../images/simulators.svg'
import { ReactComponent as Alerts } from '../../images/alerts.svg'
import { ReactComponent as DL } from '../../images/dl.svg'

export const generateProjectsList = (projects, projectName) =>
  projects.map(project => ({
    label: project.name === projectName ? 'Current project' : project.name,
    id: project.name
  }))

export const generateCategoryHeader = category => {
  switch (category) {
    case 'data-prep':
      return {
        className: category,
        label: 'Data Preparation',
        icon: <DataPreparation />,
        miniIcon: <DataPreparationMini />
      }
    case 'data-source':
      return {
        className: category,
        label: 'ETL',
        icon: <ETL />,
        miniIcon: <ETLMini />
      }
    case 'NLP':
      return {
        className: category,
        label: 'NLP',
        icon: <NLP />,
        miniIcon: <NLPMini />
      }
    case 'ml':
      return {
        className: category,
        label: 'Machine Learning',
        icon: <ML />,
        miniIcon: <MLMini />
      }
    case 'serving':
      return {
        className: category,
        label: 'Model Serving',
        icon: <ModelServing />,
        miniIcon: <ModelServingMini />
      }
    case 'training':
      return {
        className: category,
        label: 'Model Training',
        icon: <ModelTraining />,
        miniIcon: <ModelTrainingMini />
      }
    case 'analysis':
      return {
        className: category,
        label: 'Data Analysis',
        icon: <DataAnalysis />,
        miniIcon: <DataAnalysisMini />
      }
    case 'simulators':
      return {
        className: category,
        label: 'Simulators',
        icon: <Simulators />,
        miniIcon: <SimulatorsMini />
      }
    case 'notifications':
      return {
        className: category,
        label: 'Alerts and Notifications',
        icon: <Alerts />,
        miniIcon: <AlertsMini />
      }
    case 'dl':
      return {
        className: category,
        label: 'Deep Learning',
        icon: <DL />,
        miniIcon: <DLMini />
      }
    default:
      return {
        className: category,
        label: category,
        icon: null,
        miniIcon: null
      }
  }
}

export const getFunctionCategories = functions => {
  return chain(functions)
    .map(func => {
      return func.metadata.categories ?? []
    })
    .flatten()
    .unionBy('name')
    .value()
}
