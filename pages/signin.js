import { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import Head from "next/head";
import Link from "next/link";
import { postData } from "../utils/fetchData";
import Cookie from "js-cookie";
import { useRouter } from "next/router";

const Signin = () => {
	const initialState = {
		email: "",
		password: "",
	};
	const [userData, setUserData] = useState(initialState);
	const { email, password } = userData;

	const { state, dispatch } = useContext(DataContext);

	const router = useRouter();

	const { auth } = state;

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
		dispatch({ type: "NOTIFY", payload: {} });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		dispatch({ type: "NOTIFY", payload: { loading: true } });

		const res = await postData("auth/login", userData);
		console.log(res);
		if (res.err)
			return dispatch({ type: "NOTIFY", payload: { error: res.err } });

		dispatch({ type: "NOTIFY", payload: { success: res.message } });

		dispatch({
			type: "AUTH",
			payload: {
				token: res.access_token,
				user: res.user,
			},
		});

		Cookie.set("refreshtoken", res.refresh_token, {
			path: "api/auth/accessToken",
			expires: 7,
		});
		localStorage.setItem("firstLogin", true);
	};

	useEffect(() => {
		if (Object.keys(auth).length !== 0) router.push("/");
	}, [auth]);

	return (
		<div>
			<Head>
				<title>Login Page</title>
			</Head>
			<form
				className="mx-auto my-4"
				style={{ maxWidth: "500px" }}
				onSubmit={handleSubmit}
			>
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

				<button type="submit" className="btn btn-dark w-100">
					Login
				</button>

				<p>
					Didnt have an account yet?{" "}
					<Link href="/register">
						<a style={{ color: "crimson" }}>Register</a>
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Signin;
