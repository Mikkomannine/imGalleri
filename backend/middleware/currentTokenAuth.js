const currentTokenAuth = async (req, res, next) => {
        const targetUserId = req.params.id;
        const requestingUserId = req.user._id
          
        if (targetUserId !== requestingUserId.toString()) {
            return res.status(403).json({ error: 'Not your account' });
        }
        next();
    }

module.exports = currentTokenAuth;
