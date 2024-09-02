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
    try {
        const { accessKey, documentCustomer, openingDate, balance = 0 } = req.body;

        const hashedAccessKey = await bcrypt.hash(accessKey, 10);

        const lastAccount = await savingAccounts.findOne().sort({ accountNumber: -1 });
        const accountNumber = lastAccount ? lastAccount.accountNumber + 1 : 1;

        // Crear una nueva cuenta
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

export async function postDeposit(req, res) {
    const { balance } = req.body;

    if (balance <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    try {
        const account = await savingAccounts.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'User not found' });
        }

        account.saldo += balance;
        await account.save();
        res.status(200).json({ message: 'Deposit Successful', newBalance: account.balance });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Post para retirar dinero de una cuenta

export async function postRetire(req, res) {
    const { balance } = req.body;

    if (balance <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    try {
        const account = await savingAccounts.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (account.balance < balance) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        account.balance -= balance;
        await account.save();
        res.status(200).json({ message: 'Retire Successful', newBalance: account.balance });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete para eliminar una cuenta *-*

export async function deleteAccount(req, res) {
    try {
        const account = await savingAccounts.findById(req.params.id);

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        if (account.balance !== 0) {
            return res.status(400).json({ error: 'Account balance must be 0 to delete' });
        }

        await savingAccounts.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'The account has been deleted', account });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
