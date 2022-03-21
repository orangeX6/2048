import Grid from './scripts/grid.js';
import Tile from './scripts/tile.js';

// import Grid from './Grid.js';
// import Tile from './Tile.js';

const gameBoard = document.getElementById('game-board');
const score = document.querySelector('.score');

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
let sc = 0;

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

const direction = key => {
  if (key === 'ArrowUp') slideTiles(grid.cellsByColumn);

  if (key === 'ArrowDown')
    slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));

  if (key === 'ArrowLeft') slideTiles(grid.cellsByRow);

  if (key === 'ArrowRight')
    slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
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
      alert('game over');
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
