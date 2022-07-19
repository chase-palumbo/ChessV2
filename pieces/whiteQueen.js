import Piece from "./pieceClass.js";

export class WhiteQueen extends Piece {
  type = 'Queen';
  rank = 5;
  player = 'White';
  img = './pieceImgs/White_Queen.svg.png';

  constructor(squareID, pieceID) {
    super();
    this.square = document.getElementById(squareID);
    this.id = pieceID;
  }

  createPiece(pieceID) {
    this.pieceHTML = `<img id="${pieceID}" class="queen piece white" src="${this.img}"/>`
    this.square.insertAdjacentHTML('afterbegin', this.pieceHTML);

    this.piece = document.getElementById(pieceID);
  }

  calcControl(state) {
    const blackKing = state.black.king;
    const controlSquares = [];
    this.threatening = false;

    const upStraight = [0, 1];
    this.calcDirection(state.allOccupiedSquares, upStraight, controlSquares, blackKing);

    const rightStraight = [1, 0];
    this.calcDirection(state.allOccupiedSquares, rightStraight, controlSquares, blackKing);

    const downStraight = [0, -1];
    this.calcDirection(state.allOccupiedSquares, downStraight, controlSquares, blackKing);

    const leftStraight = [-1, 0];
    this.calcDirection(state.allOccupiedSquares, leftStraight, controlSquares, blackKing);

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