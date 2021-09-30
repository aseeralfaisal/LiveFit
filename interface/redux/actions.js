import * as types from './types'

export const setObj = (obj) => {
  dispatch({
    type: types.SET_OBJ,
    payload: obj,
  })
}
