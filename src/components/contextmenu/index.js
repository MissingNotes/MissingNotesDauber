import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'dva'
import styles from './style.css'
import highlightStyles from '../../highLight.css'

// const contextMenuRoot = document.getElementById('context-menu')
const highlightNoteClassName = highlightStyles.highlightNote
const contextMenuDelete = styles.contextMenuDelete
let highlightNote
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
    document.body.appendChild(this.menu)
    this.contextListener()
    this.clickListener()
    this.keyupListener()
  }

  // componentWillUpdate({ textNodeMap }) {
  //   this.highlight(textNodeMap)
  // }

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
      highlightNote = this.clickInsideElement( e, highlightNoteClassName );

      if ( highlightNote ) {
        e.preventDefault();
        this.toggleMenuOn();
        this.positionMenu(e);
      } else {
        hilightNote = null;
        this.toggleMenuOff();
      }
    });
  }

  // 1. 左键单击时退出面板，
  // 2. 左键单击右键面板时，响应删除函数功能。
  clickListener = () => {
    document.addEventListener('click', (e) => {
      let clickItem = this.clickInsideElement(e,contextMenuDelete)
      if (clickItem){
        e.preventDefault()
        let highlightNoteId = highlightNote.classList[highlightNote.classList.length - 1]
        highlightNoteId = highlightNoteId.slice(5)
        this.props.dispatch({
          type: 'textNode/remove',
          payload: highlightNoteId
        })
      } else {
        var button = e.which || e.Button
        if (button === 1 ){
          this.toggleMenuOff()
        }
      }
    })
  }

  keyupListener = () => {
    window.onkeyup = (e) => {
      if (e.keyCode === 27) {
        this.toggleMenuOff()
      }
    }
  }

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
        <button className={styles.contextMenuDelete}>Delete</button>
      </div>,
      this.menu,
    )
  }
}


export default connect()(Contextmenu)
