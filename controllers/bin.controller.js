const Bin = require("../models/bin.model");
const User = require("../models/user.model");

/**
 *
 * Handler function for {/api/bin} route
 * @method POST
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
function addBin(req, res) {
  const { data, private, owner_id, shared_with, username } = req.body;
  const newBin = new Bin({
    data,
    private,
    owner_id,
    shared_with,
    owner_username: username,
  });

  // Check if bin is private
  if (private) {
    User.findOne({ _id: owner_id }, (err, user) => {
      //  Send HTTP status code 500 if error occured
      if (err) return res.status(500).json({ message: "Server Error" }).end();
      //  Send HTTP status code 400 as a response user is not found
      if (!user)
        return res
          .status(400)
          .json({ message: "Invalid UserId or Username" })
          .end();

      // Save bin
      newBin.save();
      return res.status(200).json({ binId: newBin._id }).end();
    });
  } else {
    // Save bin
    newBin.save();
    return res.status(200).json({ binId: newBin._id }).end();
  }
}

/**
 *
 * Handler function for {/api/bin:binId} route
 * @method GET
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
function getBin(req, res) {
  const { owner_id, username, email } = req.body;

  const binId = req.params.binId;
  Bin.findOne(
    {
      _id: binId,
    },
    (err, bin) => {
      //  Send HTTP status code 500 if error occured
      if (err) return res.status(500).json({ message: "Server Error" }).end();
      else if (!bin)
        //  Send HTTP status code 204 if {bin} not found
        return res.status(204).json({ message: "Bin Not Found" }).end();
      else if (
        bin.private &&
        (bin.owner_id === owner_id ||
          bin.shared_with.includes(username) ||
          bin.shared_with.includes(email))
      ) {
        return res.status(200).json(bin).end();
      } else if (!bin.private) return res.status(200).json(bin).end();

      //  Send HTTP status code 401
      return res.status(401).json({ message: "Unauthorized" }).end();
    }
  );
}

/**
 *
 * Handler function for {/api/bin} route
 * @method GET
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
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
      //  Send HTTP status code 500 if error occured
      if (err) return res.status(500).json({ message: "Server Error" }).end();
      else if (bins.length === 0)
        //  Send HTTP status code 204 if no bins found
        return res.status(204).json({ message: "Bins Not Found" }).end();
      return res.status(200).json(bins).end();
    }
  );
}

/**
 *
 * Handler function for {/api/bin} route
 * @method DELETE
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
function deleteBin(req, res) {
  const { owner_id, binId } = req.body;
  //  Send HTTP status code 400 if {owner_id} or {binId} is not provided
  if ([owner_id, binId].includes(undefined)) return res.status(400).end();
  Bin.deleteOne({ _id: binId, owner_id }, (err) => {
    //  Send HTTP status code 500 if error occured
    if (err) return res.status(500).json(err).end();
    return res.status(200).end();
  });
}

/**
 *
 * Handler function for {/api/bin} route
 * @method PUT
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
function updateBin(req, res) {
  const { data, private, binId, owner_id } = req.body;
  //  Send HTTP status code 400 if {owner_id} is not provided
  if (owner_id === undefined) return res.status(400).end();
  Bin.findOne({ _id: binId, owner_id }, (err, bin) => {
    //  Send HTTP status code 400 if error occured
    if (err) return res.status(500).end();
    //  Send HTTP status code 204 if {bin} not found
    if (!bin) return res.status(204).end();
    // Update Bin
    bin.data = data || bin.data;
    bin.private = private || bin.private;
    bin.save();
    return res.status(200).end();
  });
}

module.exports = { addBin, getBin, getAllBin, deleteBin, updateBin };
