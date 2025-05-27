const modelB = require("../model/Branch");
const Branch = modelB.Branch;

exports.branch = async (req, res) => {
  const { name, Location, PhoneNumber, pincodes } = req.body;

  if (!name || !Location || !PhoneNumber || !pincodes) {
    return res.status(400).json({ message: "All fields are required." });
  }

//   if (!Array.isArray(pincodes) || pincodes.length === 0) {
//   return res.status(400).json({ message: "Pincodes must be a non-empty array." });
// }


  try {
    const newBranch = new Branch({
      name,
      Location,
      PhoneNumber,
      pincodes,
    });

    await newBranch.save();

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      branch: newBranch,
    });
  } catch (error) {
    console.error("Error creating branch:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
