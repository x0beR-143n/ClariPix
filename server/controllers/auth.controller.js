const { StatusCodes } = require('http-status-codes');
const userService = require('../services/user.service');

async function register(req, res, next) {
    try {
        const { name, email, password, gender, birthdate } = req.body;

        const user = await userService.register({ name, email, password, gender, birthdate });

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const result = await userService.login({ email, password });

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login
};