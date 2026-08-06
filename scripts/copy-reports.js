const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../FINAL REPORTS');
const destDir1 = path.resolve(__dirname, '../web-app/reports');
const destDir2 = path.resolve(__dirname, '../web-app/FINAL REPORTS');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const reportsDir = path.resolve(__dirname, '../reports');

copyRecursive(srcDir, destDir1);
copyRecursive(srcDir, destDir2);
copyRecursive(reportsDir, destDir1);
console.log('✅ Final Reports synced into web-app/reports and web-app/FINAL REPORTS');
