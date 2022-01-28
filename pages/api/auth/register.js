import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import valid from "../../../utils/valid";
import bcrypt from "bcrypt";

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case "POST":
			await register(req, res);
			break;
	}
};

const register = async (req, res) => {
	try {
		const { name, email, password, confirm_password } = req.body;
		const err_msg = valid(name, email, password, confirm_password);

		if (err_msg) return res.status(400).json({ err: err_msg });

		const user = await Users.findOne({ email });
		if (user)
			return res.status(400).json({ err: "This email already exists" });

		const passwordHash = await bcrypt.hash(password, 12);

		const newUser = new Users({
			name,
			email,
			password: passwordHash,
			confirm_password,
		});

		await newUser.save();
		res.json({ message: "Register Success" });
	} catch (error) {
		return res.status(500).json({ err: error.message });
	}
};
