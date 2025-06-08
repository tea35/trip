import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useDispatch } from "react-redux";
import { login } from "../../store/store";

//ログインページ
export default function Login() {
  const email = useRef();
  const password = useRef();
  const [statusCode, setStatusCode] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //ログイン認証する
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const user = {
        email: email.current.value,
        password: password.current.value,
      };
      setStatusCode("");

      //loginAPIを叩く
      await axios.post("/login", user);
      dispatch(login(user.email));

      // console.log(res);
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
          <div className="loginLeft">
            <div className="welcomeMsg">
              <h1 className="mainTitle">忘れ物ゼロの旅へ</h1>
              <h2 className="subTitle">
                あなただけのチェックリストで、もっと自由な旅行を
              </h2>

              <section>
                <p>
                  <strong>TripList</strong>{" "}
                  は、旅行前の「持ち物チェック」をもっと簡単・便利にする、あなただけの旅行準備アプリです。
                  <br></br>
                  ログイン・会員登録をすると、自分専用のチェックリストを保存・編集・カスタマイズできるようになります。
                  <br></br>
                  国内旅行でも、海外旅行でも、「あれ持ったっけ？」の不安をこのアプリが解決します。
                </p>
              </section>
            </div>
            <div className="divider_ver"></div>
          </div>

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
              <button className="logregiButton" type="submit">
                ログインする
              </button>
              <div className="divider" />
              会員未登録の方はこちらから
              <button
                className="logregiButton"
                type="button"
                onClick={() => navigate(`/register`)}
              >
                新規会員登録
              </button>
              {statusCode && <p>{statusCode}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
