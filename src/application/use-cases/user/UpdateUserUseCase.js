import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException.js';

export class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, updates) {
    const updated = await this.userRepository.updateById(id, updates);
    if (!updated) throw new UserNotFoundException();
    return updated.toJSON();
  }
}

