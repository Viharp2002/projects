const router = require("express").Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

const { Login, Register, Info, allUser, post_extra_info, oneUser, updateUser } = require("../controller/user")

router.post("/signup", Register);
router.post("/login", Login);

// auth 
router.get("/info", auth, Info);
router.put("/change", auth, updateUser);

//admin
router.get("/all", auth, isAdmin, allUser);
router.get("/one/:id", auth, isAdmin, oneUser);

module.exports = router;
