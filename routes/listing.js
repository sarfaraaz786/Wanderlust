const express = require("express");
const router = express.Router();
const wrapAsync = require("../utiles/wrapAsync");
const Review = require("../models/review");
const Listen = require("../models/listing");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner,validateListing} = require("../middleware");
const listingController = require("../controllers/listings");
const multer = require("multer"); // help to parse image which is uploaded by user
const {storage} = require("../cloudConfig");
const upload = multer({ storage });  //destinationn where file will save

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListings))
    


// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateListing))
    .get(wrapAsync(listingController.showListings))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))

//edit Route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.renderEditForm))

module.exports = router;