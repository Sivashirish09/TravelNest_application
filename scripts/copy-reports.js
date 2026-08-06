const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../FINAL REPORTS');
const reportsDir = path.resolve(__dirname, '../reports');
const enterpriseReportsDir = path.resolve(__dirname, '../Reports');
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

copyRecursive(srcDir, destDir1);
copyRecursive(srcDir, destDir2);
copyRecursive(reportsDir, destDir1);
copyRecursive(enterpriseReportsDir, destDir1);

const zipSrc = path.resolve(__dirname, '../Reports.zip');
if (fs.existsSync(zipSrc)) {
  fs.copyFileSync(zipSrc, path.join(destDir1, 'Reports.zip'));
}

console.log('✅ Enterprise Reports & Reports.zip synced into web-app/reports');
