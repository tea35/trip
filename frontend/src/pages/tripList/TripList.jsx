import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TripList.css";
import { useSelector } from "react-redux";

export default function TripList() {
  const navigate = useNavigate();
  const days = ["日", "月", "火", "水", "木", "金", "土"];

  // 仮の旅行データ（本来はバックエンドから取得）
  const TripList = [
    {
      trip_id: 7,
      location_name: "東京",
      first_date: "2025-01-01",
      last_date: "2025/01/03",
    },
    {
      trip_id: 8,
      location_name: "京都",
      first_date: "2026-01-01",
      last_date: "2026-01-03",
    },
  ];
  const user = useSelector((state) => state.auth.user); // ユーザー情報を取得

  const [trips, setTrips] = useState([]); // APIから取得した旅行データ用のstate
  // tripsが更新されたタイミングでコンソールに出力
  useEffect(() => {
    console.log("tripsの中身:", trips);
  }, [trips]);

  // YYYY-MM-DDの値に(曜日)を追加する
  function formatDateWithDay(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // 日付変換失敗なら元文字列を返す
    const day = days[date.getDay()];
    return `${dateStr}(${day})`;
  }

  // // コンポーネントが表示されたときにデータを取得
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/triplist?user=${user}`);

        // 昨日の日付を取得
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // 最終日が今日より前の旅行をフィルタリング
        const filteredTrips = res.data.filter(
          (trip) => new Date(trip.last_date) >= yesterday
        );

        const TripList = filteredTrips.sort(
          (a, b) => new Date(a.first_date) - new Date(b.first_date)
        );
        console.log(TripList);
        setTrips(TripList);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            console.error(`404 Not Found: ${err.response.data.error}`);
          } else {
            console.error(
              `Error status: ${err.response.status}`,
              err.response.data
            );
          }
        } else if (err.request) {
          console.error("No response received from server", err.request);
        } else {
          console.error("Error setting up request", err.message);
        }
      }
    })();
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

          <button className="addButton" onClick={() => navigate("/createtrip")}>
            +
          </button>

          <div className="tripList">
            {trips.map((trip) => (
              <div
                key={trip.trip_id}
                className="tripCard"
                onClick={() => navigate(`/checklist/${trip.trip_id}`)}
              >
                <p className="tripCardTitle">{trip.location_name}</p>
                <p className="tripDate">
                  {formatDateWithDay(trip.first_date)} ～{" "}
                  {formatDateWithDay(trip.last_date)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
