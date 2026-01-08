const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
    console.error('Please provide a version number.');
    process.exit(1);
}

const baseDir = process.env.TEST_DIR || process.cwd();

const files = {
    package: path.join(baseDir, 'package.json'),
    manifest: path.join(baseDir, 'manifest.json'),
    srcManifest: path.join(baseDir, 'src/manifest.json'), // Default path
    versions: path.join(baseDir, 'versions.json')
};

// In test environment, srcManifest might be at a different location
if (process.env.TEST_DIR && !fs.existsSync(files.srcManifest)) {
    files.srcManifest = path.join(baseDir, 'src-manifest.json');
}

function updateJson(filePath, updateFn) {
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const updated = updateFn(content);
        fs.writeFileSync(filePath, JSON.stringify(updated, null, 2) + '\n');
        console.log(`Updated ${filePath}`);
    } else {
        console.warn(`File not found: ${filePath}`);
    }
}

// Update package.json
updateJson(files.package, (data) => {
    data.version = version;
    return data;
});

// Update manifest.json
updateJson(files.manifest, (data) => {
    data.version = version;
    return data;
});

// Update src/manifest.json
updateJson(files.srcManifest, (data) => {
    data.version = version;
    return data;
});

// Update versions.json
updateJson(files.versions, (data) => {
    // Get minAppVersion from manifest.json
    let minAppVersion = '0.15.0'; // Fallback
    if (fs.existsSync(files.manifest)) {
        const manifest = JSON.parse(fs.readFileSync(files.manifest, 'utf8'));
        minAppVersion = manifest.minAppVersion || minAppVersion;
    }
    data[version] = minAppVersion;
    return data;
});
