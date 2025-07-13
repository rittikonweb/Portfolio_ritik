# Interactive Chess Game

A fully functional, responsive, two-player chess game built with HTML, CSS, and JavaScript. This implementation includes all standard chess rules and provides a modern, intuitive user interface.

## Features

### Core Gameplay
- **Complete Chess Rules**: All standard chess rules including legal moves, castling, en passant, pawn promotion, and check/checkmate detection
- **Interactive Interface**: Click-to-move functionality with visual feedback
- **Move Validation**: Ensures only legal moves are allowed
- **Turn-Based Play**: Clear indication of whose turn it is
- **Game State Detection**: Automatic detection of check, checkmate, and stalemate

### User Interface
- **Modern Design**: Clean, responsive layout with gradient backgrounds and smooth animations
- **Responsive Layout**: Optimized for both desktop and mobile devices
- **Visual Feedback**: Highlighted squares show selected pieces and possible moves
- **Move History**: Complete move history displayed in algebraic notation
- **Captured Pieces**: Visual display of captured pieces for both players
- **Game Status**: Clear indication of game state (check, checkmate, stalemate)

### Special Features
- **Pawn Promotion**: Interactive modal for selecting promotion piece
- **Castling**: Both kingside and queenside castling implemented
- **En Passant**: Proper en passant capture handling
- **Restart Game**: Easy game reset functionality
- **Algebraic Notation**: Standard chess notation for move history

## How to Play

1. **Starting the Game**: Open `index.html` in your web browser
2. **Making Moves**: Click on a piece to select it, then click on a destination square
3. **Visual Cues**: 
   - Selected piece is highlighted in green
   - Valid moves are shown with green circles
   - Capture moves are highlighted with red borders
   - King in check is highlighted with a blinking red background
4. **Pawn Promotion**: When a pawn reaches the opposite end, a modal will appear to select the promotion piece
5. **Castling**: Click on the king and then the target square (two squares away) to castle
6. **Game End**: The game automatically detects checkmate and stalemate conditions
7. **Restart**: Click the "Restart Game" button to start a new game

## Implementation Details

### Architecture
The game is built using a modular class-based approach:

- **ChessPiece**: Base class for all chess pieces with common functionality
- **Individual Piece Classes**: Pawn, Rook, Bishop, Knight, Queen, King - each with specific movement logic
- **ChessBoard**: Manages the game board, piece positions, and game state
- **ChessGame**: Main game controller handling UI interactions and game flow

### Key Features Implementation

#### Move Validation
- Each piece implements its own `getPossibleMoves()` method
- Legal moves are filtered to prevent moves that would leave the king in check
- Special moves (castling, en passant) are handled with proper validation

#### Check Detection
- `isSquareAttacked()` method checks if a square is under attack
- `isInCheck()` determines if a player's king is in check
- Visual indicators show when a king is in check

#### Game State Management
- Automatic detection of checkmate and stalemate
- Turn management with visual indicators
- Move history tracking with algebraic notation

#### Responsive Design
- CSS Grid for the chessboard layout
- Flexible sidebar that adapts to screen size
- Mobile-optimized controls and piece sizing

## File Structure

```
chess-game/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # Game logic and piece movement
└── README.md          # This documentation
```

## Technical Specifications

- **No External Dependencies**: Pure HTML, CSS, and JavaScript
- **Browser Compatibility**: Works in all modern browsers
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Performance**: Efficient move calculation and validation
- **Code Quality**: Well-commented, modular, and maintainable code

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Notes

### Chess Rules Implemented
- ✅ Basic piece movement (all pieces)
- ✅ Castling (kingside and queenside)
- ✅ En passant capture
- ✅ Pawn promotion
- ✅ Check detection
- ✅ Checkmate detection
- ✅ Stalemate detection
- ✅ Move validation (no self-check)

### UI Features
- ✅ Drag-and-drop alternative (click-to-move)
- ✅ Move highlighting
- ✅ Capture highlighting
- ✅ Turn indication
- ✅ Move history in algebraic notation
- ✅ Captured pieces display
- ✅ Responsive design
- ✅ Modern styling with animations

## Future Enhancements

Potential improvements that could be added:
- Online multiplayer support
- AI opponent
- Move timer
- Game saving/loading
- PGN export
- Sound effects
- Themes and customization

## License

This project is open source and available under the MIT License.