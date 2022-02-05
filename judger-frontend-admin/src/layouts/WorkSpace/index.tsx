import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Enroll from '../../pages/Enroll'
import Menu from '../../components/menu'
function WorkSpace() {
  return (
    <div>
      <Menu />
      <Switch>
        <Route path="/workspace/enroll" component={Enroll}></Route>
        <Route path="/workspace/content"></Route>
      </Switch>
    </div>  
  )
}
export default WorkSpace
