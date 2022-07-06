
const board = document.querySelector('.board');
const boardContainer = document.querySelector('.board-container');
const menu = document.querySelector('.main');
const actionLog = document.querySelector('.action-log');
const whiteCaptured = document.querySelector('.taken-pieces');
const blackCaptured = document.querySelector('.lost-pieces');

let whitePromoteBox;
let blackPromoteBox;



// Adds click events and handles most elements of the view of the page.
class View {

  // Menu event listener
  addHandlerMenuBtns(handler1, handler2) {
    const startGame = function(e) {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      const twoPlayer = document.querySelector('.two-player');
      const vsAI = document.querySelector('.vs-AI');
      if (btn === twoPlayer) handler1();
      if (btn === vsAI) handler2();
      menu.removeEventListener('click', startGame);

      const quitButtonMarkup = `<button class="quit-game btn">Quit Game</button>`;
      menu.insertAdjacentHTML('beforeend', quitButtonMarkup);
    };
    
    menu.addEventListener('click', startGame);
  };

  addHandlerQuitGame(handler) {
    const quitGame = function(e) {
      const btn = e.target.closest('.quit-game');
      if (!btn) return;

      handler();
      menu.removeChild(btn);
    }

    menu.addEventListener('click', quitGame);
  }

  // Board Event Listnener 
  addHandlerPieceClick(handler) {
    board.addEventListener('click', handler);
  };

  // Renders the clicked square and move squares on the board with a color
  // border.
  renderSquares(curPiece) {
    const curSquare = curPiece.square;
    const moves = curPiece.moves;
  
    curSquare.classList.add('clicked-square');
    moves.forEach(move => {
      const square = document.getElementById(move);
      if (!square) return;
  
      square.classList.add('drop-square');
    });
  };

  // Piece drop event listener
  addHandlerPieceDrop(removeHandler, addHandler) {
    board.removeEventListener('click', removeHandler);
    board.addEventListener('click', addHandler);
  };
  
  // Adds white's promotion box and adds a click event to it.  Removes
  // board event listener.
  addHandlerWhitePromote(clickHandler, promoteHandler) {
    const whiteBoxMarkup = `
      <div class="white-promotion">
        <img id="Queen" class="promote-piece" src="./pieceImgs/White_Queen.svg.png">
        <img id="Rook" class="promote-piece" src="./pieceImgs/White_Rook.svg.png">
        <img id="Bishop" class="promote-piece" src="./pieceImgs/White_Bishop.svg.png">
        <img id="Knight" class="promote-piece" src="./pieceImgs/White_Knight.svg.png">
      </div>
    `;
    boardContainer.insertAdjacentHTML('afterbegin', whiteBoxMarkup);
    whitePromoteBox = document.querySelector('.white-promotion');
    whitePromoteBox.scrollIntoView();

    board.removeEventListener('click', clickHandler);
    whitePromoteBox.addEventListener('click', promoteHandler);
  };

  // Adds black's promotion box and adds a click event to it.  Removes
  // board event listener.
  addHandlerBlackPromote(clickHandler, promoteHandler) {
    const blackBoxMarkup = `
      <div class="black-promotion">
        <img id="Queen" class="promote-piece" src="./pieceImgs/Black_Queen.svg.png">
        <img id="Rook" class="promote-piece" src="./pieceImgs/Black_Rook.svg.png">
        <img id="Bishop" class="promote-piece" src="./pieceImgs/Black_Bishop.svg.png">
        <img id="Knight" class="promote-piece" src="./pieceImgs/Black_Knight.svg.png">
      </div>
    `;
    boardContainer.insertAdjacentHTML('beforeend', blackBoxMarkup);
    blackPromoteBox = document.querySelector('.black-promotion');
    blackPromoteBox.scrollIntoView();

    board.removeEventListener('click', clickHandler);
    blackPromoteBox.addEventListener('click', promoteHandler);
  };

  // Removes promote box, and removes promotion click event.  Adds board
  // click event.
  unclickPromote(removeHandler, addHandler, player) {
    if (player === 'White') {
      whitePromoteBox.removeEventListener('click', removeHandler);
      boardContainer.removeChild(whitePromoteBox);
    } else if (player === 'Black') {
      blackPromoteBox.removeEventListener('click', removeHandler);
      boardContainer.removeChild(blackPromoteBox);
    }

    board.addEventListener('click', addHandler);
  };

  // Removes rendered squares. Removes drop-piece click event, and adds
  // board click event.
  unclickPiece(curPiece, removeHandler, addHandler) {
    curPiece.square.classList.remove('clicked-square');
    const moves = curPiece.moves;
    moves.forEach(move => {
      const square = document.getElementById(move);
      if (!square) return;

      square.classList.remove('drop-square');
    });

    board.removeEventListener('click', removeHandler);
    board.addEventListener('click', addHandler);
  };

  // Adds markup to the action log documenting every move. PERFECT
  updateActionLog(state, actionData) {
    const turn = state.turnNum;
    const pieceImg = `<span><img src="${this.img}"/></span>`;

    const pieceType = state.clicked.type;
    const player = state.clicked.player;
    const villian = player === 'White' ? 'Black' : 'White';   
    
    const startMarkup = `<ul class="action-text">GAME START!</ul>`;

    const moveMarkup = `<ul class="action-text">${turn}.  <span class="action-text--${player}">${pieceType}</span>  ${actionData.initialSquare} ➜ ${actionData.dropSquare}.</ul>`;

    const castleMarkup = `<ul class="action-text">${turn}.  <span class="action-text--${player}">${player}</span> castles!</ul>`;

    const captureMarkup = `<ul class="action-text"><span class="action-text--${player}">${pieceType}</span> captures <span class="action-text--${villian}">${actionData.capturedPiece}</span>!</ul>`;

    const promotionMarkup = `<ul class="action-text"><span class="action-text--${player}">Pawn</span> promoted to <span class="action-text--${player}">${actionData.promotePiece}</span></ul>`;

    const checkMarkup = `<ul class="action-check--${player}">CHECK</ul>`;

    const checkmateMarkup = `<ul class="action-check--${player}">CHECKMATE! ${player} Wins!</ul>`;

    const stalemateMarkup = `<ul class="action-stalemate">STALEMATE. Everyone loses.</ul>`;
    
    if (actionData.gameStart) {
      actionLog.insertAdjacentHTML('afterbegin', startMarkup);
      return;
    }

    if (actionData.castle) {
      actionLog.insertAdjacentHTML('afterbegin', castleMarkup);
      return;
    }

    if (actionData.checkmate) {
      actionLog.removeChild(actionLog.firstChild);
      actionLog.insertAdjacentHTML('afterbegin', checkmateMarkup);
      return;
    }

    if (actionData.stalemate) {
      actionLog.insertAdjacentHTML('afterbegin', stalemateMarkup);
      return;
    }

    actionLog.insertAdjacentHTML('afterbegin', moveMarkup);
    if (actionData.capturedPiece)
      actionLog.insertAdjacentHTML('afterbegin', captureMarkup);
    if (actionData.promotePiece)
      actionLog.insertAdjacentHTML('afterbegin', promotionMarkup);
    if (actionData.check) 
      actionLog.insertAdjacentHTML('afterbegin', checkMarkup);
    
  }

  stopGame(handler) {
    board.removeEventListener('click', handler);
  }

  resetView() {
    const gameElements = [board, actionLog, whiteCaptured, blackCaptured];
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => {    
      square.classList.remove('clicked-square');
      square.classList.remove('drop-square');
      const piece = square.querySelector('img');
      if (!piece) return;

      square.removeChild(piece);
    });

    while (actionLog.firstChild) {
      actionLog.removeChild(actionLog.lastChild);
    }

    const whiteCapPieces = whiteCaptured.querySelectorAll('img');
    whiteCapPieces.forEach(piece => whiteCaptured.removeChild(piece));

    const blackCapPieces = blackCaptured.querySelectorAll('img');
    blackCapPieces.forEach(piece => blackCaptured.removeChild(piece));
  }

};

export default new View();
