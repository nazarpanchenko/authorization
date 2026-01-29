const dns = require("dns/promises");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const userModel = require("../models/user.model");
const tokenModel = require("../models/token.model");
const mailService = require("./mail.service");
const tokenService = require("./token.service");
const UserDTO = require("../dto/user.dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  async signUp(email, password) {
    const user = await userModel.findOne({ email });
    if (user) {
      throw ApiError.BadRequest(
        `User with email ${email} already exists in database`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      activationLink,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`,
    );

    const userDto = new UserDTO(newUser);
    const tokens = await tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async signIn(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User with email ${email} doesn't exist`);
    }

    if (!user.isActivated) {
      throw ApiError.Forbidden();
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) {
      throw ApiError.BadRequest(`Password is incorrect`);
    }
    const userDto = new UserDTO(user);
    const tokens = await tokenService.generateToken({ ...userDto });
    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest(
        `User with the associated activation link ${activationLink} doesn't exist in database`,
      );
    }
    user.isActivated = true;
    await user.save();
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await userModel.findById(userData.id);
    const userDto = new UserDTO(user);
    const tokens = await tokenService.generateToken({ ...userDto });
    return { ...tokens, user: userDto };
  }

  async getUsers() {
    const users = await userModel.find();
    return users.map((user) => ({
      id: user._id.toString(),
      ...user.toJSON(),
    }));
  }

  async deleteUser(id) {
    await tokenModel.deleteMany({ user: id });
    await userModel.findByIdAndDelete(id);
  }
}

module.exports = new UserService();
