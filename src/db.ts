import mongoose from 'mongoose';

export const connect = async (mongoConnectionString: string) => {
  try {
    await mongoose.connect(mongoConnectionString);
    console.log(new Date(), 'Connected to the MongoDB database');
  } catch (error) {
    throw new Error(`Could not connect to the database: ${error}`);
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log(new Date(), 'Disconnected from the MongoDB database');
  } catch (error) {
    throw new Error(`Could not disconnect from the database: ${error}`);
  }
};

export default {
  connect,
  disconnect,
}
