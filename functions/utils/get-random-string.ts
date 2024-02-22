const STRING_LENGTH = 8

export const getRandomString = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;

  let result = '';

  for (let i = 0; i < STRING_LENGTH; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}