import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import WorkSpace from '../WorkSpace'
import LogIn from '../../pages/LogIn'
const App = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/login" />
    </Route>
    <Route path="/login" component={LogIn} />
    <Route path="/workspace" component={WorkSpace} />
  </Switch>
)

export default App
