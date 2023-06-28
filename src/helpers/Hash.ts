import * as bcrypt from 'bcrypt';

class Hash {
  hashData = async (data: string): Promise<string> =>
    await bcrypt.hash(data, +process.env.SALT_ROUNDS || 10);

  compareData = async (data: string, hash: string): Promise<boolean> =>
    await bcrypt.compare(data, hash);
}

export default new Hash();
