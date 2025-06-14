import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

//会員登録ページ
export default function Register() {
  const email = useRef();
  const password = useRef();
  const passwordConfirmation = useRef();
  const [statusCode, setStatusCode] = useState("");

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    //パスワードと確認用パスワードが合っているかどうか確認
    if (password.current.value !== passwordConfirmation.current.value) {
      passwordConfirmation.current.setCustomValidity("パスワード違います");
    } else {
      try {
        const user = {
          email: email.current.value,
          password: password.current.value,
        };
        setStatusCode("");
        //registerAPIを叩く
        await axios.post("/register", user);
        navigate("/login"); // 会員登録完了後、ログイン画面へ
      } catch (err) {
        if (err.response.status === 500) {
          setStatusCode("アカウントが存在しています");
        }
        console.log(err);
      }
    }
  };
  return (
    <div>
      <div className="headerBar">
        <h1>TripList</h1>
      </div>

      <div
        className="registerBackground"
        style={{ backgroundImage: 'url("/sample2.png")' }}
      >
        <div className="registerForm">
          <div className="registerLeft">
            <div className="welcomeMsg">
              <h1 className="mainTitle">忘れ物ゼロの旅へ</h1>
              <h2 className="subTitle">
                あなただけのチェックリストで、もっと自由な旅行を
              </h2>

              <section>
                <p>
                  <strong>TripList</strong>{" "}
                  は、旅行前の「持ち物チェック」をもっと簡単・便利にする、あなただけの旅行準備アプリです。
                  <br />
                  ログイン・会員登録をすると、自分専用のチェックリストを保存・編集・カスタマイズできるようになります。
                  <br />
                  国内旅行でも、海外旅行でも、「あれ持ったっけ？」の不安をこのアプリが解決します。
                </p>
              </section>
            </div>
            <div className="divider_ver"></div>
          </div>

          <div className="registerRight">
            <form className="registerBox" onSubmit={(e) => handleClick(e)}>
              <p className="registerTitle">新規会員登録はこちら</p>
              <p className="registerMsg">
                登録するメールアドレスとパスワードを入力してください
              </p>
              メールアドレス
              <input
                type="email"
                className="registerInput"
                placeholder="example@mail.com"
                required
                ref={email}
              />
              パスワード
              <input
                type="password"
                className="registerInput"
                placeholder="●●●●●●"
                required
                minLength="6"
                ref={password}
              />
              確認用パスワード
              <input
                type="password"
                className="registerInput"
                placeholder="●●●●●●"
                required
                minLength="6"
                ref={passwordConfirmation}
              />
              <button className="registerButton" type="submit">
                会員登録する
              </button>
              {statusCode && <p>{statusCode}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
