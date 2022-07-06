import View from "./view.js";

import { WhitePawn } from "./pieces/whitePawn.js";
import { WhiteKnight } from "./pieces/whiteKnight.js";
import { BlackPawn } from "./pieces/blackPawn.js";
import { BlackKnight } from "./pieces/blackKnight.js";
import { BlackBishop } from "./pieces/blackBishop.js";
import { WhiteBishop } from "./pieces/whiteBishop.js";
import { WhiteRook } from "./pieces/whiteRook.js";
import { BlackRook } from "./pieces/blackRook.js";
import { WhiteQueen } from "./pieces/whiteQueen.js";
import { BlackQueen } from "./pieces/blackQueen.js";
import { WhiteKing } from "./pieces/whiteKing.js";
import { BlackKing } from "./pieces/blackKing.js";


const state = {
  turnNum: 0,
  activePlayer: '',
  allOccupiedSquares: [],
  totalPieces: [],
  white: {
    allPieces: [],
    occupiedSquares: [],
    controlSquares: [],
    king: {}
  },
  black: {
    allPieces: [],
    occupiedSquares: [],
    controlSquares: [],
    king: {}
  },
  clicked: {}
};

let actionLogData = {
  gameStart: false,
  castle: false,
  check: false,
  checkmate: false,
  stalemate: false,
  initialSquare: '',
  dropSquare: '',
  capturedPiece: '',
  promotePiece: ''
};

const arrayRemove = (arr, value) => arr.filter(el => el !== value);





// Menu event handler.  Initializes a two player game, adds pieces to the 
// board.
const initGame = function() {
  const whitePawn1 = new WhitePawn('a2', 'white-pawn-1');
  const whitePawn2 = new WhitePawn('b2', 'white-pawn-2');
  const whitePawn3 = new WhitePawn('c2', 'white-pawn-3');
  const whitePawn4 = new WhitePawn('d2', 'white-pawn-4');
  const whitePawn5 = new WhitePawn('e2', 'white-pawn-5');
  const whitePawn6 = new WhitePawn('f2', 'white-pawn-6');
  const whitePawn7 = new WhitePawn('g2', 'white-pawn-7');
  const whitePawn8 = new WhitePawn('h2', 'white-pawn-8');

  const whiteRook1 = new WhiteRook('a1', 'white-rook-1');
  const whiteRook2 = new WhiteRook('h1', 'white-rook-2');
  const whiteKnight1 = new WhiteKnight('b1', 'white-knight-1');
  const whiteKnight2 = new WhiteKnight('g1', 'white-knight-2');
  const whiteBishop1 = new WhiteBishop('c1', 'white-bishop-1');
  const whiteBishop2 = new WhiteBishop('f1', 'white-bishop-2');
  const whiteQueen = new WhiteQueen('d1', 'white-queen');
  const whiteKing = new WhiteKing('e1', 'white-king');

  const blackPawn1 = new BlackPawn('a7', 'black-pawn-1');
  const blackPawn2 = new BlackPawn('b7', 'black-pawn-2');
  const blackPawn3 = new BlackPawn('c7', 'black-pawn-3');
  const blackPawn4 = new BlackPawn('d7', 'black-pawn-4');
  const blackPawn5 = new BlackPawn('e7', 'black-pawn-5');
  const blackPawn6 = new BlackPawn('f7', 'black-pawn-6');
  const blackPawn7 = new BlackPawn('g7', 'black-pawn-7');
  const blackPawn8 = new BlackPawn('h7', 'black-pawn-8');
  const blackKing = new BlackKing('e8', 'black-king');

  const blackRook1 = new BlackRook('a8', 'black-rook-1');
  const blackRook2 = new BlackRook('h8', 'black-rook-2');
  const blackKnight1 = new BlackKnight('b8', 'black-knight-1');
  const blackKnight2 = new BlackKnight('g8', 'black-knight-2');
  const blackBishop1 = new BlackBishop('c8', 'black-bishop-1');
  const blackBishop2 = new BlackBishop('f8', 'black-bishop-2');
  const blackQueen = new BlackQueen('d8', 'black-queen');

  state.white.allPieces.push(whitePawn1, whitePawn2, whitePawn3, whitePawn4, whitePawn5, whitePawn6, whitePawn7, whitePawn8, whiteKnight1, whiteKnight2, whiteBishop1, whiteBishop2, whiteRook1, whiteRook2, whiteQueen, whiteKing);


  state.black.allPieces.push(blackPawn1, blackPawn2, blackPawn3, blackPawn4, blackPawn5, blackPawn6, blackPawn7, blackPawn8, blackKnight1, blackKnight2, blackBishop1, blackBishop2, blackRook1, blackRook2, blackQueen, blackKing);

  state.totalPieces.push(...state.white.allPieces, ...state.black.allPieces);
  state.white.king = whiteKing;
  state.black.king = blackKing;

  actionLogData.gameStart = true;
  updateState(state.white.allPieces, state.black.allPieces);
};

/////////////////////////////////////////////////////////////
// FOR TESTING ONLY
const initTwoPlayerTESTING = function() {

  const whiteQueen = new WhiteQueen('d1', 'white-queen');
  const whiteKing = new WhiteKing('e1', 'white-king');

  const blackKing = new BlackKing('e8', 'black-king');

  state.white.allPieces.push(whiteQueen, whiteKing);
  state.black.allPieces.push(blackKing);
  state.totalPieces.push(...state.white.allPieces, ...state.black.allPieces);

  actionLogData.gameStart = true;
  updateState(state.white.allPieces, state.black.allPieces);
};
/////////////////////////////////////////////////////////////



// Finds the piece object by checking the id of the clicked piece element.
const getPiece = function(clickedPc) {
  state.totalPieces.forEach(piece => {
    if (piece.id === clickedPc.id) state.clicked = piece;
  });

  console.log(state);
};


// Drop piece handler.  Moves the piece element to the clicked square and
// sends the updated data to the state.  Moves a captured piece to 
// the captured pieces box.  Updates action log.  Checks for pawn promotion.
const dropPiece = function(e) {
  const curPiece = state.clicked;
  const dropSquare = e.target.closest('.square');
  actionLogData.initialSquare = curPiece.square.id;

  const player = curPiece.player;
  const playerOccupied = player === 'White' ? state.white.occupiedSquares : state.black.occupiedSquares;
  const villianOccupied = player === 'White' ? state.black.occupiedSquares : state.white.occupiedSquares;
  

  // Check if square is valid move
  if (!dropSquare || !curPiece.moves.includes(dropSquare.id)) {
    View.unclickPiece(curPiece, dropPiece, clickPiece);
    return;
  }

  // Check if square is occupied by a villian piece
  else if (villianOccupied.includes(dropSquare.id)) {
    const villianPieces = player === 'White' ? state.black.allPieces : state.white.allPieces;
    const capturedPiece = getCapturedPiece(dropSquare, villianPieces);
    curPiece.capture(dropSquare, capturedPiece);
    removePiece(villianPieces, capturedPiece);
  }
    
  // Only for castling
  else if (playerOccupied.includes(dropSquare.id)) {
    const playerPieces = player === 'White' ? state.white.allPieces : state.black.allPieces;
    const rookPiece = playerPieces.find(piece => piece.square.id === dropSquare.id);
    castle(curPiece, rookPiece);
    return;
  }

  // Move to empty square
  else curPiece.move(dropSquare);
  
  actionLogData.dropSquare = dropSquare.id;
  View.unclickPiece(curPiece, dropPiece, clickPiece);
  curPiece.updatePiece(dropSquare);

  // Check for pawn promotion
  if (curPiece.type === 'Pawn' && pawnPromotionCheck(curPiece))
    return;
  updateState(state.white.allPieces, state.black.allPieces);
};


// If there's a piece in the clicked square, finds that piece object by
// checking its ID.
const getCapturedPiece = function(dropSq, villianPcs) {
  const capturedPiece = villianPcs.find(piece => piece.square.id === dropSq.id);
  actionLogData.capturedPiece = capturedPiece.type;
  return capturedPiece;
};


// Removes a piece from the captured color's pieces array.  Also used to
// remove pawn when it is promoted.
const removePiece = function(villianPcs, capturedPc) {
  const newPieces = arrayRemove(villianPcs, capturedPc);
  const newTotalPieces = arrayRemove(state.totalPieces, capturedPc);

  if (capturedPc.player === 'White') state.white.allPieces = newPieces;
  else state.black.allPieces = newPieces;

  state.totalPieces = newTotalPieces;
};


// For pawn promotion.  Adds new piece to all pieces arrays.
const addPiece = function(newPc) {
  const playerPcs = newPc.player === 'White' ? state.white.allPieces : state.black.allPieces;

  const newPieces = playerPcs.slice();
  const newTotalPieces = state.totalPieces.slice();

  newPieces.push(newPc);
  newTotalPieces.push(newPc);

  if (newPc.player === 'White') state.white.allPieces = newPieces
  else state.black.allPieces = newPieces;

  state.totalPieces = newTotalPieces;
};


// Checks if a pawn moved to the end of the board.  If so, adds event to
// click the new piece you want to promote it to.
const pawnPromotionCheck = function(pawn) {
  const player = pawn.player;
  const dropSquareNum = +pawn.square.id[1];

  if (
    player === 'White' &&
    dropSquareNum === 8
  ) {
    View.addHandlerWhitePromote(clickPiece, getPromotedPiece);
    return true;
  }

  else if (
    player === 'Black' &&
    dropSquareNum === 1
  ) {
    View.addHandlerBlackPromote(clickPiece, getPromotedPiece);
    return true;
  }

  else return false;
};


// Gets the new piece that the pawn will be promoted to.  Removes the pawn
// and adds in the new piece.  Updates the state.
const getPromotedPiece = function(e) {
  state.promotePiece = '';
  const piece = e.target.closest('.promote-piece');
  if (!piece) return;

  const player = state.clicked.player;
  const playerPieces = player === 'White' ? state.white.allPieces : state.black.allPieces;

  state.promotePiece = piece.id;    
  actionLogData.promotePiece = piece.id; 
  View.unclickPromote(getPromotedPiece, clickPiece, player);  

  promotePiece(state.clicked, state.clicked.square, state.promotePiece, playerPieces);
  updateState(state.white.allPieces, state.black.allPieces);
};


// Removes the pawn from all pieces arrays.  Creates the new piece and
// adds it to all pieces arrays.
const promotePiece = function(pawnPc, dropSq, promotePc, playerPcs) {
  let promotedCount = 1;
  playerPcs.forEach(piece => {
    if (piece.type === promotePc) promotedCount++;
  });
  const player = pawnPc.player;

  dropSq.removeChild(pawnPc.piece);
  removePiece(playerPcs, pawnPc);

  let newPiece;
  if (player === 'White') {
    newPiece = promotePc === 'Queen' ? new WhiteQueen(dropSq.id, `promoted-white-queen${promotedCount}`)
      : promotePc === 'Rook' ? new WhiteRook(dropSq.id, `promoted-white-rook${promotedCount}`)
      : promotePc === 'Bishop' ? new WhiteBishop(dropSq.id, `promoted-white-bishop${promotedCount}`)
      : promotePc === 'Knight' ? new WhiteKnight(dropSq.id, `promoted-white-knight${promotedCount}`) 
      : null;
  }

  if (player === 'Black') {
    newPiece = promotePc === 'Queen' ? new BlackQueen(dropSq.id, `promoted-black-queen${promotedCount}`)
      : promotePc === 'Rook' ? new BlackRook(dropSq.id, `promoted-black-rook${promotedCount}`)
      : promotePc === 'Bishop' ? new BlackBishop(dropSq.id, `promoted-black-bishop${promotedCount}`)
      : promotePc === 'Knight' ? new BlackKnight(dropSq.id, `promoted-black-knight${promotedCount}`) 
      : null;
  }
  
  newPiece.move(dropSq);
  addPiece(newPiece);
};


// Updates the state with data containing the current position of all
// pieces
const updateOccupiedSquares = function(whitePcs, blackPcs) {
  const allOccupied = [];
  const whiteOccupied = [];
  const blackOccupied = [];

  whitePcs.forEach(piece => {
    whiteOccupied.push(piece.square.id);
    allOccupied.push(piece.square.id);
  });

  blackPcs.forEach(piece => {
    blackOccupied.push(piece.square.id);
    allOccupied.push(piece.square.id);
  });

  state.allOccupiedSquares = allOccupied;
  state.white.occupiedSquares = whiteOccupied;
  state.black.occupiedSquares = blackOccupied;
};


// Updates the state with data containing the squares controlled by each
// colors pieces.  ALSO updates each pieces moves that isn't a king.
const updateControlSquares = function(whitePcs, blackPcs) {
  const whiteControl = [];
  const blackControl = [];

  whitePcs.forEach(piece => {
    piece.calcMoves(state);
    whiteControl.push(...piece.control);
    if (piece.threatening) console.log(piece); // 
  });

  blackPcs.forEach(piece => {
    piece.calcMoves(state);
    blackControl.push(...piece.control);
    if (piece.threatening) console.log(piece); // 
  });

  state.white.controlSquares = whiteControl;
  state.black.controlSquares = blackControl;

  // Prevents a piece from putting its own king in check!
  calcBlockingPcs(whitePcs, blackPcs);
};


const calcBlockingPcs = function(whitePcs, blackPcs) {
  const whiteThreats = whitePcs.filter(piece => piece.threatening);
  const blackThreats = blackPcs.filter(piece => piece.threatening);
  const whiteKing = whitePcs.find(piece => piece.type === 'King');
  const blackKing = blackPcs.find(piece => piece.type === 'King');

  if (whiteThreats.length > 0) {
    whiteThreats.forEach(threat => {
      const threatSq = threat.square;
      const threatPath = blackKing.calcThreatPath(threat.square);
      blackPcs.forEach(piece => threatPath.includes(piece.square.id) ? piece.calcProtectMoves([], threatSq, threatPath) : piece);
    });
  }

  if (blackThreats.length > 0) {
    blackThreats.forEach(threat => {
      const threatSq = threat.square;
      const threatPath = whiteKing.calcThreatPath(threat.square);
      whitePcs.forEach(piece => threatPath.includes(piece.square.id) ? piece.calcProtectMoves([], threatSq, threatPath) : piece);
    })
  }
};


// Updates each colors king data.  Removes king moves that would put itself
// in check.  Checks for check.  If no check, checks if king can castle.
const updateKings = function(whitePcs, blackPcs) {
  const player = state.clicked.player;
  const whiteKing = whitePcs.find(piece => piece.type === 'King');
  const blackKing = blackPcs.find(piece => piece.type === 'King');

  const whiteOccupied = state.white.occupiedSquares;
  const blackOccupied = state.black.occupiedSquares;
  const whiteControl = state.white.controlSquares;
  const blackControl = state.black.controlSquares;
  
  // Updates both kings moves
  whiteKing.preventSelfCheck(blackControl, whiteOccupied);
  blackKing.preventSelfCheck(whiteControl, blackOccupied);

  // Checks if opponent king was put in check by current players move
  blackKing.checkForCheck(state);
  whiteKing.checkForCheck(state);

  // If opponent king is in check, updates opponents moves to only have moves
  // that get its king out of check!
  if (whiteKing.inCheck || blackKing.inCheck) {
    actionLogData.check = true;
    const opponentKing = player === 'White' ? blackKing : whiteKing;
    const opponentPieces = player === 'White' ? state.black.allPieces : state.white.allPieces;
    const checkPcs = opponentKing.checkPieces;

    if (checkPcs.length > 1) opponentKing.doubleCheck(opponentPieces, checkPcs);
    else opponentKing.protectMe(opponentPieces, checkPcs[0]);
  }

  // If king is not in check and has not moved, checks for ability to castle. 
  if (
    whiteKing.inCheck === false &&
    whiteKing.moveCount === 0
  ) whiteKing.castleOption(state);

  if (
    blackKing.inCheck === false &&
    blackKing.moveCount === 0
  ) blackKing.castleOption(state);
  
  state.white.king = whiteKing;
  state.black.king = blackKing;
};


// Moves king and rook according to which direction the player castles in.
const castle = function(kingPc, rookPc) {
  const [curKingLet, curKingNum] = kingPc.square.id.split('');
  const curKingLetCopy = curKingLet.charCodeAt(0);
  const curKingNumCopy = +curKingNum;

  const [curRookLet, curRookNum] = rookPc.square.id.split('');
  const curRookLetCopy = curRookLet.charCodeAt(0);
  const curRookNumCopy = +curRookNum;

  let newKingSquare;
  let newRookSquare;

  if (
    rookPc.id === 'white-rook-2' ||
    rookPc.id === 'black-rook-2'
  ) {
    const rightKingSq = `${String.fromCharCode(curKingLetCopy + 2)}${curKingNumCopy}`;
    const rightRookSq = `${String.fromCharCode(curRookLetCopy - 2)}${curRookNumCopy}`;

    newKingSquare = document.getElementById(rightKingSq);
    newRookSquare = document.getElementById(rightRookSq);

    kingPc.move(newKingSquare);
    rookPc.move(newRookSquare);
  } 
  
  else if (
    rookPc.id === 'white-rook-1' ||
    rookPc.id === 'black-rook-1' 
  ) {
    const leftKingSq = `${String.fromCharCode(curKingLetCopy - 2)}${curKingNumCopy}`;
    const leftRookSq = `${String.fromCharCode(curRookLetCopy + 3)}${curRookNumCopy}`;

    newKingSquare = document.getElementById(leftKingSq);
    newRookSquare = document.getElementById(leftRookSq);

    kingPc.move(newKingSquare);
    rookPc.move(newRookSquare);
  }

  View.unclickPiece(kingPc, dropPiece, clickPiece);
  kingPc.square = newKingSquare;
  kingPc.moveCount++;
  rookPc.square = newRookSquare;
  rookPc.moveCount++;
  
  // !Action Log Update!
  actionLogData.castle = true;
  
  updateState(state.white.allPieces, state.black.allPieces);
};


const checkmateCheck = function(whiteKing, blackKing) {
  if (whiteKing.checkmate === true || blackKing.checkmate === true) {
    actionLogData.checkmate = true;
    View.updateActionLog(state, actionLogData);
    View.stopGame(clickPiece);
    alert('Checkmate!');
  }
}


// Checks for a stalemate
const stalemateCheck = function(whitePcs, blackPcs) {
  const allWhiteMoves = [];
  const allBlackMoves = [];
  
  whitePcs.forEach(piece => allWhiteMoves.push(...piece.moves));
  blackPcs.forEach(piece => allBlackMoves.push(...piece.moves));
  
  const curPlayer = state.activePlayer;
  const curKing = curPlayer === 'White' ? state.white.king : state.black.king;
  const curPlayerMoves = curPlayer === 'White' ? allWhiteMoves : allBlackMoves;

  if (!curKing.inCheck && curPlayerMoves.length === 0) {
    actionLogData.stalemate = true;
    View.updateActionLog(state, actionLogData);
    View.stopGame(clickPiece);
    alert('Stalemate!');
  }
}


// Updates the data in the state object.  Updates the action log and checks
// for checkmate or stalemate.
const updateState = function(whitePcs, blackPcs) {
  updateOccupiedSquares(whitePcs, blackPcs);
  updateControlSquares(whitePcs, blackPcs);
  updateKings(whitePcs, blackPcs);
  View.updateActionLog(state, actionLogData);
  
  state.turnNum++;
  state.activePlayer = state.turnNum % 2 !== 0 ? 'White' : 'Black';

  checkmateCheck(state.white.king, state.black.king);
  stalemateCheck(whitePcs, blackPcs);
  actionLogData = {};
};

const quitGame = function() {
  View.stopGame(clickPiece);
  View.resetView();

  state.turnNum = 0;
  state.allOccupiedSquares = [];
  state.totalPieces = [];
  state.white.allPieces = [];
  state.white.occupiedSquares = [];
  state.white.controlSquares = [];
  state.black.allPieces = [];
  state.black.occupiedSquares = [];
  state.black.controlSquares = [];

  View.addHandlerMenuBtns(initGame);
  View.addHandlerPieceClick(clickPiece);
};






// Board event handler.  Gets the piece object, renders its moves on the
// board, and adds new click event allowing you to move it to a square.
const clickPiece = function(e) {
  const clickedPiece = e.target.closest('.piece')
  if (!clickedPiece) return;
  
  getPiece(clickedPiece);
  if (state.clicked.player !== state.activePlayer) return;

  View.renderSquares(state.clicked);
  View.addHandlerPieceDrop(clickPiece, dropPiece);
};

// Adds handlers for clicking the menu button and the pieces.
View.addHandlerMenuBtns(initGame);
View.addHandlerPieceClick(clickPiece);
View.addHandlerQuitGame(quitGame);







