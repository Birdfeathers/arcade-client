const {BaseUrl} = require('../constants');

export async function newGame(token, rows, cols, toWin, against, goesFirst, overline, threeThree, fourFour, giveWarning) {
    try {
        const response = await fetch(BaseUrl + 'games/newgame', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body : JSON.stringify({
                rows,
                cols,
                toWin,
                against,
                goesFirst,
                overline,
                threeThree,
                fourFour,
                giveWarning
            })
        });
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getGame(id)
{
    try {
        const response = await fetch(BaseUrl + 'games/game/'+ id, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const result = await response.json();
        console.log(result);
        return result;
    } catch(error) {
        throw error;
    }
}

export async function getGamesByUser(token)
{
    try {
        const response = await fetch(BaseUrl + 'games/usergames', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();
        console.log(result);
        return result;
    } catch(error) {
        throw error;
    }
}

export async function updateMoveHistory(token, moveHistory, game)
{
    //console.log("update logs", token, gameId, history, game)
    const id = game.id;
    try{
        const response = await fetch(BaseUrl + 'games/move', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body : JSON.stringify({
                id,
                moveHistory,
                game
            })
        });
        const result = await response.json();

        console.log(result);
        return result;

    } catch(error) {
        throw error;
    }
}

export async function updateStatus(token, gameId, status)
{
    try{
        const response = await fetch(BaseUrl + 'games/status/' + gameId, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body : JSON.stringify({
               status
            })
        });
        const result = await response.json();

        console.log(result);
        return result;

    } catch(error) {
        throw error;
    }
}

export async function deleteGame(token, gameId) {
    try {
      const response = await fetch(BaseUrl + 'games/' + gameId, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  }


export async function getWinLines(moveHistory, rows, cols, towin)
{
    try{
        const response = await fetch(BaseUrl + 'games/winLines', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                moveHistory,
                rows,
                cols,
                towin
            })
        });
        const result = await response.json();

        console.log(result);
        return result;

    } catch(error) {
        throw error;
    }
}

export async function getViolations(moveHistory, rows, cols, overline, threeThree, fourFour)
{
    try{
        const response = await fetch(BaseUrl + 'games/violations', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                moveHistory,
                rows,
                cols,
                overline,
                threeThree,
                fourFour
            })
        });
        const result = await response.json();

        console.log(result);
        return result;

    } catch(error) {
        throw error;
    }
}