export class DeleteProfilePictureUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ userId }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }
    await this.userRepository.deleteProfilePicture(userId);
    return { message: 'Foto de perfil eliminada' };
  }
}

