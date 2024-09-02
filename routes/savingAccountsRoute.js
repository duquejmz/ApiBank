import { Router } from 'express';
import { deleteAccount, getAccounts, PostAccount, postDeposit, postRetire } from '../controllers/savingAccountsController.js';

const savingAccountsRouter = Router()

savingAccountsRouter.get('/', getAccounts);
savingAccountsRouter.post('/', PostAccount);
savingAccountsRouter.delete('/balance', deleteAccount);
savingAccountsRouter.post('/+:id', postDeposit);
savingAccountsRouter.post('/retire/:id', postRetire);

export default savingAccountsRouter