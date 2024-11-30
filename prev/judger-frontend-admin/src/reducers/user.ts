import produce from 'immer'
import { AnyAction } from 'redux'

export const initialState: IUserState = {
  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,
  me: null,
}

export type IUserState = {
  logInLoading: boolean
  logInDone: boolean
  logInError: null | Error
  me: null | object
}
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST'
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS'
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE'

const reducer = (state = initialState, action: AnyAction): IUserState =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOG_IN_REQUEST:
        draft.logInLoading = true
        draft.logInError = null
        draft.logInDone = false
        break
      case LOG_IN_SUCCESS:
        draft.logInLoading = false
        draft.logInDone = true
        break
      case LOG_IN_FAILURE:
        draft.logInLoading = false
        draft.logInError = action.error.message
        break
      default:
        break
    }
  })

export default reducer
