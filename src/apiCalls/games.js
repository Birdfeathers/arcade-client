const {BaseUrl} = require('./constants');

export async function newGame(token, rows, cols, toWin, against, goesFirst) {
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
                goesFirst
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
        const response = await fetch(BaseUrl + 'games/game/'+ {id}, {
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

export async function updateMoveHistory(token, id, moveHistory)
{
    try{
        const response = await fetch(BaseUrl + 'games/move', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body : JSON.stringify({
                id,
                moveHistory
            })
        });
        const result = await response.json();

        console.log(result);
        return result;

    } catch(error) {
        throw error;
    }
}