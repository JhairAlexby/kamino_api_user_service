import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export class JwtTokenGenerator {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '24h';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  generateAccessToken(user) {
    return jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      this.secret,
      { expiresIn: this.accessTokenExpiry }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { 
        userId: user.id,
        type: 'refresh'
      },
      this.secret,
      { expiresIn: this.refreshTokenExpiry }
    );
  }

  verify(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}