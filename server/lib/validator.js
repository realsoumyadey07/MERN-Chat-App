import { body, validationResult } from "express-validator";

export const registerValidator = () => [
  body("username", "Please enter username")
    .notEmpty()
    .isLength({ min: 3, max: 15 })
    .withMessage("Username must be between 3 to 15 characters"),
  body("email", "Please enter email")
    .notEmpty()
    .isEmail()
    .withMessage("Please enter valid email"),
  body("password", "Please enter password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidator = ()=> [
    body("email", "Please enter email")
        .notEmpty()
        .isEmail()
        .withMessage("Please enter valid email"),
    body("password", "Please enter password")
        .notEmpty(),
]

export const validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  const errorMessages = errors.array().map((error) => error.msg).join(", ");
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errorMessages,
    });
  }
  if (errors.isEmpty()) return next();
};
