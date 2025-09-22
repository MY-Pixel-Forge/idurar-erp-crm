
// ========== Types ==========
import type { AddressInfo } from 'net';

// ========== Implementation ==========
import 'module-alias/register';
import mongoose from 'mongoose';
import { globSync } from 'glob';
import path from 'path';
import { pathToFileURL } from 'url';
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

const isProduction = process.env.NODE_ENV === 'production';
// In production we compile to ./dist — load compiled .js files. In dev use .ts sources.
const modelsFiles: string[] = globSync(isProduction ? './dist/models/**/*.js' : './src/models/**/*.ts');
for (const filePath of modelsFiles) {
  // dynamic ES import to execute model files for mongoose schema registration
  // we intentionally don't await here to preserve startup speed; top-level effects will run
  import(path.resolve(filePath)).catch((err) => {
    console.error('Failed loading model:', filePath, err?.message || err);
  });
}

// Start our app!
(async () => {
  try {
    // Import the correct file at runtime using a file URL to avoid static import extension checks
    const appFile = isProduction ? path.resolve('./dist/app.js') : path.resolve('./src/app.ts');
    const appModule = await import(pathToFileURL(appFile).href);
    // Cast to Express application to expose set/get/listen methods for TS
    const app = (appModule?.default || appModule) as unknown as import('express').Application;
    app.set('port', process.env.PORT || 8888);
    const server = app.listen(app.get('port'), () => {
      const address = server.address() as AddressInfo;
      console.log(`Express running → On PORT : ${address.port}`);
    });
  } catch (err: any) {
    console.error('Failed starting server:', err?.message || err);
    process.exit(1);
  }
})();
