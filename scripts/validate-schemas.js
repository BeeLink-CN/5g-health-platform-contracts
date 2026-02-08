const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);

const schemasDir = path.join(__dirname, '../schemas');

function getAllSchemaFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            getAllSchemaFiles(fullPath, fileList);
        } else if (file.name.endsWith('.json')) {
            fileList.push(fullPath);
        }
    }

    return fileList;
}

console.log('Validating JSON schemas...\n');

// Step 1: Load all schemas
const schemaFiles = getAllSchemaFiles(schemasDir);
const schemas = [];

console.log('Loading schemas...');
for (const filePath of schemaFiles) {
    try {
        const schemaContent = fs.readFileSync(filePath, 'utf8');
        const schema = JSON.parse(schemaContent);

        // Require $id
        if (!schema.$id) {
            console.error(`✗ ${path.relative(schemasDir, filePath)} - Missing required $id field`);
            process.exit(1);
        }

        schemas.push({ filePath, schema });
        console.log(`  Loaded: ${path.relative(schemasDir, filePath)}`);
    } catch (error) {
        console.error(`✗ ${path.relative(schemasDir, filePath)} - Failed to load`);
        console.error(`  Error: ${error.message}`);
        process.exit(1);
    }
}

// Step 2: Add all schemas to AJV
console.log('\nAdding schemas to AJV...');
for (const { filePath, schema } of schemas) {
    try {
        ajv.addSchema(schema);
        console.log(`  Added: ${path.relative(schemasDir, filePath)}`);
    } catch (error) {
        console.error(`✗ ${path.relative(schemasDir, filePath)} - Failed to add to AJV`);
        console.error(`  Error: ${error.message}`);
        process.exit(1);
    }
}

// Step 3: Validate and compile each schema
console.log('\nValidating schemas...');
let hasErrors = false;

for (const { filePath, schema } of schemas) {
    try {
        // Validate the schema itself
        const isValid = ajv.validateSchema(schema);
        if (!isValid) {
            console.error(`✗ ${path.relative(schemasDir, filePath)} - Schema validation failed`);
            console.error(`  Errors:`, ajv.errors);
            hasErrors = true;
            continue;
        }

        // Try to compile the schema (this ensures all $refs resolve)
        ajv.compile(schema);
        console.log(`✓ ${path.relative(schemasDir, filePath)} - Valid`);
    } catch (error) {
        console.error(`✗ ${path.relative(schemasDir, filePath)} - Compilation failed`);
        console.error(`  Error: ${error.message}`);
        hasErrors = true;
    }
}

if (hasErrors) {
    console.error('\n✗ Some JSON schemas are invalid. Please fix the errors above.\n');
    process.exit(1);
} else {
    console.log('\n✓ All JSON schemas are valid!\n');
    process.exit(0);
}
