import React from 'react'
import { chain } from 'lodash'

import { ReactComponent as DataPreparationMini } from 'igz-controls/images/data-preparation-mini.svg'
import { ReactComponent as ETLMini } from 'igz-controls/images/etl-mini.svg'
import { ReactComponent as NLPMini } from 'igz-controls/images/nlp-mini.svg'
import { ReactComponent as MLMini } from 'igz-controls/images/ml-mini.svg'
import { ReactComponent as ModelServingMini } from 'igz-controls/images/model-serving-mini.svg'
import { ReactComponent as ModelTrainingMini } from 'igz-controls/images/model-training-mini.svg'
import { ReactComponent as DataAnalysisMini } from 'igz-controls/images/data-analytics-mini.svg'
import { ReactComponent as SimulatorsMini } from 'igz-controls/images/simulator-mini.svg'
import { ReactComponent as AlertsMini } from 'igz-controls/images/alerts-mini.svg'
import { ReactComponent as DLMini } from 'igz-controls/images/dl-mini.svg'
import { ReactComponent as DataPreparation } from 'igz-controls/images/data-preperation.svg'
import { ReactComponent as ETL } from 'igz-controls/images/etl.svg'
import { ReactComponent as NLP } from 'igz-controls/images/nlp.svg'
import { ReactComponent as ML } from 'igz-controls/images/ml.svg'
import { ReactComponent as ModelServing } from 'igz-controls/images/model-serving.svg'
import { ReactComponent as ModelTraining } from 'igz-controls/images/model-training.svg'
import { ReactComponent as DataAnalysis } from 'igz-controls/images/data-analytics.svg'
import { ReactComponent as Simulators } from 'igz-controls/images/simulators.svg'
import { ReactComponent as Alerts } from 'igz-controls/images/alerts.svg'
import { ReactComponent as DL } from 'igz-controls/images/dl.svg'

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
