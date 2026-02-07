const Listing = require("../models/listing");
const Listen = require("../models/listing");
const axios = require("axios");
const geocoder = require("../utiles/geocoder");


async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;

  const res = await axios.get(url);

  if (res.data.length === 0) return null;

  return {
    lat: parseFloat(res.data[0].lat),
    lng: parseFloat(res.data[0].lon)
  };
}



module.exports.index = async (req,res) =>{
    const listings = await Listing.find({});
    res.render("./listings/index.ejs",{listings});
}

module.exports.renderNewForm = (req,res) => {
    res.render("./listings/new.ejs");
}

module.exports.showListings = async (req,res) => {
    let {id} = req.params;
    const listing = await Listen.findById(id)
        .populate({
            path : "reviews",
            populate : {
                path : "author",
            }
        })
        .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    else{
        res.render("./listings/show.ejs",{listing});
    }   
}

module.exports.createListings = async (req,res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    const geoData = await geocoder.geocode(req.body.listing.location);

    const newListing = new Listing(req.body.listing);

    newListing.geometry = {
      type: "Point",
      coordinates: [geoData[0].longitude, geoData[0].latitude]
    };

    newListing.owner = req.user._id;
    newListing.image = {url , filename};

    await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    let listing = await Listen.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    else{
        let originalImageUrl =  listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
        res.render("./listings/edit.ejs",{listing,originalImageUrl});
    }
}

module.exports.updateListing = async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
    const deletedListing = await Listen.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}