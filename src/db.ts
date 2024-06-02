import mongoose from 'mongoose';

export default async (mongoConnectionString: string) => {
  try {
    await mongoose.connect(mongoConnectionString);
    console.log(new Date(), 'Connected to the MongoDB database');
  } catch (error) {
    throw new Error(`Could not connect to the database: ${error}`);
  }
};
