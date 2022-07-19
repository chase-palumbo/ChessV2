import Piece from "./pieceClass.js";

export class WhiteKnight extends Piece {
  type = 'Knight';
  rank = 2;
  player = 'White';
  img = './pieceImgs/White_Knight.svg.png';

  constructor(squareID, pieceID) {
    super();
    this.square = document.getElementById(squareID);
    this.id = pieceID;
  }

  createPiece(pieceID) {
    this.pieceHTML = `<img id="${pieceID}" class="knight piece white" src="${this.img}"/>`
    this.square.insertAdjacentHTML('afterbegin', this.pieceHTML);

    this.piece = document.getElementById(pieceID);
  }

  calcControl(state) {
    const [curLet, curNum] = this.square.id.split('');
    const possibleMoves = [];

    const curLetCopy = curLet.charCodeAt(0);
    const curNumCopy = +curNum;

    const upPos1 = `${String.fromCharCode(curLetCopy - 1)}${curNumCopy + 2}`;
    const upPos2 = `${String.fromCharCode(curLetCopy + 1)}${curNumCopy + 2}`;
    const rightPos1 = `${String.fromCharCode(curLetCopy + 2)}${curNumCopy + 1}`;
    const rightPos2 = `${String.fromCharCode(curLetCopy + 2)}${curNumCopy - 1}`;
    const downPos1 = `${String.fromCharCode(curLetCopy + 1)}${curNumCopy - 2}`;
    const downPos2 = `${String.fromCharCode(curLetCopy - 1)}${curNumCopy - 2}`;
    const leftPos1 = `${String.fromCharCode(curLetCopy - 2)}${curNumCopy - 1}`;
    const leftPos2 = `${String.fromCharCode(curLetCopy - 2)}${curNumCopy + 1}`;

    possibleMoves.push(upPos1, upPos2, rightPos1, rightPos2, downPos1, downPos2, leftPos1, leftPos2);

    const controlSquares = this.validSquareCheck(possibleMoves);
    return controlSquares
  }

  calcMoves(state) {
    const whiteOccupied = state.white.occupiedSquares;
    const moves = this.control.filter(sq => !whiteOccupied.includes(sq));
    return moves;
  }
  
};