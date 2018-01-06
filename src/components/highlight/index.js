import React from 'react'
import {connect} from 'dva'

class Highlight extends React.Component {


  //渲染高亮的数据，对每一个存储在textNodeList里的信息 进行渲染
  componentDidMount() {
    this.highlight(this.props.textNodeList)
  }

  componentWillUpdate({ textNodeList }) {
    this.highlight(textNodeList)
  }

  highlight(textNodeList) {
    const textNodeArray = Object.values(textNodeList)
    textNodeArray.forEach(function(textNode) {

      // 找到高亮的数据所在的textnode的父节点
      let nodeChainArray = textNode.nodeChain.slice()
      let baseElement = document.querySelector(nodeChainArray.pop())
      let commonAncestorNode = ''
      while (nodeChainArray.length) {
        commonAncestorNode = baseElement.querySelector(nodeChainArray.pop())
        baseElement = commonAncestorNode
      }

      // 对parentNode里面的对应的数据进行高亮，用replace
      // let startOffset = textNode.startOffset
      // let endOffset = textNode.endOffset
      let content = textNode.content
      if (commonAncestorNode.nodeType === Node.ELEMENT_NODE) {
        commonAncestorNode.innerHTML = commonAncestorNode.innerHTML.replace(content, '<span style="background-color: rgb(255, 255, 0)">' + content + '</span>')
      }
    })
  }

  render() {
    return (
      <div></div>
    )
  }
}

function mapStateToProps(state) {
  const { textNodeList } = state.textNode
  return { textNodeList }
}

export default connect(mapStateToProps)(Highlight)
