import React from 'react'

class Card extends React.Component {
  render() {
    return <h1>carte {this.props.name}</h1>;
  }
}

export default Card;