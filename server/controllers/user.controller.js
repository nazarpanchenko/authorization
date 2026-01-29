const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const ApiError = require("../exceptions/api-error");

class UserController {
  async signUp(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { email, password } = req.body;
      const userData = await userService.signUp(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 60 * 5000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.signIn(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 60 * 5000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (err) {
      return next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(204).json();
      }
      await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const userData = await userService.refresh(req.cookies.refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 60 * 5000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async activate(req, res, next) {
    try {
      await userService.activate(req.params.link);
      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.clearCookie("refreshToken");
      res.json({ message: `User with id ${id} has been successfully deleted` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
