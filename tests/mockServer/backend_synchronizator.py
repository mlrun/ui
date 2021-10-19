import requests
import json
import os
import shutil
from lxml import html


react_app_mlrun_api_url = 'http://mlrun-api-ingress.default-tenant.app.vmdev36.lab.iguazeng.com'
react_app_nuclio_api_url='http://nuclio-ingress.default-tenant.app.vmdev36.lab.iguazeng.com'
save_folder = 'tests/mockServer/data'

endpoint_frontend_spec = '/api/frontend-spec'
endpoint_projects_summary = '/api/project-summaries'
endpoint_projects = '/api/projects/'

endpoint_artifacts = '/api/artifacts?project={project}&tag=*'
endpoint_project_feature_sets = '/api/projects/{project}/feature-sets'
endpoint_project_schedules = '/api/projects/{project}/schedules'
endpoint_project_pipelines = '/api/projects/{project}/pipelines'
endpoint_project_features = '/api/projects/{project}/features'
endpoint_project_entities = '/api/projects/{project}/entities'
endpoint_project_feature_vectors = '/api/projects/{project}/feature-vectors'
endpoint_project_artifact_tags = '/api/projects/{project}/artifact-tags'
endpoint_runs = '/api/runs?project={project}'
endpoint_run = '/api/run/{project}/{run_uid}'
endpoint_funcs = '/api/funcs?project={project}'
endpoint_log = '/api/log/{project}/{uid}'
endpoint_pipline = '/api/pipelines/{id}'

endpoint_files = '/api/files?path='

endpoint_nuclio_functions = '/api/functions'
endpoint_nuclio_api_gateways = '/api/api_gateways'


# github functions
github_functions = 'https://github.com/mlrun/functions/tree/master'
github_function = 'https://raw.githubusercontent.com/mlrun/functions/master/{func_template}/function.yaml'

locator = '//div[contains(@class,"Box")]//div[@class="js-details-container Details"]/div[contains(@class,"js-navigation-container")]/div[@role="row"]//span/a'

def clear_data_folder(path_to_data):
    try:
       shutil.rmtree(path_to_data)
    except:
       print('Error while deleting directory')

    os.mkdir(path_to_data)

def get_json(host, endpoint):
    with requests.get(host + endpoint) as rf:
        return rf.text

def get_jsons(host, endpoint, *args):
    return [get_json(host, endpoint.format(**item)) for item in args]

def get_jsons_per_project(host, endpoint, *args):
    return {item['project']:json.loads(get_json(host, endpoint.format(**item))) for item in args}

def convert_array_to_json(*arr):
    artifact_name = list(json.loads(arr[0]))[0]
    result = {artifact_name: []}
    for item in arr:
        if isinstance(json.loads(item)[artifact_name], list):
            result[artifact_name] += json.loads(item)[artifact_name]
        else:
            result[artifact_name].append(json.loads(item)[artifact_name])
    return result

def save_dict_to_json(path_to_save, **kwargs):
    with open(path_to_save, 'w', encoding='utf-8') as f:
        json.dump(kwargs, f, ensure_ascii=False, indent=2)
        
def save_arr_to_json(path_to_save, *args):
    with open(path_to_save, 'w', encoding='utf-8') as f:
        f.write(str(list(args)).replace("'",'"'))

def getFile(host, endpoint, file_sub_url, save_path):
    save_file_path = save_path + file_sub_url.replace('v3io://','')
    save_folder = os.path.dirname(save_file_path)

    if not os.path.exists(save_folder):
        try:
            os.makedirs(save_folder)
        except OSError:
            pass

    with requests.get(host + endpoint + file_sub_url) as f:
        if f.status_code == 200:
            with open(save_file_path, 'wb') as wf:
                wf.write(f.content)

def get_function_yaml(file_url, save_path):
    save_file_path = save_path + file_url.replace('https://raw.githubusercontent.com/','')
    save_folder = os.path.dirname(save_file_path)

    if not os.path.exists(save_folder):
        try:
            os.makedirs(save_folder)
        except OSError:
            pass

    with requests.get(file_url) as f:
        if f.status_code == 200:
            with open(save_file_path, 'wb') as wf:
                wf.write(f.content)


if __name__ == '__main__':
    # mlrun endpoint
    projects = get_json(react_app_mlrun_api_url, endpoint_projects)
    projects_summary = get_json(react_app_mlrun_api_url, endpoint_projects_summary)
    frontend_spec = get_json(react_app_mlrun_api_url, endpoint_frontend_spec)

    project_dict = json.loads(projects)
    project_names = [{'project': item['metadata']['name']} for item in project_dict['projects']]

    artifacts_arr = get_jsons(react_app_mlrun_api_url, endpoint_artifacts, *project_names)
    feature_sets_arr = get_jsons(react_app_mlrun_api_url, endpoint_project_feature_sets, *project_names)
    schedules_arr = get_jsons(react_app_mlrun_api_url, endpoint_project_schedules, *project_names)
    features_arr = get_jsons(react_app_mlrun_api_url, endpoint_project_features, *project_names)
    entities_arr = get_jsons(react_app_mlrun_api_url, endpoint_project_entities, *project_names)
    feature_vectors_arr = get_jsons(react_app_mlrun_api_url, endpoint_project_feature_vectors, *project_names)
    artifact_tags_arr = get_jsons(react_app_mlrun_api_url, endpoint_project_artifact_tags, *project_names)
    funcs_arr = get_jsons(react_app_mlrun_api_url, endpoint_funcs, *project_names)
    runs_arr = get_jsons(react_app_mlrun_api_url, endpoint_runs, *project_names)

    artifacts_all = convert_array_to_json(*artifacts_arr)
    feature_sets_all = convert_array_to_json(*feature_sets_arr)
    schedules_all = convert_array_to_json(*schedules_arr)
    features_all = convert_array_to_json(*features_arr)
    entities_all = convert_array_to_json(*entities_arr)
    feature_vectors_all = convert_array_to_json(*feature_vectors_arr)
    funcs_all = convert_array_to_json(*funcs_arr)
    runs_all = convert_array_to_json(*runs_arr)

    artifact_tags_all = [json.loads(item) for item in artifact_tags_arr]

    pipelines_all = get_jsons_per_project(react_app_mlrun_api_url, endpoint_project_pipelines, *project_names)

    runs_prj_uid = [{'project': job['metadata']['project'], 'run_uid': job['metadata']['uid']} for job in runs_all['runs']]
    run_prj_uid_arr = get_jsons(react_app_mlrun_api_url, endpoint_run, *runs_prj_uid)
    run_prj_uid_all = convert_array_to_json(*run_prj_uid_arr)

    tmp = [pipelines_all[item]['runs'] for item in pipelines_all]
    pipline_ids = [{'id': item['id']} for sublist in tmp for item in sublist]
    pipline_ids_arr = get_jsons(react_app_mlrun_api_url, endpoint_pipline, *pipline_ids)
    pipline_ids_all = [json.loads(item) for item in pipline_ids_arr]


    # collect logs
    logs_artifacts = [
        {'project': item['metadata']['project'], 'uid': item['metadata']['uid']} for item in runs_all['runs']
    ]
    logs_all = {'logs': [
            {
                'uid': item['uid'],
                'log': get_json(react_app_mlrun_api_url, endpoint_log.format(**item))
            }
                for item in logs_artifacts
        ]
    }

    clear_data_folder(save_folder + '/*')
    save_dict_to_json(save_folder + '/projects.json', **json.loads(projects))
    save_dict_to_json(save_folder + '/summary.json', **json.loads(projects_summary))
    save_dict_to_json(save_folder + '/frontendSpec.json', **json.loads(frontend_spec))

    save_dict_to_json(save_folder + '/artifacts.json', **artifacts_all)
    save_dict_to_json(save_folder + '/features.json', **features_all)
    save_dict_to_json(save_folder + '/entities.json', **entities_all) # entities_all
    save_dict_to_json(save_folder + '/featureSets.json', **feature_sets_all)
    save_dict_to_json(save_folder + '/featureVectors.json', **feature_vectors_all)
    save_dict_to_json(save_folder + '/pipelines.json', **pipelines_all)
    save_dict_to_json(save_folder + '/schedules.json', **schedules_all)
    save_dict_to_json(save_folder + '/funcs.json', **funcs_all)
    save_dict_to_json(save_folder + '/runs.json', **runs_all)
    save_dict_to_json(save_folder + '/logs.json', **logs_all)
    save_dict_to_json(save_folder + '/run.json', **run_prj_uid_all)

    save_arr_to_json(save_folder + '/artifactsTags.json', *artifact_tags_all)
    save_arr_to_json(save_folder + '/piplineIDs.json', *pipline_ids_all)

    files_filtered = [list(item['spec'].get('analysis', {}).values()) for item in feature_sets_all['feature_sets']]
    files_to_download = {item for sublist in files_filtered for item in sublist}
    [getFile(react_app_mlrun_api_url, endpoint_files, item, save_folder) for item in files_to_download]

    # nuclio endpoint
    nuclio_functions = get_json(react_app_nuclio_api_url, endpoint_nuclio_functions)
    nuclio_api_gateways = get_json(react_app_nuclio_api_url, endpoint_nuclio_api_gateways)

    save_dict_to_json(save_folder + '/nuclioFunctions.json', **json.loads(nuclio_functions))
    save_dict_to_json(save_folder + '/nuclioAPIGateways.json', **json.loads(nuclio_api_gateways))

    # github functions
    functions_thml = get_json(github_functions, '')
    functions_tree = html.fromstring(functions_thml)

    not_functions = {None, '.gitignore', 'CONTRIBUTING.md', 'LICENSE', 'README.md', 'catalog.json', 'catalog.yaml', 'functions.py', 'requirements.txt'}
    func_template_names = set([item.text for item in functions_tree.xpath(locator)]) - not_functions

    for item in func_template_names:
        get_function_yaml(github_function.format(func_template=item), save_folder+'/')