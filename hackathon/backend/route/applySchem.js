const router = require("express").Router();
const auth = require("../middleware/auth");
const { applySchem, getAllApplications, verify_user, hasAlready, usersOfSchem, OneApplication } = require("../controller/applyScema");
const isAdmin = require("../middleware/admin");

router.post("/apply", auth, applySchem);

router.post("/apply/check", auth, hasAlready);

// admin
router.get("/apply/all", auth, isAdmin, getAllApplications);

router.get("/apply/users/:id", auth, isAdmin, usersOfSchem);

router.post("/apply/verify", auth, isAdmin, verify_user);

router.get("/apply/:uid/:sid", auth, isAdmin, OneApplication);


module.exports = router