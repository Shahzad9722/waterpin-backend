const express = require("express");
const router = express.Router();
const {
  getAllDestinationsPaginated,
} = require("../../controllers/destinations.controller");
const { uploadImage } = require("../../controllers/uploadDestinationImages");
const { query } = require("express-validator");
/**
 * @route GET /content-assets/browse
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get(
  "/",
  [
    query("type").isLength({ min: 5, max: 15 }),
    query("search").exists(),
    query("page").exists(),
    query("count").exists(),
    query("filter").exists(),
  ],
  getAllDestinationsPaginated
);

router.route("/:id/uploadImage").post(uploadImage);

module.exports = router;
