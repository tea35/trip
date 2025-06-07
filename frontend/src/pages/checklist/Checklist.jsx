import axios from "axios";
import React ,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Checklist.css";

//旅行先の荷物のチェックリスト
export default function Checklist() {
  const navigate = useNavigate();

  const [items, setItems] = useState([
    { name: "着替え", checked: false, quantity: 2 },
    { name: "下着", checked: false, quantity: 2 },
    { name: "コンタクト", checked: false, quantity: 2 },
    { name: "充電器", checked: false, quantity: 1 },

  ]);

  const [newItemName, setNewItemName] = useState(""); //新規作成時の荷物
  const [newItemQuantity, setNewItemQuantity] = useState(1); //新規作成時の個数
  const [showAddForm, setShowAddForm] = useState(false);


  //チェック状態の切り替え
  const handleToggle = (index) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
  };

  //個数変更
  const handleQuantityChange = (index, newQuantity) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, newQuantity); //荷物の個数最小値を1
    setItems(newItems);
  };

  //チェックリストの削除
  const handleDelete = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  //荷物の新規作成
  const handleAddItem = () => {
    if (newItemName.trim() === "") return;
    const newItem = {
      name: newItemName,
      quantity: newItemQuantity,
      checked: false,
    };
    setItems([...items, newItem]);
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

  return (
    <div>
      <div className="headerBar">
        <h1>TripList</h1>
      </div>

      <div className="checklistBackground" style={{ backgroundImage: 'url("/sample2.png")' }}>
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
                      checked={item.checked}
                      onChange={() => handleToggle(idx)}
                    />
                    {item.name}
                  </label>
                    <div className="quantityChange"> {/*数量変更*/}
                      {item.quantity > 1 && (
                        <div >
                          <button onClick={() => handleQuantityChange(idx, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                          <span className="quantityItem">{item.quantity}個</span>
                        </div>
                      )}
                      <button onClick={() => handleQuantityChange(idx, item.quantity + 1)}>+</button>

                      <button className="deleteButton" onClick={() => handleDelete(idx)}>削除</button>
                    </div>
                </li>
              ))}
            </ul>
          </div>
          

          {/*チェックリストの新規作成*/}
          <button className="createListButton"onClick={() => setShowAddForm(true)}>新規作成</button>
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