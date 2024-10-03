const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Render the overview template with tour data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the tour based on the slug and populate reviews
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
// .set(
//   'Content-Security-Policy',
//   "script-src 'self' https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com; connect-src 'self' ws://127.0.0.1:6606;",
// )

exports.getLogInForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id });

  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log('Hello from updateUserData');
  // Only update the fields that are provided in the request body
  // const updates = {};
  // if (req.body.name) updates.name = req.body.name;
  // if (req.body.email) updates.email = req.body.email;

  // Update user data
  console.log(req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    },
  );
  console.log(updatedUser.name, updatedUser.email);
  // Render the account page with the updated user
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
