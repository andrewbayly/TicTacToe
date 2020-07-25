var board = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]; 

function start(){ 
  board = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
  playing = true; 
  showBoard(); 
  message(''); 
}

function computerStarts(){ 
  board = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
  playing = true; 
  showBoard(); 
  play(); 
  message(''); 
}

var playing = false ; 

const square = 100; 

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    //console.log("x: " + x + " y: " + y)
  
    var xPos = Math.floor(x / square); 
    var yPos = Math.floor(y / square);
  
    var pos = yPos * 3 + xPos; 
  
    if(!playing)
      return; 
  
    if(board[pos] == 'X' || board[pos] == 'O' )
      return;
      
    board[pos] = 'O'; 
    showBoard(); 
    play();   
}

const canvas = document.querySelector('canvas')
canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

function drawBoard() {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, square*3, square*3); 
  
  ctx.lineWidth = 8;   
  ctx.beginPath();
  ctx.moveTo(0, square);
  ctx.lineTo(square*3, square);
  ctx.moveTo(0, square*2);
  ctx.lineTo(square * 3, square * 2);

  ctx.moveTo(square, 0);
  ctx.lineTo(square, square*3);
  ctx.moveTo(square*2, 0);
  ctx.lineTo(square * 2, square * 3);
  
  ctx.strokeStyle = "black";
  
  ctx.stroke();
 
  for(var i = 0; i < 9; i++){ 
    var token = board[i]; 
    xPos = (i % 3 + 0.5) * square
    yPos = (Math.floor(i / 3) + 0.5) * square
    
    if(token == 'X'){ 
      ctx.beginPath();
      ctx.moveTo(xPos - square * 0.25, yPos - square * 0.25) 
      ctx.lineTo(xPos + square * 0.25, yPos + square * 0.25) 

      ctx.moveTo(xPos - square * 0.25, yPos + square * 0.25) 
      ctx.lineTo(xPos + square * 0.25, yPos - square * 0.25) 
      ctx.stroke();
    }
    if(token == 'O'){
      ctx.beginPath();
      ctx.arc(xPos, yPos, square * 0.25, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
  
 
  
}

function showBoard(){
  drawBoard(); 
}

showBoard(); 

function message(m){ 
  var div = document.getElementById('message'); 
  div.innerHTML = m ; 
}

function play(){ 
  //check board to see if anyone has won.
  //if so, anounce winner
  var w = winner(board); 
  if(w == 'X' || w == 'O') { 
    message('' + w + ' won');
    playing = false; 
    return; 
  }
  else if(w == 'draw') {
    message("it's a draw");
    playing = false; 
    return; 
  } 
  
  count = 0; 
  var NOW = new Date(); 
  //otherwise make a move
  var move = score('X', board);   
  
  var elapsed = new Date() - NOW; 
  console.log('elapsed: ' + elapsed); 
  console.log('count = ' + count ); 
  
  console.log('score: ' + move.score); 
  board[move.move] = 'X'; 
  showBoard(); 

  var w = winner(board); 
  if(w == 'X' || w == 'O') { 
    message('' + w + ' won');
    playing = false; 
    return; 
  }
  else if(w == 'draw') {
    message("it's a draw");
    playing = false; 
    return; 
  } 
} 

/**
 returns the score of this board's position given that it's player's turn to play
 also return the move that we would play
 return value { move : move, score: score }
**/

function score(player, board){ 
  count++; 

  var ret = {move:null, score:null}; 
  
  //has anyone won - if so return the score
  var w = winner(board); 
  
  if(w == 'X'){  
    ret.score = 10; 
    return ret ; 
  }
  else if(w == 'O'){ 
    ret.score = -10; 
    return ret ; 
  }
  else if(w == 'draw'){ 
    ret.score = 0; 
    return ret ; 
  }
  
  //gather all possible moves in an array
  var moves = [ ];
  for(var i = 0; i < 9; i++){ 
    if(board[i] != 'X' && board[i] != 'O'){ 
      moves.push({move: i, score:null})
    }
  }
  
  //for each one, calculate the score (by calling score)
  for(var i = 0; i < moves.length; i++){ 
    //var move = moves[i]; 
    var oldValue = board[moves[i].move]; 
    board[moves[i].move] = player; 
    moves[i].score = score(player == 'X' ? 'O' : 'X', board).score; 
    board[moves[i].move] = oldValue; 
  }  
  
  //console.log(moves); 
  
  //pick the max/min-imum scored move
  var maxI = 0; 
  for(var i = 0; i < moves.length; i++){ 
    if((player == 'X' && moves[maxI].score < moves[i].score) || (player == 'O' && moves[maxI].score > moves[i].score)){ 
      maxI = i; 
    }
  }
  
  //console.log('return ...'); 
  //console.log(moves[maxI]); 
  
  //return the score and the move.
  return moves[maxI]; 
  
}


function winner(board){ 
  if(win('O', board))
    return 'O';
  else if(win('X', board))
    return 'X';
  else if(complete(board))
    return 'draw'
  else return null; 
  
  function win(player, board){ 
    var triads = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]; 
    
    for(var i = 0; i < triads.length; i++){ 
      var t = triads[i];
      if(board[t[0]] == player && board[t[1]] == player && board[t[2]] == player)
        return true; 
    }
    return false; 
  }  
  
  function complete(board){ 
    for(var i = 0; i < 9; i++){ 
      if(board[i] != 'X' && board[i] != 'O')
        return false; 
    }
    return true; 
  }
}