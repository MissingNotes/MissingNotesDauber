import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'dva'
import styles from './style.css'
import highlightStyles from '../../highLight.css'

const contextMenuRoot = document.getElementById('context-menu')
const taskItemClassName = highlightStyles.highlightNote
class Contextmenu extends React.Component {
  constructor(props){
    super(props)
    this.menu = document.createElement('div')
    this.menu.classList.add(styles.contextMenu)
    this.state = {
      visible: false,
    }
  }

  // 监听高亮信息的右键事件，弹出删除面板
  componentDidMount() {
    // this.highlight(this.props.textNodeMap)
    contextMenuRoot.appendChild(this.menu)
    this.contextListener()
  }

  componentWillUpdate({ textNodeMap }) {
    // this.highlight(textNodeMap)
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.menu);
  }
  //
  // highlight = (textNodeMap) => {
  //   const textNodeArray = Object.values(textNodeMap)
  //   textNodeArray.forEach(function(textNode) {
  //
  //     // 找到高亮的数据所在的textnode的父节点
  //     let nodeChainArray = textNode.nodeChain.slice()
  //     let baseElement = document.querySelector(nodeChainArray.pop())
  //     let commonAncestorNode = ''
  //     while (nodeChainArray.length) {
  //       commonAncestorNode = baseElement.querySelector(nodeChainArray.pop())
  //       baseElement = commonAncestorNode
  //     }
  //
  //     // 对parentNode里面的对应的数据进行高亮，用replace
  //     // let startOffset = textNode.startOffset
  //     // let endOffset = textNode.endOffset
  //     let content = textNode.content
  //     let startOffset = textNode.startOffset
  //     let endOffset = textNode.endOffset
  //     if (commonAncestorNode.nodeType === Node.ELEMENT_NODE) {
  //        commonAncestorNode.innerHTML = commonAncestorNode.innerHTML.replace(content, '<span class="'+styles.highlightNote + '">' + content + '</span>')
  //       // let spanEl = document.createElement("span")
  //       // spanEl.classList.add("highlightNote")
  //       // spanEl.innerHTML = content
  //       // let textBefore = document.createTextNode(commonAncestorNode.innerHTML.slice(0, startOffset))
  //       // let textAfter = document.createTextNode(commonAncestorNode.innerHTML.slice(endOffset))
  //       // commonAncestorNode.innerHTML = ""
  //       // commonAncestorNode.appendChild(textBefore)
  //       // commonAncestorNode.appendChild(spanEl)
  //       // commonAncestorNode.appendChild(textAfter)
  //     }
  //   })
  // }
  // 筛选右键事件监听目标
  clickInsideElement = (e, className) => {
    let el = e.srcElement || e.target;

    if (el.classList.contains(className)) {
      return el;
    } else {
      while (el = el.parentNode) {
        if (el.classList && el.classList.contains(className)) {
          return el;
        }
      }
    }
    return false;
  }

  //获取鼠标的坐标
  getPosition = (e) => {
    let posx = 0
    let posy = 0

    if (!e) { let e = window.event }

    if (e.pageX || e.pageY) {
      posx = e.pageX
      posy = e.pageY
    } else if (e.clientX || e.clientY) {
      posx = e.clientX  + document.body.scrollLeft + document.documentElement.scrollLeft
      posy = e.clientY  + document.body.scrollTop + document.documentElement.scrollTop
    }

    return {
      x: posx,
      y: posy
    }
  }

  positionMenu = (e) => {
    let menuPosition = this.getPosition(e)
    let menuPositionX = menuPosition.x + 'px'
    let menuPositionY = menuPosition.y + 'px'

    this.menu.style.left = menuPositionX
    this.menu.style.top = menuPositionY
  }
  // 监听右键事件，弹出删除面板
  contextListener = () => {
    document.addEventListener( "contextmenu", (e) => {
      let taskItemInContext = this.clickInsideElement( e, taskItemClassName );

      if ( taskItemInContext ) {
        e.preventDefault();
        console.log(e)
        this.toggleMenuOn();
        this.positionMenu(e);
      } else {
        taskItemInContext = null;
        this.toggleMenuOff();
      }
    });
  }

  // 1. 左键单击时退出面板，
  // 2. 左键单击右键面板时，响应删除函数功能。

  toggleMenuOn = () => {
    this.setState({
      visible: true,
    })
    this.menu.classList.add(styles.contextMenuActive)
  }

  toggleMenuOff = () => {
    this.setState({
      visible: false,
    })
    this.menu.classList.remove(styles.contextMenuActive)
  }

  render() {
    return ReactDOM.createPortal(
      <div>
        <button>Delete</button>
      </div>,
      this.menu,
    )
  }
}


export default Contextmenu
