const Society = require('../../models/SocietyConnect/societies');
const { BadRequestError } = require('../../errors');

exports.createSociety = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    throw new BadRequestError('Society name is required');
  }

  const existing = await Society.findOne({ name: name.trim() });
  if (existing) {
    throw new BadRequestError('Society with this name already exists');
  }

  const society = await Society.create({ name: name.trim() });

  res.status(201).json({ message: 'Society created', society: { id: society._id, name: society.name } });
};
