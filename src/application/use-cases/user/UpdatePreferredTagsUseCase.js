import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException.js';

const VALID_TAGS = [
  "Tradicional",
  "Música",
  "Cultura",
  "Educativo",
  "Arte",
  "Naturaleza",
  "Gastronomía",
  "Aventura",
  "Familia",
  "Ciencia",
  "Historia",
  "Tecnología"
];

export class UpdatePreferredTagsUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, tags) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const invalidTags = tags.filter(tag => !VALID_TAGS.includes(tag));
    if (invalidTags.length > 0) {
      throw new Error(`Tags inválidos: ${invalidTags.join(', ')}`);
    }

    const uniqueTags = [...new Set(tags)];

    await this.userRepository.updateById(userId, { 
      preferredTags: uniqueTags 
    });

    return {
      success: true,
      message: 'Preferencias actualizadas',
      preferredTags: uniqueTags
    };
  }
}
