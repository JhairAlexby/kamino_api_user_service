import bcrypt from 'bcryptjs';

export class BcryptPasswordHasher {
  async hash(password) {
    return bcrypt.hash(password, 10);
  }

  async compare(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}