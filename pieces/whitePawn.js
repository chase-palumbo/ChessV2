import Piece from "./pieceClass.js";

export class WhitePawn extends Piece {
  type = 'Pawn';
  player = 'White';
  img = './pieceImgs/White_Pawn.svg.png';

  constructor(squareID, pieceID) {
    super();
    this.square = document.getElementById(squareID);
    this.createPiece(pieceID);
  }

  createPiece(pieceID) {
    this.pieceHTML = `<img id="${pieceID}" class="pawn piece white" src="${this.img}"/>`
    this.square.insertAdjacentHTML('afterbegin', this.pieceHTML);

    this.piece = document.getElementById(pieceID);
    this.id = pieceID;
  }

  calcMoves(state) {
    const [curLet, curNum] = this.square.id.split('');
    const allOccupied = state.allOccupiedSquares;
    const blackOccupied = state.black.occupiedSquares;
    const validMoves = [];
    const controlSquares = [];

    const curLetCopy = curLet.charCodeAt(0);
    const curNumCopy = +curNum;

    const up = `${String.fromCharCode(curLetCopy)}${curNumCopy + 1}`;
    const up2 = `${String.fromCharCode(curLetCopy)}${curNumCopy + 2}`;

    if (
      this.moveCount === 0 && 
      !allOccupied.includes(up) &&
      !allOccupied.includes(up2)
    ) validMoves.push(up, up2);
    else if (!allOccupied.includes(up)) validMoves.push(up);

    const upLeft = `${String.fromCharCode(curLetCopy - 1)}${curNumCopy + 1}`;
    const upRight = `${String.fromCharCode(curLetCopy + 1)}${curNumCopy + 1}`;
    controlSquares.push(upLeft, upRight);

    if (blackOccupied.includes(upLeft)) validMoves.push(upLeft);
    if (blackOccupied.includes(upRight)) validMoves.push(upRight);

    this.control = this.validSquareCheck(controlSquares);
    this.moves = this.validSquareCheck(validMoves);
  }
  
  promote(queenPiece) {

  }
};