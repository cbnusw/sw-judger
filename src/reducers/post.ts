import produce from 'immer'
import { AnyAction } from 'redux'

export const initialState: IPostState = {
  mainPosts: [],
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
}

export type IPostState = {
  mainPosts: Array<object>
  addPostLoading: boolean
  addPostDone: boolean
  addPostError: Error | null
}

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST'
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS'
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE'

const postReducer = (state = initialState, action: AnyAction): IPostState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ADD_POST_REQUEST:
        draft.addPostLoading = true
        draft.addPostDone = false
        draft.addPostError = null
        break
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false
        draft.addPostDone = true
        draft.mainPosts.unshift(action.data)
        break
      case ADD_POST_FAILURE:
        draft.addPostLoading = false
        draft.addPostError = action.error
        break
      default:
        return state
    }
  })
}

export default postReducer
