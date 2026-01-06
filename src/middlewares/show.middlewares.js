const { STATUS } = require("../utils/constants");

const validateCreateShowRequest = (req, res, next) => {
         const { movieId, theaterId, showtime, screenNumber, availableSeats, pricePerSeat } = req.body;
         if (!movieId || !theaterId || !showtime || !availableSeats || !pricePerSeat) {
             return res.status(STATUS.BAD_REQUEST).json({ message: "Missing required fields" });
         }
         // Additional validations can be added here (e.g., data types, formats)
         next();
};

module.exports = {
         validateCreateShowRequest,
};

