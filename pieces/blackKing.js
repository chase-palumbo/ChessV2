import Piece from "./pieceClass.js";

export class BlackKing extends Piece {
  type = 'King';
  player = 'Black';
  img = './pieceImgs/Black_King.svg.png';

  constructor(squareID, pieceID) {
    super();
    this.square = document.getElementById(squareID);
    this.inCheck = false;
    this.createPiece(pieceID);
  }

  createPiece(pieceID) {
    this.pieceHTML = `<img id="${pieceID}" class="king piece black" src="${this.img}"/>`
    this.square.insertAdjacentHTML('afterbegin', this.pieceHTML);

    this.piece = document.getElementById(pieceID);
    this.id = pieceID;
  }

  // this.piece, this.player
  calcMoves(state) {
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
    
    this.control = controlSquares;
  }

  preventSelfCheck(whiteControl, blackOccupied) {
    const noCheckMoves = this.control.filter(sq => !whiteControl.includes(sq) && !blackOccupied.includes(sq));
    this.moves = noCheckMoves;
  }

  castleOption(state) {
    this.castleRight(state);
    this.castleLeft(state);
  }

  castleRight(state) {
    const rookRight = state.black.allPieces.find(piece => piece.id === 'black-rook-2');
    if (
      !rookRight ||
      rookRight.moveCount > 0
    ) return;

    const seperatingSquares = ['f8', 'g8'];
    const allOccupied = state.allOccupiedSquares;
    const whiteControl = state.white.controlSquares;

    const castle = seperatingSquares.every(sq => !allOccupied.includes(sq) && !whiteControl.includes(sq));

    if (castle) this.moves.push(rookRight.square.id);
  }

  castleLeft(state) {
    const rookLeft = state.black.allPieces.find(piece => piece.id === 'black-rook-1');
    if (
      !rookLeft ||
      rookLeft.moveCount > 0
    ) return;

    const seperatingSquares = ['b8', 'c8', 'd8'];
    const allOccupied = state.allOccupiedSquares;
    const whiteControl = state.white.controlSquares;

    const castle = seperatingSquares.every(sq => !allOccupied.includes(sq) && !whiteControl.includes(sq));

    if (castle) this.moves.push(rookLeft.square.id);
  }

  checkForCheck(state) {
    this.checkPieces = [];
    const whiteControl = state.white.controlSquares;
    const whitePieces = state.white.allPieces;
  
    if (whiteControl.includes(this.square.id)) {
      whitePieces.forEach(piece => {
        if (piece.control.includes(this.square.id)) {
          this.checkPieces.push(piece);
        }
      });

      console.log(`White CHECK!`);
      this.inCheck = true;
    } else this.inCheck = false;
  }
  
};
