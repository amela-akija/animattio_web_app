import React from 'react';
import './GameComponent.css';

interface game {
  id: string;
  mode: string;
  timestamp: string;
}

interface GameDetailsProps {
  gameData: game;
}

const GameComponent: React.FC<GameDetailsProps> = ({ gameData }) => {
  const { id, mode, timestamp } = gameData;

  const formattedDate = new Date(timestamp).toLocaleString();

  return (
    <div className="game-container">
      <p className="game-details">
        <strong>Patient ID:</strong> {id}
      </p>
      <p className="game-details">
        <strong>Mode:</strong> {mode}
      </p>
      <p className="game-details">
        <strong>Date:</strong> {formattedDate}
      </p>
      <button className="see-more-button">See more</button>
    </div>
  );
};

export default GameComponent;
