import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { pathToFileURL } from 'url';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

mongoose.connect(process.env.DATABASE as string);

async function deleteData() {
  const isProduction = process.env.NODE_ENV === 'production';
  const adminFile = isProduction ? path.resolve('./dist/models/coreModels/Admin.js') : path.resolve('./src/models/coreModels/Admin.ts');
  const adminPassFile = isProduction ? path.resolve('./dist/models/coreModels/AdminPassword.js') : path.resolve('./src/models/coreModels/AdminPassword.ts');
  const settingFile = isProduction ? path.resolve('./dist/models/coreModels/Setting.js') : path.resolve('./src/models/coreModels/Setting.ts');
  const paymentModeFile = isProduction ? path.resolve('./dist/models/appModels/PaymentMode.js') : path.resolve('./src/models/appModels/PaymentMode.ts');
  const taxesFile = isProduction ? path.resolve('./dist/models/appModels/Taxes.js') : path.resolve('./src/models/appModels/Taxes.ts');

  const _adminMod = (await import(pathToFileURL(adminFile).href)) as any;
  const Admin = _adminMod?.default || _adminMod;
  const _adminPassMod = (await import(pathToFileURL(adminPassFile).href)) as any;
  const AdminPassword = _adminPassMod?.default || _adminPassMod;
  const _settingMod = (await import(pathToFileURL(settingFile).href)) as any;
  const Setting = _settingMod?.default || _settingMod;
  const _paymentModeMod = (await import(pathToFileURL(paymentModeFile).href)) as any;
  const PaymentMode = _paymentModeMod?.default || _paymentModeMod;
  const _taxesMod = (await import(pathToFileURL(taxesFile).href)) as any;
  const Taxes = _taxesMod?.default || _taxesMod;

  await Admin.deleteMany();
  await AdminPassword.deleteMany();
  await PaymentMode.deleteMany();
  await Taxes.deleteMany();
  console.log('👍 Admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  await Setting.deleteMany();
  console.log('👍 Setting Deleted. To setup Setting data, run\n\n\t npm run setup\n\n');

  process.exit();
}

deleteData();
