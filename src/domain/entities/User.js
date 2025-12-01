export class User {
  constructor({ 
    id, 
    email, 
    firstName, 
    lastName, 
    password, 
    role, 
    isActive, 
    profilePhotoUrl, 
    gender,
    age,
    favoritePlaces,
    visitedPlaces,
    preferredTags,
    createdAt, 
    updatedAt 
  }) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.role = role || 'USER';
    this.isActive = isActive ?? true;
    this.profilePhotoUrl = profilePhotoUrl ?? null;
    this.gender = gender ?? null;
    this.age = age ?? null;
    this.favoritePlaces = favoritePlaces ?? [];
    this.visitedPlaces = visitedPlaces ?? [];
    this.preferredTags = preferredTags ?? [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isAdmin() {
    return this.role === 'ADMIN';
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      isActive: this.isActive,
      profilePhotoUrl: this.profilePhotoUrl,
      gender: this.gender,
      age: this.age,
      favoritePlaces: this.favoritePlaces,
      visitedPlaces: this.visitedPlaces,
      preferredTags: this.preferredTags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
