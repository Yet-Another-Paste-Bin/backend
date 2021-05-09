const Bin = require("../models/bin.model");
const User = require("../models/user.model");

function addBin(req, res) {
  const { data, private, owner_id, shared_with, username } = req.body;
  const newBin = new Bin({
    data,
    private,
    owner_id,
    shared_with,
    owner_username: username,
  });

  if (private) {
    User.findOne({ _id: owner_id }, (err, user) => {
      if (err) return res.status(500).json({ message: "Server Error" }).end();

      if (!user)
        return res
          .status(400)
          .json({ message: "Invalid UserId or Username" })
          .end();

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
      if (err) return res.status(500).json({ message: "Server Error" }).end();

      if (!bin) return res.status(404).json({ message: "Bin Not Found" }).end();

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
        return res.status(204).json({ message: "Bin Not Found" }).end();
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
      return res.status(401).json({ message: "Unauthorized" }).end();
    }
  );
}

function getAllBin(req, res) {
  const { owner_id, username, email } = req.body;
  Bin.find(
    {
      $or: [
        { owner_id },
        { shared_with: { $in: [username] } },
        { shared_with: { $in: [email] } },
      ],
    },
    (err, bins) => {
      if (err) {
        return res.status(500).json({ message: "Server Error" }).end();
      } else if (bins.length === 0) {
        return res.status(204).json({ message: "Bins Not Found" }).end();
      }
      return res.status(200).json(bins).end();
    }
  );
}

function deleteBin(req, res) {
  const { owner_id, binId } = req.body;
  if ([owner_id, binId].includes(undefined)) return res.status(400).end();
  Bin.deleteOne({ _id: binId, owner_id }, (err) => {
    if (err) return res.status(500).json(err).end();
  });
}

function updateBin(req, res) {
  const { data, private, binId, owner_id } = req.body;
  if (owner_id === undefined) return res.status(400).end();
  Bin.findOne({ _id: binId, owner_id }, (err, bin) => {
    if (err) return res.status(500).end();
    if (!bin) return res.status(204).end();
    bin.data = data || bin.data;
    bin.private = private || bin.private;
    bin.save();
    return res.status(200).end();
  });
}

module.exports = { addBin, removeBin, getBin, getAllBin, deleteBin, updateBin };
