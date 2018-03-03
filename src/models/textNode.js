// @flow

type TextNode = {
  id: string,
  content: string,
  // comment,
  fhtno: number,
  lhtno: number,
  nodeChain: Array < string >,
  data: string
}

type TextNodeMap = {
  [ID : string]: TextNode
}
type State = {
  textNodeMap:
    ? TextNodeMap,
  toolbarOn: ?number,
}
type Model = {
  namespace: string,
  state: State
}

let model : Model = {
  namespace: 'textNode',
  state: {
    textNodeMap: {},
    toolbarOn: 0,
  },
  reducers: {
    save(state, {payload: values} : { payload: TextNodeMap }){
      if(Object.keys(values).length === 0) {
        return state
      }
      let textNodeMap = { ...state.textNodeMap, ...values  }
      return {
        ...state,
        textNodeMap
      }
    },
    remove(state, { payload: id }) {
      if (state.textNodeMap.hasOwnProperty(id)){
        const newState = {
          ...state,
          textNodeMap: {
            ...state.textNodeMap
          }
         }
        delete newState.textNodeMap[id]
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
    //       textNodeMap
    //     }} = yield select()
    //     let textNodeMapNew = { ...textNodeMap, [values.id]: values  }
    //   localStorage.setItem('textNodeMap', JSON.stringify(textNodeMapNew))
    //   yield put({type: 'save', payload: textNodeMapNew})
    // },
    * fetch(action, {put}) {
      const textNodeMapString = localStorage.getItem('textNodeMap')
      let textNodeMap = {}
      if (textNodeMapString) {
        try {
          textNodeMap = JSON.parse(textNodeMapString)
        } catch (e) {
          localStorage.setItem('textNodeMap', JSON.stringify(textNodeMap))
        }
      } else {
        localStorage.setItem('textNodeMap', JSON.stringify(textNodeMap))
      }
      yield put({type: 'save', payload: textNodeMap})
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      dispatch({type: 'fetch'})
    }
  }
}
export default model
