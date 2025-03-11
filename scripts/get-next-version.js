import fs from 'fs';
import semver from 'semver';

// Read current version from package.json
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const currentVersion = pkg.version;

// Increment patch version
const nextVersion = semver.inc(currentVersion, 'patch');

// Output just the version number
console.log(nextVersion);