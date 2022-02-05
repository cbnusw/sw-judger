import { all, fork } from 'redux-saga/effects'
import postSaga from './post'
import userSaga from './user'

// axios.defaults.withCredentials = true

export default function* rootSaga() {
  yield all([fork(userSaga), fork(postSaga)])
}
