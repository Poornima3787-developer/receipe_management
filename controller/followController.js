const Follow=require('../models/follow');
const Recipe=require('../models/recipe');
const Review=require('../models/review');

exports.addFollow=async (req, res) => {
  try {
    const follow = await Follow.create({
      followerId: req.user.id,
      followingId: req.params.userId
    });
    res.json({ message: 'User followed.', follow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFollow= async (req, res) => {
  try {
    await Follow.destroy({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    });
    res.json({ message: 'User unfollowed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollow= async (req, res) => {
  try {
    const following = await Follow.findAll({
      where: { followerId: req.user.id },
      include: [{ model: User, as: 'Following', attributes: ['id', 'username'] }]
    });
    res.json({ following });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActivity= async (req, res) => {
  try {
    const follows = await Follow.findAll({
      where: { followerId: req.user.id },
      attributes: ['followingId']
    });
    const followingIds = follows.map(f => f.followingId);

    const recipes = await Recipe.findAll({
      where: { userId: followingIds },
      include: [{ model: User, attributes: ['id', 'username'] }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const reviews = await Review.findAll({
      where: { userId: followingIds },
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Recipe, attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({ recipes, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


