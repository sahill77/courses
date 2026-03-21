import Category from "../models/Category.js";
import Course from "../models/Course.js";

export const getAllCategories = async (req, res) => {
  try {
    // Auto-sync missing categories from Courses
    const courseCategories = await Course.distinct("category");
    let existingCategories = await Category.find();
    const existingNames = existingCategories.map((c) => c.name);

    let newCategoriesAdded = false;
    for (const cName of courseCategories) {
      if (cName && !existingNames.includes(cName)) {
        const newCat = new Category({
          name: cName,
          icon: cName.charAt(0).toUpperCase(),
          color: "#6366f1",
          description: "Auto-generated category",
          showOnHome: false,
        });
        await newCat.save();
        existingCategories.push(newCat);
        newCategoriesAdded = true;
      }
    }

    if (newCategoriesAdded) {
      existingCategories = await Category.find(); // Re-fetch to ensure proper Mongoose documents & sorting
    }
    const sortedCategories = existingCategories.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    res.send(sortedCategories);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, color, showOnHome } = req.body;
    if (!name) return res.status(400).send({ error: "Name is required" });

    const existing = await Category.findOne({ name });
    if (existing)
      return res.status(400).send({ error: "Category already exists" });

    const category = new Category({
      name,
      description,
      icon: icon || name.charAt(0).toUpperCase(),
      color,
      showOnHome,
    });
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const oldCategory = await Category.findById(req.params.id);
    if (!oldCategory)
      return res.status(404).send({ error: "Category not found" });

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Cascade category name change to all associated courses
    if (req.body.name && oldCategory.name !== req.body.name) {
      await Course.updateMany(
        { category: oldCategory.name },
        { category: req.body.name }
      );
    }

    res.send(category);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
