import { model, Schema } from 'mongoose';

const savingAccountsSchema = new Schema({
    accountNumber: {
        type : Number,
        unique : true,
        default : 0
    },
    documentCustomer: {
        type : String,
        required: true
    },
    openingDate: {
        type : Date
    },
    balance:{
        type : String,
        default: 0
    },
    accessKey: {
        type: String
    }
},
{
    versionKey: false,
    timestamps: true
})

export default model('accounts', savingAccountsSchema, 'accounts' )