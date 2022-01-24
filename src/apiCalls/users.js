const {BaseUrl} = require('./constants');

export async function login(username, password) {
    try {
        const response = await fetch(BaseUrl + 'users/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body : JSON.stringify({
                username,
                password
            })
        });
        const result = await response.json();

        console.log(result);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function register(username, password) {
    try {
        const response = await fetch(BaseUrl + 'users/register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body : JSON.stringify({
                username,
                password
            })
        });
        const result = await response.json();

        console.log(result);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getAllUsers() {
    try {
        const response = await fetch(BaseUrl + 'users/all', {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log(result);
        return result;
    } catch(error) {
        throw error;
    }
}

export async function getUserById(id){
    try{
        const response = await fetch(BaseUrl + 'users/user/' + id, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.log(result);
        return result;
    } catch(error) {
        throw error;
    }
}

export async function updatePassword(password, token)
{
    try{
        const response = await fetch(BaseUrl + 'users/password', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body : JSON.stringify({
                password,
            })
        });
        const result = await response.json();

        console.log(result);
        return result;

    } catch(error) {
        throw error;
    }
}