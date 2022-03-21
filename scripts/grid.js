// --grid-size: 4;
// --cell-size: 15vmin;
// --cell-gap: 2vmin;

const CELL_GAP = 2;
const GRID_SIZE = 4;
const CELL_SIZE = 60 / GRID_SIZE;

export default class Grid {
  #cells;

  constructor(gridElement) {
    gridElement.style.setProperty('--grid-size', GRID_SIZE);
    gridElement.style.setProperty('--cell-size', `${CELL_SIZE}vmin`);
    gridElement.style.setProperty('--cell-gap', `${CELL_GAP}vmin`);

    this.#cells = this.createCellElements(gridElement).map(
      (cellElement, index) =>
        new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
    );
    // console.log(this.#cells);
  }

  get cells() {
    return this.#cells;
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  get #emptyCells() {
    return this.#cells.filter(cell => !cell.tile);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[randomIndex];
  }

  createCellElements(gridElement) {
    const cells = [];
    for (let index = 0; index < GRID_SIZE * GRID_SIZE; index++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cells.push(cell);
      gridElement.append(cell);
    }
    return cells;
  }
}

class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;
    // console.log(value);
    if (!value) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    // console.log(this.#mergeTile);
    if (!value) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  canAccept(tile) {
    return !this.tile || (!this.mergeTile && this.tile.value === tile.value);
  }

  mergeTiles() {
    // console.log(this.tile, this.mergeTile);
    if (!this.tile || !this.mergeTile) return;
    this.tile.value = this.tile.value + this.mergeTile.value;
    let score =
      Number(document.querySelector('.score').textContent) + this.tile.value;
    document.querySelector('.score').textContent = score;
    this.mergeTile.removeTile();
    this.mergeTile = null;
  }
}
