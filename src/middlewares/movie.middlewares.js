const Joi = require("joi");

const movieValidator = Joi.object({
  name: Joi.string().required().min(4).max(100),
  description: Joi.string().required(),
  casts: Joi.array().items(Joi.string().required()).min(1).required(),
  trailerUrl: Joi.string().uri().required(),
  language: Joi.string().optional(),
  releaseDate: Joi.string().required(),
  director: Joi.string().required(),
  releaseStatus: Joi.string()
    .valid("RELEASED", "UNRELEASED", "BLOCKED")
    .required(),
  poster: Joi.string().uri().required(),
});

const validateMovie = (req, res, next) => {
  const { error } = movieValidator.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      success: false,
      error: error.details.map((e) => e.message),
      data: null,
    });
  }

  next();
};

module.exports = validateMovie;
