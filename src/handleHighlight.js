import styles from './handlehighlight.css'

let currentValue

export default function handlehighlight(state) {
  let previousValue = currentValue
  let highlightTextsAdd = {}
  let highlightTextsDelete = {}

  if (state.highlight.toolbarOn === 1) {
    currentValue = state.highlight.highlightMap
    if (previousValue !== currentValue) {
      if (previousValue === undefined) {
        highlightTextsAdd = currentValue
      } else {
        localStorage.setItem('highlightMap', JSON.stringify(currentValue))
        let keysPre = Object.keys(previousValue)
        let keysCur = Object.keys(currentValue)

        keysPre.filter((item) => {
          if (!(keysCur.indexOf(item) > -1)) {
            highlightTextsDelete[item] = previousValue[item]
          }
        })
        keysCur.filter((item) => {
          if (!(keysPre.indexOf(item) > -1)) {
            highlightTextsAdd[item] = currentValue[item]
          }
        })
      }
      // 渲染新增加的highlightText

      if (Object.keys(highlightTextsAdd).length !== 0) {
        const highlightTextsArray = Object.values(highlightTextsAdd)
        highlightTextsArray.forEach(function(highlight) {
          let id = highlight.id

          highlight.texts.forEach(function(highlightText) {
            // 找到高亮的数据所在的highlightText的父节点
            let selectorArray = highlight.cacSelector.concat(highlightText.subSelector)

            let highlightTextSelector = ''
            for(var i = 0; i < selectorArray.length; i++) {
              highlightTextSelector = highlightTextSelector + selectorArray[i].nodeName
              if(selectorArray[i].id) {
                highlightTextSelector = highlightTextSelector  + "#" +  selectorArray[i].id
              }
              if(selectorArray[i].classes) {
                selectorArray[i].classes.forEach((className) =>      highlightTextSelector = highlightTextSelector  + "." + className)
              }
              highlightTextSelector = highlightTextSelector + '>'
              // highlightTextSelector = highlightTextSelector + ':nth-of-type(' + selectorArray[i].nthOfType + ')>'
            }

            let nodes = document.querySelectorAll(highlightTextSelector.slice(0,highlightTextSelector.length - 1))
            let text = highlightText.text
            let startOffset = highlightText.startOffset
            let endOffset = highlightText.endOffset
            let hightlightTextNode

            for (var i = 0; i < nodes.length; i++ ) {
              let node = nodes[i]
              for (var j = 0; j < node.childNodes.length; j++) {
                if (node.childNodes[j].nodeType === Node.TEXT_NODE) {
                  if (node.childNodes[j].nodeValue.slice(startOffset,endOffset) === text) {
                    hightlightTextNode = node.childNodes[j]
                  }
                }
              }
            }
            let selectBF = document.createTextNode(hightlightTextNode.nodeValue.slice(0, startOffset))

            let selectAF = document.createTextNode(hightlightTextNode.nodeValue.slice(endOffset))
            let span = document.createElement('span')
            span.innerHTML = text
            span.classList.add(styles.highlightNote)
            span.classList.add('node_' + id)

            let fragment = document.createDocumentFragment()
            fragment.appendChild(selectBF)
            fragment.appendChild(span)
            fragment.appendChild(selectAF)
            hightlightTextNode.parentNode.replaceChild(fragment, hightlightTextNode)
            // if (hightlightNode.nodeType === Node.ELEMENT_NODE) {
              // hightlightNode.innerHTML = hightlightNode.innerHTML.replace(text, '<span class="' + styles.highlightNote + ' node_' + id + '">' + text + '</span>')
            // }
          })
        })
      }

      // 删除高亮数据
      if (Object.keys(highlightTextsDelete).length !== 0) {
        const highlightTextsArray = Object.values(highlightTextsDelete)
        highlightTextsArray.forEach(function(highlight) {

          highlight.texts.forEach(function(highlightText){
          let deleteNode = document.body.querySelector(".node_" + highlight.id)
          let commonAncestorNode = deleteNode.parentNode

          let text = highlightText.text
          let startOffset = highlightText.startOffset
          if (commonAncestorNode.nodeType === Node.ELEMENT_NODE) {
            // commonAncestorNode.removeChild(deleteNode)
            commonAncestorNode.innerHTML = commonAncestorNode.innerHTML.replace(deleteNode.outerHTML, text)
            // commonAncestorNode.innerHTML = commonAncestorNode.innerHTML.slice(0, startOffset) + content + commonAncestorNode.innerHTML.slice(startOffset)
          }
          })
        })
      }
    }
  }
}
