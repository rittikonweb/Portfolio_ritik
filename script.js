/**
 * Interactive Chess Game
 * A complete chess implementation with all standard rules
 */

// Chess piece Unicode symbols
const PIECE_SYMBOLS = {
    white: {
        king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙'
    },
    black: {
        king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟'
    }
};

// Initial board setup
const INITIAL_BOARD = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

/**
 * Chess Piece class - represents individual chess pieces
 */
class ChessPiece {
    constructor(type, color, row, col) {
        this.type = type.toLowerCase();
        this.color = color;
        this.row = row;
        this.col = col;
        this.hasMoved = false;
    }

    /**
     * Get the Unicode symbol for this piece
     */
    getSymbol() {
        return PIECE_SYMBOLS[this.color][this.type];
    }

    /**
     * Check if a position is within board bounds
     */
    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    /**
     * Get all possible moves for this piece (to be overridden by subclasses)
     */
    getPossibleMoves(board) {
        return [];
    }

    /**
     * Move the piece to a new position
     */
    moveTo(row, col) {
        this.row = row;
        this.col = col;
        this.hasMoved = true;
    }

    /**
     * Create a copy of this piece
     */
    copy() {
        const piece = new ChessPiece(this.type, this.color, this.row, this.col);
        piece.hasMoved = this.hasMoved;
        return piece;
    }
}

/**
 * Pawn piece implementation
 */
class Pawn extends ChessPiece {
    getPossibleMoves(board) {
        const moves = [];
        const direction = this.color === 'white' ? -1 : 1;
        const startRow = this.color === 'white' ? 6 : 1;

        // Forward move
        if (this.isValidPosition(this.row + direction, this.col)) {
            if (!board.getPiece(this.row + direction, this.col)) {
                moves.push({row: this.row + direction, col: this.col});
                
                // Double move from starting position
                if (this.row === startRow && !board.getPiece(this.row + 2 * direction, this.col)) {
                    moves.push({row: this.row + 2 * direction, col: this.col});
                }
            }
        }

        // Capture moves
        for (const colOffset of [-1, 1]) {
            const newRow = this.row + direction;
            const newCol = this.col + colOffset;
            
            if (this.isValidPosition(newRow, newCol)) {
                const targetPiece = board.getPiece(newRow, newCol);
                if (targetPiece && targetPiece.color !== this.color) {
                    moves.push({row: newRow, col: newCol});
                }
            }
        }

        // En passant
        if (board.enPassantTarget) {
            const enPassantRow = board.enPassantTarget.row;
            const enPassantCol = board.enPassantTarget.col;
            
            if (this.row === enPassantRow && Math.abs(this.col - enPassantCol) === 1) {
                moves.push({row: this.row + direction, col: enPassantCol});
            }
        }

        return moves;
    }
}

/**
 * Rook piece implementation
 */
class Rook extends ChessPiece {
    getPossibleMoves(board) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        for (const [rowDir, colDir] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = this.row + i * rowDir;
                const newCol = this.col + i * colDir;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                
                const targetPiece = board.getPiece(newRow, newCol);
                if (!targetPiece) {
                    moves.push({row: newRow, col: newCol});
                } else {
                    if (targetPiece.color !== this.color) {
                        moves.push({row: newRow, col: newCol});
                    }
                    break;
                }
            }
        }

        return moves;
    }
}

/**
 * Bishop piece implementation
 */
class Bishop extends ChessPiece {
    getPossibleMoves(board) {
        const moves = [];
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

        for (const [rowDir, colDir] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = this.row + i * rowDir;
                const newCol = this.col + i * colDir;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                
                const targetPiece = board.getPiece(newRow, newCol);
                if (!targetPiece) {
                    moves.push({row: newRow, col: newCol});
                } else {
                    if (targetPiece.color !== this.color) {
                        moves.push({row: newRow, col: newCol});
                    }
                    break;
                }
            }
        }

        return moves;
    }
}

/**
 * Knight piece implementation
 */
class Knight extends ChessPiece {
    getPossibleMoves(board) {
        const moves = [];
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (const [rowOffset, colOffset] of knightMoves) {
            const newRow = this.row + rowOffset;
            const newCol = this.col + colOffset;
            
            if (this.isValidPosition(newRow, newCol)) {
                const targetPiece = board.getPiece(newRow, newCol);
                if (!targetPiece || targetPiece.color !== this.color) {
                    moves.push({row: newRow, col: newCol});
                }
            }
        }

        return moves;
    }
}

/**
 * Queen piece implementation
 */
class Queen extends ChessPiece {
    getPossibleMoves(board) {
        const moves = [];
        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];

        for (const [rowDir, colDir] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = this.row + i * rowDir;
                const newCol = this.col + i * colDir;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                
                const targetPiece = board.getPiece(newRow, newCol);
                if (!targetPiece) {
                    moves.push({row: newRow, col: newCol});
                } else {
                    if (targetPiece.color !== this.color) {
                        moves.push({row: newRow, col: newCol});
                    }
                    break;
                }
            }
        }

        return moves;
    }
}

/**
 * King piece implementation
 */
class King extends ChessPiece {
    getPossibleMoves(board) {
        const moves = [];
        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];

        // Normal king moves
        for (const [rowDir, colDir] of directions) {
            const newRow = this.row + rowDir;
            const newCol = this.col + colDir;
            
            if (this.isValidPosition(newRow, newCol)) {
                const targetPiece = board.getPiece(newRow, newCol);
                if (!targetPiece || targetPiece.color !== this.color) {
                    moves.push({row: newRow, col: newCol});
                }
            }
        }

        // Castling
        if (!this.hasMoved && !board.isInCheck(this.color)) {
            // Kingside castling
            const kingsideRook = board.getPiece(this.row, 7);
            if (kingsideRook && kingsideRook.type === 'rook' && !kingsideRook.hasMoved) {
                if (!board.getPiece(this.row, 5) && !board.getPiece(this.row, 6)) {
                    if (!board.isSquareAttacked(this.row, 5, this.color === 'white' ? 'black' : 'white') &&
                        !board.isSquareAttacked(this.row, 6, this.color === 'white' ? 'black' : 'white')) {
                        moves.push({row: this.row, col: 6, castling: 'kingside'});
                    }
                }
            }
            
            // Queenside castling
            const queensideRook = board.getPiece(this.row, 0);
            if (queensideRook && queensideRook.type === 'rook' && !queensideRook.hasMoved) {
                if (!board.getPiece(this.row, 1) && !board.getPiece(this.row, 2) && !board.getPiece(this.row, 3)) {
                    if (!board.isSquareAttacked(this.row, 2, this.color === 'white' ? 'black' : 'white') &&
                        !board.isSquareAttacked(this.row, 3, this.color === 'white' ? 'black' : 'white')) {
                        moves.push({row: this.row, col: 2, castling: 'queenside'});
                    }
                }
            }
        }

        return moves;
    }
}

/**
 * Chess Board class - manages the game board and pieces
 */
class ChessBoard {
    constructor() {
        this.board = Array(8).fill().map(() => Array(8).fill(null));
        this.enPassantTarget = null;
        this.initializeBoard();
    }

    /**
     * Initialize the board with starting pieces
     */
    initializeBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const pieceChar = INITIAL_BOARD[row][col];
                if (pieceChar) {
                    const color = pieceChar === pieceChar.toUpperCase() ? 'white' : 'black';
                    const type = pieceChar.toLowerCase();
                    
                    this.board[row][col] = this.createPiece(type, color, row, col);
                }
            }
        }
    }

    /**
     * Create a piece instance based on type
     */
    createPiece(type, color, row, col) {
        switch (type) {
            case 'p': return new Pawn(type, color, row, col);
            case 'r': return new Rook(type, color, row, col);
            case 'n': return new Knight(type, color, row, col);
            case 'b': return new Bishop(type, color, row, col);
            case 'q': return new Queen(type, color, row, col);
            case 'k': return new King(type, color, row, col);
            default: return null;
        }
    }

    /**
     * Get piece at specific position
     */
    getPiece(row, col) {
        return this.board[row][col];
    }

    /**
     * Set piece at specific position
     */
    setPiece(row, col, piece) {
        this.board[row][col] = piece;
        if (piece) {
            piece.row = row;
            piece.col = col;
        }
    }

    /**
     * Find the king of a specific color
     */
    findKing(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === 'king' && piece.color === color) {
                    return piece;
                }
            }
        }
        return null;
    }

    /**
     * Check if a square is attacked by the opponent
     */
    isSquareAttacked(row, col, attackerColor) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece && piece.color === attackerColor) {
                    const moves = piece.getPossibleMoves(this);
                    if (moves.some(move => move.row === row && move.col === col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Check if a player is in check
     */
    isInCheck(color) {
        const king = this.findKing(color);
        if (!king) return false;
        
        const opponentColor = color === 'white' ? 'black' : 'white';
        return this.isSquareAttacked(king.row, king.col, opponentColor);
    }

    /**
     * Check if a move would leave the king in check
     */
    wouldBeInCheck(fromRow, fromCol, toRow, toCol, color) {
        // Create a copy of the board
        const originalPiece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        // Make the move temporarily
        this.board[toRow][toCol] = originalPiece;
        this.board[fromRow][fromCol] = null;
        
        // Check if king is in check
        const inCheck = this.isInCheck(color);
        
        // Restore the board
        this.board[fromRow][fromCol] = originalPiece;
        this.board[toRow][toCol] = capturedPiece;
        
        return inCheck;
    }

    /**
     * Get all legal moves for a piece
     */
    getLegalMoves(piece) {
        const possibleMoves = piece.getPossibleMoves(this);
        return possibleMoves.filter(move => {
            return !this.wouldBeInCheck(piece.row, piece.col, move.row, move.col, piece.color);
        });
    }

    /**
     * Check if the game is in checkmate
     */
    isCheckmate(color) {
        if (!this.isInCheck(color)) return false;
        
        // Check if any piece can make a legal move
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const legalMoves = this.getLegalMoves(piece);
                    if (legalMoves.length > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Check if the game is in stalemate
     */
    isStalemate(color) {
        if (this.isInCheck(color)) return false;
        
        // Check if any piece can make a legal move
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const legalMoves = this.getLegalMoves(piece);
                    if (legalMoves.length > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Make a move on the board
     */
    makeMove(fromRow, fromCol, toRow, toCol, promotionPiece = null) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        if (!piece) return null;

        const move = {
            from: {row: fromRow, col: fromCol},
            to: {row: toRow, col: toCol},
            piece: piece,
            captured: capturedPiece,
            castling: null,
            enPassant: false,
            promotion: promotionPiece
        };

        // Handle castling
        if (piece.type === 'king' && Math.abs(toCol - fromCol) === 2) {
            move.castling = toCol > fromCol ? 'kingside' : 'queenside';
            
            // Move the rook
            const rookFromCol = toCol > fromCol ? 7 : 0;
            const rookToCol = toCol > fromCol ? 5 : 3;
            const rook = this.board[fromRow][rookFromCol];
            
            this.board[fromRow][rookToCol] = rook;
            this.board[fromRow][rookFromCol] = null;
            rook.moveTo(fromRow, rookToCol);
        }

        // Handle en passant
        if (piece.type === 'pawn' && this.enPassantTarget && 
            toRow === this.enPassantTarget.row + (piece.color === 'white' ? -1 : 1) &&
            toCol === this.enPassantTarget.col) {
            move.enPassant = true;
            move.captured = this.board[this.enPassantTarget.row][this.enPassantTarget.col];
            this.board[this.enPassantTarget.row][this.enPassantTarget.col] = null;
        }

        // Update en passant target
        if (piece.type === 'pawn' && Math.abs(toRow - fromRow) === 2) {
            this.enPassantTarget = {row: toRow, col: toCol};
        } else {
            this.enPassantTarget = null;
        }

        // Handle pawn promotion
        if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
            if (promotionPiece) {
                const promotedPiece = this.createPiece(promotionPiece, piece.color, toRow, toCol);
                promotedPiece.hasMoved = true;
                this.board[toRow][toCol] = promotedPiece;
            }
        } else {
            // Normal move
            this.board[toRow][toCol] = piece;
            piece.moveTo(toRow, toCol);
        }

        this.board[fromRow][fromCol] = null;
        
        return move;
    }
}

/**
 * Main Chess Game class
 */
class ChessGame {
    constructor() {
        this.board = new ChessBoard();
        this.currentPlayer = 'white';
        this.gameOver = false;
        this.selectedSquare = null;
        this.moveHistory = [];
        this.capturedPieces = {white: [], black: []};
        
        this.initializeUI();
        this.bindEvents();
    }

    /**
     * Initialize the user interface
     */
    initializeUI() {
        const chessboard = document.getElementById('chessboard');
        chessboard.innerHTML = '';

        // Create squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                chessboard.appendChild(square);
            }
        }

        this.updateBoard();
        this.updateUI();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        document.getElementById('chessboard').addEventListener('click', this.handleSquareClick.bind(this));
        document.getElementById('restart-btn').addEventListener('click', this.restart.bind(this));
        
        // Pawn promotion modal
        document.querySelectorAll('.promotion-piece').forEach(piece => {
            piece.addEventListener('click', this.handlePromotion.bind(this));
        });
    }

    /**
     * Handle square click events
     */
    handleSquareClick(event) {
        if (this.gameOver) return;

        const square = event.target.closest('.square');
        if (!square) return;

        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (this.selectedSquare) {
            // Try to make a move
            if (this.selectedSquare.row === row && this.selectedSquare.col === col) {
                // Deselect
                this.selectedSquare = null;
                this.clearHighlights();
            } else {
                this.tryMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
            }
        } else {
            // Select a piece
            this.selectSquare(row, col);
        }
    }

    /**
     * Select a square and highlight possible moves
     */
    selectSquare(row, col) {
        const piece = this.board.getPiece(row, col);
        
        if (piece && piece.color === this.currentPlayer) {
            this.selectedSquare = {row, col};
            this.clearHighlights();
            
            // Highlight selected square
            const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            square.classList.add('selected');
            
            // Highlight possible moves
            const legalMoves = this.board.getLegalMoves(piece);
            legalMoves.forEach(move => {
                const moveSquare = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
                const targetPiece = this.board.getPiece(move.row, move.col);
                
                if (targetPiece) {
                    moveSquare.classList.add('capture-move');
                } else {
                    moveSquare.classList.add('valid-move');
                }
            });
        }
    }

    /**
     * Clear all highlights
     */
    clearHighlights() {
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('selected', 'valid-move', 'capture-move', 'highlighted');
        });
    }

    /**
     * Try to make a move
     */
    tryMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board.getPiece(fromRow, fromCol);
        if (!piece || piece.color !== this.currentPlayer) {
            this.selectedSquare = null;
            this.clearHighlights();
            return;
        }

        const legalMoves = this.board.getLegalMoves(piece);
        const validMove = legalMoves.find(move => move.row === toRow && move.col === toCol);

        if (validMove) {
            // Check for pawn promotion
            if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
                this.showPromotionModal(fromRow, fromCol, toRow, toCol);
                return;
            }

            this.makeMove(fromRow, fromCol, toRow, toCol);
        }

        this.selectedSquare = null;
        this.clearHighlights();
    }

    /**
     * Make a move and update the game state
     */
    makeMove(fromRow, fromCol, toRow, toCol, promotionPiece = null) {
        const move = this.board.makeMove(fromRow, fromCol, toRow, toCol, promotionPiece);
        
        if (move) {
            // Add captured piece to list
            if (move.captured) {
                this.capturedPieces[move.captured.color].push(move.captured);
            }

            // Add move to history
            this.moveHistory.push(move);
            
            // Switch players
            this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
            
            // Update UI
            this.updateBoard();
            this.updateUI();
            this.updateMoveHistory();
            this.updateCapturedPieces();
            
            // Check game state
            this.checkGameState();
        }
    }

    /**
     * Show pawn promotion modal
     */
    showPromotionModal(fromRow, fromCol, toRow, toCol) {
        const modal = document.getElementById('promotion-modal');
        const pieces = modal.querySelectorAll('.promotion-piece');
        
        // Set correct piece symbols for current player
        pieces.forEach(pieceElement => {
            const pieceType = pieceElement.dataset.piece;
            pieceElement.textContent = PIECE_SYMBOLS[this.currentPlayer][pieceType];
        });
        
        modal.style.display = 'block';
        
        // Store move information for later use
        this.pendingPromotion = {fromRow, fromCol, toRow, toCol};
    }

    /**
     * Handle pawn promotion selection
     */
    handlePromotion(event) {
        const pieceType = event.target.dataset.piece;
        const modal = document.getElementById('promotion-modal');
        
        modal.style.display = 'none';
        
        if (this.pendingPromotion) {
            const {fromRow, fromCol, toRow, toCol} = this.pendingPromotion;
            this.makeMove(fromRow, fromCol, toRow, toCol, pieceType);
            this.pendingPromotion = null;
        }
    }

    /**
     * Update the board display
     */
    updateBoard() {
        const squares = document.querySelectorAll('.square');
        
        squares.forEach(square => {
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            const piece = this.board.getPiece(row, col);
            
            square.innerHTML = '';
            square.classList.remove('check');
            
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.className = 'piece';
                pieceElement.textContent = piece.getSymbol();
                square.appendChild(pieceElement);
            }
        });

        // Highlight king if in check
        if (this.board.isInCheck(this.currentPlayer)) {
            const king = this.board.findKing(this.currentPlayer);
            if (king) {
                const kingSquare = document.querySelector(`[data-row="${king.row}"][data-col="${king.col}"]`);
                kingSquare.classList.add('check');
            }
        }
    }

    /**
     * Update the UI elements
     */
    updateUI() {
        const currentPlayerElement = document.getElementById('current-player');
        currentPlayerElement.textContent = this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1);
        
        const gameStatus = document.getElementById('game-status');
        gameStatus.className = 'game-status';
        
        if (this.gameOver) {
            if (this.board.isCheckmate(this.currentPlayer)) {
                gameStatus.textContent = `Checkmate! ${this.currentPlayer === 'white' ? 'Black' : 'White'} wins!`;
                gameStatus.classList.add('checkmate');
            } else if (this.board.isStalemate(this.currentPlayer)) {
                gameStatus.textContent = 'Stalemate! Game is a draw.';
                gameStatus.classList.add('stalemate');
            }
        } else if (this.board.isInCheck(this.currentPlayer)) {
            gameStatus.textContent = `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)} is in check!`;
            gameStatus.classList.add('check');
        } else {
            gameStatus.textContent = '';
        }
    }

    /**
     * Update move history display
     */
    updateMoveHistory() {
        const moveList = document.getElementById('move-list');
        moveList.innerHTML = '';
        
        for (let i = 0; i < this.moveHistory.length; i += 2) {
            const moveNumber = Math.floor(i / 2) + 1;
            const whiteMove = this.moveHistory[i];
            const blackMove = this.moveHistory[i + 1];
            
            // Move number
            const numberElement = document.createElement('div');
            numberElement.className = 'move-number';
            numberElement.textContent = `${moveNumber}.`;
            moveList.appendChild(numberElement);
            
            // White move
            const whiteMoveElement = document.createElement('div');
            whiteMoveElement.className = 'move-item';
            whiteMoveElement.textContent = this.moveToAlgebraic(whiteMove);
            moveList.appendChild(whiteMoveElement);
            
            // Black move
            const blackMoveElement = document.createElement('div');
            blackMoveElement.className = 'move-item';
            blackMoveElement.textContent = blackMove ? this.moveToAlgebraic(blackMove) : '';
            moveList.appendChild(blackMoveElement);
        }
        
        // Scroll to bottom
        moveList.scrollTop = moveList.scrollHeight;
    }

    /**
     * Convert a move to algebraic notation
     */
    moveToAlgebraic(move) {
        if (!move) return '';
        
        let notation = '';
        
        // Castling
        if (move.castling === 'kingside') {
            return 'O-O';
        } else if (move.castling === 'queenside') {
            return 'O-O-O';
        }
        
        // Piece symbol (except for pawns)
        if (move.piece.type !== 'pawn') {
            notation += move.piece.type.toUpperCase();
        }
        
        // Capture
        if (move.captured) {
            if (move.piece.type === 'pawn') {
                notation += String.fromCharCode(97 + move.from.col);
            }
            notation += 'x';
        }
        
        // Destination square
        notation += String.fromCharCode(97 + move.to.col) + (8 - move.to.row);
        
        // Promotion
        if (move.promotion) {
            notation += '=' + move.promotion.toUpperCase();
        }
        
        // Check/checkmate indicators would go here
        // (simplified for this implementation)
        
        return notation;
    }

    /**
     * Update captured pieces display
     */
    updateCapturedPieces() {
        const whiteContainer = document.getElementById('captured-white');
        const blackContainer = document.getElementById('captured-black');
        
        whiteContainer.innerHTML = '';
        blackContainer.innerHTML = '';
        
        this.capturedPieces.white.forEach(piece => {
            const pieceElement = document.createElement('span');
            pieceElement.className = 'captured-piece';
            pieceElement.textContent = piece.getSymbol();
            whiteContainer.appendChild(pieceElement);
        });
        
        this.capturedPieces.black.forEach(piece => {
            const pieceElement = document.createElement('span');
            pieceElement.className = 'captured-piece';
            pieceElement.textContent = piece.getSymbol();
            blackContainer.appendChild(pieceElement);
        });
    }

    /**
     * Check the current game state
     */
    checkGameState() {
        if (this.board.isCheckmate(this.currentPlayer)) {
            this.gameOver = true;
        } else if (this.board.isStalemate(this.currentPlayer)) {
            this.gameOver = true;
        }
    }

    /**
     * Restart the game
     */
    restart() {
        this.board = new ChessBoard();
        this.currentPlayer = 'white';
        this.gameOver = false;
        this.selectedSquare = null;
        this.moveHistory = [];
        this.capturedPieces = {white: [], black: []};
        this.pendingPromotion = null;
        
        // Hide promotion modal if open
        document.getElementById('promotion-modal').style.display = 'none';
        
        this.updateBoard();
        this.updateUI();
        this.updateMoveHistory();
        this.updateCapturedPieces();
        this.clearHighlights();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
});