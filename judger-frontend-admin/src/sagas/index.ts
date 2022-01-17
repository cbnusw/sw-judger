import { all, fork } from 'redux-saga/effects'
import axios from 'axios'
import postSaga from './post'
import userSaga from './user'

// axios.defaults.withCredentials = true

export default function* rootSaga() {
  yield all([fork(userSaga), fork(postSaga)])
}
