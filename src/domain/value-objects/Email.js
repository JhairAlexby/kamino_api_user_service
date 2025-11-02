export class Email {
    constructor(value) {
      if (!this.isValid(value)) {
        throw new Error('Email inválido');
      }
      this.value = value.toLowerCase().trim();
    }
  
    isValid(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
  
    toString() {
      return this.value;
    }
  }