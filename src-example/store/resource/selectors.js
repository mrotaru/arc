// https://github.com/diegohaz/arc/wiki/Selectors
// https://github.com/diegohaz/arc/wiki/Example-redux-modules#resource
export const initialState = {}

export const initialResourceState = {
  list: [],
  detail: null,
}

export const getResourceState = (state = initialState, resource) =>
  state[resource] || initialResourceState

export const getList = (state = initialState, resource, listId = 'list') =>
  getResourceState(state, resource)[listId]

export const getDetail = (state = initialState, resource) =>
  getResourceState(state, resource).detail
