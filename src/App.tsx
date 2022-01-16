import React from 'react'
import { Route } from 'react-router-dom'
import LogIn from './pages/LogIn'
function App() {
  return (
    <div className="App">
      <Route path="/LogIn">
        <LogIn />
      </Route>
    </div>
  )
}

export default App
