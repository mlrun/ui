import React from 'react'
import PropTypes from 'prop-types'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import CheckBox from '../../../common/CheckBox/CheckBox'
import Select from '../../../common/Select/Select'
import Input from '../../../common/Input/Input'

import { ReactComponent as Online } from '../../../images/nosql.svg'
import { ReactComponent as Offline } from '../../../images/db-icon.svg'
import { ReactComponent as Other } from '../../../images/other.svg'
import {
  checkboxModels,
  otherKindOptions
} from './featureSetsPanelTargetStore.util'

import './featureSetsPanelTargetStore.scss'

const FeatureSetsPanelTargetStoreView = ({
  handleOtherKindPathOnBlur,
  handleOtherKindTypeChange,
  handleSelectTargetKind,
  isOtherTargetExists,
  otherKindData,
  selectedTargetKind,
  setOtherKindData
}) => {
  return (
    <div className="feature-set-panel__item new-item-side-panel__item target-store">
      <FeatureSetsPanelSection title="Target store">
        <div className="target-store__checkbox-container">
          <CheckBox
            item={checkboxModels.online}
            onChange={handleSelectTargetKind}
            selectedId={selectedTargetKind.find(
              kind => checkboxModels.online.id === kind
            )}
          >
            <Online /> Online
          </CheckBox>
          <CheckBox
            item={checkboxModels.offline}
            onChange={handleSelectTargetKind}
            selectedId={selectedTargetKind.find(
              kind => checkboxModels.offline.id === kind
            )}
          >
            <Offline /> Offline
          </CheckBox>
          <CheckBox
            item={checkboxModels.other}
            onChange={handleSelectTargetKind}
            selectedId={selectedTargetKind.find(
              kind => checkboxModels.other.id === kind
            )}
          >
            <Other /> Other
          </CheckBox>
        </div>
        {isOtherTargetExists && (
          <div className="target-store__inputs-container">
            <Select
              floatingLabel
              label="File type"
              onClick={handleOtherKindTypeChange}
              options={otherKindOptions}
              selectedId={otherKindData.kind}
            />
            <Input
              floatingLabel
              label="URL"
              onBlur={handleOtherKindPathOnBlur}
              onChange={path => setOtherKindData(state => ({ ...state, path }))}
              placeholder="s3://bucket/path"
              value={otherKindData.path}
              wrapperClassName="url"
            />
          </div>
        )}
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelTargetStoreView.propTypes = {
  handleOtherKindPathOnBlur: PropTypes.func.isRequired,
  handleOtherKindTypeChange: PropTypes.func.isRequired,
  handleSelectTargetKind: PropTypes.func.isRequired,
  isOtherTargetExists: PropTypes.bool.isRequired,
  otherKindData: PropTypes.shape({}).isRequired,
  selectedTargetKind: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOtherKindData: PropTypes.func.isRequired
}

export default FeatureSetsPanelTargetStoreView
