import { connect } from 'mongoose'

export async function dbConnect() {
    try {
        await connect(process.env.MONGO_CNN);
        console.log('Connect to server database');
    } catch (error) {
        console.log(error);
    }
}

export default dbConnect