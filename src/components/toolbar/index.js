import React from 'react'
import styles from './style.css'
import Button from '../button'

export default class Toolbar extends React.PureComponent {
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
    // TODO: 监听适当的DOM事件，用户选择文字后，提取所需的信息
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
    let commonAncestorNode = range.commonAncestorContainer
    if (!commonAncestorNode) {
      console.log("commonAncestorNode is undefind")
    }
    // nodeChian
    let commonAncestorElement = commonAncestorNode
    let textNode = {}
    let nodeChian = []

    while (commonAncestorElement.nodeType !== Node.ELEMENT_NODE) {
      commonAncestorElement = commonAncestorElement.parentNode
      if (!commonAncestorElement) {
        console.log("commonAncestorElement is undefind")
      }
    }
     let i = 0
     while (commonAncestorElement.parentNode) {
      nodeChian[i] = new String ()
      nodeChian[i] = commonAncestorElement.nodeName.toLocaleLowerCase()
      if(commonAncestorElement.id){
        nodeChian[i] = nodeChian[i] + "#" + commonAncestorElement.id
      }
      if(commonAncestorElement.classList.value){
        commonAncestorElement.classList.forEach(className => nodeChian[i] = nodeChian[i] + "." +className)
      }
      commonAncestorElement = commonAncestorElement.parentNode
      i = i + 1
     }
    textNode.nodeChian = nodeChian
    // comtent,fhtno,lhtno

    if (!range.collapsed) {

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
      textNode.data = myDate.toLocaleString()

      localStorage.setItem(textNode.id, JSON.stringify(textNode))
      console.log(localStorage)
      // comments
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
      </div>
    )
  }
}
