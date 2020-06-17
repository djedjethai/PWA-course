const jwt = 'jsonwebtoken';

module.export = (req, res, next) => {
    
    const authHeaders = req.get('Authorization');
    if (!authHeaders) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    const token = req.get('Authorization').spli(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "ThisSecretShouldBeLongueur");
    } catch(err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    res.userId = decodedToken._id;
    console.log('req.userId from is-auth middleware');
    console.log(req.userId);
    next();
}