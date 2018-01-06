// @flow

type TextNodeObject = {
  id: string,
  content: string,
  // comment,
  fhtno: number,
  lhtno: number,
  nodeChain: Array < string >,
  data: string
}

type TextNodeList = {
  [ID : string]: TextNodeObject
}
type State = {
  textNodeList:
    ? TextNodeList,
  // total: ?number,
}
type Model = {
  namespace: string,
  state: State
}

let model : Model = {
  namespace: 'textNode',
  state: {
    textNodeList: {},
    // total: undefined,
  },
  reducers: {
    save(state, {payload: textNodeList}) {
      return {
        ...state,
        textNodeList
      }
    }
  },
  effects: {
    // * add({ payload: values }, { put, select }){
    * add({payload: values} : {
      payload: TextNodeObject
    }, {put, select}) {
      let {textNode: {
          textNodeList
        }} = yield select()      
        let textNodeListNew = { ...textNodeList, [values.id]: values  }
      // textNodeList[values.id] = values
      // const total = yield select(state => state.total)
      // const totalNew = total + 1
      localStorage.setItem('textNodeList', JSON.stringify(textNodeListNew))
      yield put({type: 'save', payload: textNodeListNew})
    },
    * fetch(action, {put}) {
      const textNodeListString = localStorage.getItem('textNodeList')
      let textNodeList = {}
      if (textNodeListString) {
        try {
          textNodeList = JSON.parse(textNodeListString)
        } catch (e) {
          localStorage.setItem('textNodeList', JSON.stringify(textNodeList))
        }
      } else {
        localStorage.setItem('textNodeList', JSON.stringify(textNodeList))
      }
      yield put({type: 'save', payload: textNodeList})
    },
    * remove() {}
  },
  subscriptions: {
    setup({dispatch, history}) {
      dispatch({type: 'fetch'})
    }
  }
}
// localStorage.setItem('textNodeList', JSON.stringify())
export default model
