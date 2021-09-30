import * as types from './types'

const initialState = {
  obj: '',
}

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_OBJ:
      return { ...state, obj: action.payload }
    default:
      return state
  }
}

export default reducers
