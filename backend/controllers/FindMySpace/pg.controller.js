const PG = require('../../models/FindMySpace/PG'); // Adjust path to your PG model as needed
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../../errors'); // Assuming you have custom error classes

/**
 * @desc    Get all PG listings with their room posts
 * @route   GET /api/v1/PGs
 * @access  Public
 */
exports.getAllPGs = async (req, res) => {
    // Find all PGs, populate the 'posts' field with documents from the 'PGPost' collection,
    // and sort by the most recently created.
    const pgs = await PG.find({})
        .populate({
            path: 'posts',
            model: 'PGPost' // Explicitly specify the model name for clarity
        })
        .sort('-createdAt');

    res.status(StatusCodes.OK).json({ count: pgs.length, pgs });
};

/**
 * @desc    Get a single PG by its ID, including its room posts
 * @route   GET /api/v1/PG/:id
 * @access  Public
 */
exports.getPGById = async (req, res) => {
    const { id: pgId } = req.params;

    const pg = await PG.findById(pgId)
        .populate({
            path: 'posts',
            model: 'PGPost'
        });

    if (!pg) {
        throw new NotFoundError(`No PG found with id: ${pgId}`);
    }

    res.status(StatusCodes.OK).json({ pg });
};
