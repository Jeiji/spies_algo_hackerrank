

function printMatrix( n ) {
  let matrix = [];
  let row = [];

  // Shifting Rows
  for ( i = 0; i < n; i++ ) {

    //Printing Columns
    for ( j = 0; j < n; j++ ) {
        row.push('| |');
    }
    matrix.push( row );
    row = [];
  }
  return matrix
}


function blockSpaces( matrix , newAgentRow , newAgentCol , listedAgents ) {
  // console.log(`\nBlocking spaces for other agents...`);
  // console.log(`Current agent assignments:`); console.log( listedAgents ); console.log('\n');

  // Be sure to block out any future locations by slope in comparison to the placed agent
  if ( newAgentRow > 0 ) {

    // Loop through agent list, get their coordinates, and calculate slopped collaterals
    for ( o = 0; o < listedAgents.length; o++) {
      let listedAgentRow = listedAgents[o][0][0], listedAgentCol = listedAgents[o][0][1];
      let yDif = newAgentRow - listedAgentRow, xDif = newAgentCol - listedAgentCol;
      // This is just the multiplier to keep track of how many rows I'm traversing. Kinda' like slope.
      let m = 1;

      // Looping here to get all possibilities of blocked spaces by slope.
      while ( matrix[newAgentRow + yDif*m] && matrix[newAgentRow + yDif*m][newAgentCol + xDif*m] && listedAgents[o][0][0] !== newAgentRow ) {
        if ( ( newAgentRow + yDif*m ) > newAgentRow ) {
          matrix[newAgentRow + yDif*m][newAgentCol + xDif*m] = '|X|'
        }
        // console.log(`found a slope!( from [${ listedAgents[o] }] to [ ${ newAgentRow } , ${ newAgentCol } ] )`);
        // console.log(matrix);
        listedAgents[newAgentRow][1].push( [newAgentRow + yDif*m , newAgentCol + xDif*m] )
        // console.log('This is listedAgents:',listedAgents);
        m++
      }
    }
  }

  // The main loop that nixes all vertical and diagonal collateral spaces. Starts on next row.
  let slope = 1;
  for ( let i = newAgentRow + 1; i < matrix.length; i++ ) {
    for ( let j = 0; j < matrix.length ; j++) {
      // Check for verticals
      if ( j == newAgentCol ) {
        if ( matrix[i][j] == '| |' ) {
            matrix[i][j] = '|||'
        }
        listedAgents[newAgentRow][1].push( [ i , j ] )
      }
      // Check for diagonals
      if ( j == newAgentCol + slope ) {
        if ( matrix[i][j] == '| |' ) {
            matrix[i][j] = '|||'
        }
        listedAgents[newAgentRow][1].push( [ i , j ] )
      }
      if ( j == newAgentCol - slope ) {
        if ( matrix[i][j] == '| |' ) {
            matrix[i][j] = '|||'
        }
        listedAgents[newAgentRow][1].push( [ i , j ] )
      }
    }
    slope += 1;
  }
  // console.log(matrix);
}



function dropAgent( matrix , row , col , listedAgents ){
  // console.log(`These are the row and column in dropAgent: [ ${ row } , ${ col } ]`);
  matrix[row][col] = '|S|';
  let newAgent = [ row , col ]

  // Add this agent to the list to use as info for placing other agents (preloaded with an empty array to hold all of the future collaterally affected spaces)
  listedAgents.push( [ newAgent , [newAgent] ] );
  console.log(`\nAGENT PLANTED at [ ${ row } , ${ col } ]!`);


  // Block off any spots that would blow cover for other agents
  blockSpaces( matrix , row , col , listedAgents );
  // console.log(`\nMatrix after block-outs...`);
  // console.log( matrix );
};

function retractAgent( matrix , agentToRemove , listedAgents ){
  // console.log(`\nRetracting agent...`);

  let row = agentToRemove[0];
  let col = agentToRemove[1];

  // Looping through agent's collaterals
  for (let i = 0; i < listedAgents[row][1].length; i++) {
    let rowOfCollToRemove = listedAgents[row][1][i][0]
    let colOfCollToRemove = listedAgents[row][1][i][1]
    matrix[rowOfCollToRemove][colOfCollToRemove] = '| |';
  }
  listedAgents.pop();

  // Also need to replace all proper collaterals from previously deployed agents.
  for (let i = 0; i < listedAgents.length; i++) {
    let agentToBlockFor = listedAgents[i];
    let agentBlockRow = agentToBlockFor[0][0];
    let agentBlockCol = agentToBlockFor[0][1];
    // Wiping the list of each agent's collaterals clean so that I don't duplicate while re-blocking.
    agentToBlockFor[1] = []
    blockSpaces( matrix , agentBlockRow , agentBlockCol , listedAgents )
  }

  //Should replace the agent's "S" with an "R"
  console.log(`\nAgent to remove: ` , agentToRemove);
  matrix[row][col] = '|R|';

  // console.log(`Here's the current matrix after retraction:`); console.log(matrix);
}



function deployAgents( n , sanity ) {
  // Write the matrix
  let matrix = printMatrix( n );

  let agentList = [];
  let agentDroppedThisRound = false
  let currentRow = 0;

  // Loop through matrix to find an opening
  for ( let i = 0 ; i < n ; i++ ) {
    // console.log(`\nChecking for openings on row ${ i }`);
    for ( let j = 0; j < n; j++){

      // Just for sanity's sake... try not putting first agent at 0,0...
      if ( sanity && i == 0 ) {
        j += (sanity-1);
      }

      agentDroppedThisRound = false;

      // If the spot's open, plant and move to next row
      if( matrix[i][j] == '| |' ){
        dropAgent( matrix , i , j , agentList );
        agentDroppedThisRound = true;
        break;
      }
    }


    // Also, if you get out of the loop, then all the spaces were taken retract prior agent and retry placing in the next column.
    if ( !agentDroppedThisRound ) {
      // console.log(`NO OPENINGS IN ROW ${ i }`);
      // And most importantly... if you've reached the end of the first row, then there's NO SOLUTION!
      if ( i == 0 ) {
        console.log(`\n!!!!!!!NO SOLUTION`);
        // console.log(matrix);
        return;
      }
      let agentToRemove = agentList[agentList.length-1][0];
      retractAgent( matrix , agentToRemove , agentList );

      // If you get to the end of the loop and you have retracted spots, you should clear them.
      if ( matrix[i] ) {
        for (let k = 0; k < n; k++) {
          // console.log(matrix[i][k]);
          if ( matrix[i][k] == '|R|' ) {
            // console.log(`Removing next-row retraction...( ${ i } , ${ k } )`);
            matrix[i][k] = '| |'
            // console.log(matrix);
          }
        }
      }
      i-=2;
    }

    // console.log(`Finished this round.`);
    // console.log(matrix);
  }
  let ln1 = n, ln2 = '';

  // Load the row placement for the spies into ln2 for output.
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if ( matrix[i][j] == '|S|' ) {
        ln2 += (j+1) + " "
      }
    }
  }

  console.log(`\nDone! Here's the solution:`);
  console.log(matrix);
  console.log(`\n`,ln1,`\n`,ln2);

}

deployAgents( 31 );
