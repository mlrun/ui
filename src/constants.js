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

export const LARGE_REQUEST_CANCELED = 'Large request canceled'
export const REQUEST_CANCELED = 'Request canceled'
export const DEFAULT_ABORT_MSG = 'canceled'

export const MODEL_PATH_DATA_INPUT = 'model_path'

export const NAVBAR_WIDTH_CLOSED = 57
export const NAVBAR_WIDTH_OPENED = 245
export const CANCEL_REQUEST_TIMEOUT = 120000

export const PROJECT_ONLINE_STATUS = 'online'

export const ERROR_STATE = 'error'
export const FAIL_STATE = 'fail'
export const FAILED_STATE = 'failed'
export const PENDING_STATE = 'pending'
export const UNKNOWN_STATE = 'unknown'

/*=========== PAGINATION =============*/

export const BE_PAGE = 'bePage'
export const FE_PAGE = 'fePage'
export const BE_PAGE_SIZE = 'bePageSize'
export const FE_PAGE_SIZE = 'fePageSize'
export const FE_PAGE_START = 'fePageStart'
export const FE_PAGE_END = 'fePageEnd'
export const ITEMS_COUNT_START = 'itemsCountStart'
export const ITEMS_COUNT_END = 'itemsCountEnd'

/*=========== PAGES & TABS =============*/

export const PROJECTS_PAGE = 'PROJECTS'
export const PROJECTS_PAGE_PATH = 'projects'
export const PROJECTS_SETTINGS_PAGE = 'SETTINGS'
export const PROJECTS_SETTINGS_GENERAL_TAB = 'general'
export const PROJECTS_SETTINGS_MEMBERS_TAB = 'members'
export const PROJECTS_SETTINGS_SECRETS_TAB = 'secrets'

export const INACTIVE_JOBS_TAB = 'monitor'
export const JOBS_PAGE = 'JOBS'
export const JOBS_PAGE_PATH = 'jobs'
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

export const ALERTS_PAGE = 'ALERTS'
export const MONITOR_ALERTS_PAGE = 'alerts-monitoring'
export const ALERTS_PAGE_PATH = 'alerts'
export const ALERTS_FILTERS = 'alerts'
export const MODEL_ENDPOINT_RESULT = 'model-endpoint-result'
export const MODEL_ENDPOINT_ID = 'model-endpoint-id'
export const MODEL_MONITORING_APPLICATION = 'model-monitoring-application'
export const SEVERITY_LOW = 'low'
export const SEVERITY_MEDIUM = 'medium'
export const SEVERITY_HIGH = 'high'
export const SEVERITY_CRITICAL = 'critical'
export const ALERTS_DISPLAY_LIMIT = 100

export const MODELS_PAGE = 'models'
export const MODELS_TAB = 'models'
export const MODEL_ENDPOINTS_TAB = 'model-endpoints'
export const REAL_TIME_PIPELINES_TAB = 'real-time-pipelines'
export const PIPELINE_SUB_PAGE = 'pipeline'

export const FEATURE_STORE_PAGE = 'FEATURE-STORE'
export const FEATURE_STORE_PAGE_PATH = 'feature-store'
export const FEATURES_TAB = 'features'
export const FEATURE_SETS_TAB = 'feature-sets'
export const FEATURE_VECTORS_TAB = 'feature-vectors'
export const ADD_TO_FEATURE_VECTOR_TAB = 'add-to-feature-vector'

export const DATASETS_PAGE = 'datasets'

export const FUNCTIONS_PAGE = 'FUNCTIONS'
export const FUNCTIONS_PAGE_PATH = 'functions'
export const ARTIFACTS_PAGE = 'artifacts'

export const FILES_PAGE = 'files'

export const MONITORING_APP_PAGE = 'monitoring-app'

export const DOCUMENTS_PAGE = 'documents'

export const LLM_PROMPTS_PAGE = 'llm-prompts'
export const PROMPT_TAB = 'prompt'
export const ARGUMENTS_TAB = 'arguments'

export const PROJECT_MONITOR = 'monitor'

export const PROJECT_QUICK_ACTIONS_PAGE = 'quick-actions'

export const ALL_VERSIONS_PATH = 'all-versions'

/*=========== CONSUMER_GROUPS =============*/

export const CONSUMER_GROUP_PAGE = 'CONSUMER_GROUP'
export const CONSUMER_GROUPS_PAGE = 'CONSUMER_GROUPS'
export const CONSUMER_GROUPS_FILTER = 'CONSUMER_GROUPS_FILTER'
export const CONSUMER_GROUP_FILTER = 'CONSUMER_GROUP_FILTER'

/*=========== JOBS =============*/

export const FETCH_JOB_PODS_BEGIN = 'FETCH_JOB_PODS_BEGIN'
export const FETCH_JOB_PODS_FAILURE = 'FETCH_JOB_PODS_FAILURE'
export const FETCH_JOB_PODS_SUCCESS = 'FETCH_JOB_PODS_SUCCESS'
export const JOB_DEFAULT_OUTPUT_PATH = 'v3io:///projects/{{run.project}}/artifacts/{{run.uid}}'
export const REMOVE_JOB_PODS = 'REMOVE_JOB_PODS'

export const FUNCTION_SELECTION_STEP = 'functionSelection'
export const RUN_DETAILS_STEP = 'runDetails'
export const PARAMETERS_STEP = 'parameters'
export const HYPERPARAMETER_STRATEGY_STEP = 'hyperparameterStrategy'
export const DATA_INPUTS_STEP = 'dataInputs'
export const RESOURCES_STEP = 'resources'
export const ADVANCED_STEP = 'advanced'

/*=========== JOB KINDS =============*/

export const JOB_KIND_APPLICATION = 'application'
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
export const FUNCTION_FAILED_TO_DELETE_STATE = 'failedToDelete'
export const FUNCTION_ERROR_STATE = 'error'
export const FUNCTION_INITIALIZED_STATE = 'initialized'
export const FUNCTION_READY_STATE = 'ready'
export const FUNCTION_PENDINDG_STATE = 'pending'
export const FUNCTION_RUNNING_STATE = 'running'
export const FUNCTION_DEFAULT_HANDLER = 'handler'
export const FUNCTION_RUN_KINDS = [FUNCTION_TYPE_JOB]
export const FUNCTION_FILTERS = 'FUNCTION_FILTERS'

/*=========== ARTIFACTS =============*/

export const ARTIFACTS_TAB = 'artifacts'
export const ARTIFACT_PREVIEW_TABLE_ROW_LIMIT = 100

/*=========== DETAILS =============*/

export const DETAILS_ANALYSIS_TAB = 'analysis'
export const DETAILS_ARTIFACTS_TAB = 'artifacts'
export const DETAILS_BUILD_LOG_TAB = 'build-log'
export const DETAILS_CODE_TAB = 'code'
export const DETAILS_COLLECTIONS_TAB = 'collections'
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
export const DETAILS_ALERTS_TAB = 'alerts'
export const DETAILS_ALERT_APPLICATION = 'alert'
export const DETAILS_RESULTS_TAB = 'results'
export const DETAILS_RETURNED_FEATURES_TAB = 'returned-features'
export const DETAILS_STATISTICS_TAB = 'statistics'
export const DETAILS_TRANSFORMATIONS_TAB = 'transformations'
export const DETAILS_PROMPT_TEMPLATE_TAB = 'prompt-template'
export const DETAILS_GENERATION_CONFIGURATION_TAB = 'generation-configuration'
export const FETCH_MODEL_FEATURE_VECTOR_BEGIN = 'FETCH_MODEL_FEATURE_VECTOR_BEGIN'
export const FETCH_MODEL_FEATURE_VECTOR_FAILURE = 'FETCH_MODEL_FEATURE_VECTOR_FAILURE'
export const FETCH_MODEL_FEATURE_VECTOR_SUCCESS = 'FETCH_MODEL_FEATURE_VECTOR_SUCCESS'
export const FETCH_ENDPOINT_METRICS_BEGIN = 'FETCH_ENDPOINT_METRICS_BEGIN'
export const FETCH_ENDPOINT_METRICS_SUCCESS = 'FETCH_ENDPOINT_METRICS_SUCCESS'
export const FETCH_ENDPOINT_METRICS_FAILURE = 'FETCH_ENDPOINT_METRICS_FAILURE'
export const FETCH_ENDPOINT_METRICS_VALUES_BEGIN = 'FETCH_ENDPOINT_METRICS_VALUES_BEGIN'
export const FETCH_ENDPOINT_METRICS_VALUES_SUCCESS = 'FETCH_ENDPOINT_METRICS_VALUES_SUCCESS'
export const FETCH_ENDPOINT_METRICS_VALUES_FAILURE = 'FETCH_ENDPOINT_METRICS_VALUES_FAILURE'
export const REMOVE_DETAILS_POPUP_INFO_CONTENT = 'REMOVE_DETAILS_POPUP_INFO_CONTENT'
export const REMOVE_INFO_CONTENT = 'REMOVE_INFO_CONTENT'
export const REMOVE_MODEL_FEATURE_VECTOR = 'REMOVE_MODEL_FEATURE_VECTOR'
export const RESET_CHANGES = 'RESET_CHANGES'
export const SET_CHANGES = 'SET_CHANGES'
export const SET_CHANGES_COUNTER = 'SET_CHANGES_COUNTER'
export const SET_CHANGES_DATA = 'SET_CHANGES_DATA'
export const SET_DETAILS_DATES = 'SET_DETAILS_DATES'
export const SET_DETAILS_POPUP_INFO_CONTENT = 'SET_DETAILS_POPUP_INFO_CONTENT'
export const SET_FILTERS_WAS_HANDLED = 'SET_FILTERS_WAS_HANDLED'
export const SET_EDIT_MODE = 'SET_EDIT_MODE'
export const SET_INFO_CONTENT = 'SET_INFO_CONTENT'
export const SET_ITERATION = 'SET_ITERATION'
export const SET_ITERATION_OPTIONS = 'SET_ITERATION_OPTIONS'
export const SET_SELECTED_METRICS_OPTIONS = 'SET_SELECTED_METRICS_OPTIONS'
export const SHOW_WARNING = 'SHOW_WARNING'

/*=========== KEY CODES =============*/

export const KEY_CODES = {
  ENTER: 13,
  DELETE: 46,
  BACKSPACE: 8
}

/*=========== TABLE =============*/

export const TABLE_CONTAINER = 'table-container'

/*=========== FILTERS =============*/

export const DATE_FILTER_ANY_TIME = ['', '']
export const GROUP_BY_NAME = 'name'
export const GROUP_BY_NONE = 'none'
export const GROUP_BY_WORKFLOW = 'workflow'
export const SHOW_ITERATIONS = 'iter'
export const FILTER_ALL_ITEMS = 'all'
export const TAG_FILTER_ALL_ITEMS = 'All tags'
export const TAG_FILTER_LATEST = 'latest'
export const PROJECTS_FILTER_ALL_ITEMS = '*'

export const DATE_RANGE_TIME_FILTER = 'dateRangeTime'
export const ENTITIES_FILTER = 'entities'
export const GROUP_BY_FILTER = 'groupBy'
export const ITERATIONS_FILTER = 'iter'
export const LABELS_FILTER = 'labels'
export const NAME_FILTER = 'name'
export const DATES_FILTER = 'dates'
export const PROJECT_FILTER = 'project'
export const TYPE_FILTER = 'type'
export const SHOW_UNTAGGED_FILTER = 'showUntagged'
export const SORT_BY = 'sortBy'
export const STATUS_FILTER = 'state'
export const TAG_FILTER = 'tag'
export const MODEL_NAME_FILTER = 'model-name'
export const MODEL_TAG_FILTER = 'model-tag'
export const AUTO_REFRESH_ID = 'auto-refresh'
export const INTERNAL_AUTO_REFRESH_ID = 'internal-auto-refresh'
export const AUTO_REFRESH = 'Auto Refresh'
export const ANY_TIME = 'Any time'
export const STATUS_FILTER_NAME = 'state'
export const APPLICATION = 'application'
export const ENDPOINT = 'endpoint'
export const ENTITY_TYPE = 'entity-type'
export const ENTITY_KIND = 'entity-kind'
export const ENTITY_ID = 'entity'
export const EVENT_TYPE = 'event-type'
export const EVENT_KIND = 'event-kind'

export const SEVERITY = 'severity'
export const JOB = 'job'
export const JOB_NAME = 'job-name'
export const ENDPOINT_APPLICATION = 'endpoint-application'
export const ENDPOINT_RESULT = 'endpoint-result'

export const FILTER_MENU = 'filterMenu'
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
export const DOCUMENT_TYPE = 'document'
export const MODEL_TYPE = 'model'
export const ARTIFACT_OTHER_TYPE = 'other'
export const LLM_PROMPT_TYPE = 'llm-prompt'

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

/*=========== Chart =============*/
export const CHART_TYPE_LINE = 'line'
export const CHART_TYPE_GRADIENT_LINE = 'gradient-line'
export const CHART_TYPE_BAR = 'bar'
export const CHART_TYPE_HISTOGRAM = 'histogram'

/*=========== ARTIFACTS LIMITS =============*/
export const ARTIFACT_MAX_CHUNK_SIZE = 1048576 // 1MB
export const ARTIFACT_MAX_PREVIEW_SIZE = 10485760 // 10MB
export const ARTIFACT_MAX_DOWNLOAD_SIZE = 104857600 // 100MB

/*=========== NOTIFICATION =============*/
export const NOTIFICATION_DURATION = 500

/*========= DEFAULT PROPS =============*/
export const EMPTY_ARRAY = []
export const EMPTY_OBJECT = {}

/*========= PROTOCOLS =============*/
export const HTTP = 'http://'
export const HTTPS = 'https://'

/*========= METRICS TYPES =============*/
export const METRIC_TYPE = 'metric'
export const RESULT_TYPE = 'result'
