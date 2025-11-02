import { GetUserProfileUseCase } from '../../../../application/use-cases/user/GetUserProfileUseCase.js';

export class UserController {
  constructor(userRepository) {
    this.getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await this.getUserProfileUseCase.execute(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}