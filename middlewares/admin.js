export const isAdmin = (req, res, next) => {
    if (!req.session.isAdmin) {
        // Eğer admin değilse, login sayfasına at veya 403 ver
        return res.status(403).send('Yetkiniz yok');
    }
    next();
};
