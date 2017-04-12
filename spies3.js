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


function spyFree( grid , row , col ) {
let mark = 0;
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
    if ( grid[i][j] == "|||" ) {
      tallyBlockedSpaces += 1;
      //console.log(`in tallyBlockedSpaces`, tallyBlockedSpaces);
    }
  }
  if ( tallyBlockedSpaces == n ) {
    for ( j = 0; j < n; j++) {
       grid[i][j] = "|X|"
    }
    //console.log( `We're all blocked out...\n\n` );
    //console.log(grid);
    fails += 1;
    //console.log(`\n----------------------------------------------------------------------------------------\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n----------------------------------------------------------------------------------------\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    return spyDrop( n , fails );
  }
  tallyBlockedSpaces = 0;


///////////////////////////////////


  while ( grid[i][rando] == '|||' ) {
    //console.log(`Whoops... on row` , i , 'Rando was' , rando);
    //console.log(grid[i]);
    rando = chooseRandCol( n )
  }
  grid[i][rando] = ' S '
  ln2 += ( ( rando + 1) + " " )
  spyFree( grid , i , rando );
}
console.log('\n Got it!');
for (let i = 0; i < grid.length; i++) {
console.log(grid[i]);
}
// console.log(fails);
console.log( ln1,'\n',ln2 );
}

spyDrop( 9 );
