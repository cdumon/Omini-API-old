const jwt = require("jsonwebtoken");
const models = require(`${appRoot}/models`);
const config = require("../config.json");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token was provided" });
    }

    jwt.verify(token, config.jwt.key.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "The token provided is incorrect" });
        }
        req.id = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    models.user.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        models.role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                res.status(403).send({ message: "Require Admin Role" });
            }
        );
    });
};

isModerator = (req, res, next) => {
    models.user.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        models.role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "moderator") {
                        next();
                        return;
                    }
                }

                res.status(403).send({ message: "Require Moderator Role" });
            }
        );
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};
module.exports = authJwt;