const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Contact = require("../models/Contact");


router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", auth, async (req, res) => {
  try {
    const { name, phone, email, notes } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const contact = new Contact({ user: req.user.id, name, phone, email, notes });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, user: req.user.id });
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    const updates = req.body;
    Object.assign(contact, updates);
    await contact.save();

    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
