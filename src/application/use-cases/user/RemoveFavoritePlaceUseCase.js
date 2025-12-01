import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException.js';

export class RemoveFavoritePlaceUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, placeId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const favoritePlaces = (user.favoritePlaces || [])
      .filter(id => id !== placeId);

    await this.userRepository.updateById(userId, { 
      favoritePlaces 
    });

    return {
      success: true,
      message: 'Lugar eliminado de favoritos',
      favoritePlaces
    };
  }
}
