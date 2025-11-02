export const validateRegister = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }
    
    next();
  };
  
  export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }
    
    next();
  };