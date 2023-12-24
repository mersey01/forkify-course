import { async } from 'regenerator-runtime';
import { TIMEOUTSECONDS } from './config.js';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took longer than ${s} seconds`));
        }, s * 1000);
    })
}

export const AJAX = async function(url, data = null, method = 'GET') {
    
    try {
        const res = await Promise.race([fetch(url, {
            method,
            headers: {'Content-Type': 'application/json'},
            ...(data && {body: JSON.stringify(data)})
        }), timeout(TIMEOUTSECONDS)]);
        const json = await res.json();
        if (!res.ok) throw new Error(`${json.message} (${res.status})`);

        return json
    } catch (err) {
        throw err;
    }
}

// export const getJSON = async (url) => {
//     try {
//         const res = await Promise.race([fetch(url), timeout(TIMEOUTSECONDS)]);
//         const data = await res.json();
//         if (!res.ok) throw new Error(`${data.message} (${res.status})`);

//         return data
//     } catch (err) {
//         throw err;
//     }
// }

// export const sendJSON = async (url, recipe) => {
//     try {
//         const res = await Promise.race([fetch(url, {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify(recipe)
//         }), timeout(TIMEOUTSECONDS)]);
//         const data = await res.json();
//         if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//         return data
//     } catch (err) {
//         throw err;
//     }
// }