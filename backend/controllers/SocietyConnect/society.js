const Society = require('../../models/SocietyConnect/societies');
const { BadRequestError, NotFoundError } = require('../../errors');
const { uploadImage, deleteFile } = require('../../util/cloud');

// Update society bio data: description, contactDetails, images, achievements
exports.updateSociety = async (req, res) => {
    const societyId = req.params.id;
    const { description, contactDetails, achievements } = req.body;

    // deletedImages may come as JSON string when sent via multipart/form-data
    let deletedImages = req.body.deletedImages;
    if (deletedImages && typeof deletedImages === 'string') {
        try {
        deletedImages = JSON.parse(deletedImages);
        } catch (e) {
        // keep as string if not JSON
        }
    }

    if (!societyId) throw new BadRequestError('Society id is required');

    const society = await Society.findById(societyId);
    if (!society) throw new NotFoundError('Society not found');

    // Only the societyAdmin belonging to this society should be allowed.
    // `authentication.societyadmin` attaches req.societyAdmin.society
    if (!req.societyAdmin || req.societyAdmin.society.toString() !== societyId.toString()) {
        throw new BadRequestError('Not authorized to update this society');
    }

    if (description !== undefined) society.description = description;
    if (contactDetails !== undefined) society.contactDetails = contactDetails;
    if (achievements !== undefined) society.achievements = achievements;

    // Handle deleted images (array of image URLs)
    if (deletedImages) {
        const imagesToDelete = Array.isArray(deletedImages) ? deletedImages : [deletedImages];
        await Promise.all(imagesToDelete.map(url => deleteFile(url)));
        society.images = (society.images || []).filter(img => !imagesToDelete.includes(img));
    }

    // Handle newly uploaded images (req.files expected from multer memory storage)
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadImage(file.buffer));
        const results = await Promise.all(uploadPromises);
        const uploadedUrls = results.map(r => r.secure_url || r.url);
        society.images = [...(society.images || []), ...uploadedUrls];
    }

    await society.save();

    // return society and explicit images list
    res.status(200).json({ message: 'Society updated', society, images: society.images || [] });
};

// Public: get all societies (open to anyone)
exports.getAllSocieties = async (req, res) => {
    // Optionally add pagination later
    const societies = await Society.find().select('name description images achievements contactDetails posts createdAt updatedAt');
    res.status(200).json({ message: 'Societies retrieved', count: societies.length, societies });
};

// Public: get society by id
exports.getSocietyById = async (req, res) => {
    const id = req.params.id;
    if (!id) throw new BadRequestError('Society id is required');

    const society = await Society.findById(id).select('-__v');
    if (!society) throw new NotFoundError('Society not found');

    res.status(200).json({ message: 'Society retrieved', society });
};
