const express = require("express");
const router = express.Router();
const controller = require("../controllers/booksController");
const { authenticate } = require('../middleware/auth');

router.get("/", controller.index);
router.get("/:id", authenticate, controller.show);
router.post("/", authenticate, controller.create);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.destroy);

module.exports = router;