import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Checklist.css";

//旅行先の荷物のチェックリスト
export default function Checklist() {
  const navigate = useNavigate();
  const checklist_id = useParams().checklist_id;
  const dummyitems = [
    { item_name: "着替え", check_bool: false, item_num: 2 },
    { item_name: "下着", check_bool: false, item_num: 2 },
    { item_name: "コンタクト", check_bool: false, item_num: 2 },
    { item_name: "コンタクトケース", check_bool: false, item_num: 1 },
    { item_name: "洗浄液", check_bool: false, item_num: 1 },
    { item_name: "メガネ", check_bool: false, item_num: 1 },
    { item_name: "イヤホン", check_bool: false, item_num: 1 },
    { item_name: "メイク道具", check_bool: false, item_num: 1 },
    { item_name: "スキンケア用品", check_bool: false, item_num: 1 },
    { item_name: "スマホ充電器", check_bool: false, item_num: 1 },
    { item_name: "イヤホン充電器", check_bool: false, item_num: 1 },
    { item_name: "おやつ", check_bool: false, item_num: 1 },
    { item_name: "ヘアアイロン", check_bool: false, item_num: 1 },
    { item_name: "チケット", check_bool: false, item_num: 2 },
    { item_name: "パスポート", check_bool: false, item_num: 1 },
    { item_name: "パスポートのコピー", check_bool: false, item_num: 1 },
    { item_name: "エコバック", check_bool: false, item_num: 1 },
    { item_name: "歯ブラシ", check_bool: false, item_num: 1 },
    { item_name: "モバイルバッテリー", check_bool: false, item_num: 1 },
    { item_name: "傘", check_bool: false, item_num: 1 },
    { item_name: "カメラ", check_bool: false, item_num: 1 },
    { item_name: "バック", check_bool: false, item_num: 1 },
    { item_name: "パジャマ", check_bool: false, item_num: 1 },
    { item_name: "現金", check_bool: false, item_num: 1 },
    { item_name: "カード", check_bool: false, item_num: 1 },
  ];
  const [items, setItems] = useState([]);

  const [newItemName, setNewItemName] = useState(""); //新規作成時の荷物
  const [newItemQuantity, setNewItemQuantity] = useState(1); //新規作成時の個数

  const handleUpdateItem = async () => {
    const itemsSubmit = {
      checklist_id: checklist_id,
      items: items,
    };
    console.log(itemsSubmit);
    await axios.put("/item", itemsSubmit);
    navigate(`/tripList`);
  };
  //チェック状態の切り替え
  const handleToggle = (index) => {
    const newItems = [...items];
    newItems[index].check_bool = !newItems[index].check_bool;
    setItems(newItems);
  };

  //個数変更
  const handleQuantityChange = (index, newQuantity) => {
    const newItems = [...items];
    newItems[index].item_num = Math.max(1, newQuantity); //荷物の個数最小値を1
    setItems(newItems);
  };

  //チェックリストの削除
  const handleDelete = async (index) => {
    await axios.delete(`/item/${index}`);
    const res = await axios.get(`/item?checklist_id=${checklist_id}`);
    console.log(res.data);
    setItems(res.data);
  };

  //荷物の新規作成
  const handleAddItem = async () => {
    if (newItemName.trim() === "") return;
    const newItem = {
      checklist_id: checklist_id,
      item_name: newItemName,
      item_num: newItemQuantity,
      check_bool: false,
    };
    await axios.post(`/item`, newItem);
    const res = await axios.get(`/item?checklist_id=${checklist_id}`);
    setItems(res.data);
    setNewItemName("");
    setNewItemQuantity(1);
  };

  //荷物の新規作成のキャンセル
  const handleCancel = () => {
    setNewItemName("");
    setNewItemQuantity(1);
  };
  useEffect(() => {
    (async () => {
      const res = await axios.get(`/item?checklist_id=${checklist_id}`);
      setItems(res.data);
    })();
  }, []);

  return (
    <div>
      <div className="headerBar">
        <h1>TripList</h1>
      </div>

      <div
        className="checklistBackground"
        style={{ backgroundImage: 'url("/sample2.png")' }}
      >
        <div className="checkList">
          <div className="titleBar">
            <button
              className="backButton"
              style={{ backgroundImage: 'url("/back.png")' }}
              onClick={() => navigate(`/tripList`)}
            ></button>{" "}
            {/*戻るボタン*/}
            <h2 className="title">旅行チェックリスト</h2>
            <button
              className="saveButton"
              style={{ backgroundImage: 'url("/save.png")' }}
              onClick={handleUpdateItem}
            ></button>{" "}
            {/*保存ボタン*/}
          </div>

          <div className="checkListBox">
            {/*チェックリスト */}
            <ul>
              {items.map((item, idx) => (
                <li key={idx} className="listItem">
                  <label>
                    <input
                      type="checkBox"
                      checked={item.check_bool}
                      onChange={() => handleToggle(idx)}
                    />
                    {item.item_name}
                    {item.item_num > 1 && (
                      <span className="quantityItem"> ×{item.item_num} </span>
                    )}
                  </label>
                  <div className="quantityChange">
                    {" "}
                    {/*数量変更*/}
                    {item.item_num > 1 && (
                      <div>
                        <button
                          className="minusButton"
                          onClick={() =>
                            handleQuantityChange(idx, item.item_num - 1)
                          }
                          disabled={item.item_num <= 1}
                        >
                          -
                        </button>{" "}
                        {/*-ボタン*/}
                      </div>
                    )}
                    <button
                      className="plusButton"
                      onClick={() =>
                        handleQuantityChange(idx, item.item_num + 1)
                      }
                    >
                      +
                    </button>{" "}
                    {/*+ボタン*/}
                    <button
                      className="deletebutton"
                      style={{ backgroundImage: 'url("/delete.png")' }}
                      onClick={() => handleDelete(item.item_id)}
                    ></button>{" "}
                    {/*削除ボタン*/}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="createCheckList">
            <div className="addItemForm">
              <div className="inputGroup">
                <input
                  type="text"
                  placeholder="荷物"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <input
                  type="number"
                  value={newItemQuantity}
                  required
                  onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                  min="1"
                />
              </div>

              <div className="buttonGroup">
                <button onClick={handleAddItem}>追加</button>
                <button onClick={handleCancel}>キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
