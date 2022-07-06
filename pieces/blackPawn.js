import Piece from "./pieceClass.js";

export class BlackPawn extends Piece {
  type = 'Pawn';
  player = 'Black';
  img = './pieceImgs/Black_Pawn.svg.png';

  constructor(squareID, pieceID) {
    super();
    this.square = document.getElementById(squareID);
    this.createPiece(pieceID);
  }

  createPiece(pieceID) {
    this.pieceHTML = `<img id="${pieceID}" class="pawn piece black" src="${this.img}"/>` 
    this.square.insertAdjacentHTML('afterbegin', this.pieceHTML);

    this.piece = document.getElementById(pieceID);
    this.id = pieceID;
  }

  calcMoves(state) {
    const [curLet, curNum] = this.square.id.split('');
    const allOccupied = state.allOccupiedSquares;
    const whiteOccupied = state.white.occupiedSquares;
    const validMoves = [];
    const controlSquares = [];

    const curLetCopy = curLet.charCodeAt(0);
    const curNumCopy = +curNum;

    const down = `${String.fromCharCode(curLetCopy)}${curNumCopy - 1}`;
    const down2 = `${String.fromCharCode(curLetCopy)}${curNumCopy - 2}`;

    if (
      this.moveCount === 0 && 
      !allOccupied.includes(down) &&
      !allOccupied.includes(down2)
    ) validMoves.push(down, down2);
    else if (!allOccupied.includes(down)) validMoves.push(down);
    
    const downLeft = `${String.fromCharCode(curLetCopy - 1)}${curNumCopy - 1}`;
    const downRight = `${String.fromCharCode(curLetCopy + 1)}${curNumCopy - 1}`;
    controlSquares.push(downLeft, downRight);

    if (whiteOccupied.includes(downLeft)) validMoves.push(downLeft);
    if (whiteOccupied.includes(downRight)) validMoves.push(downRight);

    this.control = this.validSquareCheck(controlSquares);
    this.moves = this.validSquareCheck(validMoves); 
  }

  promote() {

  }

};