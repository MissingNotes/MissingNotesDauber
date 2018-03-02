import styles from './highLight.css'

let currentValue
export default function highlight(state) {
  let previousValue = currentValue
  currentValue = state.textNode.textNodeMap
  if (previousValue !== currentValue) {
    let textNodeMap = state.textNode.textNodeMap
    if (previousValue !== undefined ) {
      localStorage.setItem('textNodeMap', JSON.stringify(textNodeMap))
    }
    if (Object.keys(textNodeMap).length !== 0) {
      const textNodeArray = Object.values(textNodeMap)
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
        let startOffset = textNode.startOffset
        let endOffset = textNode.endOffset
        if (commonAncestorNode.nodeType === Node.ELEMENT_NODE) {
          commonAncestorNode.innerHTML = commonAncestorNode.innerHTML.replace(content, '<span class="' + styles.highlightNote + '">' + content + '</span>')
        }
      })
    }
  }
}
