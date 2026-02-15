
const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('c:/Users/user/Desktop/imedteam/imedteamuz/swagger.json', 'utf8'));

    const paths = data.paths || {};
    console.log("Matching Paths:");
    Object.keys(paths).forEach(path => {
        if (path.toLowerCase().includes('promo') || path.toLowerCase().includes('code') || path.toLowerCase().includes('voucher') || path.toLowerCase().includes('coupon')) {
            console.log(path);
            Object.keys(paths[path]).forEach(method => {
                console.log(`  ${method}: ${paths[path][method].summary || ''}`);
            });
        }
    });

    // also check /mobile/order structure
    if (paths['/mobile/order']) {
        console.log('\n/mobile/order methods:', Object.keys(paths['/mobile/order']));
    }

} catch (e) {
    console.error(e);
}
