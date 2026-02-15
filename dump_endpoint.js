
const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('c:/Users/user/Desktop/imedteam/imedteamuz/swagger.json', 'utf8'));
    const path = '/mobile/promocode/check';
    if (data.paths[path]) {
        console.log(JSON.stringify(data.paths[path], null, 2));
    } else {
        console.log('Path not found');
    }
} catch (e) {
    console.error(e);
}
