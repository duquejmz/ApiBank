import savingAccounts from "../models/savingAccounts.js";
import bcrypt from 'bcryptjs'

// Get para listar los datos de una cuenta

export async function getAccounts (req, res) {
    try {
        const accounts = await savingAccounts.find();
        if (!accounts) return res.status(404).json({ error : 'The account not found'});
        res.status(200).json(accounts)
    } catch (error) {
        res.status(400).json({ message : error.message });
    }
}

// Post para crear los datos de una cuenta 

export async function PostAccount(req, res) {
    const { accessKey: accessKey, documentCustomer, openingDate, balance } = req.body;

    try {
        const hashedAccessKey = await bcrypt.hash(accessKey, 10);

        const lastAccount = await savingAccounts.findOne().sort('-accountNumber');
        const accountNumber = lastAccount ? lastAccount.accountNumber + 1 : 1;

        const newAccount = new savingAccounts({
            accountNumber,
            documentCustomer: documentCustomer || undefined,
            openingDate: openingDate ? new Date(openingDate) : undefined,
            balance,
            accessKey: hashedAccessKey 
        });

        await newAccount.save();
        res.status(200).json(newAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Post para consignar dinero en una cuenta

export async function postDeposit (req, res) {
    const { balance } = req.body;

    if(balance <= 0){
        return res.status(400).json('Invalid amount')
    }
    try {
        const account = await savingAccounts.findById(req.params.id);
        if(!account){
            return res.status(404).json('User not found')
        }
        savingAccounts.balance += balance
        await account.save()
        res.status(200).json('Deposit Succesful', 'New Balance:${savingAccounts.balance}')
    } catch (error) {
        res.status(400).json({ message : error.message })
    }
}

// Post para retirar dinero de una cuenta

export async function postRetire (req, res) {
    const { balance } = req.body
    if (balance <= 0){
        return res.status(404).json('Invalid amount')
    }
    try {
        const account = await savingAccounts.findById(req.params.id)
        if(account) { return res.status(404).json('User not found');
        } if(savingAccounts.balance < balance){
            return res.status(400).json('Insufficient founds')
        }
        savingAccounts.balance-= balance;
        await savingAccounts.save();
        res.status(200).json('Retire Succesfull', 'New Balance:${savingAccounts.balance}')
    } catch (error) {
        res.status(400).json({ message : error.message })
    }
}

// Delete para eliminar una cuenta *-*

export async function deleteAccount (req, res) {
    try {
        const account = await savingAccounts.findOneAndDelete(
            { balance : 0 }
        );
        if (!account) return res.status(404).json({ error : 'No accounts in 0' })
        res.status(200).json(account, 'The account have be deleted')
    } catch (error) {
        res.status(400).json({ message : error.message })
    }
}