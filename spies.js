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
let retry = 0;


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
        if ( ( row + yDif*m ) > row ) {
          grid[row + yDif*m][col + xDif*m] = '|X|'
        }

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
    let redoChk = 0;
    let placeSpyHere = 0;
    let trapped = false;
  // Get to a row...
  for (let i = 0; i < n; i++) {
    console.log(`\N\N\N\N\N FROM THE TOP`);
    tallyBlockedSpaces = 0;
      // Drop a spy...
      /////////// Safety Check ///////////
        for ( j = 0; j < n; j++) {
          console.log(`\nThis is I:${ i } and J: ${ j }`);
          if ( alreadyBlocked ) {
            j+=fails;
            alreadyBlocked = false;
          }
          if ( trapped ) {
            j = trapped
            trapped = false;
          }
          if ( grid[i][j] == "|||" || grid[i][j] == "|X|" || grid[i][j] == "|R|" || grid[i][j] == "|T|" ) {
            if ( grid[i][j] == "|R|" ) {
              redoChk += 1;
              console.log(`Logging a redo...`);
            }
            tallyBlockedSpaces += 1;
            console.log(`This is I:${ i } and J: ${ j }`);

            console.log('tallies',tallyBlockedSpaces);
            // tallyBlockedSpaces += 1;
            // console.log(`in tallyBlockedSpaces`, tallyBlockedSpaces);
          }else{
            placeSpyHere = j;
            console.log(`\n\n\n J IS: ${ j }`);
            break;
          }
        }


        if ( tallyBlockedSpaces == n ) {
          console.log('\nRe-do!!!!!!!!!!!!!!!!');
          successChain = 0;
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
            console.log( `clearing [ ${redos[redos.length-1][1]  } , ${ redos[redos.length-1][0] } ] ( ${ grid[redos[redos.length-1][1]][redos[redos.length-1][0]] } )` );
            grid[redos[redos.length-1][1]][redos[redos.length-1][0]] = '| |'
          }
          redos.pop();
          // for ( j = 0; j < n; j++) {
          //    grid[i][j] = "|X|"
          // }
          //console.log( `We're all blocked out...\n\n` );
          //console.log(grid);

          //console.log(`\n----------------------------------------------------------------------------------------\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n----------------------------------------------------------------------------------------\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);

          console.log(`retries: ${retry}`);
          retry+=1

          // console.log( 'memo',memo,'\n' );
          // console.log( 'memo[i-1]',memo[i-1],'\n' );
          // console.log( 'i-1',i-1,'\n' );
          for (q = 0; q < memo[i-1][1].length; q++) {
            grid[memo[i-1][1][q][1]][memo[i-1][1][q][0]] = '| |';
            // console.log( memo[i-1][1][q] );
          }
          memo.pop();
          for (let i = 0; i < memo.length; i++) {
              spyFree( grid , memo[i][0][1] , memo[i][0][0] , coordinates )
          }
          // console.log( memo[i-1] );
          for ( e = i-1; e < n; e++) {
            for ( d = 0; d < n; d++) {
              if ( grid[e][d] == ' S ' ) {
                grid[e][d] = '|R|'
                redos.push( [ d , e ] );
                console.log(`\n`,grid);
              }
            }
          }
          i-=2;
          continue;
        }
        if ( ( ( tallyBlockedSpaces >= (n - 2) ) && redoChk > 0 ) ){
        console.log(`\n\n\n\n TRAPPED! \n\n\n\n`);
        console.log(`Success Chain: ${successChain}`);
        console.log(`retries: ${retry}`);
        retry -= 1;
          if ( redos[0] ) {
            grid[redos[redos.length-1][1]][redos[redos.length-1][0]] = '| |'
          }
          redos.pop();
          for (q = 0; q < memo[i-1][1].length; q++) {
            grid[memo[i-1][1][q][1]][memo[i-1][1][q][0]] = '| |';
            // console.log( `clearing [ ${memo[i-1][1][q][1]  } , ${ memo[i-1][1][q][0] } ]` );
            // console.log(q);
          }
          memo.pop();
          for (let i = 0; i < memo.length; i++) {
              spyFree( grid , memo[i][0][1] , memo[i][0][0] , coordinates )
          }
          // console.log( memo[i-1] );
          for ( e = i-1; e < n; e++) {
            for ( d = 0; d < n; d++) {
              if ( grid[e][d] == ' S ' ) {
                grid[e][d] = '|T|'
                trapped = d;
                // redos.push( [ d , e ] );
                console.log(`\n`,grid);
              }
            }
          }
          tallyBlockedSpaces = 0;
          redoChk = 0;
          i -= 2;
          continue;
          }

          if ( placeSpyHere > -1 ) {
            successChain += 1;
            console.log('Found a spot! Placing...');
            if ( retry > 0 && successChain > n/2) {
              retry -= 1;
            }
            grid[i][placeSpyHere] = ' S ';
            if (blockages > 0 && successChain > 2) {
              blockages -= 1;
            }
            memo.push([[ placeSpyHere , i ],[]])
            coordinates.push( [ j , i ] );
            // ln2 += ( ( j + 1) + " " )
            spyFree( grid , i , j , coordinates );
            console.log(`\n`,grid);
            tallyBlockedSpaces = 0;
            placeSpyHere = -1;
            redoChk = 0;
          }



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

spyDrop( 9 );
