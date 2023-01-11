const { getSchems, getSchemInfo, addSchem, updateSchem, deleteSchem, searchSchema, getMyschema } = require("../controller/schem");
const { uploadImage } = require("../config/upload");


const isAdmin = require("../middleware/admin");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.get("/all", getSchems);

router.get("/filter/", searchSchema);

//auth 
router.get("/my", auth, getMyschema);
router.get("/:id", getSchemInfo);

//admin
router.post("/", auth, isAdmin, uploadImage.single('image'), addSchem);

router.put("/:id", auth, isAdmin, uploadImage.single('image'), updateSchem);

router.delete("/:id", auth, isAdmin, deleteSchem);

module.exports = router;