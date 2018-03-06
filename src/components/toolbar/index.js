import React from 'react'
import styles from './style.css'
import Button from '../button'
import {connect} from 'dva'
import Contextmenu from '../contextmenu'

let textNodes = []
let highlightOn = 0

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
  componentDidMount() {
    this.props.dispatch({
      type: 'highlight/toolbarOn',
      payload: {
        toolbarOn: 1
      }
    })
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

      let highlight = {}

      highlight.cacSelector = this.getSelector(commonAncestorNode, "#document")

      highlight.texts = this.getTextsIn(range, commonAncestorNode)

      highlight.id = (Date.now()).toString(32)

      highlight.createTime = new Date().getTime()
      console.log(highlight)

      // comments

      // dispatch
      this.props.dispatch({
        type: 'highlight/save',
        payload: {
          [highlight.id]: highlight
        }
      })
    }
  }
  // get hightlight.cacSelector
  getSelector = (node, startNodeName) => {
    let cacSelector = []
    while (node.nodeType !== Node.ELEMENT_NODE) {
      node = node.parentNode
      if (!node) {
        console.log("get hightlight.cacSelector error")
      }
    }
    let i = 0
    while (node && node.nodeName !== startNodeName) {
      cacSelector[i] = new String()
      cacSelector[i] = node.nodeName.toLocaleLowerCase()
      if (node.id) {
        cacSelector[i] = cacSelector[i] + "#" + node.id
      }
      if (node.classList.value) {
        node.classList.forEach(className => cacSelector[i] = cacSelector[i] + "." + className)
      }
      node = node.parentNode
      i = i + 1
    }
    return cacSelector
  }

  // get all the highlight textNode in commonAncestorNode
  getTextsIn = (range, cANode) => {
    let highlightText = {}
    let texts = []
    let startContainer = range.startContainer
    let endContainer = range.endContainer
    let startOffset = range.startOffset
    let endOffset = range.endOffset

    this.getTextNodesIn(cANode, startContainer, endContainer)

    if (textNodes.length !== 0) {
      if(textNodes.length === 1) {
        texts[0] = this.getTextIn(cANode,textNodes[0], startOffset, endOffset)
      } else {
        texts[0] = this.getTextIn(cANode,textNodes[0], startOffset, textNodes[0].data.length)
        texts[textNodes.length - 1] = this.getTextIn(cANode,textNodes[textNodes.length - 1], 0, endOffset)
        for (var i = 1; i < textNodes.length-1; i++){
          texts[i] = this.getTextIn(cANode,textNodes[i], 0,textNodes[0].data.length)
        }
      }
    }
    return texts
  }

  getTextNodesIn = (cANode, startContainer, endContainer) => {
    if(cANode.childNodes.length !== 0){
      for (var i = 0; i < cANode.childNodes.length; i++){
        this.getTextNodesIn(cANode.childNodes[i], startContainer, endContainer)
      }
    } else if (cANode.nodeType === Node.TEXT_NODE) {
      if(cANode === startContainer) {
        highlightOn = 1
      }
      if(cANode === endContainer && cANode !== startContainer) {
        highlightOn = 0
      }
      if(highlightOn || cANode === endContainer) {
        textNodes.push(cANode)
      }
    }
  }

  getTextIn = (cANode,textNode, startOffset, endOffset) => {
    let text = {}
    text.startOffset = startOffset
    text.endOffset = endOffset
    text.text = textNode.data.slice(startOffset, endOffset)
    if (cANode.nodeType === Node.TEXT_NODE){
      text.subSelector = this.getSelector(textNode, cANode.parentNode.nodeName)
    } else {
      text.subSelector = this.getSelector(textNode, cANode.nodeName)
    }
    return text
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
        <Contextmenu/>
      </div>
    )
  }
}

export default connect()(Toolbar)
