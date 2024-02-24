const express = require("express");
const router = express.Router();
const controller = require("../controllers/authorsController");
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;