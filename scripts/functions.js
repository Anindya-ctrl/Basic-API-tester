import { keyValueTemplateElement, responseHeadersContainer } from './script.js';
import prettyBytes from 'pretty-bytes';

export function handleKeyValuePair() {
    const clonedTemplate = keyValueTemplateElement.content.cloneNode(true);

    clonedTemplate.querySelector('[data-remove-button]').addEventListener('click', event => {
        event.target.closest('[data-key-value-pair]').remove();
    });

    return clonedTemplate;
}

export function convertKeyValueToObject(pairContainer) {
    const allPairs = pairContainer.querySelectorAll('[data-key-value-pair]');

    return [...allPairs].reduce((res, pair) => {
        const key = pair.querySelector('[data-key]').value;
        const value = pair.querySelector('[data-value]').value;
        if(!key) return res;

        return { ...res, [key]: value };
    }, {});
}

export function getResponseHeaders(headers) {
    responseHeadersContainer.innerHTML = '';

    Object.entries(headers).forEach(([key, value]) => {
        const newKeyElement = document.createElement('div');
        const newValueElement = document.createElement('div');
        
        newKeyElement.textContent = key;
        newValueElement.textContent = value;

        responseHeadersContainer.append(newKeyElement);
        responseHeadersContainer.append(newValueElement);
    });
}

export function getResponseDetails(response) {
    const { status, data, headers, customData } = response;

    document.querySelector('[data-status]').textContent = status;
    document.querySelector('[data-size]').textContent =  prettyBytes(
        JSON.stringify(data).length + JSON.stringify(headers).length
    );
    document.querySelector('[data-time]').textContent = customData.timeTaken;
}

export function getTakenTime(res) {
    res.customData = res.customData || {};
    res.customData.timeTaken = new Date().getTime() - res.config.customData.startTime;

    return res;
}
