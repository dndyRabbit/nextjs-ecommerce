import { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import Head from "next/head";
import Link from "next/link";
import valid from "../utils/valid";
import { postData } from "../utils/fetchData";
import { useRouter } from "next/router";

const Register = () => {
	const initialState = {
		name: "",
		email: "",
		password: "",
		confirm_password: "",
	};
	const [userData, setUserData] = useState(initialState);
	const { name, email, password, confirm_password } = userData;

	const router = useRouter();

	const { state, dispatch } = useContext(DataContext);

	const { auth } = state;

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
		dispatch({ type: "NOTIFY", payload: {} });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errMsg = valid(name, email, password, confirm_password);
		if (errMsg)
			return dispatch({ type: "NOTIFY", payload: { error: errMsg } });

		dispatch({ type: "NOTIFY", payload: { loading: true } });

		const res = await postData("auth/register", userData);
		console.log(res);
		if (res.err)
			return dispatch({ type: "NOTIFY", payload: { error: res.err } });

		return dispatch({ type: "NOTIFY", payload: { success: res.message } });
	};

	useEffect(() => {
		if (Object.keys(auth).length !== 0) router.push("/");
	}, [auth]);

	return (
		<div>
			<Head>
				<title>Register Page</title>
			</Head>
			<form
				className="mx-auto my-4"
				style={{ maxWidth: "500px" }}
				onSubmit={handleSubmit}
			>
				<div className="form-group">
					<label htmlFor="name">Name</label>
					<input
						type="text"
						className="form-control"
						id="name"
						name="name"
						value={name}
						onChange={handleChangeInput}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="email">Email address</label>
					<input
						type="text"
						className="form-control"
						id="email"
						name="email"
						value={email}
						onChange={handleChangeInput}
					/>
					<small id="emailHelp" className="form-text text-muted">
						We'll never share your email with anyone else.
					</small>
				</div>

				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						className="form-control"
						id="password"
						name="password"
						value={password}
						onChange={handleChangeInput}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						type="password"
						className="form-control"
						id="confirmPassword"
						name="confirm_password"
						value={confirm_password}
						onChange={handleChangeInput}
					/>
				</div>

				<button type="submit" className="btn btn-dark w-100">
					Register
				</button>

				<p>
					Already have an account?{" "}
					<Link href="/signin">
						<a style={{ color: "crimson" }}>Login</a>
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Register;
