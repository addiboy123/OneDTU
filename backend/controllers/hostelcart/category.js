const Category = require("../models/categories");

exports.getCategories = async (req, res) => {
    try {
        const allCategories = await Category.find();

        if (!allCategories || allCategories.length === 0) {
            return res.status(404).json({
                message: "No categories found",
                success: false
            });
        }

        const categoryNames = allCategories.map(category => category.categoryName);
        const categoryIds = allCategories.map(category => category._id.toString());

        return res.status(200).json({
            message: "Categories fetched successfully",
            success: true,
            data: categoryNames,
            categoryIds: categoryIds
        });
    } catch (error) {
        console.error("Error fetching categories: ", error);
        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
            success: false
        });
    }
};
