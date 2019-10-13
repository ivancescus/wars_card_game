import React from 'react'
import { Card } from 'react-bootstrap';


class PlayerBoard extends React.Component {
  /*
    this.props.remainingCards // cate mai am din deck-ul curent
    this.props.imageSrc // poza cu cartea curenta

    this.props.lastTakenCardSrc // poza cu imaginea cu ce am luat recent
    this.props.takenCards // cate am luat pana acunm
  */
  renderOld() {
    return <h1>carti ramase: {this.props.remainingCards}, randez: {this.props.imageSrc}</h1>;
  }
  render() {
    const cardText = `${this.props.deckType} mai are ${this.props.remainingCards} carti`
    return (

      <Card style={{ width: '20rem', color: 'red', float: 'left' }}>
        <Card.Img variant="top" src={this.props.imageSrc} />
        <Card.Body>
          <Card.Title>{this.props.playerIndex}</Card.Title>
          <Card.Text>
            {cardText}
          </Card.Text>
        </Card.Body>
      </Card>
    )
  }
}

export default PlayerBoard;