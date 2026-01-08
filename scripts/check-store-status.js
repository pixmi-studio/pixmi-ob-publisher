const https = require('https');

const url = 'https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const plugins = JSON.parse(data);
            const plugin = plugins.find(p => p.id === 'pixmi-ob-publisher');
            if (plugin) {
                console.log('Success! Pixmi Ob Publisher is now available in the Obsidian Community Store.');
            } else {
                console.log('Plugin not found yet. It may still be under review.');
            }
        } catch (e) {
            console.error('Failed to parse community-plugins.json');
        }
    });
}).on('error', (err) => {
    console.error('Error fetching data: ' + err.message);
});
