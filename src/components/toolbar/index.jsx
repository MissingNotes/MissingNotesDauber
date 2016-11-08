import React from 'react'
import styles from './style.css'
import Button from '../button'

export default class Toolbar extends React.PureComponent {
  constructor(props){
    super(props)
    this.handleHighlight = this.handleHighlight.bind(this)
    this.handleAddStickyNode = this.handleAddStickyNode.bind(this)
  }
  componentDidMount () {
    // TODO: 监听适当的DOM事件，用户选择文字后，提取所需的信息
  }
  handleHighlight(event){
    var selObj = window.getSelection()
    console.log(selObj)
    event.preventDefault()
  }
  handleAddStickyNode(){

  }
  render () {
    // TODO: 渲染工具栏
    return (
      <div className={styles.toolbar}>
        <Button onClick={this.handleHighlight}>
          高亮文本
        </Button>
        <Button onClick={this.handleAddStickyNode}>
          添加注释
        </Button>
      </div>
    )
  }
}
