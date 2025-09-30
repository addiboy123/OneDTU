const User = require("../../models/User");
const Item = require("../../models/hostelcart/Item");
const Category = require("../../models/hostelcart/Category"); // during creation/lookup
const { uploadImage, deleteFile } = require("../../util/cloud");


exports.createItem = async (req,res) => {
    try {
        // use authenticated user id (set by route middleware)
        const userId = req.user && req.user.userId;
        const { itemName, itemDescription, itemPrice, itemCategory } = req.body;
        
        if (!userId || !itemName || !itemPrice || !itemCategory || !req.files || req.files.length === 0) {
            return res.status(400).json({ message: "All fields and at least one image are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const category = await Category.findOne({ categoryName: itemCategory });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Upload all images to Cloudinary and get URLs
        const imageUploadPromises = req.files.map(file => uploadImage(file.buffer));
        const uploadedImageUrls = await Promise.all(imageUploadPromises);
        const formattedPictures = uploadedImageUrls.map(img => img.secure_url);

        // Create item document in items collection
        const createdItem = await Item.create({
            itemName,
            itemDescription: itemDescription || "",
            itemPrice,
            itemCategory: category._id,
            itemPictures: formattedPictures
        });

        // Add reference to user
        user.item.push(createdItem._id);
        await user.save();

        return res.status(201).json({ message: "Item created successfully", item: createdItem });

    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


exports.getUserItems = async (req,res) =>{
    try{
        // only allow fetching the authenticated user's items
        const userId = req.user && req.user.userId;

        const user = await User.findById(userId).populate({
            path: 'item',
            populate: { path: 'itemCategory', model: 'categories' }
        });
        if(!user){
            return res.status(404).json({
                message: "no user found",
                success: false,
            });
        }

        const userItems = user.item;

        return res.status(200).json({
            message: "Items retrieved successfully",
            success: true,
            items: userItems,
        });
    }catch(error){
        console.error("Error fetching user items:", error);
        res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message,
        });
    }
}


exports.getOtherItems = async (req,res) =>{
    try {
        // no college filter - return items from all users except the requester
        const userId = req.user && req.user.userId;

        // Fetch users excluding requesting user and populate their items
        const users = await User.find({ _id: { $ne: userId } }).populate({
            path: 'item',
            populate: { path: 'itemCategory', model: 'categories' }
        });

        if (users.length === 0) {
            return res.status(404).json({ message: "No other users found", success: false });
        }

        let items = [];
        users.forEach(user => {
            user.item.forEach(item => {
                items.push({
                    ...item.toObject(),
                    seller: {
                        name: user.name,
                        phoneNumber: user.phoneNumber,
                        profile_photo_url: user.profile_photo_url,
                    }
                });
            });
        });

        return res.status(200).json({
            message: "Items retrieved successfully",
            success: true,
            items: items,
        });

    } catch (error) {
        console.error("Error fetching user items:", error);
        res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message,
        });
    }
}


exports.getItemsByCategory = async (req,res) =>{
    try{
        // read categoryId from query (route is GET)
        const { categoryId } = req.query;
        
        if (!categoryId) {
            return res.status(400).json({ message: "category ID is required", success: false });
        }

        // search across all users for items matching categoryId
        const users = await User.find().populate({
            path: 'item',
            populate: { path: 'itemCategory', model: 'categories' }
        });
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found", success: false });
        }

        let items = [];
        users.forEach(user => {
            user.item.forEach(item => {
                if (item.itemCategory && item.itemCategory._id.toString() === categoryId) {
                    items.push({
                        ...item.toObject(),
                        seller: {
                            name: user.name,
                            phoneNumber: user.phoneNumber,
                            profile_photo_url: user.profile_photo_url,
                        }
                    });
                }
            });
        });
        return res.status(200).json({
            message: "Items retrieved successfully",
            success: true,
            items: items,
        });
    }catch(error){
        console.error("Error fetching user items:", error);
        res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message,
        });
    }
}


exports.updateItem = async (req, res) => {
    try {
        const { itemId, itemName, itemDescription, itemPrice, deletedImages } = req.body;
        const userId = req.user && req.user.userId;

        if (!userId || !itemId) {
            return res.status(400).json({ message: "User ID and Item ID are required", success: false });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Ensure user owns the item
        if (!user.item.some(id => id.toString() === itemId)) {
            return res.status(403).json({ message: "Not authorized to update this item", success: false });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found", success: false });
        }

        // Update text fields if provided
        if (itemName) item.itemName = itemName;
        if (itemDescription) item.itemDescription = itemDescription;
        if (itemPrice) item.itemPrice = itemPrice;

        // Upload new images to Cloudinary
        if (req.files && req.files.length > 0) {
            const imageUploadPromises = req.files.map(file => uploadImage(file.buffer));
            const uploadedImageUrls = await Promise.all(imageUploadPromises);
            const formattedPictures = uploadedImageUrls.map(img => img.secure_url);

            item.itemPictures = [...(item.itemPictures || []), ...formattedPictures];
        }

        // Delete images from Cloudinary & remove from itemPictures array
        if (deletedImages) {
            const imagesToDelete = Array.isArray(deletedImages) ? deletedImages : [deletedImages];

            await Promise.all(imagesToDelete.map(imgUrl => deleteFile(imgUrl)));

            item.itemPictures = (item.itemPictures || []).filter(img => !imagesToDelete.includes(img));
        }

        await item.save();

        return res.status(200).json({
            message: "Item updated successfully",
            success: true,
            item
        });

    } catch (error) {
        console.error("Error updating item:", error);
        return res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message
        });
    }
};


exports.deleteItem = async (req, res) => {
    try {
        const { itemId } = req.body;
        const userId = req.user && req.user.userId;

        if (!userId || !itemId) {
            return res.status(400).json({ message: "User ID and Item ID are required", success: false });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Ensure user owns the item
        const itemIndexInUser = user.item.findIndex(id => id.toString() === itemId);
        if (itemIndexInUser === -1) {
            return res.status(404).json({ message: "Item not found or not owned by user", success: false });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            // still remove reference if item doc missing
            user.item.splice(itemIndexInUser, 1);
            await user.save();
            return res.status(200).json({
                message: "Item reference removed from user (item doc not found)",
                success: true,
            });
        }

        // Delete all images from Cloudinary
        if (item.itemPictures && item.itemPictures.length > 0) {
            const deleteImagePromises = item.itemPictures.map(imageUrl => deleteFile(imageUrl));
            await Promise.all(deleteImagePromises);
        }

        // Remove the item document and its reference from the user
        await Item.deleteOne({ _id: itemId });
        user.item.splice(itemIndexInUser, 1);
        await user.save();

        return res.status(200).json({
            message: "Item and associated images deleted successfully",
            success: true,
        });

    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message,
        });
    }
};


exports.getAllItems = async (req, res) => {
    // this endpoint remains public
    try{
        const users = await User.find().populate({
            path: 'item',
            populate: { path: 'itemCategory', model: 'categories' }
        });
        let items = [];
        users.forEach(user => {
            user.item.forEach(item => {
                items.push({
                    ...item.toObject(),
                    seller: {
                        name: user.name,
                        phoneNumber: user.phoneNumber,
                        profile_photo_url: user.profile_photo_url,
                    },
                    college: null
                });
            });
        });

        return res.status(200).json({
            message: "Items retrieved successfully",
            success: true,
            items: items,
        });
    }
    catch(error){
        console.error("Error fetching all items:", error);
        res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message,
        });
    }
}
