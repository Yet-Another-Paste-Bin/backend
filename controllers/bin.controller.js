const Bin = require("../models/bin.model");
const User = require("../models/user.model");
const { nanoid } = require("nanoid");
function addBin(req, res) {
  const { data, private, owner_id, shared_with } = req.body;
  const _id = nanoid();
  const newBin = new Bin({ _id, data, private, owner_id, shared_with });

  if (private) {
    User.findOne({ _id: owner_id }, (err, user) => {
      if (err) {
        return res.status(500).json({ message: "Server Error" }).end();
      }

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid UserId or Username" })
          .end();
      }
      newBin.save();
      return res.status(200).json({ binId: newBin._id }).end();
    });
  } else {
    newBin.save();
    return res.status(200).json({ binId: newBin._id }).end();
  }
}

function removeBin(req, res) {
  const { binId, owner_id, username } = req.body;
  Bin.findOne(
    {
      _id: binId,
      $or: [{ owner_id }, { shared_with: { $in: [username] } }],
    },
    (err, bin) => {
      if (err) {
        return res.status(500).json({ message: "Server Error" }).end();
      }
      if (!bin) {
        return res.status(404).json({ message: "Bin Not Found" }).end();
      }

      bin.remove();
      return res.status(200).json({ message: "Bin is Deleted" }).end();
    }
  );
}

function getBin(req, res) {
  const { owner_id, username, email } = req.body;

  const binId = req.params.binId;

  Bin.findOne(
    {
      _id: binId,
      $or: [
        { owner_id },
        { shared_with: { $in: [username] } },
        { shared_with: { $in: [email] } },
      ],
    },
    (err, bin) => {
      if (err) {
        return res.status(500).json({ message: "Server Error" }).end();
      } else if (!bin) {
        return res.status(404).json({ message: "Bin Not Found" }).end();
      } else if (
        bin.private &&
        (bin.owner_id === owner_id ||
          bin.shared_with.includes(username) ||
          bin.shared_with.includes(email))
      ) {
        return res.status(200).json(bin).end();
      } else if (!bin.private) {
        return res.status(200).json(bin).end();
      }
      return res.status(403).json({ message: "Unauthorized" }).end();
    }
  );
}

module.exports = { addBin, removeBin, getBin };
