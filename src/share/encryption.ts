import * as bcrypt from 'bcrypt';

/**
 * @description 对数据进行 hash
 */
export const cryption = async (data: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data, salt);
  return hash;
};

export const encryption = async (data: string, cryptionData: string) => {
  return await bcrypt.compare(data, cryptionData);
};
