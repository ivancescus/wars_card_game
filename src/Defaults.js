import axios from 'axios';


async function GetNewDeck() {
  try {
    const res = await axios.post('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    if (!res.data || res.status !== 200) {
      console.error('error, res returned ', res);
      return null;
    }
    return res.data;
  } catch (e) {
    console.error('req failed with err', e);
    return null;
  }
}


// always draw one card only cuz API is bugged when requestion more than one card
async function GetNewCard(deckId) {
  try {
    const res = await axios.post(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    if (!res.data || res.status !== 200) {
      console.error('error, res returned ', res);
      return null;
    }
    if (!res.data.cards) {
      console.error('error, bad api answer');
      return null;
    }
    // cerem mereu cate una deci nu are rost sa le parcurgem pe toate
    if (res.data.cards.length > 1) {
      console.error('error, undefined behaviour : api drew more than one card for some reason')
      return null;
    }
    return res.data.cards[0];
  } catch (e) {
    console.error('req failed with err', e);
    return null;
  }
}

const Sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


const CardTextToValue = {
  'KING': 14,
  'ACE': 1,
  'QUEEN': 13,
  'JACK': 12,
}

function GetValueOfCard(card) {
  const value = CardTextToValue[card];
  return value === undefined ? parseInt(card) : value;
}

async function GetNewShuffledDeck(cards) {
  try {
    const res = await axios.post(`https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${cards}`)
    if (!res.data || res.status !== 200) {
      console.error('error, res returned ', res);
      return null;
    }
    return res.data;
  } catch (e) {
    console.error('req failed with err', e);
    return null;
  }
}
export {
  GetNewDeck,
  GetNewCard,
  Sleep,
  GetValueOfCard,
  GetNewShuffledDeck,
}
