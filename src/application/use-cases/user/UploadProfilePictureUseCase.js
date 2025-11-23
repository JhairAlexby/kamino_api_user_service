export class UploadProfilePictureUseCase {
  constructor(userRepository, imageService) {
    this.userRepository = userRepository;
    this.imageService = imageService;
  }

  async execute({ userId, buffer, mimetype }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }
    const compressed = await this.imageService.validateAndCompress(buffer, mimetype);
    await this.userRepository.updateProfilePicture(userId, compressed);
    return { message: 'Foto de perfil cargada' };
  }
}

