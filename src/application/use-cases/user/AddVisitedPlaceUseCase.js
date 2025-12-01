import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException.js';

export class AddVisitedPlaceUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, placeId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const visitedPlaces = user.visitedPlaces || [];
    
    // Verificar si ya está marcado como visitado
    if (visitedPlaces.includes(placeId)) {
      return {
        success: false,
        message: 'El lugar ya está marcado como visitado',
        visitedPlaces
      };
    }

    // Agregar solo el ID (igual que favoritos)
    visitedPlaces.push(placeId);
    await this.userRepository.updateById(userId, { visitedPlaces });

    return {
      success: true,
      message: 'Lugar marcado como visitado',
      visitedPlaces,
      totalVisits: visitedPlaces.length
    };
  }
}
