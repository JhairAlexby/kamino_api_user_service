import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException.js';

export class RemoveVisitedPlaceUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, placeId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    // Filtrar el ID (igual que favoritos)
    const visitedPlaces = (user.visitedPlaces || []).filter(id => id !== placeId);
    await this.userRepository.updateById(userId, { visitedPlaces });

    return {
      success: true,
      message: 'Lugar eliminado de visitados',
      visitedPlaces
    };
  }
}
