import { Request, Response } from "express";
import User from "../models/user.models";

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findOne({ _id: req.userId});
        if(!currentUser){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(currentUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something went wrong!"});
    }
}

const createCurrentUser = async(req: Request, res: Response) => {
    //1. check if the user exists
    // 2. create the user if it doesn't exist
    //3. return the user object to the calling client
    try {
        const {auth0Id} = req.body;
        const exisitingUser = await User.findOne({auth0Id});

        if(exisitingUser){
            return res.status(200).json(exisitingUser.toObject());
        }

        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).json(newUser.toObject());
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error creating user"});
    }
}

const updateCurrentUser = async(req: Request, res: Response) => {
    try {
        const {name, addressLine1, country, city} = req.body;
        const user = await User.findById(req.userId);

        if(!user){
            return res.status(404).json({message: "user not found!"});
        }

        user.name = name;
        user.addressLine1 = addressLine1;
        user.country = country;
        user.city=city;

        await user.save();
        res.send(user);
    } catch (error) {
        console.log(error);
    }
}

export default {
    getCurrentUser,
    createCurrentUser,
    updateCurrentUser
}