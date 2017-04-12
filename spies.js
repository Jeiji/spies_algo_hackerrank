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

let memo = [];
let redos = [];
let alreadyBlocked = false;
let blockages = 0;
let successChain = 0;
let newRetry = false;


function spyFree( grid , row , col , points ) {
  let mark = 0;
  //Get To Row
  if ( row > 0 ) {
    // console.log(points);
    for ( o = 0; o < points.length; o++) {
      let coorX = points[o][0], coorY = points[o][1];
      let yDif = row - coorY, xDif = col - coorX;
      // let slope =  ( row - coorY / col - coorX );
      let m = 1;
      while ( grid[row + yDif*m] && grid[row + yDif*m][col + xDif*m] && points[o][1] !== row ) {
        grid[row + yDif*m][col + xDif*m] = '|X|'
        // console.log(`found a slope!( from [${ points[o] }] to [ ${ col } , ${ row } ] )`);
        // console.log(grid);
        memo[row][1].push( [col + xDif*m , row + yDif*m] )
        // console.log('This is memo:',memo);
        m++
      }
    }
  }
  for ( i = row + 1; i < grid.length; i++ ) {
    if ( i != row ) {
      mark++
    }
    //Slash Column
    for ( j = 0; j < grid.length ; j++) {
      if ( j == col ) {
        grid[i][j] = '|||'
        memo[row][1].push( [ j , i] )
      }
      if ( j == col + mark ) {
        grid[i][j] = '|||'
        memo[row][1].push( [ j , i] )
      }
      if ( j == col - mark ) {
        grid[i][j] = '|||'
        memo[row][1].push( [ j , i] )
      }
    }
  }
}

function chooseRandCol( n ){
  let rand = Math.floor(Math.random() * ( n - 0 ) );
  return rand
}

function spyDrop( n , fails ) {
  let coordinates = [];
  if ( !fails ) {
    fails = 0;
  }
  let grid = printGrid( n ),
    rando, tallyBlockedSpaces = 0 , ln1 = "" , ln2 = "";
    ln1 += n;
    let marker = [];
  // Get to a row...
  for (let i = 0; i < n; i++) {
    console.log(`\N\N\N\N\N FROM THE TOP`);
      // Drop a spy...
      /////////// Safety Check ///////////
        for ( j = 0; j < n; j++) {
          if ( alreadyBlocked ) {
            j+=fails;
            alreadyBlocked = false;
          }
          if ( grid[i][j] == "|||" || grid[i][j] == "|X|" || grid[i][j] == "|R|" ) {
            tallyBlockedSpaces += 1;
            console.log(`This is I:${ i } and J: ${ j}`);

            console.log('tallies',tallyBlockedSpaces);
            // tallyBlockedSpaces += 1;
            // console.log(`in tallyBlockedSpaces`, tallyBlockedSpaces);
          }
          else {
            console.log('Found a spot! Placing...');
            grid[i][j] = ' S ';
            successChain += 1;
            if (blockages > 0 && successChain > 2) {
              blockages -= 1;
            }
            memo.push([[ j , i ],[]])
            coordinates.push( [ j , i ] );
            // ln2 += ( ( j + 1) + " " )
            spyFree( grid , i , j , coordinates );
            console.log(`\n`,grid);
            tallyBlockedSpaces = 0;
            break;
          }
        }
        if ( tallyBlockedSpaces == n ) {

          successChain = 0;
          if (successChain < 4) {
            blockages += 1;
          }
          console.log(`Blockages: ${ blockages }`);
          console.log(`successChain: ${ successChain }`);
          if ( blockages >= n ) {
            console.log(`\n\n\n\nTOOOOO MUUUUCH BLOCKAGE Let's try another x...`);
            tallyBlockedSpaces = 0;
            successChain = 0;
            blockages = 0;
            alreadyBlocked = true;
            // points.pop();
            // memo.pop();
            fails += 1;
            return spyDrop( n , fails )
          }
          if ( redos[0] ) {
            // console.log(redos);
            grid[redos[redos.length-1][1]][redos[redos.length-1][0]] = '| |'
          }
          redos.pop();
          // for ( j = 0; j < n; j++) {
          //    grid[i][j] = "|X|"
          // }
          //console.log( `We're all blocked out...\n\n` );
          //console.log(grid);

          //console.log(`\n----------------------------------------------------------------------------------------\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n----------------------------------------------------------------------------------------\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
          console.log('\nRe-do!!!!!!!!!!!!!!!!');
          console.log( 'memo[i-1]',memo[i-1],'\n' );
          for (q = 0; q < memo[i-1][1].length; q++) {
            grid[memo[i-1][1][q][1]][memo[i-1][1][q][0]] = '| |';
            // console.log( memo[i-1][1][q] );
          }
          for (let i = 0; i < memo.length; i++) {
              spyFree( grid , memo[i][0][1] , memo[i][0][0] , coordinates )
          }
          // console.log( memo[i-1] );
          for ( e = i-1; e < n; e++) {
            for ( d = 0; d < n; d++) {
              if ( grid[e][d] == ' S ' ) {
                grid[e][d] = '|R|'
                memo.pop();
                redos.push( [ d , e ] );
                j = d+1;
                console.log(`\n`,grid);
                i--;
                break;
              }
            }
          }
          i--;

        tallyBlockedSpaces = 0;
        }

      ///////////////////////////////////


      // rando = chooseRandCol( n )
      // while ( grid[i][rando] == '|||' || grid[i][rando] == '|X|' ) {
      //   console.log(`Whoops... on row` , i , 'Rando was' , rando);
      //   console.log(grid[i]);
      //   rando = chooseRandCol( n )
      // }
      // grid[i][rando] = ' S '
      // coordinates.push( [ rando , i ] );
      // ln2 += ( ( rando + 1) + " " )
      // spyFree( grid , i , rando , coordinates );
    }
  console.log('\n Got it!');
  for (let i = 0; i < grid.length; i++) {
    console.log(grid[i]);
  }
  for (let i = 0; i < memo.length; i++) {
    ln2 += (memo[i][0][0]+1) + " "
  }
  console.log(fails);
  console.log( ln1 );
  console.log( ln2 );
}

spyDrop( 7 );
