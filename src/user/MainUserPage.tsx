import React from 'react';
import './MainUserPage.css';
// import { useNavigate } from 'react-router-dom';
import useResponsive from '../ui-components/useResponsive';
import GameComponent from '../ui-components/GameComponent';

const game = {
  id: 'pIqWxP87HaZjuosGDgIk1nw0x2W2',
  mode: 'mode2',
  timestamp: 'September 2, 2024 at 8:51:18 PM UTC+2'
};
function MainUserPage() {
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();

  return (
    <div className="user-account-container">
      <div className="user-account-first-column">
        <div className="user-button-container">
          <button className="add-button">
            <text className="user-text-button"> Add patient</text>
          </button>
        </div>
        <div className="user-button-container">
          <button className="list-button">
            <text className="user-text-button"> See patients</text>
          </button>
        </div>
        <div className="user-button-container">
          <button className="profile-button">
            <text className="user-text-button"> Profile</text>
          </button>
        </div>
      </div>
      <div className="user-account-second-column">
        <div className="user-column-container">
          {laptop && <text className="user-result-laptop"> New results:</text>}
          {mobile && <text className="user-result-mobile"> New results:</text>}
          {tablet && <text className="user-result-tablet"> New results:</text>}
          <div className="game-container">
            <GameComponent gameData={game} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainUserPage;
