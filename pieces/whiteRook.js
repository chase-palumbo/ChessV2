import Piece from "./pieceClass.js";

export class WhiteRook extends Piece {
  type = 'Rook';
  rank = 4;
  player = 'White';
  img = './pieceImgs/White_Rook.svg.png';

  constructor(squareID, pieceID) {
    super();
    this.square = document.getElementById(squareID);
    this.id = pieceID;
  }

  createPiece(pieceID) {
    this.pieceHTML = `<img id="${pieceID}" class="rook piece white" src="${this.img}"/>`
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
    
    return controlSquares;
  }

  calcMoves(state) {
    const whiteOccupied = state.white.occupiedSquares;
    const moves = this.control.filter(sq => !whiteOccupied.includes(sq));
    return moves;
  }

};