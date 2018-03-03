import styles from './highLight.css'

let currentValue

export default function highlight(state) {
  let previousValue = currentValue
  let textNodeAdd = {}
  let textNodeDelete = {}

  if (state.textNode.toolbarOn === 1) {
    currentValue = state.textNode.textNodeMap
    if (previousValue !== currentValue) {
      if (previousValue === undefined) {
        textNodeAdd = currentValue
      } else {
        localStorage.setItem('textNodeMap', JSON.stringify(currentValue))
        let keysPre = Object.keys(previousValue)
        let keysCur = Object.keys(currentValue)

        keysPre.filter((item) => {
          if (!(keysCur.indexOf(item) > -1)) {
            textNodeDelete[item] = previousValue[item]
          }
        })
        keysCur.filter((item) => {
          if (!(keysPre.indexOf(item) > -1)) {
            textNodeAdd[item] = currentValue[item]
          }
        })
      }
      // 渲染新增加的textNode

      if (Object.keys(textNodeAdd).length !== 0) {
        const textNodeArray = Object.values(textNodeAdd)
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
          let content = textNode.content
          let startOffset = textNode.startOffset
          let endOffset = textNode.endOffset
          if (commonAncestorNode.nodeType === Node.ELEMENT_NODE) {
            commonAncestorNode.innerHTML = commonAncestorNode.innerHTML.replace(content, '<span class="' + styles.highlightNote + ' node_'+ textNode.id +'">' + content + '</span>')
          }
        })
      }

      // 删除高亮数据
      if (Object.keys(textNodeDelete).length !== 0) {
        const textNodeArray = Object.values(textNodeDelete)
        textNodeArray.forEach(function(textNode) {

          let deleteNode = document.body.querySelector(".node_" + textNode.id)
          console.log(deleteNode)
          let commonAncestorNode = deleteNode.parentNode
          let content = textNode.content
          let startOffset = textNode.startOffset
          if (commonAncestorNode.nodeType === Node.ELEMENT_NODE) {
            // commonAncestorNode.removeChild(deleteNode)
            commonAncestorNode.innerHTML = commonAncestorNode.innerHTML.replace(deleteNode.outerHTML, content)            
            // commonAncestorNode.innerHTML = commonAncestorNode.innerHTML.slice(0, startOffset) + content + commonAncestorNode.innerHTML.slice(startOffset)
          }
        })
      }
    }
  }
}
