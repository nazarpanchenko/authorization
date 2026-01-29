const router = require("express").Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/sign-up",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.signUp,
);
router.post("/sign-in", userController.signIn);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
