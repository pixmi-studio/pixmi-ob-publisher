const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2];

if (!targetDir) {
    console.error('Please provide a target directory path.');
    process.exit(1);
}

const filesToCopy = ['dist/main.js', 'src/manifest.json'];

async function copyFiles() {
    try {
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        for (const file of filesToCopy) {
            const fileName = path.basename(file);
            const destPath = path.join(targetDir, fileName);
            fs.copyFileSync(file, destPath);
            console.log(`Successfully copied ${file} to ${destPath}`);
        }
    } catch (err) {
        console.error('Error copying files:', err);
        process.exit(1);
    }
}

copyFiles();
