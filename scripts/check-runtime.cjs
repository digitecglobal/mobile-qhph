const requiredNode = "v22.14.0";
const currentNode = process.version;

if (currentNode !== requiredNode) {
  console.error(`Invalid Node.js version: ${currentNode}. Required: ${requiredNode}.`);
  process.exit(1);
}

console.log(`Runtime OK: Node.js ${currentNode}`);
