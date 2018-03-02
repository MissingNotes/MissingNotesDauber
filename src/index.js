import dva from 'dva'
import React from 'react'
import './index.css'
import ReactDOM from 'react-dom'
import Toolbar from './components/toolbar/index'
import highlight from './highLight'
// 1. Initialize
const app = dva({
  onStateChange: highlight,
})

// 2. Plugins


// 3. model
app.model(require('./models/textNode').default)

// 4. Router
app.router(() => <Toolbar />)

// 5.Start
const toolbarContainer = document.createElement("div", { id: "root" })
document.body.appendChild(toolbarContainer)
app.start('#root')
