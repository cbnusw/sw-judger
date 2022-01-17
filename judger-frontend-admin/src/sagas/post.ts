import axios from 'axios'
import { backUrl } from '../config/config'

axios.defaults.baseURL = backUrl

export default function* postSaga() {}
