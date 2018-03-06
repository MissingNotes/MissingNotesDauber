import styles from './handlehighlight.css'

let currentValue

export default function handlehighlight(state) {
  let previousValue = currentValue
  let highlightTextAdd = {}
  let highlightTextDelete = {}

  if (state.highlight.toolbarOn === 1) {
    currentValue = state.highlight.highlightMap
    if (previousValue !== currentValue) {
      if (previousValue === undefined) {
        highlightTextAdd = currentValue
      } else {
        localStorage.setItem('highlightMap', JSON.stringify(currentValue))
        let keysPre = Object.keys(previousValue)
        let keysCur = Object.keys(currentValue)

        keysPre.filter((item) => {
          if (!(keysCur.indexOf(item) > -1)) {
            highlightTextDelete[item] = previousValue[item]
          }
        })
        keysCur.filter((item) => {
          if (!(keysPre.indexOf(item) > -1)) {
            highlightTextAdd[item] = currentValue[item]
          }
        })
      }
      // 渲染新增加的highlightText

      if (Object.keys(highlightTextAdd).length !== 0) {
        const highlightTextArray = Object.values(highlightTextAdd)
        highlightTextArray.forEach(function(highlightText) {

          // 找到高亮的数据所在的highlightText的父节点
          let cacSelectorArray = highlightText.cacSelector.slice()
          let baseElement = document.querySelector(cacSelectorArray.pop())
          let commonAncestorNode = ''
          while (cacSelectorArray.length) {
            commonAncestorNode = baseElement.querySelector(cacSelectorArray.pop())
            baseElement = commonAncestorNode
          }

          // 对parentNode里面的对应的数据进行高亮，用replace
          let content = highlightText.content
          let startOffset = highlightText.startOffset
          let endOffset = highlightText.endOffset
          if (commonAncestorNode.nodeType === Node.ELEMENT_NODE) {
            commonAncestorNode.innerHTML = commonAncestorNode.innerHTML.replace(content, '<span class="' + styles.highlightNote + ' node_'+ highlightText.id +'">' + content + '</span>')
          }
        })
      }

      // 删除高亮数据
      if (Object.keys(highlightTextDelete).length !== 0) {
        const highlightTextArray = Object.values(highlightTextDelete)
        highlightTextArray.forEach(function(highlightText) {

          let deleteNode = document.body.querySelector(".node_" + highlightText.id)
          console.log(deleteNode)
          let commonAncestorNode = deleteNode.parentNode
          let content = highlightText.content
          let startOffset = highlightText.startOffset
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
