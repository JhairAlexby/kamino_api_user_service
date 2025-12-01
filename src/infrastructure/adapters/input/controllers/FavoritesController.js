import { AddFavoritePlaceUseCase } from '../../../../application/use-cases/user/AddFavoritePlaceUseCase.js';
import { RemoveFavoritePlaceUseCase } from '../../../../application/use-cases/user/RemoveFavoritePlaceUseCase.js';
import { AddVisitedPlaceUseCase } from '../../../../application/use-cases/user/AddVisitedPlaceUseCase.js';
import { RemoveVisitedPlaceUseCase } from '../../../../application/use-cases/user/RemoveVisitedPlaceUseCase.js';

export class FavoritesController {
  constructor(userRepository) {
    this.addFavoritePlaceUseCase = new AddFavoritePlaceUseCase(userRepository);
    this.removeFavoritePlaceUseCase = new RemoveFavoritePlaceUseCase(userRepository);
    this.addVisitedPlaceUseCase = new AddVisitedPlaceUseCase(userRepository);
    this.removeVisitedPlaceUseCase = new RemoveVisitedPlaceUseCase(userRepository);
  }

  async addFavorite(req, res, next) {
    try {
      const userId = req.user.userId;
      const { placeId } = req.body;
      
      if (!placeId) {
        return res.status(400).json({ error: 'placeId es requerido' });
      }
      
      const result = await this.addFavoritePlaceUseCase.execute(userId, placeId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeFavorite(req, res, next) {
    try {
      const userId = req.user.userId;
      const { placeId } = req.params;
      
      const result = await this.removeFavoritePlaceUseCase.execute(userId, placeId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async addVisited(req, res, next) {
    try {
      const userId = req.user.userId;
      const { placeId } = req.body;
      
      if (!placeId) {
        return res.status(400).json({ error: 'placeId es requerido' });
      }
      
      const result = await this.addVisitedPlaceUseCase.execute(userId, placeId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeVisited(req, res, next) {
    try {
      const userId = req.user.userId;
      const { placeId } = req.params;
      
      const result = await this.removeVisitedPlaceUseCase.execute(userId, placeId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
