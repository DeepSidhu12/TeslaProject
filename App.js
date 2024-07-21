import React, { useState, useEffect } from 'react';
import './App.css';
import MazeCell from './MazeCell';

const GRID_SIZE = 50;
const WALL = true;
const PASSAGE = false;

const App = () => {
  const [maze, setMaze] = useState([]);
  const [start, setStart] = useState([1, 1]);
  const [end, setEnd] = useState([GRID_SIZE - 2, GRID_SIZE - 2]);
  const [path, setPath] = useState([]);
  const [carPosition, setCarPosition] = useState(start);

  useEffect(() => {
    generateMaze();
  }, []);

  const generateMaze = () => {
    const newMaze = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(WALL));
    
    const startX = 1;
    const startY = 1;

    const stack = [[startX, startY]];
    newMaze[startY][startX] = PASSAGE;

    const directions = [
      [2, 0], [-2, 0], [0, 2], [0, -2]
    ];

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const randomDirections = [...directions].sort(() => Math.random() - 0.5);

      for (const [dx, dy] of randomDirections) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && newMaze[ny][nx] === WALL) {
          newMaze[y + dy / 2][x + dx / 2] = PASSAGE;
          newMaze[ny][nx] = PASSAGE;
          stack.push([nx, ny]);
        }
      }
    }

    newMaze[startY][startX] = PASSAGE;
    newMaze[end[1]][end[0]] = PASSAGE;

    setMaze(newMaze);
  };

  const handleClick = (row, col) => {
    if (maze[row][col] === WALL) return;
    setEnd([row, col]);
    findPath(start, [row, col]);
  };

  const findPath = (start, end) => {
    const directions = [
      [1, 0], [0, 1], [-1, 0], [0, -1]
    ];

    const queue = [start];
    const cameFrom = new Map();
    const visited = new Set();
    
    visited.add(start.toString());
    cameFrom.set(start.toString(), null);

    while (queue.length > 0) {
      const current = queue.shift();
      const [x, y] = current;

      if (x === end[0] && y === end[1]) {
        const path = [];
        let step = end;
        while (step) {
          path.push(step);
          step = cameFrom.get(step.toString());
        }
        path.reverse();
        setPath(path);
        animateCar(path);
        return;
      }

      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && maze[ny][nx] === PASSAGE && !visited.has([nx, ny].toString())) {
          visited.add([nx, ny].toString());
          queue.push([nx, ny]);
          cameFrom.set([nx, ny].toString(), [x, y]);
        }
      }
    }

    setPath([]);
  };

  const animateCar = (path) => {
    if (path.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < path.length) {
        const [x, y] = path[index];
        setCarPosition([x, y]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 200);
  };

  return (
    <div className="App">
      <h1>Maze Generation</h1>
      <div className="maze">
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className="maze-row">
            {row.map((cell, colIndex) => (
              <MazeCell 
                key={`${rowIndex}-${colIndex}`} 
                isWall={cell} 
                isStart={start[0] === rowIndex && start[1] === colIndex}
                isEnd={end[0] === rowIndex && end[1] === colIndex}
                onClick={() => handleClick(rowIndex, colIndex)}
                hasCar={carPosition[0] === rowIndex && carPosition[1] === colIndex}
                isPath={path.some(([x, y]) => x === rowIndex && y === colIndex)}
                pathColor={path.some(([x, y]) => x === rowIndex && y === colIndex) ? 'yellow' : 'transparent'}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;