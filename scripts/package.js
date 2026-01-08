const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const folderName = 'pixmi-ob-publisher';
const zipName = `${folderName}.zip`;

// 1. 清理并创建临时文件夹
if (fs.existsSync(folderName)) {
    fs.rmSync(folderName, { recursive: true, force: true });
}
fs.mkdirSync(folderName);

// 2. 复制产物
const assets = ['dist/main.js', 'manifest.json'];
assets.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(folderName, path.basename(file)));
        console.log(`Copied ${file} to ${folderName}/`);
    }
});

// 3. 执行压缩 (使用系统 zip 命令)
try {
    // -r 递归, -q 安静模式
    execSync(`zip -rq ${zipName} ${folderName}`);
    console.log(`Successfully created ${zipName}`);
    
    // 清理临时文件夹
    fs.rmSync(folderName, { recursive: true, force: true });
} catch (error) {
    console.error('Failed to create zip package:', error.message);
    process.exit(1);
}
