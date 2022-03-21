export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  constructor(gameBoard, value = Math.random() > 0.2 ? 2 : 4) {
    this.#tileElement = document.createElement('div');
    this.#tileElement.classList.add('tile');
    if (localStorage.theme === 'light')
      this.#tileElement.classList.add('light--tile');
    gameBoard.append(this.#tileElement);
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  set value(val) {
    this.#value = val;
    this.#tileElement.textContent = val;
    const power = Math.log2(val);
    // const power = 1;
    const backgroundLightness = 100 - power * 9;
    this.#tileElement.style.setProperty(
      '--background-lightness',
      `${backgroundLightness}%`
    );
    this.#tileElement.style.setProperty(
      '--text-lightness',
      `${backgroundLightness <= 50 ? 90 : 10}% `
    );
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty('--x', value);
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty('--y', value);
  }

  removeTile() {
    this.#tileElement.remove();
  }

  waitForTransition(animation = false) {
    return new Promise(resolve => {
      this.#tileElement.addEventListener(
        animation ? 'animationend' : 'transitionend',
        resolve,
        {
          once: true,
        }
      );
    });
  }
}
