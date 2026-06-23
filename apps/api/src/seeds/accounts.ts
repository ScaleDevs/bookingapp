import { fileURLToPath } from 'node:url';
import { sql } from '../db/index';

async function main() {
    try {
        console.log('SEED LOGIC HERE');
    } catch (error) {
        console.error('Unit of measure seed failed:', error);
        process.exitCode = 1;
    } finally {
        await sql.end();
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    void main();
}
