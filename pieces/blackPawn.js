import Piece from "./pieceClass.js";

export class BlackPawn extends Piece {
  type = 'Pawn';
  rank = 1;
  player = 'Black';
  img = './pieceImgs/Black_Pawn.svg.png';

  constructor(squareID, pieceID) {
    super();
    this.square = document.getElementById(squareID);
    this.id = pieceID;
  }

  createPiece(pieceID) {
    this.pieceHTML = `<img id="${pieceID}" class="pawn piece black" src="${this.img}"/>` 
    this.square.insertAdjacentHTML('afterbegin', this.pieceHTML);

    this.piece = document.getElementById(pieceID);
  }

  calcControl(state) {
    const [curLet, curNum] = this.square.id.split('');
    const controlSquares = [];

    const curLetCopy = curLet.charCodeAt(0);
    const curNumCopy = +curNum;
    
    const downLeft = `${String.fromCharCode(curLetCopy - 1)}${curNumCopy - 1}`;
    const downRight = `${String.fromCharCode(curLetCopy + 1)}${curNumCopy - 1}`;
    controlSquares.push(downLeft, downRight);

    const control = this.validSquareCheck(controlSquares);
    return control;
  }

  calcMoves(state) {
    const [curLet, curNum] = this.square.id.split('');
    const allOccupied = state.allOccupiedSquares;
    const whiteOccupied = state.white.occupiedSquares;
    const validMoves = [];

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

    this.control.forEach(move => {
      if (whiteOccupied.includes(move)) validMoves.push(move);
    });

    const moves = this.validSquareCheck(validMoves);
    return moves;
  }

};