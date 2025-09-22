import dotenv from 'dotenv';
import { globSync } from 'glob';
import fs from 'fs';
import { generate as uniqueId } from 'shortid';
import mongoose from 'mongoose';
import path from 'path';
import { pathToFileURL } from 'url';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

mongoose.connect(process.env.DATABASE as string);

async function setupApp() {
  try {
    // load models dynamically to avoid circular import during setup
    const isProduction = process.env.NODE_ENV === 'production';
    const adminFile = isProduction ? path.resolve('./dist/models/coreModels/Admin.js') : path.resolve('./src/models/coreModels/Admin.ts');
    const adminPasswordFile = isProduction ? path.resolve('./dist/models/coreModels/AdminPassword.js') : path.resolve('./src/models/coreModels/AdminPassword.ts');

    const AdminModule = (await import(pathToFileURL(adminFile).href)) as any;
    const Admin = AdminModule?.default || AdminModule;
    const adminPasswordModule = (await import(pathToFileURL(adminPasswordFile).href)) as any;
    const AdminPassword = adminPasswordModule?.default || adminPasswordModule;
    const newAdminPassword = new AdminPassword();

    const salt = uniqueId();

    const passwordHash = newAdminPassword.generateHash(salt, 'admin123');

    const demoAdmin = {
      email: 'admin@admin.com',
      name: 'IDURAR',
      surname: 'Admin',
      enabled: true,
      role: 'owner',
    };
    const result = await new Admin(demoAdmin).save();

    const AdminPasswordData = {
      password: passwordHash,
      emailVerified: true,
      salt: salt,
      user: result._id,
    };
    await new AdminPassword(AdminPasswordData).save();

    console.log('👍 Admin created : Done!');

    const settingFile = isProduction ? path.resolve('./dist/models/coreModels/Setting.js') : path.resolve('./src/models/coreModels/Setting.ts');
    const _settingMod = (await import(pathToFileURL(settingFile).href)) as any;
    const Setting = _settingMod?.default || _settingMod;

    const settingFiles = [];

    const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');

    for (const filePath of settingsFiles) {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      settingFiles.push(...file);
    }

    await Setting.insertMany(settingFiles);

    console.log('👍 Settings created : Done!');

    const paymentModeFile = isProduction ? path.resolve('./dist/models/appModels/PaymentMode.js') : path.resolve('./src/models/appModels/PaymentMode.ts');
    const taxesFile = isProduction ? path.resolve('./dist/models/appModels/Taxes.js') : path.resolve('./src/models/appModels/Taxes.ts');
    const _paymentModeMod = (await import(pathToFileURL(paymentModeFile).href)) as any;
    const PaymentMode = _paymentModeMod?.default || _paymentModeMod;
    const _taxesMod = (await import(pathToFileURL(taxesFile).href)) as any;
    const Taxes = _taxesMod?.default || _taxesMod;

    await Taxes.insertMany([{ taxName: 'Tax 0%', taxValue: '0', isDefault: true }]);
    console.log('👍 Taxes created : Done!');

    await PaymentMode.insertMany([
      {
        name: 'Default Payment',
        description: 'Default Payment Mode (Cash , Wire Transfert)',
        isDefault: true,
      },
    ]);
    console.log('👍 PaymentMode created : Done!');

    console.log('🥳 Setup completed :Success!');
    process.exit();
  } catch (e) {
    console.log('\n🚫 Error! The Error info is below');
    console.log(e);
    process.exit();
  }
}

setupApp();
