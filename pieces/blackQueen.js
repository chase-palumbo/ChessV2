import Piece from "./pieceClass.js";

export class BlackQueen extends Piece {
  type = 'Queen';
  rank = 5;
  player = 'Black';
  img = './pieceImgs/Black_Queen.svg.png';

  constructor(squareID, pieceID) {
    super();
    this.square = document.getElementById(squareID);
    this.id = pieceID;
  }

  createPiece(pieceID) {
    this.pieceHTML = `<img id="${pieceID}" class="queen piece black" src="${this.img}"/>`
    this.square.insertAdjacentHTML('afterbegin', this.pieceHTML);

    this.piece = document.getElementById(pieceID);
  }

  calcControl(state) {
    const whiteKing = state.white.king;
    const controlSquares = [];
    this.threatening = false;

    const upStraight = [0, 1];
    this.calcDirection(state.allOccupiedSquares, upStraight, controlSquares, whiteKing);

    const rightStraight = [1, 0];
    this.calcDirection(state.allOccupiedSquares, rightStraight, controlSquares, whiteKing);

    const downStraight = [0, -1];
    this.calcDirection(state.allOccupiedSquares, downStraight, controlSquares, whiteKing);

    const leftStraight = [-1, 0];
    this.calcDirection(state.allOccupiedSquares, leftStraight, controlSquares, whiteKing);

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