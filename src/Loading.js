import React from 'react'

class Loading extends React.Component {
  render() {
    return <h1>Loading: {this.props.loadingElement}</h1>;
  }
}

export default Loading;