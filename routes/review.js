const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utiles/wrapAsync");
const Review = require("../models/review");
const Listen = require("../models/listing");
const Listing = require("../models/listing");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware");

const reviewController = require("../controllers/reviews");
const { destroyListing } = require("../controllers/listings");

//Post Review Route 
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReviews));

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;