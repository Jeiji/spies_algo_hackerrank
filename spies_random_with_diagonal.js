function printGrid( n ) {
let grid = [];
let row = [];
// Shifting Rows
for ( i = 0; i < n; i++ ) {
//Printing Columns
for ( j = 0; j < n; j++ ) {
    row.push('| |');
}
grid.push( row );
row = [];
}
return grid
}

let points = [];

function spyFree( grid , row , col , points ) {
let mark = 0;
if ( row > 0 ) {
  // console.log(points);
  for ( o = 0; o < points.length; o++) {
    let coorX = points[o][0], coorY = points[o][1];
    let yDif = row - coorY, xDif = col - coorX;
    // let slope =  ( row - coorY / col - coorX );
    let m = 1;
    while ( grid[row + yDif*m] && grid[row + yDif*m][col + xDif*m] && points[o][1] !== row ) {
      grid[row + yDif*m][col + xDif*m] = '|X|'
      console.log(`found a slope!( from [${ points[o] }] to [ ${ col } , ${ row } ] )`);
      // console.log(grid);
      // memo[row][1].push( [col + xDif*m , row + yDif*m] )
      // console.log('This is memo:',memo);
      m++
    }
  }
  console.log(`Done with slopes for this one...`);
  // console.log(grid);
}

//Get To Row
for ( i = row + 1; i < grid.length; i++ ) {
if ( i != row ) {
  mark++
}
//Slash Column
for ( j = 0; j < grid.length ; j++) {
  if ( j == col ) {
    grid[i][j] = '|||'
  }
  if ( j == col + mark ) {
    grid[i][j] = '|||'
  }
  if ( j == col - mark ) {
    grid[i][j] = '|||'
  }
}
}
}

function chooseRandCol( n ){
let rand = Math.floor(Math.random() * ( n - 0 ) );
return rand
}

function spyDrop( n , fails ) {
if ( !fails ) {
fails = 0;
}
let grid = printGrid( n ),
rando, tallyBlockedSpaces = 0 , ln1 = "" , ln2 = "";
ln1 += n;
// Get to a row...
for (let i = 0; i < n; i++) {
//console.log(`\n`,grid);
  // Drop a spy...
  rando = chooseRandCol( n )

/////////// Safety Check ///////////
  for ( j = 0; j < n; j++) {
    if ( grid[i][j] == "|||" || grid[i][j] == "|X|" ) {
      tallyBlockedSpaces += 1;
      console.log(`in tallyBlockedSpaces`, tallyBlockedSpaces);
    }
  }
  if ( tallyBlockedSpaces == n ) {
    for ( j = 0; j < n; j++) {
       grid[i][j] = "|X|"
    }
    console.log( `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nWe're all blocked out...\n\n STARTING OVER......................................................................................................................\n\n\n\n******************************************************************************************************************************************************************************************************\n************************************************************************************************************************************\n************************************************************************************************************************************\n************************************************************************************************************************************\n` );
    // console.log(grid);
    fails += 1;
    //console.log(`\n----------------------------------------------------------------------------------------\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n----------------------------------------------------------------------------------------\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    points = [];
    return spyDrop( n , fails );
  }
  tallyBlockedSpaces = 0;


///////////////////////////////////


  while ( grid[i][rando] == '|||' || grid[i][rando] == "|X|" ) {
    //console.log(`Whoops... on row` , i , 'Rando was' , rando);
    //console.log(grid[i]);
    rando = chooseRandCol( n )
  }
  grid[i][rando] = ' S ';
  console.log(`\n\n\n\n\n PLACED A SPY!!!! ( [ ${ j } , ${ i } ] )`);
  points.push( [ rando , i ] );
  ln2 += ( ( rando + 1) + " " )
  spyFree( grid , i , rando , points );
  // console.log(grid);
}
console.log('\n Got it!');
for (let i = 0; i < grid.length; i++) {
console.log(grid[i]);
}
console.log(`\n\n\nFailures before success: ${ fails }`);
console.log( ln1,'\n',ln2 );
}

spyDrop( 999 );
