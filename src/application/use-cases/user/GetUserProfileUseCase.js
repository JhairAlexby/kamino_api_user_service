import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException.js';

export class GetUserProfileUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user.toJSON();
  }
}