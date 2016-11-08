import React from 'react'
import styles from './style.css'


export default class Button extends React.PureComponent{
  render(){
    return (
      <span className={styles.btn}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.children}
      </span>
    )
  }
}
