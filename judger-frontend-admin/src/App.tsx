import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import LogIn from './pages/LogIn'
const App = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/login" />
    </Route>
    <Route path="/login" component={LogIn} />
    <Route path="/dashboard/:dashboard" component={Dashboard} />
  </Switch>
)

export default App
