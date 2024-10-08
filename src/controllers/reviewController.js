const Review = require('../models/Review');
const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');

exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { menuItem, rating, comment, order } = req.body;
    const newReview = new Review({
      user: req.user.id,
      menuItem,
      rating,
      comment,
      order
    });

    const review = await newReview.save();

    // Update menu item's average rating
    const menuItemDoc = await MenuItem.findById(menuItem);
    menuItemDoc.averageRating = (menuItemDoc.averageRating * menuItemDoc.numberOfRatings + rating) / (menuItemDoc.numberOfRatings + 1);
    menuItemDoc.numberOfRatings += 1;
    await menuItemDoc.save();

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewsForMenuItem = async (req, res) => {
  try {
    const reviews = await Review.find({ menuItem: req.params.menuItemId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};