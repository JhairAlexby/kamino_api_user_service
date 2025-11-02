export class User {
    constructor({ id, email, firstName, lastName, password, role, isActive, createdAt, updatedAt }) {
      this.id = id;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.password = password;
      this.role = role || 'USER';
      this.isActive = isActive ?? true;
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
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  }