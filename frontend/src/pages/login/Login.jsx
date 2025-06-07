import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

//ログインページ
export default function Login() {
  const email = useRef();
  const password = useRef();
  const [statusCode, setStatusCode] = useState("");
  const navigate = useNavigate();
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const user = {
        email: email.current.value,
        password: password.current.value,
      };
      // const header = {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //     accept: "application/json",
      //   },
      // };
      setStatusCode("");
      console.log(user);
      //loginAPIを叩く
      // const res2 = await fetch("http://127.0.0.1:5000/login", {
      //   method: "GET",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(user),
      // });
      // console.log(res2);

      const res = await axios.post("/login", user);

      console.log(res);
      navigate("/tripList"); // ログイン画面後、トリップリスト画面へ
    } catch (err) {
      if (err.response.status === 500) {
        setStatusCode("アカウントが存在していません");
      }
      console.log(err.response.data);
    }
  };
  return (
    <div>
      <div className="headerBar">
        <h1>TripList</h1>
      </div>

      <div
        className="loginBackground"
        style={{ backgroundImage: 'url("/sample2.png")' }}
      >
        <div className="loginForm">
          <div className="loginLeft"></div>

          <div className="loginRight">
            <form className="loginBox" onSubmit={(e) => handleClick(e)}>
              <p className="loginTitle">ログイン</p>
              <p className="loginMsg">
                メールアドレスとパスワードを入力してください
              </p>
              メールアドレス
              <input
                type="email"
                className="loginInput"
                placeholder="example@mail.com"
                required
                ref={email}
              />
              パスワード
              <input
                type="password"
                className="loginInput"
                placeholder="●●●●●●"
                required
                minLength="6"
                ref={password}
              />
              <button className="loginButton" type="submit">
                ログインする
              </button>
              <div className="divider" />
              会員未登録の方はこちらから
              <button className="go2registerButton">
                <Link
                  to={`/register`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <span className="sidebarListItemText">新期会員登録</span>
                </Link>
              </button>
              {statusCode && <p>{statusCode}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
