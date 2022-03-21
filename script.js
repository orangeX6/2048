import Grid from './scripts/grid.js';
import Tile from './scripts/tile.js';

const gameBoard = document.getElementById('game-board');
const score = document.querySelector('.score');
const restart = document.querySelector('.btn--restart');
const dark = document.querySelector('.btn--dark');
localStorage.setItem('theme', 'dark');

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

const slideTiles = cellsArray => {
  return Promise.all(
    cellsArray.flatMap(cellArray => {
      const promises = [];

      cellArray.slice(1, 4).forEach((cell, index) => {
        if (cell.tile) {
          let lastValidCell;
          for (index; index >= 0; index--) {
            const moveToCell = cellArray[index];
            if (!moveToCell.canAccept(cell.tile)) break;
            lastValidCell = moveToCell;
          }

          if (lastValidCell) {
            promises.push(cell.tile.waitForTransition());
            lastValidCell.tile
              ? (lastValidCell.mergeTile = cell.tile)
              : (lastValidCell.tile = cell.tile);
            cell.tile = null;
          }
        }
      });
      return promises;
    })
  );
};

const direction = async key => {
  if (key === 'ArrowUp') await slideTiles(grid.cellsByColumn);

  if (key === 'ArrowDown')
    await slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));

  if (key === 'ArrowLeft') await slideTiles(grid.cellsByRow);

  if (key === 'ArrowRight')
    await slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
};

const moveTiles = async e => {
  const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (!keys.includes(e.key)) return setControls();

  if (!canMoveUp() && e.key === 'ArrowUp') return setControls();
  if (!canMoveDown() && e.key === 'ArrowDown') return setControls();
  if (!canMoveLeft() && e.key === 'ArrowLeft') return setControls();
  if (!canMoveRight() && e.key === 'ArrowRight') return setControls();

  await direction(e.key);

  grid.cells.forEach(cell => cell.mergeTiles());

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      if (localStorage.highScore) {
        if (Number(score.textContent) > Number(localStorage.highScore)) {
          localStorage.setItem('highScore', score.textContent);
          alert(`New High Score!!! ${localStorage.getItem('highScore')}`);
        } else {
          alert('game over');
        }
      } else {
        localStorage.highScore = Number(score.textContent);
      }
    });
    return;
  }

  setControls();
};

function setControls() {
  window.addEventListener('keydown', moveTiles, { once: true });
}
setControls();

const canMoveUp = () => canMove(grid.cellsByColumn);
const canMoveDown = () =>
  canMove(grid.cellsByColumn.map(column => [...column].reverse()));
const canMoveLeft = () => canMove(grid.cellsByRow);
const canMoveRight = () =>
  canMove(grid.cellsByRow.map(row => [...row].reverse()));

const canMove = cellsArray => {
  return cellsArray.some(cellArray => {
    return cellArray.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = cellArray[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
};

const init = () => {
  grid.cells.forEach(cell => {
    if (cell.tile) {
      cell.tile.removeTile();
      cell.tile = null;
    }
  });
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  score.textContent = 0;
  setControls();
};

restart.addEventListener('click', init);

const mode = () => {
  localStorage.theme = `${localStorage.theme === 'dark' ? 'light' : 'dark'}`;
  document.querySelector('body').classList.toggle('light');
  // document.queryS
  document.querySelector('.header').classList.toggle('light--header');
  document.querySelector('.title').classList.toggle('light');
  document
    .querySelectorAll('.btn')
    .forEach(btn => btn.classList.toggle('light'));
  document
    .querySelector('.game-container')
    .classList.toggle('light--game-board');
  document
    .querySelectorAll('.cell')
    .forEach(cell => cell.classList.toggle('light--cell'));
  document
    .querySelectorAll('.tile')
    .forEach(tile => tile.classList.toggle('light--tile'));
};

dark.addEventListener('click', mode);
