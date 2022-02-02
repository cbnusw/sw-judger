import configureMockStore from 'redux-mock-store'
import createSagaMiddleware from 'redux-saga'
import axios from 'axios'
import { authUrl } from '../config/config'
import { LOG_IN_REQUEST } from '../reducers/user'

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]

axios.defaults.baseURL = authUrl
describe("auth async request",()=>{
    t('creates AUTH_USER action when user is logged in', () => {
          axios.post("/auth/login")
          .then( { data: 'Logged in successfully' }})
    
        const expectedActions = [
          { type: LOG_IN_REQUEST }
        ]
        const store = mockStore({ })
    
        return store.dispatch(actions.loginUser({'no':"12345","password":'12345'}))
          .then(() => { // return of async actions
            expect(store.getActions()).toEqual(expectedActions)
          })
      })

function t(arg0: string, arg1: () => void) {
  throw new Error('Function not implemented.')
}


function mockStore(arg0: {}) {
  throw new Error('Function not implemented.')
}
