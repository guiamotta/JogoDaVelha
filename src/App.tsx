import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

type Players = "O" | "X";

function App() {

  const[turn, setTurn] = useState<Players>("O");
  const[winner, setWinner] = useState<Players | null>(null);
  const[draw, setDraw] = useState<boolean | null>(null);
  const[marks, setMarks] = useState<{[key:string]: Players}>({});
  const[bot, setBot] = useState<number>(0);
  
  const gameOver = !!winner || !!draw;

  const getSquares = () => {
    return new Array(9).fill(true);
  }

  const play = (index: number) => {
    let array = livres(index);
    if (marks[index] || gameOver){
      livres(index);
      return;
    }
    else{
      setMarks(prev => ({ ...prev, [index]: turn}));
      setTurn(prev => prev === "O" ? "X" : "O");
      livres(index);
    }

    if(!gameOver && bot === 1){
      let randomInteger = index; 
      randomInteger = array[Math.floor(Math.random() * array.length)];  
      marks[randomInteger] = (turn === "X" ? "O" : "X");
      setTurn(prev => prev === "O" ? "X" : "O");
    } 
    livres(index);
  }

  function livres(index: number){
    const array: number[] = [];
    for (let i=0; i<9; i++){
      if (!marks[i]){
        array.push(i);
      }
    }
    for (let j=0; j<array.length; j++){
      if (array[j]===index){
        array.splice(j, 1);
      }
    }
    return array;
  }

  const getCellPlayer = (index: number) => {
    if (!marks[index]) {
      return;
    }
    return marks[index];
  }

  const getWinner = () => {
    const victoryLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8]
    ]
    for (const line of victoryLines){
      const[a, b, c] = line;

      if(marks[a] && marks[a]===marks[b] && marks[a]===marks[c]){
        return marks[a];
      }
    }
  }

  useEffect(() => {
    const winner = getWinner();
    if(winner){
      setWinner(winner);
    }
    else{
      if (Object.keys(marks).length === 9){
        setDraw(true);
      }
    }
  }, [marks])

  const reset = () => {
    setMarks({});
    setWinner(null);
    setDraw(null);
  }

  const JogarO = () => {
    setTurn("O");
    setBot(1);
  }
  
  const JogarX =() => {
    let a = Math.floor(Math.random() * 9)
    marks[a] = "O";
    livres(a);
    setTurn("X");
    setBot(1);
  }

  const Multiplayer =() => {
    reset();
    setTurn("O");
    setBot(0);
  }

  function Iniciou(){
    if (marks[0]||marks[1]||marks[2]||marks[3]||marks[4]||marks[5]||marks[6]||marks[7]||marks[8]){
      return true;
    }
    return false;
  }

  return(
    <div className="container">
      <h1>Jogo da velha{ bot === 0? "": " - Singleplayer"}</h1>
      {winner && <h2>{winner} ganhou!</h2>}
      {draw &&<h2>Empate</h2>}
      {!gameOver &&<p> É a vez de {turn}</p>}

      <div className ={`board ${gameOver ? "gameOver": null}`}>
        {getSquares().map((_, i) => (
          <div className={`cell ${getCellPlayer(i)}`} onClick={() => play(i)}>
            {marks[i]}
          </div>
        ))}
      </div>
      <div>
      <button onClick={JogarX}>Singleplayer X</button>
      <button onClick={JogarO}>Singleplayer O</button>
      <button onClick={Multiplayer}>Sair</button> 
      </div>

    
    </div>
  )
}

export default App;
