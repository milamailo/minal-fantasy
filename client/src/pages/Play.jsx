import React, { useState, useEffect } from 'react';
import Tile from '../components/Tile';
import '../components/tile.css';

import { useQuery } from "@apollo/client";
import { QUERY_GET_MATRIX } from '../utils/queries';

const Play = () => {
  const [matrix, setMatrix] = useState([]);
  const { loading, data } = useQuery(QUERY_GET_MATRIX);

  useEffect(() => {
    if (!loading && data) {
      setMatrix(data.getMatrix);
      if(matrix){
        const serialized = []
        matrix.forEach((line)=>{
          if(line){
            const tmp = line.map((cell)=>{
              return {
                reward: cell.reward,
                threat: cell.threat,
                adjacentThreat: cell.adjacentThreat,
                adjacentReward: cell.adjacentReward,
                revealed: cell.revealed,
                flagged: cell.flagged,
              } 
            })
            serialized.push(...tmp)
          }
        })
        setTilesState(serialized)
      }
    }
    handleStartGame();
  }, [loading, data, matrix]);


    const [gameStarted, setGameStarted] = useState(false);
    const [showModal, setShowModal] = useState(false);
  
    // Create a new array to hold the state of individual tiles
    // const [tilesState, setTilesState] = useState(() => {
    //   const initialTilesState = Array(25).fill(false);
    //   return initialTilesState;
    // });
    const [tilesState, setTilesState] = useState([]);


    // Handle the "Start" button click to start the game
    const handleStartGame = () => {
      setGameStarted(true);
    };
  
    // Handle the "Rules" button click to show/hide the modal
    const handleRulesClick = () => {
      setShowModal(!showModal);
    };
  
    const handleTileClick = (index) => {
      if (gameStarted) {
        console.log(index)
      }
    };
  
    const renderGrid = () => {
      return tilesState.map((tile, index) => (
        <Tile key={index} value={tile} onClick={() => handleTileClick(index)} />
      ));
    };
    // const renderGrid = () => {
    //   return tilesState.map((isRevealed, index, tile) => (
    //     <Tile key={index} value={tile[index]} isRevealed={isRevealed} onClick={() => handleTileClick(index)} />
    //   ));
    // };
  
    // const renderGrids = () => {
    //   const output = matrix.map((isRevealed, index) => (
    //     <Tile key={index} value={'X'} isRevealed={isRevealed} onClick={() => handleTileClick(index)} />
    //   ));
    //   return output
    // };

    return (
      <div className="container">
        <div className="buttons-container">
          {/* START button */}
          <button className="minecraft-btn mx-auto w-64 text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200" onClick={handleStartGame}>Start</button>
          {/* RULES button */}
          {/* <button className="minecraft-btn mx-auto w-64 text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200" onClick={handleRulesClick}>Rules</button> */}
        </div>
  
        {/* The modal */}
        {/* {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleRulesClick}>
                &times;
              </span>
              <h2>Rules</h2>
              <p>Explanation of the rules of the game goes here.</p>
            </div>
          </div>
        )} */}
  
        <div className="grid-container">{renderGrid()}</div>

      </div>
    );
  };
  
  export default Play;
