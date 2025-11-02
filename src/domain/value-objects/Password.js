export class Password {
    constructor(value) {
      if (!this.isValid(value)) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }
      this.value = value;
    }
  
    isValid(password) {
      return password && password.length >= 8;
    }
  
    toString() {
      return this.value;
    }
  }