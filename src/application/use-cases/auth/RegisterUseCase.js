import { User } from '../../../domain/entities/User.js';
import { Email } from '../../../domain/value-objects/Email.js';
import { Password } from '../../../domain/value-objects/Password.js';
import { UserAlreadyExistsException } from '../../../domain/exceptions/UserAlreadyExistsException.js';

export class RegisterUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ 
    email, 
    password, 
    firstName, 
    lastName, 
    role = 'USER', 
    profilePhotoUrl = null, 
    gender = null,
    age = null,
    preferredTags = []
  }) {
    const emailVO = new Email(email);
    const passwordVO = new Password(password);

    const existingUser = await this.userRepository.findByEmail(emailVO.toString());
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await this.passwordHasher.hash(passwordVO.toString());

    const user = new User({
      email: emailVO.toString(),
      password: hashedPassword,
      firstName,
      lastName,
      role: role === 'ADMIN' ? 'ADMIN' : 'USER',
      profilePhotoUrl: profilePhotoUrl ?? null,
      gender: gender ?? null,
      age: age ?? null,
      favoritePlaces: [],
      visitedPlaces: [],
      preferredTags: preferredTags ?? []
    });

    const savedUser = await this.userRepository.save(user);
    return savedUser.toJSON();
  }
}
