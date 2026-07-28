import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log(`\n=======================================================`);
console.log(`⚡ QuickThought Developer Environment & Setup Script ⚡`);
console.log(`=======================================================\n`);

// Step 1: Check Runtime Requirements
console.log(`🔍 [1/4] Checking System Runtime & Environment...`);

const nodeVersionStr = process.version;
const nodeMajor = parseInt(nodeVersionStr.replace(/^v/, '').split('.')[0], 10);

if (nodeMajor < 18) {
  console.error(`❌ Node.js version ${nodeVersionStr} detected. Node.js v20+ or v22+ LTS is required.`);
  process.exit(1);
} else {
  console.log(`  ✅ Node.js Runtime: ${nodeVersionStr} (Satisfies requirement >= v18.x)`);
}

try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`  ✅ npm Package Manager: v${npmVersion}`);
} catch {
  console.error(`❌ npm is not installed or not available in PATH.`);
  process.exit(1);
}

console.log(`  ℹ️ OS Platform: ${process.platform} (${process.arch})`);

// Step 2: Audit Project Files
console.log(`\n📁 [2/4] Auditing Project Architecture & Required Files...`);

const requiredFiles = [
  'package.json',
  'electron-builder.json',
  'electron/main.js',
  '.gitignore',
  'src/version.ts',
  'src/App.tsx',
  'src/services/db.ts',
  'src/services/updateService.ts',
  '.github/workflows/main.yml',
  '.github/workflows/release.yml',
  'DEVELOPMENT_GUIDE.md',
  'README.md',
];

let missingCount = 0;
for (const relPath of requiredFiles) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ Found required file: ${relPath}`);
  } else {
    console.error(`  ❌ Missing file: ${relPath}`);
    missingCount++;
  }
}

if (missingCount > 0) {
  console.error(`\n❌ Error: ${missingCount} required file(s) are missing from the project directory.`);
  process.exit(1);
}

// Step 3: Check & Install Node Dependencies
console.log(`\n📦 [3/4] Verifying Node Dependencies (node_modules)...`);

const nodeModulesPath = path.join(rootDir, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log(`  ⚠️ node_modules not detected. Installing dependencies now...`);
  try {
    execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
    console.log(`  ✅ Dependencies installed successfully!`);
  } catch (err) {
    console.error(`❌ npm install failed. Please inspect errors above.`);
    process.exit(1);
  }
} else {
  console.log(`  ✅ node_modules directory exists.`);
}

// Step 4: Run Code Quality & TypeScript Audit
console.log(`\n🔬 [4/4] Validating TypeScript Compilation & Linter...`);
try {
  execSync('npm run lint', { cwd: rootDir, stdio: 'inherit' });
  console.log(`  ✅ Code quality & type checks passed without errors!`);
} catch {
  console.error(`❌ TypeScript compilation or linting issues detected.`);
  process.exit(1);
}

console.log(`\n=======================================================`);
console.log(`🎉 Success! Developer environment is fully set up and ready!`);
console.log(`=======================================================\n`);
console.log(`Available Developer Commands:`);
console.log(`  • npm run dev            - Start hot-reloading web development server`);
console.log(`  • npm run build:win      - Package Windows setup installer & portable .exe`);
console.log(`  • npm run build:win:dir  - Unpack raw Windows executable folder for quick tests`);
console.log(`  • npm run bump-version   - Upgrade project version across all release manifests`);
console.log(`  • npm run lint           - Run TypeScript type checks`);
console.log(`\nRefer to DEVELOPMENT_GUIDE.md for detailed documentation.\n`);
