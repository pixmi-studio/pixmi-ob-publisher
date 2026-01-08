import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const tempDir = path.join(process.cwd(), 'temp-test-release');

describe('Release Logic - Update Manifests', () => {
    beforeEach(() => {
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        
        // Setup mock files
        fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({ version: '1.0.0' }));
        fs.writeFileSync(path.join(tempDir, 'manifest.json'), JSON.stringify({ version: '1.0.0', minAppVersion: '0.15.0' }));
        fs.writeFileSync(path.join(tempDir, 'src-manifest.json'), JSON.stringify({ version: '1.0.0', minAppVersion: '0.15.0' }));
        fs.writeFileSync(path.join(tempDir, 'versions.json'), JSON.stringify({ '1.0.0': '0.15.0' }));
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('should update all manifest files and versions.json', () => {
        const nextVersion = '1.1.0';
        const scriptPath = path.join(process.cwd(), 'scripts/update-manifests.js');
        
        execSync(`node ${scriptPath} ${nextVersion}`, {
            env: { ...process.env, TEST_DIR: tempDir }
        });

        const pkg = JSON.parse(fs.readFileSync(path.join(tempDir, 'package.json'), 'utf8'));
        const manifest = JSON.parse(fs.readFileSync(path.join(tempDir, 'manifest.json'), 'utf8'));
        const srcManifest = JSON.parse(fs.readFileSync(path.join(tempDir, 'src-manifest.json'), 'utf8'));
        const versions = JSON.parse(fs.readFileSync(path.join(tempDir, 'versions.json'), 'utf8'));

        expect(pkg.version).toBe(nextVersion);
        expect(manifest.version).toBe(nextVersion);
        expect(srcManifest.version).toBe(nextVersion);
        expect(versions[nextVersion]).toBe('0.15.0');
    });
});
