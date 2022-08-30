import './App.css';

import React, {useState} from "react";
import Game from "./Game";

function App() {
    const [gameId, setGameId] = useState(1);
    return (
        <div className="App">
            <header className="App-header">
                <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>
            </header>
        </div>
    );
}

export default App;
