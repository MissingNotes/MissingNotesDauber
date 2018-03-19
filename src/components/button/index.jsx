import React from 'react'
import styles from './style.css'


export default class Button extends React.PureComponent{
  render(){
    return (
      <span className={
          styles.btn + ' ' +
          (this.props.active ? styles.active : '')
        }
        onClick={this.props.onClick}
        style={this.props.style}
        tabIndex="0"
      >
        {this.props.children}
      </span>
    )
  }
}
