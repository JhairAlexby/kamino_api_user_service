export class GetUsersMLDataUseCase {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }
  
    async execute() {
      const users = await this.userRepository.findAll();
      
      const regularUsers = users.filter(user => user.role === 'USER');
      
      return regularUsers.map(user => ({
        id: user.id,
        age: user.age,
        gender: user.gender,
        favoritePlaces: user.favoritePlaces || [],
        visitedPlaces: user.visitedPlaces || [],
        preferredTags: user.preferredTags || []
      }));
    }
  }
  