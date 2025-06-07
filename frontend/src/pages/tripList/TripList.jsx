import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TripList.css";

export default function TripList() {
  const navigate = useNavigate();
  const days = ["日", "月", "火", "水", "木", "金", "土"];

  // 仮の旅行データ（本来はバックエンドから取得）
  const TripList = [
    { id: 1, location_name: "東京", first_date: "2025/01/01", last_date: "2025/01/03" },
    { id: 2, location_name: "京都", first_date: "2026/01/01", last_date: "2026/01/03" }
    ];

  const [trips, setTrips] = useState([]); // APIから取得した旅行データ用のstate

  function formatDateWithDay(dateStr) {
    const date = new Date(dateStr.replace(/-/g, "/"));
    if (isNaN(date.getTime())) return dateStr; // 日付変換失敗なら元文字列を返す
    const day = days[date.getDay()];
    return `${dateStr}(${day})`;
  }

  // // コンポーネントが表示されたときにデータを取得
  useEffect(() => {
    try {
      //   const res = await axios.get("/triplist?user=t@gmail.com");
      //   const TripList = res.data;
      setTrips(TripList);
      console.log(TripList);
    } catch (error) {
      console.error("データ取得エラー:", error);
    }
  }, []);

  return (
    <div>
      <div className="headerBar">
        <h1>TripList</h1>
      </div>

      <div 
        className="tripListBackground" 
        style={{ backgroundImage: 'url("/sample2.png")' }}
      >
        <div className="tripListBox">
          <p className="tripFormTitle">旅行リスト</p>
          <div className="tripList">
            {trips.map((trip) => (
              <div key={trip.id} className="tripCard" onClick={() => navigate(`/checklist/${trip.id}`)}>
                <p className="tripCardTitle">{trip.location_name}</p>
                <p className="tripDate">
                  {formatDateWithDay(trip.first_date)} ～ {formatDateWithDay(trip.last_date)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <button className="addButton" onClick={() => navigate("/createtrip")}>
        +
      </button>
    </div>
  );
}
