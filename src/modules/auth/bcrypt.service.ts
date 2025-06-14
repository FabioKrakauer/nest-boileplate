import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BcryptService {
  async hashPassword(password: string) {
    const salt = await genSalt();
    return hash(password, salt);
  }

  async isCorrectPassword(password: string, encrypted: string) {
    return compare(password, encrypted);
  }
}