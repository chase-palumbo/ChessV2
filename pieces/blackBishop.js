import Piece from "./pieceClass.js";

export class BlackBishop extends Piece {
  type = 'Bishop';
  rank = 3;
  player = 'Black';
  img = './pieceImgs/Black_Bishop.svg.png';

  constructor(squareID, pieceID) {
    super();
    this.square = document.getElementById(squareID);
    this.id = pieceID;
  }

  createPiece(pieceID) {
    this.pieceHTML = `<img id="${pieceID}" class="bishop piece black" src="${this.img}"/>`
    this.square.insertAdjacentHTML('afterbegin', this.pieceHTML);

    this.piece = document.getElementById(pieceID);
  }

  calcControl(state) {
    const whiteKing = state.white.king;
    const controlSquares = [];
    this.threatening = false;

    const upRightDiag = [1, 1];
    this.calcDirection(state.allOccupiedSquares, upRightDiag, controlSquares, whiteKing);

    const downRightDiag = [1, -1];
    this.calcDirection(state.allOccupiedSquares, downRightDiag, controlSquares, whiteKing);

    const downLeftDiag = [-1, -1];
    this.calcDirection(state.allOccupiedSquares, downLeftDiag, controlSquares, whiteKing);

    const upLeftDiag = [-1, 1];
    this.calcDirection(state.allOccupiedSquares, upLeftDiag, controlSquares, whiteKing);
    
    return controlSquares;
  }

  calcMoves(state) {
    const blackOccupied = state.black.occupiedSquares;
    const moves = this.control.filter(sq => !blackOccupied.includes(sq));
    return moves;
  }

};