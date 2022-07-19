import Piece from "./pieceClass.js";

export class WhiteBishop extends Piece {
  type = 'Bishop';
  rank = 3;
  player = 'White';
  img = './pieceImgs/White_Bishop.svg.png';

  constructor(squareID, pieceID) {
    super();
    this.square = document.getElementById(squareID);
    this.id = pieceID;
  }

  createPiece(pieceID) {
    this.pieceHTML = `<img id="${pieceID}" class="bishop piece white" src="${this.img}"/>`
    this.square.insertAdjacentHTML('afterbegin', this.pieceHTML);

    this.piece = document.getElementById(pieceID);
  }

  calcControl(state) {
    const blackKing = state.black.king;
    const controlSquares = [];
    this.threatening = false;

    const upRightDiag = [1, 1];
    this.calcDirection(state.allOccupiedSquares, upRightDiag, controlSquares, blackKing);

    const downRightDiag = [1, -1];
    this.calcDirection(state.allOccupiedSquares, downRightDiag, controlSquares, blackKing);

    const downLeftDiag = [-1, -1];
    this.calcDirection(state.allOccupiedSquares, downLeftDiag, controlSquares, blackKing);

    const upLeftDiag = [-1, 1];
    this.calcDirection(state.allOccupiedSquares, upLeftDiag, controlSquares, blackKing);

    return controlSquares;
  }

  calcMoves(state) {
    const whiteOccupied = state.white.occupiedSquares;
    const moves = this.control.filter(sq => !whiteOccupied.includes(sq));
    return moves;
  }

};