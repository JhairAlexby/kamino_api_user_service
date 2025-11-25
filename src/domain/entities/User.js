export class User {
    constructor({ id, email, firstName, lastName, password, role, isActive, profilePhotoUrl, gender, createdAt, updatedAt }) {
      this.id = id;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.password = password;
      this.role = role || 'USER';
      this.isActive = isActive ?? true;
      this.profilePhotoUrl = profilePhotoUrl ?? null;
      this.gender = gender ?? null;
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
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  }
