
// ========== Types ==========
import type { AddressInfo } from 'net';
import type { Mongoose } from 'mongoose';

// ========== Implementation ==========
import 'module-alias/register';
import mongoose from 'mongoose';
import { globSync } from 'glob';
import path from 'path';
import dotenv from 'dotenv';

// Make sure we are running node 20+
const [major] = process.versions.node.split('.').map(Number);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

mongoose.connect(process.env.DATABASE as string);

const OPENAI_API_KEY: string | undefined = process.env.OPENAI_API_KEY;

mongoose.connection.on('error', (error: Error) => {
  console.log(
    `1. 🔥 Common Error caused issue → : check your .env file first and add your mongodb url`
  );
  console.error(`2. 🚫 Error → : ${error.message}`);
});

const modelsFiles: string[] = globSync('./src/models/**/*.ts');
for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
  const address = server.address() as AddressInfo;
  console.log(`Express running → On PORT : ${address.port}`);
});
