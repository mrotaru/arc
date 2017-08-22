// https://github.com/diegohaz/arc/wiki/API-service
import 'whatwg-fetch'
import { stringify } from 'query-string'
import merge from 'lodash/merge'
import get from 'lodash/get'
import { apiUrl } from 'config'

export const checkStatus = (response) => {
  if (response.ok) {
    return response
  }
  const error = new Error(`${response.status} ${response.statusText}`)
  error.response = response
  throw error
}

export const parseJSON = response => response.json()

export const parseSettings = ({ method = 'get', data, locale, ...otherSettings } = {}) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': locale,
  }
  const settings = merge({
    body: data ? JSON.stringify(data) : undefined,
    method,
    headers,
  }, otherSettings)
  return settings
}

const getResourceEndpoint = (resource, needle, endpointType, endpointOptions) => {
  const complexResourceEndpoints = {
    'comments': {
      'list': ({ postId }) => `/post/${postId}/comments`
    }
  }
  if (!complexResourceEndpoints.hasOwnProperty(resource)) {
    switch (endpointType) {
      case 'detail': return `${resource}/${needle}`
      case 'list': return `${resource}`
      default: throw new Error(`Unknown endpoint type: ${endpointType}`)
    }
  } else {
    return complexResourceEndpoints[resource][endpointType](endpointOptions)
  }
}

export const parseEndpoint = (resource, needle, endpointType, params, options) => {
  const endpoint = getResourceEndpoint(resource, needle, endpointType, options)
  const url = endpoint.indexOf('http') === 0 ? endpoint : apiUrl + endpoint
  const querystring = params ? `?${stringify(params)}` : ''
  return `${url}${querystring}`
}

const api = {}

api.request = (resource, { params, options, needle, ...settings } = {}) =>
  fetch(parseEndpoint(resource, params, options, needle), parseSettings(settings))
    .then(checkStatus)
    .then(parseJSON)

;['delete', 'get'].forEach((method) => {
  api[method] = (endpoint, settings) => api.request(endpoint, { method, ...settings })
})

;['post', 'put', 'patch'].forEach((method) => {
  api[method] = (endpoint, data, settings) => api.request(endpoint, { method, data, ...settings })
})

api.create = (settings = {}) => ({
  settings,

  setToken(token) {
    this.settings.headers = {
      ...this.settings.headers,
      Authorization: `Bearer ${token}`,
    }
  },

  unsetToken() {
    this.settings.headers = {
      ...this.settings.headers,
      Authorization: undefined,
    }
  },

  request(resource, settings) {
    return api.request(resource, merge({}, this.settings, settings))
  },

  post(resource, data, settings) {
    return this.request(resource, { method: 'post', data, ...settings })
  },

  getList(resource, settings, endpointOptions) {
    return this.request(resource, { method: 'get', ...settings }, endpointOptions)
  },

  getDetail(resource, { needle }) {
    return this.request(resource, { method: 'get', ...settings })
  },

  put(resource, data, settings) {
    return this.request(resource, { method: 'put', data, ...settings })
  },

  patch(resource, data, settings) {
    return this.request(resource, { method: 'patch', data, ...settings })
  },

  delete(resource, settings) {
    return this.request(resource, { method: 'delete', ...settings })
  },
})

export default api
