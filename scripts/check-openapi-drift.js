const fs = require('fs');
const path = require('path');

const contractPath = path.join(__dirname, '..', 'specs', '001-digital-library-forum', 'contracts', 'openapi.yaml');

if (!fs.existsSync(contractPath)) {
  console.error(`Missing OpenAPI contract: ${contractPath}`);
  process.exit(1);
}

const contract = fs.readFileSync(contractPath, 'utf8');
const requiredPaths = [
  '/auth/register',
  '/auth/login',
  '/documents',
  '/lecturer/documents',
  '/forum/posts',
  '/study-groups',
  '/content/documents/pending',
  '/admin/users',
  '/statistics/overview',
  '/system-configs'
];

const missing = requiredPaths.filter((route) => !contract.includes(route));
if (missing.length > 0) {
  console.error(`OpenAPI contract missing routes: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('OpenAPI contract includes required route groups.');
