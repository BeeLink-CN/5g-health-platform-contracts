const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function findYamlFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) {
        return fileList;
    }

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findYamlFiles(filePath, fileList);
        } else {
            if (file.endsWith('.yaml') || file.endsWith('.yml')) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

const asyncapiDir = 'asyncapi';
const files = findYamlFiles(asyncapiDir);

if (files.length === 0) {
    console.log('No AsyncAPI files found');
    process.exit(0);
}

let hasErrors = false;

files.forEach(file => {
    try {
        console.log(`Validating ${file}...`);
        // Need to execute npx asyncapi or just asyncapi if it's in path from npm run script
        // Since it's a devDependency, npm run adds it to PATH.
        const absolutePath = path.resolve(file);
        execSync(`asyncapi validate "${absolutePath}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error validating ${file}`);
        hasErrors = true;
    }
});

if (hasErrors) {
    process.exit(1);
}
