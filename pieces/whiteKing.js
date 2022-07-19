import Piece from "./pieceClass.js";

export class WhiteKing extends Piece {
  type = 'King';
  rank = 6;
  player = 'White';
  img = './pieceImgs/White_King.svg.png';

  constructor(squareID, pieceID) {
    super();
    this.square = document.getElementById(squareID);
    this.inCheck = false;
    this.id = pieceID;
  }

  createPiece(pieceID) {
    this.pieceHTML = `<img id="${pieceID}" class="king piece white" src="${this.img}"/>`
    this.square.insertAdjacentHTML('afterbegin', this.pieceHTML);

    this.piece = document.getElementById(pieceID);
  }

  calcControl(state) {
    const [curLet, curNum] = this.square.id.split('');
    const possibleMoves = [];

    const curLetCopy = curLet.charCodeAt(0);
    const curNumCopy = +curNum;

    const up = `${String.fromCharCode(curLetCopy)}${curNumCopy + 1}`;
    const upLeft = `${String.fromCharCode(curLetCopy - 1)}${curNumCopy + 1}`;
    const upRight = `${String.fromCharCode(curLetCopy + 1)}${curNumCopy + 1}`;
    const right = `${String.fromCharCode(curLetCopy + 1)}${curNumCopy}`;
    const left = `${String.fromCharCode(curLetCopy - 1)}${curNumCopy}`;
    const down = `${String.fromCharCode(curLetCopy)}${curNumCopy - 1}`;
    const downLeft = `${String.fromCharCode(curLetCopy - 1)}${curNumCopy - 1}`;
    const downRight = `${String.fromCharCode(curLetCopy + 1)}${curNumCopy - 1}`;

    possibleMoves.push(up, upLeft, upRight, right, left, down, downLeft, downRight);

    const controlSquares = this.validSquareCheck(possibleMoves);
    return controlSquares;
  }

  calcMoves(blackControl, whiteOccupied) {
    const noCheckMoves = this.control.filter(sq => !blackControl.includes(sq) && !whiteOccupied.includes(sq));
    return noCheckMoves;
  }

  castleOption(state) {
    this.castleRight(state);
    this.castleLeft(state);
  }

  castleRight(state) {
    const rookRight = state.white.allPieces.find(piece => piece.id === 'white-rook-2');
    if (
      !rookRight ||
      rookRight.moveCount > 0
    ) return;

    const seperatingSquares = ['f1', 'g1'];
    const allOccupied = state.allOccupiedSquares;
    const blackControl = state.black.controlSquares;

    const castle = seperatingSquares.every(sq => !allOccupied.includes(sq) && !blackControl.includes(sq));

    if (castle) this.moves.push(rookRight.square.id);
  }

  castleLeft(state) {
    const rookLeft = state.white.allPieces.find(piece => piece.id === 'white-rook-1');
    if (
      !rookLeft ||
      rookLeft.moveCount > 0
    ) return;

    const seperatingSquares = ['b1', 'c1', 'd1'];
    const allOccupied = state.allOccupiedSquares;
    const blackControl = state.black.controlSquares;

    const castle = seperatingSquares.every(sq => !allOccupied.includes(sq) && !blackControl.includes(sq));

    if (castle) this.moves.push(rookLeft.square.id);
  }

  checkForCheck(state) {
    this.checkPieces = [];
    const blackControl = state.black.controlSquares;
    const blackPieces = state.black.allPieces;
  
    if (blackControl.includes(this.square.id)) {
      blackPieces.forEach(piece => {
        if (piece.control.includes(this.square.id)) {
          this.checkPieces.push(piece);
        }
      });

      console.log(`Black CHECK!`);
      return true;
    } else return false;
  }

};