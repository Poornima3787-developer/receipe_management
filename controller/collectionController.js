const Collection = require('../models/collections');
const Recipe=require('../models/recipe');
const Favorite=require('../models/favorite');

exports.createCollection = async (req, res) => {
    try {
        const { name } = req.body;
        const collection = await Collection.create({ name, UserId: req.user.id });
        res.status(201).json({ message: 'Collection created', collection });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create collection' });
    }
};

exports.getCollections = async (req, res) => {
    try {
        const collections = await Collection.findAll({ where: { UserId: req.user.id } });
        res.json({ collections });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch collections' });
    }
};

exports.addToCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { favoriteId } = req.body;

        const collection = await Collection.findOne({
            where: { id: collectionId, userId: req.user.id }
        });
        if (!collection) return res.status(404).json({ message: 'Collection not found' });

        const favorite = await Favorite.findOne({
            where: { id: favoriteId, userId: req.user.id }
        });
        if (!favorite) return res.status(404).json({ message: 'Favorite not found' });

        favorite.CollectionId = collectionId;
        await favorite.save();

        res.json({ message: 'Favorite added to collection successfully', favorite });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add favorite to collection' });
    }
};

exports.removeFromCollection = async (req, res) => {
    try {
        const { collectionId, favoriteId } = req.params;

        const collection = await Collection.findByPk(collectionId);
        if (!collection || collection.UserId !== req.user.id) {
            return res.status(404).json({ message: 'Collection not found or unauthorized' });
        }

        const favorite = await Favorite.findByPk(favoriteId);
        if (!favorite || favorite.UserId !== req.user.id || favorite.CollectionId != collectionId) {
            return res.status(404).json({ message: 'Favorite not found in this collection' });
        }

        favorite.CollectionId = null;
        await favorite.save();

        res.json({ message: 'Favorite removed from collection' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to remove favorite from collection' });
    }
};

exports.getCollectionFavorites = async (req, res) => {
    try {
        const { id } = req.params;
        const collection = await Collection.findOne({
            where: { id, UserId: req.user.id },
            include: [
                {
                    model: Favorite,
                    include: [Recipe],
                },
            ],
        });

        if (!collection) return res.status(404).json({ message: 'Collection not found' });

        res.json({ collection, favorites: collection.Favorites });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch collection favorites' });
    }
};
