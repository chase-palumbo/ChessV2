const whiteCaptured = document.querySelector('.taken-pieces');
const blackCaptured = document.querySelector('.lost-pieces');

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

export default class Piece {
  moveCount = 0;

  move(dropSq) {
    console.log(this);
    dropSq.appendChild(this.piece);
  }

  capture(dropSq, capturedPc) {
    if (this.player === 'White') {
      whiteCaptured.appendChild(capturedPc.piece);
      dropSq.appendChild(this.piece);
    } else {
      blackCaptured.appendChild(capturedPc.piece);
      dropSq.appendChild(this.piece);
    }
  }

  calcDirection(allOccupied, direction, controlSqs, villianKing) {
    const [curLet, curNum] = this.square.id.split('');
    let curLetCopy = curLet.charCodeAt(0);
    let curNumCopy = +curNum;

    let validSquare = true;
    while (validSquare) {
      const nextSquare = `${String.fromCharCode(curLetCopy += direction[0])}${curNumCopy += direction[1]}`;
      const squareEl = document.getElementById(nextSquare);
      if (!squareEl) {
        validSquare = false;
      }

      else if (allOccupied.includes(nextSquare)) {
        controlSqs.push(nextSquare);
        validSquare = false;

        if (this.threatening) return;
        const vKingSquare = villianKing.square.id;
        if (nextSquare !== vKingSquare)
          this.lookForKing(direction, vKingSquare, nextSquare, allOccupied);
      } 
      
      else controlSqs.push(nextSquare);
    }
  }

  lookForKing(direction, vKingSq, startSq, allOcc) {
    const [curLet, curNum] = startSq.split('');
    let curLetCopy = curLet.charCodeAt(0);
    let curNumCopy = +curNum;

    let validSquare = true;
    while (validSquare) {
      const nextSquare = `${String.fromCharCode(curLetCopy += direction[0])}${curNumCopy += direction[1]}`;
      const squareEl = document.getElementById(nextSquare);
      if (!squareEl) {
        validSquare = false;
      }

      if (allOcc.includes(nextSquare)) {
        if (nextSquare === vKingSq) {
          this.threatening = true;
          validSquare = false;
        }
        else {
          this.threatening = false;
          validSquare = false;
        }
      }
    }
  }

  validSquareCheck(moves) {
    const validMoves = moves.filter(move => {
      if (boardSquares.includes(move)) return move;
    });

    return validMoves;
  }

  updatePiece(dropSq) {
    this.square = dropSq;
    this.moveCount++;
  }

  // Only used by king pieces.  Sees if any piece can block or capture the
  // checking piece.  If piece is a king, removes any moves in a threat
  // path.  If no protecting moves, CHECKMATE!
  protectMe(pieces, threat) {
    const singleMovePcs = ['Pawn', 'Knight', 'King'];
    const multiMovePcs = ['Queen', 'Rook', 'Bishop'];

    const threatType = threat.type;
    const threatSquare = threat.square;

    const allProtectMoves = [];

    // If threat is a pawn, knight, or king
    if (singleMovePcs.includes(threatType)) {
      pieces.forEach(piece => {
        const protectMoves = piece.calcProtectMoves(threatSquare);
        allProtectMoves.push(...protectMoves);
      });
    }

    // If threat is a queen, rook, or bishop
    else if (multiMovePcs.includes(threatType)) {
      const threatPath = this.calcThreatPath(threatSquare);
      pieces.forEach(piece => {
        const protectMoves = piece.calcProtectMoves(threatSquare, threatPath);
        allProtectMoves.push(...protectMoves);
      });
    }

    if (allProtectMoves.length === 0) 
      this.checkmate = true;
    else if (allProtectMoves.length > 0)
      this.checkmate = false;
  }

  // Takes away every pieces moves but the king's.  Removes kings moves
  // that are in a threat path.  Checks if the king can move.  If King
  // cant move, CHECKMATE!
  doubleCheck(pieces, threat) {
    const multiMovePcs = ['Queen', 'Rook', 'Bishop'];

    pieces.forEach(piece => {
      if (piece.type !== 'King')
      piece.moves = [];
    });

    threat.forEach(thr => {
      if (multiMovePcs.includes(thr.type)) {
        const threatPath = this.calcThreatPath(thr.square);
      }
    });

    if (this.moves.length === 0) 
      this.checkmate = true;
    else if (this.moves.length > 0)
      this.checkmate = false;
  }

  // Run on each piece when your king is in check!  Updates valid moves!
  calcProtectMoves(threatSq, threatPath = '') {
    const protectMoves = [];

    if (this.type === 'King') 
      protectMoves.push(...this.moves);

    else if (!threatPath) {
      // Can you capture the threat?
      this.moves = this.moves.filter(move => move === threatSq.id);
      protectMoves.push(...this.moves);
    }

    else if (threatPath) {
      // Can you block or capture the threat?
      this.moves = this.moves.filter(move => threatPath.includes(move));
      protectMoves.push(...this.moves);
    }
    
    return protectMoves;
  }

  // Only used by king pieces.  Gets the squares seperating the calling 
  // piece's square and the square passed into function.
  calcThreatPath(threatSq) {
    const [kingLetter, kingNumber] = this.square.id.split('');
    const [threatLetter, threatNumber] = threatSq.id.split('');

    let kingLet = kingLetter.charCodeAt(0);
    let kingNum = +kingNumber;
    let threatLet = threatLetter.charCodeAt(0);
    let threatNum = +threatNumber;
    
    const upStraight = [0, 1];
    const rightStraight = [1, 0];
    const downStraight = [0, -1];
    const leftStraight = [-1, 0];
    
    const upLeftDiag = [-1, 1];
    const upRightDiag = [1, 1];
    const downLeftDiag = [-1, -1];
    const downRightDiag = [1, -1];

    let threatDirection;
    if (kingLet === threatLet && kingNum > threatNum)
      threatDirection = upStraight;
    else if (kingLet > threatLet && kingNum === threatNum)
      threatDirection = rightStraight;
    else if (kingLet === threatLet && kingNum < threatNum)
      threatDirection = downStraight;
    else if (kingLet < threatLet && kingNum === threatNum)
      threatDirection = leftStraight;
    else if (kingLet < threatLet && kingNum > threatNum)
      threatDirection = upLeftDiag;
    else if (kingLet > threatLet && kingNum > threatNum)
      threatDirection = upRightDiag;
    else if (kingLet < threatLet && kingNum < threatNum)
      threatDirection = downLeftDiag;
    else if (kingLet > threatLet && kingNum < threatNum)
      threatDirection = downRightDiag;

    const threatPath = [threatSq.id];
    for (let i = 0; i < 8; i++) {
      const nextSquare = `${String.fromCharCode(threatLet += threatDirection[0])}${threatNum += threatDirection[1]}`;
      const squareEl = document.getElementById(nextSquare);
      if (!squareEl) break;

      if (nextSquare === this.square.id) {
        if (this.inCheck) {
          // REMOVES ANY KING MOVES IN THE THREAT PATH 
          const otherSideSquare = `${String.fromCharCode(threatLet += threatDirection[0])}${threatNum += threatDirection[1]}`;
          if (this.moves.includes(otherSideSquare)) 
            this.moves = this.moves.filter(move => move !== otherSideSquare);
        }
        break;
      }

      threatPath.push(nextSquare);
    }

    return threatPath;
  }

};




