import React from 'react'
import ReactDOM from 'react-dom'
import Toolbar from './components/toolbar'

const toolbarContainer = document.createElement('div')
document.body.appendChild(toolbarContainer)

ReactDOM.render(
  <Toolbar></Toolbar>,
  toolbarContainer
)
