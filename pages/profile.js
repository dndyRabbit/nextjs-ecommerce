import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { DataContext } from "../store/GlobalState";
import valid from "../utils/valid";
import { patchData } from "../utils/fetchData";
import { imageUpload } from "../utils/imageUpload";

const Profile = () => {
  const initialState = {
    avatar: "",
    name: "",
    password: "",
    confirm_password: "",
  };
  const [data, setData] = useState(initialState);

  const { avatar, name, password, confirm_password } = data;

  const { state, dispatch } = useContext(DataContext);
  const { auth, notify, orders } = state;

  useEffect(() => {
    if (auth.user) setData({ ...data, name: auth.user.name });
    console.log(orders);
  }, [auth.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (password) {
      const errMsg = valid(name, auth.user.email, password, confirm_password);
      if (errMsg)
        return dispatch({ type: "NOTIFY", payload: { error: errMsg } });
      updatePassword();
    }

    if (name !== auth.user.name || avatar) updateInformation();
  };

  const updatePassword = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData("user/resetPassword", { password }, auth.token).then((res) => {
      if (res.err)
        return dispatch({
          type: "NOTIFY",
          payload: { error: res.msg },
        });
      return dispatch({
        type: "NOTIFY",
        payload: { success: res.msg },
      });
    });
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File does not exist." },
      });
    if (file.size > 1024 * 1024 * 5)
      //5mb
      return dispatch({
        type: "NOTIFY",
        payload: { error: "The largest image size is 5mb" },
      });
    if (file.type !== "image/jpeg" && file.type !== " image/png")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "the file format isnt right, jpeg/png only" },
      });

    setData({ ...data, avatar: file });
  };

  const updateInformation = async () => {
    let media;
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    if (avatar) media = await imageUpload([avatar]);

    patchData(
      "user",
      {
        name,
        avatar: avatar ? media[0].url : auth.user.avatar,
      },
      auth.token
    ).then((res) => {
      if (res.err)
        return dispatch({
          type: "NOTIFY",
          payload: { error: res.err },
        });

      dispatch({
        type: "AUTH",
        payload: {
          token: auth.token,
          user: res.user,
        },
      });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  if (!auth.user) return null;

  return (
    <div className="profile_page">
      <Head>
        <title>Profile</title>
      </Head>
      <section className="row text-secondary">
        <div className="col-md-4">
          <h3>
            {auth.user.role === "user" ? "User Profile" : "Admin Profile"}
          </h3>
          <div className="avatar">
            <img
              src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
              alt={auth.user.avatar}
            />
            <span>
              <i className="fas fa-camera"></i>
              <p>Change</p>
              <input
                type="file"
                name="file"
                id="file_up"
                accept="image/*"
                onChange={changeAvatar}
              />
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              className="form-control"
              placeholder="Your Name"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              value={auth.user.email}
              className="form-control"
              placeholder="Your Email"
              disabled={true}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">password</label>
            <input
              type="password"
              name="password"
              value={password}
              className="form-control"
              placeholder="Your new password"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Confirm password</label>
            <input
              type="password"
              name="confirm_password"
              value={confirm_password}
              className="form-control"
              placeholder="confirm new password"
              onChange={handleChange}
            />
          </div>

          <button
            className="btn btn-info"
            disabled={notify.loading}
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </div>
        <div className="col-md-8 ">
          <h3 className="text-uppercase">Orders</h3>
          <div className="my-3 table-responsive">
            <table
              className="table-bordered table-hover w-100 text-uppercase"
              style={{ minWidth: "600px", cursor: "pointer" }}
            >
              <thead className="bg-light font-weight-bold">
                <tr>
                  <td className="p-2">id</td>
                  <td className="p-2">date</td>
                  <td className="p-2">total</td>
                  <td className="p-2">delivered</td>
                  <td className="p-2">paid</td>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <Link href={`/order/${order._id}`}>
                        <a>#{order._id}</a>
                      </Link>
                    </td>
                    <td className="p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <i className="fab fa-btc text-success" /> {order.total}
                    </td>
                    <td className="p-2">
                      {order.delivered ? (
                        <i className="fas fa-check text-success" />
                      ) : (
                        <i className="fas fa-times text-danger" />
                      )}
                    </td>
                    <td className="p-2">
                      {order.paid ? (
                        <i className="fas fa-check text-success" />
                      ) : (
                        <i className="fas fa-times text-danger" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
