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
// 复制整个 dist 目录的内容
if (fs.existsSync('dist')) {
    const distFiles = fs.readdirSync('dist');
    distFiles.forEach(file => {
        const srcPath = path.join('dist', file);
        if (fs.statSync(srcPath).isFile()) {
            fs.copyFileSync(srcPath, path.join(folderName, file));
            console.log(`Copied dist/${file} to ${folderName}/`);
        }
    });
}

// 复制 manifest.json (Obsidian 插件必需)
if (fs.existsSync('manifest.json')) {
    fs.copyFileSync('manifest.json', path.join(folderName, 'manifest.json'));
    console.log(`Copied manifest.json to ${folderName}/`);
}

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
