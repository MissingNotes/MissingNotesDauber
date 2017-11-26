// @flow

type TextNodeObject = {
  id: string,
  content: string,
  // comment,
  fhtno: number,
  lhtno: number,
  nodeChain: Array<string>,
  data: string,
}

type TextNodeList = {
  [ID: string]: TextNodeObject,
}
type State = {
  textNodeList: TextNodeList,
  total: ?number,
}
type Model = {
  namespace: string,
  state: State,
}

let model: Model = {
  namespace: 'textNode',
  state : {
    textNodeList: {},
    total: undefined,
  },
  reducers: {
    save(state, { playload: { data: textNodeList, total } }){
      return { ...state, textNodeList, total }
    },
  },
  effects: {
    * fetch (){},
    * create (){},
    * remove (){},
  },
}

export default model
