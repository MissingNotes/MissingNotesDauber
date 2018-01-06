import React from 'react'
import styles from './style.css'
import Button from '../button'
import { connect } from 'dva'
import Highlight from '../highlight'

class Toolbar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleHighlight = this.handleHighlight.bind(this)
    this.handleAddStickyNode = this.handleAddStickyNode.bind(this)
    this.handleMouseup = this.handleMouseup.bind(this)
    this.state = {
      mode: 'none'
    }
  }

  handleHighlight(event) {
    this.setState({mode: 'highlight'})
    document.body.addEventListener('mouseup', this.handleMouseup)
  }

  handleAddStickyNode() {
    this.setState({mode: 'addnode'})
  }

  handleMouseup() {
    let win = event.view
    let selection = win.getSelection()
    if (selection.isCollapsed) {
      console.log("selection.isCollapsed")
    }

    let range = selection.getRangeAt(0)
    if (!range.collapsed) {
      let commonAncestorNode = range.commonAncestorContainer
      if (!commonAncestorNode) {
        console.log("commonAncestorNode is undefind")
      }
      // nodeChain
      let commonAncestorElement = commonAncestorNode
      let textNode = {}
      let nodeChain = []

      while (commonAncestorElement.nodeType !== Node.ELEMENT_NODE) {
        commonAncestorElement = commonAncestorElement.parentNode
        if (!commonAncestorElement) {
          console.log("commonAncestorElement is undefind")
        }
      }
      let i = 0
      while (commonAncestorElement.parentNode) {
        nodeChain[i] = new String()
        nodeChain[i] = commonAncestorElement.nodeName.toLocaleLowerCase()
        if (commonAncestorElement.id) {
          nodeChain[i] = nodeChain[i] + "#" + commonAncestorElement.id
        }
        if (commonAncestorElement.classList.value) {
          commonAncestorElement.classList.forEach(className => nodeChain[i] = nodeChain[i] + "." + className)
        }
        commonAncestorElement = commonAncestorElement.parentNode
        i = i + 1
      }
      textNode.nodeChain = nodeChain
      // comtent,fhtno,lhtno

      let nodeComment = []

      if (commonAncestorNode.nodeType === Node.TEXT_NODE) {
        textNode.startOffset = range.startOffset
        textNode.endOffset = range.endOffset
        nodeComment = commonAncestorNode.nodeValue
        // textNode.content = nodeComment.slice(nodeComment.indexOf(textNode.startOffset),nodeComment.indexOf(textNode.endOffset))
        textNode.content = range.toString()
      }

      // id
      textNode.id = (Date.now()).toString(32)

      // data
      let myDate = new Date()
      textNode.date = myDate.toLocaleString()
      console.log(textNode)

      // comments

      // dispatch
      this.props.dispatch({
        type: 'textNode/add',
        payload: textNode,
      })
    }
  }

  render() {
    // TODO: 渲染工具栏
    return (
      <div className={styles.toolbar}>
        <Button onClick={this.handleHighlight}>
          高亮文本
        </Button>
        <Button onClick={this.handleAddStickyNode}>
          添加注释
        </Button>
        <Highlight />
      </div>
    )
  }
}

export default connect()(Toolbar)
