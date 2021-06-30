import { handleKeyValuePair, convertKeyValueToObject, getResponseHeaders, getResponseDetails, getTakenTime } from './functions.js';
import editorSetup from './editorSetup.js';
import axios from 'axios';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const { requestEditor, updateResponseEditor } = editorSetup();
export const keyValueTemplateElement = document.querySelector('[data-key-value-template]');
export const responseHeadersContainer = document.querySelector('[data-response-headers]');
const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');
const form = document.querySelector('[data-form]');

queryParamsContainer.append(handleKeyValuePair());
requestHeadersContainer.append(handleKeyValuePair());

document.querySelector('[data-add-query-param]').addEventListener('click', () => queryParamsContainer.append(handleKeyValuePair()));
document.querySelector('[data-add-request-header]').addEventListener('click', () => requestHeadersContainer.append(handleKeyValuePair()));

axios.interceptors.request.use(req => {
    req.customData = req.customData || {};
    req.customData.startTime = new Date().getTime();

    return req;
});

axios.interceptors.response.use(getTakenTime, err => {
    return Promise.reject(getTakenTime(err.response));
});

form.addEventListener('submit', event => {
    event.preventDefault();

    let data ;
    try {
        data = JSON.parse(requestEditor.state.doc.toString());
    } catch(err) {
        return alert('JSON data could not be processed.');
    }

    axios({
        url: document.querySelector('[data-url]').value,
        method: document.querySelector('[data-method]').value,
        params: convertKeyValueToObject(queryParamsContainer),
        headers: convertKeyValueToObject(requestHeadersContainer),
        data,
    })
    .catch(err => err)
    .then(res => {
        const { headers, data } = res;
        document.querySelector('[data-response-section]').classList.remove('d-none');

        getResponseDetails(res);
        getResponseHeaders(headers);
        updateResponseEditor(data);
    });
});
