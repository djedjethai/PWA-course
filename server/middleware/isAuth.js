const jwt = require('jsonwebtoken');
                               
module.exports = (req, res, next) => {
    // we verif if headers is setted up with Authorization
    console.log('ds putain de authentication')
    console.log(req.get('Authorization'));
    const authHeaders = req.get('Authorization');
 
    // si pas de auth, pas la peine d'aller plus loin
    if (!authHeaders) {        
        const error = new Error('Not authenticated'); 
        error.statusCode = 401;
        throw error;
    } 
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;  

    try { 
        decodedToken = jwt.verify(token, "thisSecretShouldBeLongueur");
    } catch(err) {
        err.statusCode = 500;  
        throw err;
    }   
    if (!decodedToken) {       
        const error = new Error('Not authenticated'); 
        error.statusCode = 401;
        throw error;           
    }   
    req.userId = decodedToken._id;  
    console.log('req.userId from is-auth middleware');
    console.log(req.userId);   
    next();
} 
