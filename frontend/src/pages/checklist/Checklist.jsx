import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Checklist.css";

//旅行先の荷物のチェックリスト
export default function Checklist() {
  const navigate = useNavigate();
  const checklist_id = useParams();

  const [items, setItems] = useState([
    { name: "着替え", checked: false, quantity: 2 },
    { name: "下着", checked: false, quantity: 2 },
    { name: "コンタクト", checked: false, quantity: 2 },
    { name: "コンタクトケース", checked: false, quantity: 1 },
    { name: "洗浄液", checked: false, quantity: 1 },
    { name: "メガネ", checked: false, quantity: 1 },
    { name: "イヤホン", checked: false, quantity: 1 },
    { name: "メイク道具", checked: false, quantity: 1 },
    { name: "スキンケア用品", checked: false, quantity: 1 },
    { name: "スマホ充電器", checked: false, quantity: 1 },
    { name: "イヤホン充電器", checked: false, quantity: 1 },
    { name: "おやつ", checked: false, quantity: 1 },
    { name: "ヘアアイロン", checked: false, quantity: 1 },
    { name: "チケット", checked: false, quantity: 2 },
    { name: "パスポート", checked: false, quantity: 1 },
    { name: "パスポートのコピー", checked: false, quantity: 1 },
    { name: "エコバック", checked: false, quantity: 1 },
    { name: "歯ブラシ", checked: false, quantity: 1 },
    { name: "モバイルバッテリー", checked: false, quantity: 1 },
    { name: "傘", checked: false, quantity: 1 },
    { name: "カメラ", checked: false, quantity: 1 },
    { name: "バック", checked: false, quantity: 1 },
    { name: "パジャマ", checked: false, quantity: 1 },
    { name: "現金", checked: false, quantity: 1 },
    { name: "カード", checked: false, quantity: 1 }
  ]);

  const [newItemName, setNewItemName] = useState(""); //新規作成時の荷物
  const [newItemQuantity, setNewItemQuantity] = useState(1); //新規作成時の個数
  const [showAddForm, setShowAddForm] = useState(false);

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
    const res = await axios.get(`/item?${checklist_id}`);
    console.log(res.data);
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
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
    setItems([...items, newItem]);
    await axios.post(`/item`, newItem);
    const res = await axios.get(`/item?${checklist_id}`);
    console.log(res.data);
    // setItems(res.data);
    setNewItemName("");
    setNewItemQuantity(1);
    setShowAddForm(false); // 追加後にフォームを閉じる
  };

  //荷物の新規作成のキャンセル
  const handleCancel = () => {
    setNewItemName("");
    setNewItemQuantity(1);
    setShowAddForm(false);
  };
  useEffect(() => {
    const fetchItem = async () => {
      const res = await axios.get(`/item?checklist_id=${checklist_id}`);
      console.log(res);
    };
  });
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
            <button className="backButton" style={{ backgroundImage: 'url("/back.png")' }} onClick={() => navigate(-1)}></button> {/*戻るボタン*/}
            <h2 className="title">旅行チェックリスト</h2>
            <button className="saveButton" style={{ backgroundImage: 'url("/save.png")' }}></button> {/*保存ボタン*/}
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
                    {item.name}
                    {item.quantity > 1 && (
                    <span className="quantityItem"> ×{item.quantity} </span>
                    )}
                  </label>
                    <div className="quantityChange"> {/*数量変更*/}
                      {item.quantity > 1 && (
                        <div >
                          <button className="minusButton" onClick={() => handleQuantityChange(idx, item.quantity - 1)} disabled={item.quantity <= 1}>-</button> {/*-ボタン*/}
                        </div>
                      )}
                      <button className="plusButton" onClick={() => handleQuantityChange(idx, item.quantity + 1)}>+</button> {/*+ボタン*/}
                      <button className="deletebutton" style={{ backgroundImage: 'url("/delete.png")' }} onClick={() => handleDelete(idx)}></button> {/*削除ボタン*/}
                    </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="createCheckList">
            {/*チェックリストの新規作成*/}
            {/*<button className="createListButton"onClick={() => setShowAddForm(true)}>+</button> 新規作成*/}
            <div className="addItemForm">
              <div className="inputGroup">
                <input
                  type="text"
                  placeholder="荷物"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <input
                  type="number"
                  value={newItemQuantity}
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
