const express = require("express");
const router = express.Router();
const aiController = require("../../controllers/ai.js");
const wrapAsync = require("../../utils/wrapAsync.js");
const { isLoggedIn } = require("../../middleware.js");
router.route("/plan")
    .get(isLoggedIn, aiController.renderPlanForm)
    .post(isLoggedIn, wrapAsync(aiController.generatePlan));
module.exports = router;
