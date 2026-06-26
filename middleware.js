const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {ListingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review");

module.exports.isLoggedIn = (req,res,next) => {
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    
    let message = "You must be logged in!";
    if (req.originalUrl.includes("/ai/plan")) {
        message = "You must be logged in to plan your trip with AI!";
    } else if (req.originalUrl.includes("/reviews")) {
        message = "You must be logged in to manage reviews!";
    } else if (req.originalUrl.includes("/listings")) {
        message = "You must be logged in to manage listings!";
    }
    
    req.flash("error", message);
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner  = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }else{
      next();

    }
};

module.exports.validateReview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
}
};

module.exports.isReviewAuthor  = async (req,res,next) =>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author || !review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
      next();
};
