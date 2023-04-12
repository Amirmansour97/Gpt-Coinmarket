import './App.css';
import './normal.css';
import { useState, useEffect } from 'react';
import ChatMessage from './components/ChatMessage.js';

function App() {
  // adding a state to add input and chatlog

  const [input, setInput] = useState('');
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState('Model');

  const [chatlog, setChatLog] = useState([
    {
      user: 'gpt',
      message: 'How can i help u?',
    },
    {
      user: 'me',
      message: 'i Want to use ChatGPT?',
    },
  ]);

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatlog, { user: 'me', message: `${input}` }];
    setInput('');
    setChatLog(chatLogNew);

    const messages = chatLogNew.map((message) => message.message).join('\n');
    const response = await fetch('http://localhost:3050/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: messages }),
    });

    const data = await response.json();
    let chatLogUpdate = [...chatLogNew];
    if (data.completion.content.toLowerCase().includes('bitcoin')) {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '6a135429f3mshac60a861523c981p171099jsn1a82f61baa7c',
          'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
        },
      };

      const response = await fetch(
        'https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0',
        options
      );
      const data = await response.json();
      const bitcoinData = data.data.coins.filter((coin) => coin.name.toLowerCase() === 'bitcoin')[0];
      const message = `${bitcoinData.name} is currently worth $${bitcoinData.price} with a market cap of $${bitcoinData.marketCap}`;
      chatLogUpdate.push({ user: 'gpt', message });
    } else {
      chatLogUpdate.push({ user: 'gpt', message: `${data.completion.content}` });
    }
    setChatLog(chatLogUpdate);
  }
  // API

  // API
  function clearChat() {
    setChatLog([]);
  }

  return (
    <div className="App">
      <aside className="sideMenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>New Chat
        </div>
        <div>{models}</div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {/* we had to loop in order to define the message in the caht message component  so 
          we defined it in the state and then loop thro chatlog cuz its there , then i loop to fetch msg */}
          {chatlog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
      </section>
      <div className="chat-input-holder">
        <form onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            rows="1"
            className="chat-input-area"
            placeholder="Enter what you are thinking of"
          ></input>
        </form>
      </div>
    </div>
  );
}

export default App;
