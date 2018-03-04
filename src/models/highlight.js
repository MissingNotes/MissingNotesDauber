

// type HighlightText = {
//   text: string,
//   // The number of characters from the start of the `TextNode` to the start of
//   // highlighted text.
//   startOffset: number,
//   // The number of characters from the start of the `TextNode` to the end of
//   // highlighted text.
//   endOffset: number,
//   // sub selector from `Highlight#cacSelector`
//   subSelector: Array<string>,
// }
//
// type Highlight = {
//   id: string,
//   createTime: number,
//   // Each `HighlightText` is corresponding to a DOM `TextNode` that is a leaf
//   // node of the DOM `Element` specified by the `cacSelector`.
//   texts: Array<HighlightText>,
//   // `range.commonAncestorContainer` element's full selector from body element
//   cacSelector: Array<string>,
// }
//
// type HighlightMap = {
//   [ID: string]: Highlight
// }
// type State = {
//   highlightMap: ?HighlightMap,
//   toolbarOn: ?number,
// }
// type Model = {
//   namespace: string,
//   state: State
// }

// let model : Model = {
let model = {
  namespace: 'highlight',
  state: {
    highlightMap: {},
    toolbarOn: 0,
  },
  reducers: {
    save(state, {payload: values} ){
      if(Object.keys(values).length === 0) {
        return state
      }
      let highlightMap = { ...state.highlightMap, ...values  }
      return {
        ...state,
        highlightMap
      }
    },
    remove(state, { payload: id }) {
      if (state.highlightMap.hasOwnProperty(id)){
        const newState = {
          ...state,
          highlightMap: {
            ...state.highlightMap
          }
         }
        delete newState.highlightMap[id]
        return newState
      }
      else {
        return state
      }
    },
    toolbarOn(state,  { payload: value }) {
      return { ...state, ... value }
    }
  },
  effects: {
    // * add({payload: values} : {
    //   payload: TextNode
    // }, {put, select}) {
    //   let {textNode: {
    //       highlightMap
    //     }} = yield select()
    //     let highlightMapNew = { ...highlightMap, [values.id]: values  }
    //   localStorage.setItem('highlightMap', JSON.stringify(highlightMapNew))
    //   yield put({type: 'save', payload: highlightMapNew})
    // },
    * fetch(action, {put}) {
      const highlightMapString = localStorage.getItem('highlightMap')
      let highlightMap = {}
      if (highlightMapString) {
        try {
          highlightMap = JSON.parse(highlightMapString)
        } catch (e) {
          localStorage.setItem('highlightMap', JSON.stringify(highlightMap))
        }
      } else {
        localStorage.setItem('highlightMap', JSON.stringify(highlightMap))
      }
      yield put({type: 'save', payload: highlightMap})
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      dispatch({type: 'fetch'})
    }
  }
}
export default model
