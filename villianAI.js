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

const boardSquares = [
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8', 
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7', 
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6', 
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5', 
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4', 
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3', 
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2', 
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
];

const simState = {
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
};

const arrayRemove = (arr, value) => arr.filter(el => el !== value);

const removePiece = function(capturedPc) {
  const newPieces = arrayRemove(simState.white.allPieces, capturedPc);
  const newTotalPieces = arrayRemove(simState.totalPieces, capturedPc);

  simState.white.allPieces = newPieces;
  simState.totalPieces = newTotalPieces;
};


export class VillianAI {
  color = 'Black';

  updateData(state) {
    // NORMAL STATE
    this.userData = state.white;
    this.AIData = state.black;
    
    const moveable = [];
    this.AIData.allPieces.forEach(piece => {
      if (piece.moves.length > 0) 
        moveable.push(piece);
    });
    this.moveablePieces = moveable;

    // SIMULATION STATE
    this.createSimState(state);
    const simMoveable = [];
    simState.black.allPieces.forEach(piece => {
      if (piece.moves.length > 0)
        simMoveable.push(piece);
    });

    this.simMoveable = simMoveable;
    this.checkmateMoves = [];
    this.checkMoves = [];
    this.bestCaptures = [];
    this.prepCaptures = []; 
  }

  createSimState(state) {
    const whitePieces = state.white.allPieces;
    const blackPieces = state.black.allPieces;

    const whitePiecesCopy = [];
    whitePieces.forEach(piece => {
      let pieceCopy;

      if (piece.type === 'Pawn') {
        pieceCopy = new WhitePawn(piece.square.id, piece.id);
      }
      else if (piece.type === 'Knight') {
        pieceCopy = new WhiteKnight(piece.square.id, piece.id);
      }
      else if (piece.type === 'Rook') {
        pieceCopy = new WhiteRook(piece.square.id, piece.id);
        pieceCopy.threatening = piece.threatening;
      }
      else if (piece.type === 'Bishop') {
        pieceCopy = new WhiteBishop(piece.square.id, piece.id);
        pieceCopy.threatening = piece.threatening;
      }
      else if (piece.type === 'Queen') {
        pieceCopy = new WhiteQueen(piece.square.id, piece.id);
        pieceCopy.threatening = piece.threatening;
      }
      else if (piece.type === 'King') {
        pieceCopy = new WhiteKing(piece.square.id, piece.id);
        pieceCopy.checkPieces = piece.checkPieces;
        pieceCopy.inCheck = piece.inCheck;
      }

      pieceCopy.control = piece.control.slice(0);
      pieceCopy.moves = piece.moves.slice(0);
      pieceCopy.moveCount = piece.moveCount;
      whitePiecesCopy.push(pieceCopy);
    })
    
    const blackPiecesCopy = [];
    blackPieces.forEach(piece => {
      let pieceCopy;

      if (piece.type === 'Pawn') {
        pieceCopy = new BlackPawn(piece.square.id, piece.id);
      }
      else if (piece.type === 'Knight') {
        pieceCopy = new BlackKnight(piece.square.id, piece.id); 
      }
      else if (piece.type === 'Rook') {
        pieceCopy = new BlackRook(piece.square.id, piece.id);
        pieceCopy.threatening = piece.threatening;
      }
      else if (piece.type === 'Bishop') {
        pieceCopy = new BlackBishop(piece.square.id, piece.id);
        pieceCopy.threatening = piece.threatening;
      }
      else if (piece.type === 'Queen') {
        pieceCopy = new BlackQueen(piece.square.id, piece.id);
        pieceCopy.threatening = piece.threatening;
      }
      else if (piece.type === 'King') {
        pieceCopy = new BlackKing(piece.square.id, piece.id);
        pieceCopy.checkPieces = piece.checkPieces;
        pieceCopy.inCheck = piece.inCheck;
      }

      pieceCopy.control = piece.control.slice(0);
      pieceCopy.moves = piece.moves.slice(0);
      pieceCopy.moveCount = piece.moveCount;
      blackPiecesCopy.push(pieceCopy);
    });

    const totalPiecesCopy = [...whitePiecesCopy, ...blackPiecesCopy];
    const whiteKingCopy = whitePiecesCopy.find(piece => piece.type === 'King');
    const blackKingCopy = blackPiecesCopy.find(piece => piece.type === 'King');

    simState.totalPieces = totalPiecesCopy;
    simState.allOccupiedSquares = state.allOccupiedSquares.slice(0);

    simState.white.allPieces = whitePiecesCopy;
    simState.white.occupiedSquares = state.white.occupiedSquares.slice(0);
    simState.white.controlSquares = state.white.controlSquares.slice(0);

    simState.black.allPieces = blackPiecesCopy;
    simState.black.occupiedSquares = state.black.occupiedSquares.slice(0);
    simState.black.controlSquares = state.black.controlSquares.slice(0);

    simState.white.king = whiteKingCopy;
    simState.black.king = blackKingCopy;
  }

  getMove() {
    if (!this.AIData.king.inCheck) {
      // simulate ALL moves
      const bestMove = this.calcMoves();
      // console.log(simState);

      if (bestMove) {
        console.log(bestMove);
        const realPiece = this.moveablePieces.find(rPc => rPc.id === bestMove[0].id);
        this.movePiece = realPiece;
        this.dropSquare = bestMove[1];
        return;
      }
    }

    console.log('AI Random move!');
    this.movePiece = this.calcRandomPiece();
    this.dropSquare = this.calcRandomDropSquare();
  }

  calcMoves() {
    this.simMoveable.forEach(piece => this.simulateMoves(piece));

    console.log(this.checkmateMoves);
    console.log(this.checkMoves);
    console.log(this.bestCaptures);
    console.log(this.prepCaptures);

    if (this.checkmateMoves.length > 0) {
      // console.log('AI CHECKMATE MOVE!');
      const mateMove = this.randomElement(this.checkmateMoves);
      return mateMove;
    }

    else if (this.checkMoves.length > 0) {
      // console.log('AI Check move!');
      const checkMove = this.randomElement(this.checkMoves);
      return checkMove;
    }

    else if (this.bestCaptures.length > 0) {
      // console.log('AI Capture move!');
      // FILTER BESTCAPTURES TO ONE MOVE
      if (this.bestCaptures.length > 1) {
        const bestCapture = this.filterCaptures(this.bestCaptures);
        return bestCapture;
      }
      else if (this.bestCaptures.length === 1) {
        const bestCapture = this.bestCaptures[0];
        return bestCapture;
      }
    }

    else if (this.prepCaptures.length > 0) {
      // console.log('AI Preparing to capture!');
      if (this.prepCaptures.length > 1) {
        const prepMove = this.filterCaptures(this.prepCaptures);
        return prepMove;
      }
      else if (this.prepCaptures.length === 1) {
        const prepMove = this.prepCaptures[0];
        return prepMove;
      }
    }

    else return false;
  }

  simulateMoves(piece) {
    const initialSq = piece.square;
    const initialMC = piece.moveCount;
    const initialWhitePieces = simState.white.allPieces;
    const initialTotalPieces = simState.totalPieces;

    const moves = piece.moves;
    const capturables = simState.white.allPieces.filter(piece => moves.includes(piece.square.id));
    if (capturables.length > 0) this.calcCaptures(piece, capturables);
    
    moves.forEach(move => {
      const square = document.getElementById(move);
      const whitePieces = simState.white.allPieces;
      const occupyingPiece = whitePieces.find(piece => piece.square === square);

      // IF SQUARE CONTAINS CAPTURED PIECE, REMOVE PIECE FROM ARRAYS!
      if (occupyingPiece) removePiece(occupyingPiece);
      piece.square = square;
      piece.moveCount++;

      // Update the simulated state!!
      this.updateSimState(simState.white.allPieces, simState.black.allPieces);

      // check for checkmate
      this.checkmateSearch(piece, square);

      // check for check
      this.checkSearch(piece, square);      

      // check if new moves include captures
      this.prepCaptureSearch(piece, square);

    
      // RESTORE A CAPTURED PIECE
      simState.white.allPieces = initialWhitePieces;
      simState.totalPieces = initialTotalPieces;
    });

    // RESTORE PIECES DATA
    piece.square = initialSq;
    piece.moveCount = initialMC;
  }

  calcCaptures(AIpiece, capturables) {
    const freeCaps = [];
    const tradeCaps = [];
    let bestFreeCap = '';
    let bestTradeCap = '';

    const whiteControl = simState.white.controlSquares;
  
    capturables.forEach(capPiece => whiteControl.includes(capPiece.square.id) ? tradeCaps.push(capPiece) : freeCaps.push(capPiece));

    // FIND BEST FREE CAPTURE
    if (freeCaps.length > 1) {
      bestFreeCap = freeCaps.reduce((prev, cur) => cur.rank > prev.rank ? cur : prev);
    } 

    else if (freeCaps.length === 1)
      bestFreeCap = freeCaps[0];

    // FIND BEST TRADE CAPTURE
    let highestRankTrade = '';
    if (tradeCaps.length > 1) 
      highestRankTrade = tradeCaps.reduce((prev, cur) => cur.rank > prev.rank ? cur : prev);
    else if (tradeCaps.length === 1) 
      highestRankTrade = tradeCaps[0];
    
    if (highestRankTrade && highestRankTrade.rank > AIpiece.rank)
        bestTradeCap = highestRankTrade; 

    // FIGURE OUT WHICH ONE IS BETTER
    if (bestFreeCap && bestTradeCap) {
      const betterCap = bestTradeCap.rank > bestFreeCap.rank ? bestTradeCap : bestFreeCap;
      this.bestCaptures.push([AIpiece, betterCap.square, betterCap]);
    }
    else if (bestFreeCap && !bestTradeCap) 
      this.bestCaptures.push([AIpiece, bestFreeCap.square, bestFreeCap]);
    else if (!bestFreeCap && bestTradeCap)
      this.bestCaptures.push([AIpiece, bestTradeCap.square, bestTradeCap]);
  }

  filterCaptures(allMoves) {
    const bestCapture = allMoves.reduce((prev, cur) => cur[2].rank > prev[2].rank ? cur : prev);
    return bestCapture;
  }

  // checkWorth(piece, move) {
  //   // is this move controlled by a user piece with a lesser rank than you?
  //   const pieceRank = piece.rank;
  //   const userPieces = simState.white.allPieces;

  //   const userControlPieces = userPieces.filter(userPc => userPc.control.includes(move));
  //   const lowerRankControl = userControlPieces.filter(userPc => userPc.rank < pieceRank);

  //   if (lowerRankControl.length === 0) return true;
  //   else return false;
  // }

  checkmateSearch(pc, sq) {
    const whiteKing = simState.white.king;
    if (whiteKing.checkmate) {
      this.checkmateMoves.push([pc, sq]); 
    }
  }

  checkSearch(pc, sq) {
    const whiteControl = simState.white.controlSquares;
    if (whiteControl.includes(sq.id)) return;

    const whiteKing = simState.white.king;
    if (whiteKing.inCheck) 
        this.checkMoves.push([pc, sq]);
  }

  prepCaptureSearch(pc, sq) {
    const whiteControl = simState.white.controlSquares;
    if (whiteControl.includes(sq.id)) return;

    const newMoves = pc.moves;
    const whitePieces = simState.white.allPieces;

    const prepCaptures = [];
    whitePieces.forEach(piece => {
      if (newMoves.includes(piece.square.id)) {
        prepCaptures.push([pc, sq, piece]);
      }
    });

    if (prepCaptures.length > 1) {
      const bestPrepCap = prepCaptures.reduce((prev, cur) => cur[2].rank > prev[2].rank ? cur : prev);
      this.prepCaptures.push(bestPrepCap);
    }
    else if (prepCaptures.length === 1) 
      this.prepCaptures.push(prepCaptures[0]);
    else return;
  }



  /////////////////////////////////////////////////////
  // UPDATE THE SIMULATED STATE

  simOccupiedSquares(whitePcs, blackPcs) {
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
  
    simState.allOccupiedSquares = allOccupied;
    simState.white.occupiedSquares = whiteOccupied;
    simState.black.occupiedSquares = blackOccupied;
  };
  
  simControlSquares(whitePcs, blackPcs) {
    const whiteControl = [];
    const blackControl = [];
    const whiteKing = whitePcs.find(piece => piece.type === 'King');
    const blackKing = blackPcs.find(piece => piece.type === 'King');
    const whiteOccupied = simState.white.occupiedSquares;
    const blackOccupied = simState.black.occupiedSquares;
    
    whitePcs.forEach(piece => {
      piece.control = piece.calcControl(simState);
      whiteControl.push(...piece.control);

      if (piece.type === 'King') return;
      piece.moves = piece.calcMoves(simState);
    });
  
    blackPcs.forEach(piece => {
      piece.control = piece.calcControl(simState);
      blackControl.push(...piece.control);

      if (piece.type === 'King') return;
      piece.moves = piece.calcMoves(simState);
    });
  
    whiteKing.moves = whiteKing.calcMoves(blackControl, whiteOccupied);
    blackKing.moves = blackKing.calcMoves(whiteControl, blackOccupied);

    simState.white.controlSquares = whiteControl;
    simState.black.controlSquares = blackControl;
  
    this.simBlockingPcs(whitePcs, blackPcs);
  };
  
  simBlockingPcs(whitePcs, blackPcs) {
    const whiteThreats = whitePcs.filter(piece => piece.threatening);
    const blackThreats = blackPcs.filter(piece => piece.threatening);
    const whiteKing = whitePcs.find(piece => piece.type === 'King');
    const blackKing = blackPcs.find(piece => piece.type === 'King');
  
    if (whiteThreats.length > 0) {
      whiteThreats.forEach(threat => {
        const threatSq = threat.square;
        const threatPath = blackKing.calcThreatPath(threat.square);
        blackPcs.forEach(piece => threatPath.includes(piece.square.id) ? piece.calcProtectMoves(threatSq, threatPath) : piece);
      });
    }
  
    if (blackThreats.length > 0) {
      blackThreats.forEach(threat => {
        const threatSq = threat.square;
        const threatPath = whiteKing.calcThreatPath(threat.square);
        whitePcs.forEach(piece => threatPath.includes(piece.square.id) ? piece.calcProtectMoves(threatSq, threatPath) : piece);
      })
    }
  };
  
  
  simKings(whitePcs, blackPcs) {
    const whiteKing = whitePcs.find(piece => piece.type === 'King');
    whiteKing.checkmate = false;
    whiteKing.inCheck = false;
    const blackKing = blackPcs.find(piece => piece.type === 'King');

    if (whiteKing.checkForCheck(simState))
      whiteKing.inCheck = true;
  
    // If opponent king is in check, updates opponents moves to only have moves
    // that get its king out of check!
    if (whiteKing.inCheck) {
      const opponentPieces = simState.white.allPieces;
      const threat = whiteKing.checkPieces;
  
      if (threat.length > 1) whiteKing.doubleCheck(opponentPieces, threat);
      else whiteKing.protectMe(opponentPieces, threat[0]);
    }
    
    if (
      blackKing.inCheck === false &&
      blackKing.moveCount === 0
    ) blackKing.castleOption(simState);
    
    simState.white.king = whiteKing;
    simState.black.king = blackKing;
  };
  
  updateSimState(whitePcs, blackPcs) {
    this.simOccupiedSquares(whitePcs, blackPcs);
    this.simControlSquares(whitePcs, blackPcs);
    this.simKings(whitePcs, blackPcs);
  };
  //

  randomElement(arr) {
    const number = arr.length;
    const randomNum = Math.trunc(Math.random() * number);
    const randomItem = arr[randomNum];
    return randomItem;
  }

  calcRandomPiece() {
    const piece = this.randomElement(this.moveablePieces);
    return piece;
  }

  calcRandomDropSquare() {
    const move = this.randomElement(this.movePiece.moves);
    const dropSquare = document.getElementById(move); 
    return dropSquare;
  }
}






