import { Email } from '../../../domain/value-objects/Email.js';
import { InvalidCredentialsException } from '../../../domain/exceptions/InvalidCredentialsException.js';
import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException.js';

export class LoginUseCase {
  constructor(userRepository, passwordHasher, tokenGenerator) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenGenerator = tokenGenerator;
  }

  async execute({ email, password }) {
    const emailVO = new Email(email);
    
    const user = await this.userRepository.findByEmail(emailVO.toString());
    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.isActive) {
      throw new InvalidCredentialsException('Usuario inactivo');
    }

    const isPasswordValid = await this.passwordHasher.compare(password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const accessToken = this.tokenGenerator.generateAccessToken(user);
    const refreshToken = this.tokenGenerator.generateRefreshToken(user);

    await this.userRepository.saveRefreshToken(user.id, refreshToken);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken
    };
  }
}