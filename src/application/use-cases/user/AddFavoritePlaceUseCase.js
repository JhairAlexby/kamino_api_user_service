import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException.js';

export class AddFavoritePlaceUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, placeId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const favoritePlaces = user.favoritePlaces || [];
    
    // Verificar si ya está en favoritos
    if (favoritePlaces.includes(placeId)) {
      return {
        success: false,
        message: 'El lugar ya está en favoritos',
        favoritePlaces
      };
    }

    // Agregar a favoritos
    favoritePlaces.push(placeId);

    // Actualizar en BD
    await this.userRepository.updateById(userId, { 
      favoritePlaces 
    });

    return {
      success: true,
      message: 'Lugar agregado a favoritos',
      favoritePlaces
    };
  }
}
