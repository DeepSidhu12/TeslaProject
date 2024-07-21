import React from 'react';

const MazeCell = ({ isWall, isStart, isEnd, onClick, hasCar, isPath, pathColor }) => {
  const cellStyle = {
    width: '10px',
    height: '10px',
    border: '1px solid #ccc',
    backgroundColor: isWall ? '#333' : (isPath ? pathColor : '#fff'),
    cursor: 'pointer',
    position: 'relative'
  };

  return (
    <div className="maze-cell" style={cellStyle} onClick={onClick}>
      {isStart && <div className="start" style={{ position: 'absolute', top: 0, left: 0 }}>S</div>}
      {isEnd && <div className="end" style={{ position: 'absolute', top: 0, left: 0 }}>E</div>}
      {hasCar && <div className="car" style={{ position: 'absolute', top: 0, left: 0 }}>🚗</div>}
    </div>
  );
};

export default MazeCell;