import { AnyAction, combineReducers } from 'redux'
import user, { IUserState } from './user'
import post, { IPostState } from './post'

export interface IReducerState {
  user: IUserState
  post: IPostState
}

//(이전 상태 , 액션)=> 다음 상태
const rootReducer = (state: IReducerState | undefined, action: AnyAction) => {
  const combinedReducer = combineReducers({
    user: user,
    post: post,
  })
  return combinedReducer(state, action)
}

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>
