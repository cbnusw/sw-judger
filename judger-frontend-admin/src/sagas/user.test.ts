import { all, fork, put, takeLatest, call } from 'redux-saga/effects'
import { LOG_IN_REQUEST, LOG_IN_SUCCESS } from '../reducers/user'
import { testUserInfo } from '../config/config'
import { logIn, logInAPI } from './user'

describe('auth request', () => {
  it('사용자가 로그인을 하는 api를 호출하고 로그인 상태로 만들고, 정상 종료한다.', () => {
    const iterator = logIn({
      type: LOG_IN_REQUEST,
      data: testUserInfo,
    })
    // 1. logIn Api 호출
    expect(iterator.next().value).toEqual(call(logInAPI, testUserInfo))
    // 2. 로그인 상태로 만들기
    expect(iterator.next().value).toEqual(
      put({
        type: LOG_IN_SUCCESS,
      })
    )
    // 3. 실행 완료
    expect(iterator.next().done).toBeTruthy()
  })
})
