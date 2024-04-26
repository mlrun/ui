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
/*=========== GENERAL =============*/

export const SET_LOADING = 'SET_LOADING'

export const DELETE_WORKFLOWS = 'DELETE_WORKFLOWS'
export const FETCH_WORKFLOWS_BEGIN = 'FETCH_WORKFLOWS_BEGIN'
export const FETCH_WORKFLOWS_FAILURE = 'FETCH_WORKFLOWS_FAILURE'
export const FETCH_WORKFLOWS_SUCCESS = 'FETCH_WORKFLOWS_SUCCESS'
export const FETCH_WORKFLOW_BEGIN = 'FETCH_WORKFLOW_BEGIN'
export const FETCH_WORKFLOW_FAILURE = 'FETCH_WORKFLOW_FAILURE'
export const FETCH_WORKFLOW_SUCCESS = 'FETCH_WORKFLOW_SUCCESS'
export const RESET_WORKFLOW = 'RESET_WORKFLOW'

export const AZURE_STORAGE_INPUT_PATH_SCHEME = 'az://'
export const DBFS_STORAGE_INPUT_PATH_SCHEME = 'dbfs://'
export const GOOGLE_STORAGE_INPUT_PATH_SCHEME = 'gs://'
export const HTTP_STORAGE_INPUT_PATH_SCHEME = 'http://'
export const HTTPS_STORAGE_INPUT_PATH_SCHEME = 'https://'
export const MLRUN_STORAGE_INPUT_PATH_SCHEME = 'store://'
export const REDIS_INPUT_PATH_SCHEME = 'redis://'
export const S3_INPUT_PATH_SCHEME = 's3://'
export const V3IO_INPUT_PATH_SCHEME = 'v3io:///'

export const TAG_LATEST = 'latest'
export const TAG_NA = 'na'

export const DENSITY_DENSE = 'dense'
export const DENSITY_NORMAL = 'normal'
export const DENSITY_MEDIUM = 'medium'
export const DENSITY_CHUNKY = 'chunky'

export const FULL_VIEW_MODE = 'full'

export const LARGE_REQUEST_CANCELED = 'Large request canceled'
export const REQUEST_CANCELED = 'Request canceled'
export const DEFAULT_ABORT_MSG = 'canceled'

export const MODEL_PATH_DATA_INPUT = 'model_path'

export const NAVBAR_WIDTH_CLOSED = 57
export const NAVBAR_WIDTH_OPENED = 245
export const CANCEL_REQUEST_TIMEOUT = 120000

/*=========== PAGES & TABS =============*/

export const PROJECTS_PAGE = 'PROJECTS'
export const PROJECTS_PAGE_PATH = 'projects'
export const PROJECTS_SETTINGS_PAGE = 'SETTINGS'
export const PROJECTS_SETTINGS_GENERAL_TAB = 'general'
export const PROJECTS_SETTINGS_MEMBERS_TAB = 'members'
export const PROJECTS_SETTINGS_SECRETS_TAB = 'secrets'

export const INACTIVE_JOBS_TAB = 'monitor'
export const JOBS_PAGE = 'JOBS'
export const MONITOR_JOBS_TAB = 'monitor-jobs'
export const MONITOR_WORKFLOWS_TAB = 'monitor-workflows'
export const SCHEDULE_TAB = 'schedule'
export const SIMPLE_SCHEDULE = 'simple'
export const CRONSTRING_SCHEDULE = 'cronstring'
export const WORKFLOW_SUB_PAGE = 'workflow'

export const JOBS_MONITORING_PAGE = 'jobs-monitoring'
export const JOBS_MONITORING_JOBS_TAB = 'jobs'
export const JOBS_MONITORING_WORKFLOWS_TAB = 'workflows'
export const JOBS_MONITORING_SCHEDULED_TAB = 'scheduled'

export const MODELS_PAGE = 'MODELS'
export const MODELS_TAB = 'models'
export const MODEL_ENDPOINTS_TAB = 'model-endpoints'
export const REAL_TIME_PIPELINES_TAB = 'real-time-pipelines'
export const PIPELINE_SUB_PAGE = 'pipeline'

export const FEATURE_STORE_PAGE = 'FEATURE-STORE'
export const FEATURES_TAB = 'features'
export const FEATURE_SETS_TAB = 'feature-sets'
export const FEATURE_VECTORS_TAB = 'feature-vectors'
export const ADD_TO_FEATURE_VECTOR_TAB = 'add-to-feature-vector'

export const DATASETS_PAGE = 'DATASETS'
export const DATASETS_TAB = 'datasets'

export const FUNCTIONS_PAGE = 'FUNCTIONS'
export const ARTIFACTS_PAGE = 'ARTIFACTS'

export const FILES_PAGE = 'FILES'
export const FILES_TAB = 'files'

export const PROJECT_MONITOR = 'monitor'

export const PROJECT_QUICK_ACTIONS_PAGE = 'quick-actions'

/*=========== CONSUMER_GROUPS =============*/

export const CONSUMER_GROUP_PAGE = 'CONSUMER_GROUP'
export const CONSUMER_GROUPS_PAGE = 'CONSUMER_GROUPS'

/*=========== DATASETS =============*/
export const DATASETS_FILTERS = 'DATASETS_FILTERS'

/*=========== JOBS =============*/

export const ABORT_JOB_BEGIN = 'ABORT_JOB_BEGIN'
export const ABORT_JOB_FAILURE = 'ABORT_JOB_FAILURE'
export const ABORT_JOB_SUCCESS = 'ABORT_JOB_SUCCESS'
export const DELETE_ALL_JOB__RUNS_BEGIN = 'DELETE_ALL_JOB__RUNS_BEGIN'
export const DELETE_ALL_JOB_RUNS_FAILURE = 'DELETE_ALL_JOB_RUNS_FAILURE'
export const DELETE_ALL_JOB_RUNS_SUCCESS = 'DELETE_ALL_JOB_RUNS_SUCCESS'
export const DELETE_JOB_BEGIN = 'DELETE_JOB_BEGIN'
export const DELETE_JOB_FAILURE = 'DELETE_JOB_FAILURE'
export const DELETE_JOB_SUCCESS = 'DELETE_JOB_SUCCESS'
export const EDIT_JOB_BEGIN = 'EDIT_JOB_BEGIN'
export const EDIT_JOB_SUCCESS = 'EDIT_JOB_SUCCESS'
export const EDIT_JOB_FAILURE = 'EDIT_JOB_FAILURE'
export const FETCH_ALL_JOB_RUNS_BEGIN = 'FETCH_ALL_JOB_RUNS_BEGIN'
export const FETCH_ALL_JOB_RUNS_FAILURE = 'FETCH_ALL_JOB_RUNS_FAILURE'
export const FETCH_ALL_JOB_RUNS_SUCCESS = 'FETCH_ALL_JOB_RUNS_SUCCESS'
export const FETCH_JOB_BEGIN = 'FETCH_JOB_BEGIN'
export const FETCH_JOB_FAILURE = 'FETCH_JOB_FAILURE'
export const FETCH_JOB_SUCCESS = 'FETCH_JOB_SUCCESS'
export const FETCH_JOB_FUNCTION_BEGIN = 'FETCH_JOB_FUNCTION_BEGIN'
export const FETCH_JOB_FUNCTION_FAILURE = 'FETCH_JOB_FUNCTION_FAILURE'
export const FETCH_JOB_FUNCTION_SUCCESS = 'FETCH_JOB_FUNCTION_SUCCESS'
export const FETCH_JOB_FUNCTIONS_BEGIN = 'FETCH_JOB_FUNCTIONS_BEGIN'
export const FETCH_JOB_FUNCTIONS_FAILURE = 'FETCH_JOB_FUNCTIONS_FAILURE'
export const FETCH_JOB_FUNCTIONS_SUCCESS = 'FETCH_JOB_FUNCTIONS_SUCCESS'
export const FETCH_JOB_LOGS_BEGIN = 'FETCH_JOB_LOGS_BEGIN'
export const FETCH_JOB_LOGS_FAILURE = 'FETCH_JOB_LOGS_FAILURE'
export const FETCH_JOB_LOGS_SUCCESS = 'FETCH_JOB_LOGS_SUCCESS'
export const FETCH_JOB_PODS_BEGIN = 'FETCH_JOB_PODS_BEGIN'
export const FETCH_JOB_PODS_FAILURE = 'FETCH_JOB_PODS_FAILURE'
export const FETCH_JOB_PODS_SUCCESS = 'FETCH_JOB_PODS_SUCCESS'
export const FETCH_JOBS_BEGIN = 'FETCH_JOBS_BEGIN'
export const FETCH_JOBS_FAILURE = 'FETCH_JOBS_FAILURE'
export const FETCH_JOBS_SUCCESS = 'FETCH_JOBS_SUCCESS'
export const FETCH_SCHEDULED_JOBS_BEGIN = 'FETCH_SCHEDULED_JOBS_BEGIN'
export const FETCH_SCHEDULED_JOBS_FAILURE = 'FETCH_SCHEDULED_JOBS_FAILURE'
export const FETCH_SCHEDULED_JOBS_SUCCESS = 'FETCH_SCHEDULED_JOBS_SUCCESS'
export const JOB_DEFAULT_OUTPUT_PATH = 'v3io:///projects/{{run.project}}/artifacts/{{run.uid}}'
export const REMOVE_JOB = 'REMOVE_JOB'
export const REMOVE_JOB_ERROR = 'REMOVE_JOB_ERROR'
export const REMOVE_JOB_FUNCTION = 'REMOVE_JOB_FUNCTION'
export const REMOVE_JOB_PODS = 'REMOVE_JOB_PODS'
export const REMOVE_NEW_JOB = 'REMOVE_NEW_JOB'
export const REMOVE_SCHEDULED_JOB_FAILURE = 'REMOVE_SCHEDULED_JOB_FAILURE'
export const RUN_NEW_JOB_BEGIN = 'RUN_NEW_JOB_BEGIN'
export const RUN_NEW_JOB_FAILURE = 'RUN_NEW_JOB_FAILURE'
export const RUN_NEW_JOB_SUCCESS = 'RUN_NEW_JOB_SUCCESS'
export const SET_JOBS_DATA = 'SET_JOBS_DATA'
export const SET_JOBS_MONITORING_DATA = 'SET_JOBS_MONITORING_DATA'
export const SET_MLRUN_IS_UNHEALTHY = 'SET_MLRUN_IS_UNHEALTHY'
export const SET_MLRUN_UNHEALTHY_RETRYING = 'SET_MLRUN_UNHEALTHY_RETRYING'
export const SET_NEW_JOB = 'SET_NEW_JOB'
export const SET_NEW_JOB_CREDENTIALS_ACCESS_KEY = 'SET_NEW_JOB_CREDENTIALS_ACCESS_KEY'
export const SET_NEW_JOB_ENVIRONMENT_VARIABLES = 'SET_NEW_JOB_ENVIRONMENT_VARIABLES'
export const SET_NEW_JOB_HYPER_PARAMETERS = 'SET_NEW_JOB_HYPER_PARAMETERS'
export const SET_NEW_JOB_INPUTS = 'SET_NEW_JOB_INPUTS'
export const SET_NEW_JOB_NODE_SELECTOR = 'SET_NEW_JOB_NODE_SELECTOR'
export const SET_NEW_JOB_PARAMETERS = 'SET_NEW_JOB_PARAMETERS'
export const SET_NEW_JOB_PREEMTION_MODE = 'SET_NEW_JOB_PREEMTION_MODE'
export const SET_NEW_JOB_PRIORITY_CLASS_NAME = 'SET_NEW_JOB_PRIORITY_CLASS_NAME'
export const SET_NEW_JOB_SECRET_SOURCES = 'SET_NEW_JOB_SECRET_SOURCES'
export const SET_NEW_JOB_SELECTOR_CRITERIA = 'SET_NEW_JOB_SELECTOR_CRITERIA'
export const SET_NEW_JOB_SELECTOR_RESULT = 'SET_NEW_JOB_SELECTOR_RESULT'
export const SET_NEW_JOB_VOLUME_MOUNTS = 'SET_NEW_JOB_VOLUME_MOUNTS'
export const SET_NEW_JOB_VOLUMES = 'SET_NEW_JOB_VOLUMES'
export const SET_URL = 'SET_URL'
export const SET_TUNING_STRATEGY = 'SET_TUNING_STRATEGY'

export const FUNCTION_SELECTION_STEP = 'functionSelection'
export const RUN_DETAILS_STEP = 'runDetails'
export const PARAMETERS_STEP = 'parameters'
export const HYPERPARAMETER_STRATEGY_STEP = 'hyperparameterStrategy'
export const DATA_INPUTS_STEP = 'dataInputs'
export const RESOURCES_STEP = 'resources'
export const ADVANCED_STEP = 'advanced'

/*=========== JOB KINDS =============*/

export const JOB_KIND_DASK = 'dask'
export const JOB_KIND_DATABRICKS = 'databricks'
export const JOB_KIND_HANDLER = 'handler'
export const JOB_KIND_JOB = 'job'
export const JOB_KIND_LOCAL = 'local'
export const JOB_KIND_MPIJOB = 'mpijob'
export const JOB_KIND_NUCLIO = 'nuclio'
export const JOB_KIND_PIPELINE = 'pipeline'
export const JOB_KIND_REMOTE = 'remote'
export const JOB_KIND_REMOTE_SPARK = 'remote-spark'
export const JOB_KIND_SERVING = 'serving'
export const JOB_KIND_SPARK = 'spark'
export const JOB_KIND_WORKFLOW = 'workflow'

/*=========== JOB WORKFLOWS =============*/

export const WORKFLOW_TYPE_SKIPPED = 'Skipped'
export const WORKFLOW_LIST_VIEW = 'list'
export const WORKFLOW_GRAPH_VIEW = 'graph'

/*=========== JOB WIZARD =============*/

export const MAX_SELECTOR_CRITERIA = 'max'
export const LIST_TUNING_STRATEGY = 'list'
export const RANDOM_STRATEGY = 'random'
export const V3IO_VOLUME_TYPE = 'flexVolume'
export const CONFIG_MAP_VOLUME_TYPE = 'configMap'
export const SECRET_VOLUME_TYPE = 'secret'
export const PVC_VOLUME_TYPE = 'persistentVolumeClaim'
export const PARAMETERS_FROM_UI_VALUE = 'fromUI'
export const PARAMETERS_FROM_FILE_VALUE = 'fromFile'
export const NEW_IMAGE_SOURCE = 'newImageSource'
export const EXISTING_IMAGE_SOURCE = 'existingImageSource'

/*=========== ML FUNCTIONS =============*/

export const CREATE_NEW_FUNCTION_BEGIN = 'CREATE_NEW_FUNCTION_BEGIN'
export const CREATE_NEW_FUNCTION_FAILURE = 'CREATE_NEW_FUNCTION_FAILURE'
export const CREATE_NEW_FUNCTION_SUCCESS = 'CREATE_NEW_FUNCTION_SUCCESS'
export const DEPLOY_FUNCTION_BEGIN = 'DEPLOY_FUNCTION_BEGIN'
export const DEPLOY_FUNCTION_FAILURE = 'DEPLOY_FUNCTION_FAILURE'
export const DEPLOY_FUNCTION_SUCCESS = 'DEPLOY_FUNCTION_SUCCESS'
export const FETCH_FUNCTIONS_BEGIN = 'FETCH_FUNCTIONS_BEGIN'
export const FETCH_FUNCTIONS_FAILURE = 'FETCH_FUNCTIONS_FAILURE'
export const FETCH_FUNCTIONS_SUCCESS = 'FETCH_FUNCTIONS_SUCCESS'
export const FETCH_FUNCTION_LOGS_BEGIN = 'FETCH_FUNCTION_LOGS_BEGIN'
export const FETCH_FUNCTION_LOGS_FAILURE = 'FETCH_FUNCTION_LOGS_FAILURE'
export const FETCH_FUNCTION_LOGS_SUCCESS = 'FETCH_FUNCTION_LOGS_SUCCESS'
export const FETCH_FUNCTION_NUCLIO_LOGS_BEGIN = 'FETCH_FUNCTION_NUCLIO_LOGS_BEGIN'
export const FETCH_FUNCTION_NUCLIO_LOGS_FAILURE = 'FETCH_FUNCTION_NUCLIO_LOGS_FAILURE'
export const FETCH_FUNCTION_NUCLIO_LOGS_SUCCESS = 'FETCH_FUNCTION_NUCLIO_LOGS_SUCCESS'
export const FETCH_FUNCTION_TEMPLATE_BEGIN = 'FETCH_FUNCTION_TEMPLATE_BEGIN'
export const FETCH_FUNCTION_TEMPLATE_FAILURE = 'FETCH_FUNCTION_TEMPLATE_FAILURE'
export const FETCH_FUNCTION_TEMPLATE_SUCCESS = 'FETCH_FUNCTION_TEMPLATE_SUCCESS'
export const FETCH_FUNCTIONS_TEMPLATES_FAILURE = 'FETCH_FUNCTIONS_TEMPLATES_FAILURE'
export const FETCH_HUB_FUNCTION_TEMPLATE_BEGIN = 'FETCH_HUB_FUNCTION_TEMPLATE_BEGIN'
export const FETCH_HUB_FUNCTION_TEMPLATE_FAILURE = 'FETCH_HUB_FUNCTION_TEMPLATE_FAILURE'
export const FETCH_HUB_FUNCTION_TEMPLATE_SUCCESS = 'FETCH_HUB_FUNCTION_TEMPLATE_SUCCESS'
export const FETCH_HUB_FUNCTIONS_BEGIN = 'FETCH_HUB_FUNCTIONS_BEGIN'
export const FETCH_HUB_FUNCTIONS_FAILURE = 'FETCH_HUB_FUNCTIONS_FAILURE'
export const FUNCTION_TYPE_JOB = 'job'
export const FUNCTION_TYPE_LOCAL = 'local'
export const FUNCTION_TYPE_SERVING = 'serving'
export const FUNCTION_TYPE_NUCLIO = 'nuclio'
export const FUNCTION_TYPE_REMOTE = 'remote'
export const FUNCTION_TYPE_APPLICATION = 'application'
export const GET_FUNCTION_BEGIN = 'GET_FUNCTION_BEGIN'
export const GET_FUNCTION_FAILURE = 'GET_FUNCTION_FAILURE'
export const GET_FUNCTION_SUCCESS = 'GET_FUNCTION_SUCCESS'
export const NEW_FUNCTION_ADVANCED_SECTION = 'advanced'
export const NEW_FUNCTION_SECRETS_SECTION = 'secrets'
export const NEW_FUNCTION_TOPOLOGY_SECTION = 'topology'
export const REMOVE_FUNCTION = 'REMOVE_FUNCTION'
export const REMOVE_FUNCTIONS_ERROR = 'REMOVE_FUNCTIONS_ERROR'
export const REMOVE_FUNCTION_TEMPLATE = 'REMOVE_FUNCTION_TEMPLATE'
export const REMOVE_NEW_FUNCTION = 'REMOVE_NEW_FUNCTION'
export const REMOVE_HUB_FUNCTIONS = 'REMOVE_HUB_FUNCTIONS'
export const RESET_NEW_FUNCTION_CODE_CUSTOM_IMAGE = 'RESET_NEW_FUNCTION_CODE_CUSTOM_IMAGE'
export const SET_FUNCTIONS_TEMPLATES = 'SET_FUNCTIONS_TEMPLATES'
export const SET_HUB_FUNCTIONS = 'SET_HUB_FUNCTIONS'
export const SET_NEW_FUNCTION = 'SET_NEW_FUNCTION'
export const SET_NEW_FUNCTION_BASE_IMAGE = 'SET_NEW_FUNCTION_BASE_IMAGE'
export const SET_NEW_FUNCTION_BUILD_IMAGE = 'SET_NEW_FUNCTION_BUILD_IMAGE'
export const SET_NEW_FUNCTION_COMMANDS = 'SET_NEW_FUNCTION_COMMANDS'
export const SET_NEW_FUNCTION_REQUIREMENTS = 'SET_NEW_FUNCTION_REQUIREMENTS'
export const SET_NEW_FUNCTION_DEFAULT_CLASS = 'SET_NEW_FUNCTION_DEFAULT_CLASS'
export const SET_NEW_FUNCTION_DESCRIPTION = 'SET_NEW_FUNCTION_DESCRIPTION'
export const SET_NEW_FUNCTION_DISABLE_AUTO_MOUNT = 'SET_NEW_FUNCTION_DISABLE_AUTO_MOUNT'
export const SET_NEW_FUNCTION_ENV = 'SET_NEW_FUNCTION_ENV'
export const SET_NEW_FUNCTION_ERROR_STREAM = 'SET_NEW_FUNCTION_ERROR_STREAM'
export const SET_NEW_FUNCTION_FORCE_BUILD = 'SET_NEW_FUNCTION_FORCE_BUILD'
export const SET_NEW_FUNCTION_GRAPH = 'SET_NEW_FUNCTION_GRAPH'
export const SET_NEW_FUNCTION_HANDLER = 'SET_NEW_FUNCTION_HANDLER'
export const SET_NEW_FUNCTION_IMAGE = 'SET_NEW_FUNCTION_IMAGE'
export const SET_NEW_FUNCTION_LABELS = 'SET_NEW_FUNCTION_LABELS'
export const SET_NEW_FUNCTION_KIND = 'SET_NEW_FUNCTION_KIND'
export const SET_NEW_FUNCTION_CREDENTIALS_ACCESS_KEY = 'SET_NEW_FUNCTION_CREDENTIALS_ACCESS_KEY'
export const SET_NEW_FUNCTION_NAME = 'SET_NEW_FUNCTION_NAME'
export const SET_NEW_FUNCTION_PARAMETERS = 'SET_NEW_FUNCTION_PARAMETERS'
export const SET_NEW_FUNCTION_PREEMTION_MODE = 'SET_NEW_FUNCTION_PREEMTION_MODE'
export const SET_NEW_FUNCTION_PRIORITY_CLASS_NAME = 'SET_NEW_FUNCTION_PRIORITY_CLASS_NAME'
export const SET_NEW_FUNCTION_PROJECT = 'SET_NEW_FUNCTION_PROJECT'
export const SET_NEW_FUNCTION_RESOURCES = 'SET_NEW_FUNCTION_RESOURCES'
export const SET_NEW_FUNCTION_SECRETS = 'SET_NEW_FUNCTION_SECRETS'
export const SET_NEW_FUNCTION_SOURCE_CODE = 'SET_NEW_FUNCTION_SOURCE_CODE'
export const SET_NEW_FUNCTION_TAG = 'SET_NEW_FUNCTION_TAG'
export const SET_NEW_FUNCTION_TRACK_MODELS = 'SET_NEW_FUNCTION_TRACK_MODELS'
export const SET_NEW_FUNCTION_VOLUMES = 'SET_NEW_FUNCTION_VOLUMES'
export const SET_NEW_FUNCTION_VOLUME_MOUNTS = 'SET_NEW_FUNCTION_VOLUME_MOUNTS'
export const FUNCTION_CREATING_STATE = 'creating'
export const FUNCTION_FAILED_STATE = 'failed'
export const FUNCTION_ERROR_STATE = 'error'
export const FUNCTION_INITIALIZED_STATE = 'initialized'
export const FUNCTION_READY_STATE = 'ready'
export const FUNCTION_PENDINDG_STATE = 'pending'
export const FUNCTION_RUNNING_STATE = 'running'
export const FUNCTION_DEFAULT_HANDLER = 'handler'
export const FUNCTION_RUN_KINDS = [FUNCTION_TYPE_JOB]

/*=========== ARTIFACTS =============*/

export const ARTIFACTS_TAB = 'artifacts'
export const FILES_FILTERS = 'FILES_FILTERS'
export const ARTIFACT_PREVIEW_TABLE_ROW_LIMIT = 100

/*=========== MODELS =============*/

export const FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_BEGIN = 'FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_BEGIN'
export const MODELS_FILTERS = 'MODELS_FILTERS'
export const FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_FAILURE =
  'FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_FAILURE'
export const FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_SUCCESS =
  'FETCH_MODEL_ENDPOINT_WITH_ANALYSIS_SUCCESS'

/*=========== FEATURE STORE =============*/

export const CREATE_NEW_FEATURE_SET_BEGIN = 'CREATE_NEW_FEATURE_SET_BEGIN'
export const CREATE_NEW_FEATURE_SET_FAILURE = 'CREATE_NEW_FEATURE_SET_FAILURE'
export const CREATE_NEW_FEATURE_SET_SUCCESS = 'CREATE_NEW_FEATURE_SET_SUCCESS'
export const FETCH_ENTITIES_BEGIN = 'FETCH_ENTITIES_BEGIN'
export const FETCH_ENTITIES_FAILURE = 'FETCH_ENTITIES_FAILURE'
export const FETCH_ENTITIES_SUCCESS = 'FETCH_ENTITIES_SUCCESS'
export const FETCH_ENTITY_SUCCESS = 'FETCH_ENTITY_SUCCESS'
export const FETCH_FEATURES_BEGIN = 'FETCH_FEATURES_BEGIN'
export const FETCH_FEATURES_FAILURE = 'FETCH_FEATURES_FAILURE'
export const FETCH_FEATURES_SUCCESS = 'FETCH_FEATURES_SUCCESS'
export const FETCH_FEATURE_SETS_BEGIN = 'FETCH_FEATURE_SETS_BEGIN'
export const FETCH_FEATURE_SETS_FAILURE = 'FETCH_FEATURE_SETS_FAILURE'
export const FETCH_FEATURE_SET_SUCCESS = 'FETCH_FEATURE_SET_SUCCESS'
export const FETCH_FEATURE_SETS_SUCCESS = 'FETCH_FEATURE_SETS_SUCCESS'
export const FETCH_FEATURE_SUCCESS = 'FETCH_FEATURE_SUCCESS'
export const FETCH_FEATURE_VECTORS_BEGIN = 'FETCH_FEATURE_VECTORS_BEGIN'
export const FETCH_FEATURE_VECTORS_FAILURE = 'FETCH_FEATURE_VECTORS_FAILURE'
export const FETCH_FEATURE_VECTORS_SUCCESS = 'FETCH_FEATURE_VECTORS_SUCCESS'
export const FETCH_FEATURE_VECTOR_SUCCESS = 'FETCH_FEATURE_VECTOR_SUCCESS'

export const REMOVE_ENTITIES = 'REMOVE_ENTITIES'
export const REMOVE_ENTITY = 'REMOVE_ENTITY'
export const REMOVE_FEATURE = 'REMOVE_FEATURE'
export const REMOVE_FEATURES = 'REMOVE_FEATURES'
export const REMOVE_FEATURES_ERROR = 'REMOVE_FEATURES_ERROR'
export const REMOVE_FEATURE_SET = 'REMOVE_FEATURE_SET'
export const REMOVE_FEATURE_SETS = 'REMOVE_FEATURE_SETS'
export const REMOVE_FEATURE_VECTOR = 'REMOVE_FEATURE_VECTOR'
export const REMOVE_FEATURE_VECTORS = 'REMOVE_FEATURE_VECTORS'
export const REMOVE_NEW_FEATURE_SET = 'REMOVE_NEW_FEATURE_SET'
export const SET_NEW_FEATURE_SET_DATA_SOURCE_ATTRIBUTES =
  'SET_NEW_FEATURE_SET_DATA_SOURCE_ATTRIBUTES'
export const SET_NEW_FEATURE_SET_DATA_SOURCE_ENTITIES = 'SET_NEW_FEATURE_SET_DATA_SOURCE_ENTITIES'
export const SET_NEW_FEATURE_SET_DATA_SOURCE_KEY = 'SET_NEW_FEATURE_SET_DATA_SOURCE_KEY'
export const SET_NEW_FEATURE_SET_DATA_SOURCE_KIND = 'SET_NEW_FEATURE_SET_DATA_SOURCE_KIND'
export const SET_NEW_FEATURE_SET_DATA_SOURCE_TIME = 'SET_NEW_FEATURE_SET_DATA_SOURCE_TIME'
export const SET_NEW_FEATURE_SET_DATA_SOURCE_END_TIME = 'SET_NEW_FEATURE_SET_DATA_SOURCE_END_TIME'
export const SET_NEW_FEATURE_SET_DATA_SOURCE_PARSE_DATES =
  'SET_NEW_FEATURE_SET_DATA_SOURCE_PARSE_DATES'
export const SET_NEW_FEATURE_SET_DATA_SOURCE_START_TIME =
  'SET_NEW_FEATURE_SET_DATA_SOURCE_START_TIME'
export const SET_NEW_FEATURE_SET_DATA_SOURCE_TIMESTAMP_COLUMN =
  'SET_NEW_FEATURE_SET_DATA_SOURCE_TIMESTAMP_COLUMN'
export const SET_NEW_FEATURE_SET_DATA_SOURCE_URL = 'SET_NEW_FEATURE_SET_DATA_SOURCE_URL'
export const SET_NEW_FEATURE_SET_DESCRIPTION = 'SET_NEW_FEATURE_SET_DESCRIPTION'
export const SET_NEW_FEATURE_SET_LABELS = 'SET_NEW_FEATURE_SET_LABELS'
export const SET_NEW_FEATURE_SET_CREDENTIALS_ACCESS_KEY =
  'SET_NEW_FEATURE_SET_CREDENTIALS_ACCESS_KEY'
export const SET_NEW_FEATURE_SET_NAME = 'SET_NEW_FEATURE_SET_NAME'
export const SET_NEW_FEATURE_SET_PASSTHROUGH = 'SET_NEW_FEATURE_SET_PASSTHROUGH'
export const SET_NEW_FEATURE_SET_SCHEDULE = 'SET_NEW_FEATURE_SET_SCHEDULE'
export const SET_NEW_FEATURE_SET_SCHEMA_TIMESTAMP_KEY = 'SET_NEW_FEATURE_SET_SCHEMA_TIMESTAMP_KEY'
export const SET_NEW_FEATURE_SET_TARGET = 'SET_NEW_FEATURE_SET_TARGET'
export const SET_NEW_FEATURE_SET_VERSION = 'SET_NEW_FEATURE_SET_VERSION'
export const START_FEATURE_SET_INGEST_BEGIN = 'START_FEATURE_SET_INGEST_BEGIN'
export const START_FEATURE_SET_INGEST_SUCCESS = 'START_FEATURE_SET_INGEST_SUCCESS'

/*=========== PROJECTS =============*/

export const CHANGE_PROJECT_STATE_BEGIN = 'CHANGE_PROJECT_STATE_BEGIN'
export const CHANGE_PROJECT_STATE_FAILURE = 'CHANGE_PROJECT_STATE_FAILURE'
export const CHANGE_PROJECT_STATE_SUCCESS = 'CHANGE_PROJECT_STATE_SUCCESS'
export const CREATE_PROJECT_BEGIN = 'CREATE_PROJECT_BEGIN'
export const CREATE_PROJECT_FAILURE = 'CREATE_PROJECT_FAILURE'
export const CREATE_PROJECT_SUCCESS = 'CREATE_PROJECT_SUCCESS'
export const DELETE_PROJECT_BEGIN = 'DELETE_PROJECT_BEGIN'
export const DELETE_PROJECT_FAILURE = 'DELETE_PROJECT_FAILURE'
export const DELETE_PROJECT_SUCCESS = 'DELETE_PROJECT_SUCCESS'
export const FETCH_PROJECT_BEGIN = 'FETCH_PROJECT_BEGIN'
export const FETCH_PROJECT_DATASETS_BEGIN = 'FETCH_PROJECT_DATASETS_BEGIN'
export const FETCH_PROJECT_DATASETS_FAILURE = 'FETCH_PROJECT_DATASETS_FAILURE'
export const FETCH_PROJECT_SUMMARY_BEGIN = 'FETCH_PROJECT_SUMMARY_BEGIN'
export const FETCH_PROJECT_SUMMARY_FAILURE = 'FETCH_PROJECT_SUMMARY_FAILURE'
export const FETCH_PROJECT_SUMMARY_SUCCESS = 'FETCH_PROJECT_SUMMARY_SUCCESS'
export const SET_PROJECT_SECRETS = 'SET_PROJECT_SECRETS'
export const FETCH_PROJECT_DATASETS_SUCCESS = 'FETCH_PROJECT_DATASETS_SUCCESS'
export const FETCH_PROJECT_FAILED_JOBS_BEGIN = 'FETCH_PROJECT_FAILED_JOBS_BEGIN'
export const FETCH_PROJECT_FAILED_JOBS_FAILURE = 'FETCH_PROJECT_FAILED_JOBS_FAILURE'
export const FETCH_PROJECT_FAILED_JOBS_SUCCESS = 'FETCH_PROJECT_FAILED_JOBS_SUCCESS'
export const FETCH_PROJECT_FAILURE = 'FETCH_PROJECT_FAILURE'
export const FETCH_PROJECT_FEATURE_SETS_BEGIN = 'FETCH_PROJECT_FEATURE_SETS_BEGIN'
export const FETCH_PROJECT_FEATURE_SETS_FAILURE = 'FETCH_PROJECT_FEATURE_SETS_FAILURE'
export const FETCH_PROJECT_FEATURE_SETS_SUCCESS = 'FETCH_PROJECT_FEATURE_SETS_SUCCESS'
export const FETCH_PROJECT_FILES_BEGIN = 'FETCH_PROJECT_FILES_BEGIN'
export const FETCH_PROJECT_FILES_FAILURE = 'FETCH_PROJECT_FILES_FAILURE'
export const FETCH_PROJECT_FILES_SUCCESS = 'FETCH_PROJECT_FILES_SUCCESS'
export const FETCH_PROJECT_FUNCTIONS_BEGIN = 'FETCH_PROJECT_FUNCTIONS_BEGIN'
export const FETCH_PROJECT_FUNCTIONS_FAILURE = 'FETCH_PROJECT_FUNCTIONS_FAILURE'
export const FETCH_PROJECT_FUNCTIONS_SUCCESS = 'FETCH_PROJECT_FUNCTIONS_SUCCESS'
export const FETCH_PROJECT_JOBS_BEGIN = 'FETCH_PROJECT_JOBS_BEGIN'
export const FETCH_PROJECT_JOBS_FAILURE = 'FETCH_PROJECT_JOBS_FAILURE'
export const FETCH_PROJECT_JOBS_SUCCESS = 'FETCH_PROJECT_JOBS_SUCCESS'
export const FETCH_PROJECT_MODELS_BEGIN = 'FETCH_PROJECT_MODELS_BEGIN'
export const FETCH_PROJECT_MODELS_FAILURE = 'FETCH_PROJECT_MODELS_FAILURE'
export const FETCH_PROJECT_MODELS_SUCCESS = 'FETCH_PROJECT_MODELS_SUCCESS'
export const FETCH_PROJECT_RUNNING_JOBS_BEGIN = 'FETCH_PROJECT_RUNNING_JOBS_BEGIN'
export const FETCH_PROJECT_RUNNING_JOBS_FAILURE = 'FETCH_PROJECT_RUNNING_JOBS_FAILURE'
export const FETCH_PROJECT_RUNNING_JOBS_SUCCESS = 'FETCH_PROJECT_RUNNING_JOBS_SUCCESS'
export const FETCH_PROJECT_SCHEDULED_JOBS_BEGIN = 'FETCH_PROJECT_SCHEDULED_JOBS_BEGIN'
export const FETCH_PROJECT_SCHEDULED_JOBS_FAILURE = 'FETCH_PROJECT_SCHEDULED_JOBS_FAILURE'
export const FETCH_PROJECT_SCHEDULED_JOBS_SUCCESS = 'FETCH_PROJECT_SCHEDULED_JOBS_SUCCESS'
export const FETCH_PROJECT_SECRETS_BEGIN = 'FETCH_PROJECT_SECRETS_BEGIN'
export const FETCH_PROJECT_SECRETS_FAILURE = 'FETCH_PROJECT_SECRETS_FAILURE'
export const FETCH_PROJECT_SECRETS_SUCCESS = 'FETCH_PROJECT_SECRETS_SUCCESS'
export const FETCH_PROJECT_SUCCESS = 'FETCH_PROJECT_SUCCESS'
export const FETCH_PROJECTS_BEGIN = 'FETCH_PROJECTS_BEGIN'
export const FETCH_PROJECTS_FAILURE = 'FETCH_PROJECTS_FAILURE'
export const FETCH_PROJECTS_NAMES_BEGIN = 'FETCH_PROJECTS_NAMES_BEGIN'
export const FETCH_PROJECTS_NAMES_FAILURE = 'FETCH_PROJECTS_NAMES_FAILURE'
export const FETCH_PROJECTS_NAMES_SUCCESS = 'FETCH_PROJECTS_NAMES_SUCCESS'
export const FETCH_PROJECTS_SUCCESS = 'FETCH_PROJECTS_SUCCESS'
export const FETCH_PROJECTS_SUMMARY_BEGIN = 'FETCH_PROJECTS_SUMMARY_BEGIN'
export const FETCH_PROJECTS_SUMMARY_FAILURE = 'FETCH_PROJECTS_SUMMARY_FAILURE'
export const FETCH_PROJECTS_SUMMARY_SUCCESS = 'FETCH_PROJECTS_SUMMARY_SUCCESS'
export const FETCH_PROJECT_WORKFLOWS_BEGIN = 'FETCH_PROJECT_WORKFLOWS_BEGIN'
export const FETCH_PROJECT_WORKFLOWS_FAILURE = 'FETCH_PROJECT_WORKFLOWS_FAILURE'
export const FETCH_PROJECT_WORKFLOWS_SUCCESS = 'FETCH_PROJECT_WORKFLOWS_SUCCESS'
export const REMOVE_NEW_PROJECT_ERROR = 'REMOVE_NEW_PROJECT_ERROR'
export const REMOVE_PROJECTS = 'REMOVE_PROJECTS'
export const REMOVE_PROJECT_SUMMARY = 'REMOVE_PROJECT_SUMMARY'
export const REMOVE_PROJECT_DATA = 'REMOVE_PROJECT_DATA'

/*=========== DETAILS =============*/

export const DETAILS_ANALYSIS_TAB = 'analysis'
export const DETAILS_ARTIFACTS_TAB = 'artifacts'
export const DETAILS_BUILD_LOG_TAB = 'build-log'
export const DETAILS_CODE_TAB = 'code'
export const DETAILS_DRIFT_ANALYSIS_TAB = 'drift-analysis'
export const DETAILS_FEATURES_ANALYSIS_TAB = 'features-analysis'
export const DETAILS_FEATURES_TAB = 'features'
export const DETAILS_INPUTS_TAB = 'inputs'
export const DETAILS_LOGS_TAB = 'logs'
export const DETAILS_METADATA_TAB = 'metadata'
export const DETAILS_METRICS_TAB = 'metrics'
export const DETAILS_OVERVIEW_TAB = 'overview'
export const DETAILS_PODS_TAB = 'pods'
export const DETAILS_PREVIEW_TAB = 'preview'
export const DETAILS_REQUESTED_FEATURES_TAB = 'requested-features'
export const DETAILS_RESULTS_TAB = 'results'
export const DETAILS_RETURNED_FEATURES_TAB = 'returned-features'
export const DETAILS_STATISTICS_TAB = 'statistics'
export const DETAILS_TRANSFORMATIONS_TAB = 'transformations'
export const FETCH_MODEL_FEATURE_VECTOR_BEGIN = 'FETCH_MODEL_FEATURE_VECTOR_BEGIN'
export const FETCH_MODEL_FEATURE_VECTOR_FAILURE = 'FETCH_MODEL_FEATURE_VECTOR_FAILURE'
export const FETCH_MODEL_FEATURE_VECTOR_SUCCESS = 'FETCH_MODEL_FEATURE_VECTOR_SUCCESS'
export const REMOVE_INFO_CONTENT = 'REMOVE_INFO_CONTENT'
export const REMOVE_MODEL_ENDPOINT = 'REMOVE_MODEL_ENDPOINT'
export const REMOVE_MODEL_FEATURE_VECTOR = 'REMOVE_MODEL_FEATURE_VECTOR'
export const RESET_CHANGES = 'RESET_CHANGES'
export const SET_CHANGES = 'SET_CHANGES'
export const SET_CHANGES_COUNTER = 'SET_CHANGES_COUNTER'
export const SET_CHANGES_DATA = 'SET_CHANGES_DATA'
export const SET_DETAILS_DATES = 'SET_DETAILS_DATES'
export const SET_FILTERS_WAS_HANDLED = 'SET_FILTERS_WAS_HANDLED'
export const SET_EDIT_MODE = 'SET_EDIT_MODE'
export const SET_INFO_CONTENT = 'SET_INFO_CONTENT'
export const SET_ITERATION = 'SET_ITERATION'
export const SET_ITERATION_OPTIONS = 'SET_ITERATION_OPTIONS'
export const SHOW_WARNING = 'SHOW_WARNING'

/*=========== NUCLIO =============*/

export const FETCH_API_GATEWAYS_BEGIN = 'FETCH_API_GATEWAYS_BEGIN'
export const FETCH_API_GATEWAYS_FAILURE = 'FETCH_API_GATEWAYS_FAILURE'
export const FETCH_API_GATEWAYS_SUCCESS = 'FETCH_API_GATEWAYS_SUCCESS'
export const FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_BEGIN = 'FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_BEGIN'
export const FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_FAILURE =
  'FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_FAILURE'
export const FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_SUCCESS =
  'FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_SUCCESS'
export const FETCH_NUCLIO_V3IO_STREAMS_BEGIN = 'FETCH_NUCLIO_V3IO_STREAMS_BEGIN'
export const FETCH_NUCLIO_V3IO_STREAMS_FAILURE = 'FETCH_NUCLIO_V3IO_STREAMS_FAILURE'
export const FETCH_NUCLIO_V3IO_STREAMS_SUCCESS = 'FETCH_NUCLIO_V3IO_STREAMS_SUCCESS'
export const FETCH_NUCLIO_FUNCTIONS_BEGIN = 'FETCH_NUCLIO_FUNCTIONS_BEGIN'
export const FETCH_NUCLIO_FUNCTIONS_FAILURE = 'FETCH_NUCLIO_FUNCTIONS_FAILURE'
export const FETCH_NUCLIO_FUNCTIONS_SUCCESS = 'FETCH_NUCLIO_FUNCTIONS_SUCCESS'
export const FETCH_ALL_NUCLIO_FUNCTIONS_SUCCESS = 'FETCH_ALL_NUCLIO_FUNCTIONS_SUCCESS'
export const REMOVE_V3IO_STREAMS = 'REMOVE_V3IO_STREAMS'
export const RESET_V3IO_STREAMS_ERROR = 'RESET_V3IO_STREAMS_ERROR'
export const RESET_V3IO_STREAM_SHARD_LAG_ERROR = 'RESET_V3IO_STREAM_SHARD_LAG_ERROR'

/*=========== KEY CODES =============*/

export const KEY_CODES = {
  ENTER: 13,
  DELETE: 46,
  BACKSPACE: 8
}

/*=========== TABLE =============*/

export const ACTION_CELL_ID = 'action-cell'
export const SET_LABEL_FEATURE = 'SET_LABEL_FEATURE'
export const SET_TABLE_PANEL_OPEN = 'SET_TABLE_PANEL_OPEN'
export const SET_FEATURES_PANEL_DATA = 'SET_FEATURES_PANEL_DATA'
export const UPDATE_CURRENT_PROJECT_NAME = 'UPDATE_CURRENT_PROJECT_NAME'
export const UPDATE_GROUPED_FEATURES = 'UPDATE_GROUPED_FEATURES'
export const UPDATE_FEATURE_VECTOR = 'UPDATE_FEATURE_VECTOR'
export const TABLE_CONTAINER = 'table-container'

export const BUTTON_COPY_URI_CELL_TYPE = 'buttonCopyURI'

/*=========== FILTERS =============*/

export const DATE_FILTER_ANY_TIME = ['', '']
export const GROUP_BY_NAME = 'name'
export const GROUP_BY_NONE = 'none'
export const GROUP_BY_WORKFLOW = 'workflow'
export const SHOW_ITERATIONS = 'iter'
export const SHOW_UNTAGGED_ITEMS = 'showUntagged'
export const FILTER_ALL_ITEMS = 'all'
export const TAG_FILTER_ALL_ITEMS = 'All'
export const TAG_FILTER_LATEST = 'latest'

export const DATE_RANGE_TIME_FILTER = 'dateRangeTime'
export const ENTITIES_FILTER = 'entities'
export const GROUP_BY_FILTER = 'groupBy'
export const ITERATIONS_FILTER = 'iter'
export const LABELS_FILTER = 'labels'
export const NAME_FILTER = 'name'
export const PROJECT_FILTER = 'project'
export const SHOW_UNTAGGED_FILTER = 'showUntagged'
export const SORT_BY = 'sortBy'
export const STATUS_FILTER = 'status'
export const TAG_FILTER = 'tag'
export const AUTO_REFRESH_ID = 'auto-refresh'
export const AUTO_REFRESH = 'Auto Refresh'
export const ANY_TIME = 'Any time'

export const FILTER_MENU_MODAL = 'filterMenuModal'
export const JOB_WIZARD_FILTERS = 'jobWizardFilters'
export const HUB_CATEGORIES_FILTER = 'hubCategories'

/*=========== PANEL =============*/

export const PANEL_EDIT_MODE = 'EDIT'
export const PANEL_CREATE_MODE = 'CREATE'
export const PANEL_FUNCTION_CREATE_MODE = 'FUNCTION_CREATE'
export const PANEL_RERUN_MODE = 'RERUN'

export const ENV_VARIABLE_TYPE_VALUE = 'value'
export const ENV_VARIABLE_TYPE_SECRET = 'secret'

export const PANEL_DEFAULT_ACCESS_KEY = '$generate'

/*=========== ML REACT FLOW =============*/

export const ML_NODE = 'ml-node'

export const INPUT_NODE = 'input-node'
export const OUTPUT_NODE = 'output-node'
export const PRIMARY_NODE = 'primary-node'
export const SECONDARY_NODE = 'secondary-node'
export const GREY_NODE = 'grey-node'

export const OVAL_NODE_SHAPE = 'oval-shape'
export const ROUNDED_RECTANGLE_NODE_SHAPE = 'rounded-rectangle-shape'

export const ML_EDGE = 'ml-edge'

export const DEFAULT_EDGE = 'default-edge'
export const FLOATING_EDGE = 'floating-edge'
export const STRAIGHT_EDGE = 'straight-edge'
export const STEP_EDGE = 'step-edge'
export const SMOOTH_STEP_EDGE = 'smooth-step-edge'

/*=========== PROJECT SETTINGS =============*/

export const ARTIFACT_PATH = 'artifact_path'
export const SOURCE_URL = 'source'
export const DEFAULT_IMAGE = 'default_image'
export const DESCRIPTION = 'description'
export const GOALS = 'goals'
export const LABELS = 'labels'
export const NODE_SELECTORS = 'default_function_node_selector'
export const PARAMS = 'params'
export const LOAD_SOURCE_ON_RUN = 'load_source_on_run'

/*=========== ARTIFACTS TYPES =============*/

export const ARTIFACT_TYPE = 'artifact'
export const DATASET_TYPE = 'dataset'
export const MODEL_TYPE = 'model'
export const ARTIFACT_OTHER_TYPE = 'other'

/*=========== ROLES =============*/

export const ADMIN_ROLE = 'Admin'
export const ALL_ROLES = 'All'
export const EDITOR_ROLE = 'Editor'
export const OWNER_ROLE = 'Owner'
export const USER_ROLE = 'user'
export const USER_GROUP_ROLE = 'user_group'
export const VIEWER_ROLE = 'Viewer'

/*=========== ACTIONS MENU POSITION =============*/
export const ACTION_MENU_PARENT_ROW = 'action-menu_parent-row'
export const ACTION_MENU_PARENT_ROW_EXPANDED = 'action-menu_parent-row-expanded'
