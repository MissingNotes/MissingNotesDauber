import React from 'react'
import styles from './style.css'
import Button from '../button'
import {connect} from 'dva'
import Contextmenu from '../contextmenu'

// let textNodes = []
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

    // while (node && node.nodeName !== startNodeName) {
    //   let selector = ""
    //   selector = node.nodeName.toLocaleLowerCase()
    //   if (node.id) {
    //     selector = selector + "#" + node.id
    //   }
    //   if (node.classList.value) {
    //     node.classList.forEach(className => selector = selector + "." + className)
    //   }
    //   cacSelector.unshift(selector)
    //   node = node.parentNode
    // }
    //
    while (node && node.nodeName !== startNodeName) {
      let selector = {}
      selector.nodeName = node.nodeName.toLocaleLowerCase()
      if (node.id) {
        selector.id = node.id
      }
      if (node.classList.value) {
        let classes = []
        node.classList.forEach(className =>  classes.push(className))
        selector.classes = classes
      }
      // 
      // let childNodes = node.parentNode.childNodes
      // let nodes = []
      // for(var i=0; i<childNodes.length; i++) {
      //   if (childNodes[i].nodeName.toLowerCase() === selector.nodeName ) {
      //     if ( childNodes[i].id === selector.id){
      //       if (childNodes[i].classList.value) {
      //         let cNClasses  = []
      //         childNodes[i].classList.forEach(className =>  cNClasses.push(className))
      //         if (cNClasses.toString() === selector.classes.toString()) {
      //           nodes.push(childNodes[i])
      //         }
      //       }
      //       else if (selector.classes === undefined) {
      //         nodes.push(childNodes[i])
      //       }
      //     }
      //   }
      // }
      // selector.number = nodes.indexOf(node)
      cacSelector.unshift(selector)
      node = node.parentNode
    }
    return cacSelector
  }

  // get all the highlight textNode in commonAncestorNode
  getTextsIn = (range, cANode) => {

    let texts = []
    let startContainer = range.startContainer
    let endContainer = range.endContainer
    let startOffset = range.startOffset
    let endOffset = range.endOffset

    if (cANode.nodeType === Node.TEXT_NODE) {
      let highlightText = {}
      highlightText.startOffset = range.startOffset
      highlightText.endOffset = range.endOffset
      highlightText.text = cANode.textContent.slice(startOffset, endOffset)
      highlightText.subSelector = []
      texts.push(highlightText)
      return texts
    }
    else {
      const childNodeResult = this.getSelectedTextNodes(cANode, startContainer, endContainer, false)
      let textNodes = []
      textNodes.push(...childNodeResult.selectedTextNodes)

      if (textNodes.length !== 0) {
        if (textNodes.length === 1) {
          texts[0] = this.getTextIn(cANode, textNodes[0], startOffset, endOffset)
        } else {
          texts[0] = this.getTextIn(cANode, textNodes[0], startOffset, textNodes[0].textContent.length)
          texts[textNodes.length - 1] = this.getTextIn(cANode, textNodes[textNodes.length - 1], 0, endOffset)
          for (var i = 1; i < textNodes.length - 1; i++) {
            texts[i] = this.getTextIn(cANode, textNodes[i], 0, textNodes[i].textContent.length)
          }
        }
      }
      return texts
    }
  }

  getSelectedTextNodes = (el, startContainer, endContainer, hasMetStartTextNode) => {
    let selectedTextNodes = []
    let isEnd = false

    for (var i = 0; !isEnd && i < el.childNodes.length; i++) {
      const childNode = el.childNodes[i]
      if (childNode.nodeType === Node.TEXT_NODE) {
        if (!hasMetStartTextNode) {
          if (childNode === startContainer) {
            hasMetStartTextNode = true
            if (childNode.textContent.replace(/\s/g, '').length) {
              selectedTextNodes.push(childNode)
            }
          }
        }
        else {
          if (childNode.textContent.replace(/\s/g, '').length) {
            selectedTextNodes.push(childNode)
            if(childNode === endContainer) {
              isEnd = true
              break
            }
          }
        }
      }
      else if (childNode.nodeType === Node.ELEMENT_NODE) {
        const childNodeResult = this.getSelectedTextNodes(childNode, startContainer, endContainer, hasMetStartTextNode)
        selectedTextNodes.push(...childNodeResult.selectedTextNodes)
        hasMetStartTextNode = childNodeResult.hasMetStartTextNode
        if (childNodeResult.isEnd) {
          isEnd = true
          break
        }
      }
    }

    return { isEnd, hasMetStartTextNode, selectedTextNodes }
  }

  getTextIn = (cANode, textNode, startOffset, endOffset) => {
    let text = {}
    text.startOffset = startOffset
    text.endOffset = endOffset
    text.text = textNode.data.slice(startOffset, endOffset)
    if (cANode.nodeType === Node.TEXT_NODE) {
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
