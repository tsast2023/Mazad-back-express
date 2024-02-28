const category = require("../models/Category.model");
const categoryCtrl = {
  getAll: async (req, res) => {
    try {
      const Categories = await category.find();
      res.json({ allCategories: Categories });
    } catch (error) {
      console.log({ msg: error });
      res.status(500).send({ error: "Server error" });
    }
    }
};

module.exports = categoryCtrl;
