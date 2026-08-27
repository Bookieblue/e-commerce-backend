import { getAllUsers, updateUser, getUserById } from "../model/user.service.js";

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers(); 

        if (!users || users.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No users found",
                data: []
            });
        }

    
        const Users = users.map(user => ({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            gender: user.gender,
            role: user.role,
            created_at: user.created_at
        }));

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: Users
        });
    } catch (error) {
        console.log("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving users"
        });
    }
};


export const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const user = await getUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        console.log("Error fetching user:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving user"
        });
    }
};

export const patchUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Check if user exists
        const existingUser = await getUserById(id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent updating sensitive fields
        if (updates.password || updates.id) {
            return res.status(400).json({
                success: false,
                message: "Cannot update password or ID"
            });
        }

        // If email is being updated, check if it already exists
        if (updates.email && updates.email !== existingUser.email) {
            const emailExists = await findUserByEmail(updates.email);
            if (emailExists.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use"
                });
            }
        }

        const updatedUser = await updateUser(id, updates);

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.log("Error updating user:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating user"
        });
    }
};