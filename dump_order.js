
const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('c:/Users/user/Desktop/imedteam/imedteamuz/swagger.json', 'utf8'));
    const path = '/mobile/order';
    if (data.paths[path] && data.paths[path].post) {
        console.log(JSON.stringify(data.paths[path].post, null, 2));
    } else {
        console.log('Path not found');
    }
} catch (e) {
    console.error(e);
}
