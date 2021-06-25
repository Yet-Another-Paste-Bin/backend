import { Request, Response } from "express";
import Bin from "../models/bin.model";
import User from "../models/user.model";

/**
 *
 * Handler function for {/api/bin} route
 * @method POST
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
export const addBin = async (req: Request, res: Response) => {
  const { data, owner_id, shared_with, username } = req.body;
  const privateBin: boolean = req.body.private;
  const newBin = new Bin({
    data,
    private: privateBin,
    owner_id,
    shared_with,
    owner_username: username,
  });

  // Check if bin is private
  if (privateBin) {
    try {
      const user = await User.findOne({ _id: owner_id });
      if (user) {
        newBin.save();
        return res.status(200).json({ binId: newBin._id }).end();
      }

      return res
        .status(400)
        .json({ message: "Invalid UserId or Username" })
        .end();
    } catch (error) {
      return res.status(500).json({ message: "Server Error" }).end();
    }
  } else {
    // Save bin
    newBin.save();
    return res.status(200).json({ binId: newBin._id }).end();
  }
};

/**
 *
 * Handler function for {/api/bin:binId} route
 * @method GET
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
export const getBin = async (req: Request, res: Response) => {
  const { owner_id, username, email } = req.body;
  const binId = req.params.binId;
  try {
    const bin = await Bin.findById(binId);
    if (bin) {
      if (
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
    return res.status(204).json({ message: "Bin Not Found" }).end();
  } catch (error) {
    return res.status(500).json({ message: "Server Error" }).end();
  }
};

/**
 *
 * Handler function for {/api/bin} route
 * @method GET
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
export const getAllBin = async (req: Request, res: Response) => {
  const { owner_id, username, email } = req.body;
  try {
    const bins = await Bin.find({
      $or: [{ owner_id }, { shared_with: { $in: [username, email] } }],
    });
    if (bins && bins.length > 0) return res.status(200).json(bins).end();
    return res.status(204).json({ message: "Bins Not Found" }).end();
  } catch (error) {
    return res.status(500).json({ message: "Server Error" }).end();
  }
};

/**
 *
 * Handler function for {/api/bin} route
 * @method DELETE
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
export const deleteBin = async (req: Request, res: Response) => {
  const { owner_id, binId } = req.body;
  //  Send HTTP status code 400 if {owner_id} or {binId} is not provided
  if ([owner_id, binId].includes(undefined)) return res.status(400).end();
  try {
    await Bin.deleteOne({ _id: binId, owner_id });
    return res.status(200).end();
  } catch (error) {
    return res.status(500).json(error).end();
  }
};

/**
 *
 * Handler function for {/api/bin} route
 * @method PUT
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
export const updateBin = async (req: Request, res: Response) => {
  const { data, binId, owner_id } = req.body;
  const privateBin: boolean = req.body.private;
  //  Send HTTP status code 400 if {owner_id} is not provided
  if (owner_id === undefined) return res.status(400).end();
  try {
    const bin = await Bin.findOne({ _id: binId, owner_id });
    if (bin) {
      bin.data = data || bin.data;
      bin.private = privateBin || bin.private;
      bin.save();
      return res.status(200).end();
    }
    if (!bin) return res.status(204).end();
  } catch (error) {
    return res.status(500).end();
  }
};
