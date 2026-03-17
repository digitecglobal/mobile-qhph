const fs = require('node:fs');
const path = require('node:path');

const filePath = path.resolve(__dirname, '..', 'openapi', 'openapi.yaml');

if (!fs.existsSync(filePath)) {
  console.error('Missing OpenAPI file: apps/api/openapi/openapi.yaml');
  process.exit(1);
}

console.log('OpenAPI file found:', filePath);
