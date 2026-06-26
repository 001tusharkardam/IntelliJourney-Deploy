const User = require("../models/user");
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
              req.flash("success", "Welcome to Intellijorney!");
              res.redirect("/listings");
        });
      
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success","Welcome back to Intellijorney!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next) =>{
    req.logOut((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    }) ;
}

module.exports.renderProfileForm = async (req, res) => {
    res.render("users/profile.ejs");
};

module.exports.updateProfile = async (req, res) => {
    const { firstName, lastName, mobile, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/listings");
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.mobile = mobile;
    user.email = email;

    if (req.file) {
        user.profileImage = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await user.save();
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
};
