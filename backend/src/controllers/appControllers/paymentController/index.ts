import createCRUDController from '../../middlewaresControllers/createCRUDController';
const methods: Record<string, any> = createCRUDController('Payment');

import create from './create';
import summary from './summary';
import update from './update';
import remove from './remove';
import sendMail from './sendMail';

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;

export default methods;
