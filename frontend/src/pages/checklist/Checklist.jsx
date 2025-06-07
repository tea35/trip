import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Checklist.css";

//旅行先の荷物のチェックリスト
export default function Checklist() {
  const navigate = useNavigate();
  const checklist_id = useParams();

  const [items, setItems] = useState([
    { item_name: "着替え", check_bool: false, item_num: 2, item_id: 1 },
    { item_name: "下着", check_bool: false, item_num: 2, item_id: 2 },
    { item_name: "コンタクト", check_bool: false, item_num: 2, item_id: 3 },
    { item_name: "充電器", check_bool: false, item_num: 1, item_id: 4 },
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
            <h2>旅行チェックリスト</h2>
            <button className="saveButton">保存</button>
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
                  </label>
                  <div className="quantityChange">
                    {" "}
                    {/*数量変更*/}
                    {item.item_num > 1 && (
                      <div>
                        <button
                          onClick={() =>
                            handleQuantityChange(idx, item.item_num - 1)
                          }
                          disabled={item.item_num <= 1}
                        >
                          -
                        </button>
                        <span className="quantityItem">{item.item_num}個</span>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        handleQuantityChange(idx, item.item_num + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="deleteButton"
                      onClick={() => handleDelete(idx)}
                    >
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/*チェックリストの新規作成*/}
          <button
            className="createListButton"
            onClick={() => setShowAddForm(true)}
          >
            新規作成
          </button>
          {showAddForm && (
            <div className="addItemForm">
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
              <button onClick={handleAddItem}>追加</button>
              <button onClick={handleCancel}>キャンセル</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
