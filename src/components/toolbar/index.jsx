import React from 'react'
import styles from './style.css'


export default class Toolbar extends React.PureComponent {
  componentDidMount () {
    // TODO: 监听适当的DOM事件，用户选择文字后，提取所需的信息
  }
  render () {
    // TODO: 渲染工具栏
    return (
      <div className={styles.toolbar}>
        toolbar
      </div>
    )
  }
}
