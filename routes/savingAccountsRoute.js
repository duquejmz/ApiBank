import { Router } from 'express';
import { deleteAccount, getAccounts, PostAccount, putDeposit, putRetire, getAllActiveAcounts, getAllInactiveAcounts } from '../controllers/savingAccountsController.js';

const savingAccountsRouter = Router()

savingAccountsRouter.get('/', getAccounts);
savingAccountsRouter.get('/status', getAllActiveAcounts);
savingAccountsRouter.get('/inactive', getAllInactiveAcounts);
savingAccountsRouter.post('/', PostAccount);
savingAccountsRouter.delete('/:id', deleteAccount);
savingAccountsRouter.put('/:id', putDeposit);
savingAccountsRouter.put('/retire/:id', putRetire);

export default savingAccountsRouter