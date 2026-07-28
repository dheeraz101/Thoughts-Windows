import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targetVersion = process.argv[2];

if (!targetVersion) {
  console.error('❌ Error: Please specify a version number (e.g. node scripts/bump-version.js 1.1.0)');
  process.exit(1);
}

// Validate semver format X.Y.Z
if (!/^\d+\.\d+\.\d+$/.test(targetVersion)) {
  console.error('❌ Error: Version must follow semantic versioning format (e.g., 1.0.1, 1.1.0)');
  process.exit(1);
}

console.log(`🚀 Bumping version across project files to: v${targetVersion}...`);

// 1. Update package.json
const pkgPath = path.join(rootDir, 'package.json');
const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkgData.version = targetVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkgData, null, 2) + '\n');
console.log(`✅ Updated package.json -> ${targetVersion}`);

// 2. Update src/version.ts
const versionTsPath = path.join(rootDir, 'src', 'version.ts');
const versionTsContent = `export const APP_VERSION = '${targetVersion}';
export const APP_RELEASE_NAME = 'QuickThought v${targetVersion}';
export const APP_BUILD_NUMBER = '${targetVersion.replace(/\./g, '')}';
export const GITHUB_REPO = 'dheeraz101/Thoughts-Windows';
`;
fs.writeFileSync(versionTsPath, versionTsContent);
console.log(`✅ Updated src/version.ts -> ${targetVersion}`);

// 3. Update electron-builder.json if present
const ebPath = path.join(rootDir, 'electron-builder.json');
if (fs.existsSync(ebPath)) {
  const ebData = JSON.parse(fs.readFileSync(ebPath, 'utf8'));
  // Update copyright year dynamically
  ebData.copyright = `Copyright © ${new Date().getFullYear()} QuickThought Contributors`;
  fs.writeFileSync(ebPath, JSON.stringify(ebData, null, 2) + '\n');
  console.log(`✅ Refreshed electron-builder.json copyright & config`);
}

console.log(`\n🎉 Success! All files updated to v${targetVersion}. You can now commit and push to main or release:`);
console.log(`   git commit -am "chore(release): bump version to v${targetVersion}"`);
console.log(`   git push origin main:release\n`);
