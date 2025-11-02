export class LogoutUseCase {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }
  
    async execute(userId, refreshToken) {
      if (refreshToken) {
        await this.userRepository.deleteRefreshToken(refreshToken);
      }
      return { message: 'Sesión cerrada exitosamente' };
    }
  }