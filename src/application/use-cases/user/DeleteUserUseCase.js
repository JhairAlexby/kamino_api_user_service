import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException.js';

export class DeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new UserNotFoundException();
    await this.userRepository.deleteById(id);
    return { success: true };
  }
}

