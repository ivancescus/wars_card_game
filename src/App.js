import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Row, Container, Col } from 'react-bootstrap';
import Card from './Card'
import Loading from './Loading'
import PlayerBoard from './PlayerBoard'
import clone from 'lodash.clonedeep'

// api requests and helpers
import { GetNewDeck, GetNewShuffledDeck, GetNewCard, Sleep, GetValueOfCard } from './Defaults'
import { tsMethodSignature } from '@babel/types';

async function initNewPlayer() {
  return {
    currentDeck: await GetNewDeck(),
    takenDeck: [],
    currentCard: {
    },
    recentlyTakenCard: {

    }
  }
}

const sleepBetweenActions = 1000; // ms
class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      player1: null,
      player2: null,
      loadingReason: 'player decks',
      gameFinished: false,
      gameWinner: null,
    }
    // nu punem cod blocant pe constructor
    this.init();
  }

  async init() {
    this.setState({
      player1: await initNewPlayer(),
      player2: await initNewPlayer(),
      loadingReason: 'drawing cards'
    })
    this.mainLoop(); // start game loop
  }


  async playerDraw(index) {
    const dictKey = index === 1 ? 'player1' : 'player2';
    const player = { ...this.state[dictKey] };

    if (player.currentDeck.remaining > 0) {
      player.currentDeck.remaining -= 1;
      const currentCard = await GetNewCard(player.currentDeck.deck_id);
      this.setState({
        [dictKey]: {
          ...this.state[dictKey],
          currentDeck: player.currentDeck,
          currentCard,
        }
      })
      return;
    }

    // am pierdut?
    if (player.takenDeck.length === 0) {
      // ambele deckuri sunt goale, celalalt player a castigat
      this.setState({
        gameFinished: true,
        gameWinner: index === 2 ? 'player1' : 'player2'
      })
      return;
    }

    // am terminat pachetul curent, dar am carti luate, le dau reshuffle
    let cards = '';
    for (let i = 0; i < player.takenDeck.length; i += 1) {
      cards += player.takenDeck[i];
      if (i < player.takenDeck.length - 1) {
        cards += ','
      }
    }

    const currentDeck = await GetNewShuffledDeck(cards);
    currentDeck.remaining -= 1;
    const currentCard = await GetNewCard(currentDeck.deck_id);

    this.setState({
      [dictKey]: {
        takenDeck: [],
        currentDeck,
        currentCard,
      }
    });
  }

  playerCompare() {

    const p1 = clone(this.state.player1);
    const p2 = clone(this.state.player2);

    const p1Card = GetValueOfCard(p1.currentCard.value);
    const p2Card = GetValueOfCard(p2.currentCard.value);



    // cine castiga? 
    const winner = p1Card - p2Card;
    if (winner === 0) {
      // quicker method, ambii doar isi retrag cartea inapoi lor
      p1.takenDeck.push(p1.currentCard.code)
      p2.takenDeck.push(p2.currentCard.code)
      p1.recentlyTakenCard = p1.currentCard;
      p2.recentlyTakenCard = p2.currentCard;
      this.setState({
        player1: p1,
        player2: p2,
      })
      return;
    }

    if (winner > 0) {
      p1.recentlyTakenCard = p2.currentCard;
      p1.takenDeck.push(p1.currentCard.code)
      p1.takenDeck.push(p2.currentCard.code)
      this.setState({
        player1: p1,
      })
      return;
    }

    p2.recentlyTakenCard = p1.currentCard;
    p2.takenDeck.push(p1.currentCard.code)
    p2.takenDeck.push(p2.currentCard.code)
    this.setState({
      player2: p2,
    })
  }

  async mainLoop() {
    this.setState({ loadingReason: '' }) // nu mai e loading, jocul a inceput
    while (this.state.gameFinished === false) {
      await this.playerDraw(1)
      await Sleep(sleepBetweenActions)

      await this.playerDraw(2)
      await Sleep(sleepBetweenActions)
      this.playerCompare()
      await Sleep(sleepBetweenActions)
    }
  }

  render() {
    if (this.state.gameFinished) {
      return (
        <div className="App">
          <header className="App-header">
            <Loading loadingElement={`JOCUL S-A TERMINAT, a castigat ${this.state.gameWinner}`} />
          </header>
        </div>
      );
    }

    if (this.state.loadingReason !== '') {
      return (
        <div className="App">
          <header className="App-header">
            <Loading loadingElement={this.state.loadingReason} />
          </header>
        </div>
      );
    }


    const p1 = this.state.player1;
    const p2 = this.state.player2;
    // pt fiecare player, cate carti mai sunt, cartea curenta
    return (
      <div className="App" >
        <header className="App-header"   >
          <Container>
            <Row>
              <Col>
                <PlayerBoard remainingCards={p1.currentDeck.remaining}
                  playerIndex="Player1"
                  deckType="Pachetul curent"
                  imageSrc={
                    p1.currentCard.image
                  } />
              </Col>
              <Col>
                <PlayerBoard remainingCards={p1.takenDeck.length}
                  playerIndex="Player1"
                  deckType="Pachetul strans"
                  imageSrc={
                    p1.recentlyTakenCard ? p1.recentlyTakenCard.image : null
                  } />
              </Col>
            </Row>
            <Row>
              <Col>
                <PlayerBoard style={{ float: 'left' }} remainingCards={p2.currentDeck.remaining}
                  playerIndex="Player2"
                  deckType="Pachetul curent"
                  imageSrc={
                    p2.currentCard.image
                  } />
              </Col>
              <Col>
                <PlayerBoard remainingCards={p2.takenDeck.length}
                  playerIndex="Player2"
                  deckType="Pachetul strans"
                  imageSrc={
                    p2.recentlyTakenCard ? p2.recentlyTakenCard.image : null
                  } />
              </Col>
            </Row>
          </Container>
        </header>
      </ div >
    );
  }
}

export default App;
