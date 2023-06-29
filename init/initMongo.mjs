import mongoose, { Schema, model } from 'mongoose';
import jsonDataForMongo from './jsonDataforMongo.json' assert { type: 'json' };
import bcrypt from 'bcrypt';

async function addDataMongo(url, salt) {
  try {
    await mongoose.connect(url);

    const schema = new Schema({
      username: String,
      email: String,
      password: String,
      token: { type: String, default: null },
    });
    const User = model('user', schema);

    const usersHashedData = await Promise.all(
      jsonDataForMongo.map(async (user) => {
        const hashedPasword = await bcrypt.hash(user.password, +salt);

        return { ...user, password: hashedPasword };
      }),
    );

    await User.insertMany(usersHashedData);
  } catch (err) {
    console.error(`Failed to connect to MongoDB at ${url}`, err);
    process.exit(1);
  }
}

export default addDataMongo;
