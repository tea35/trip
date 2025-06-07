import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TripList.css";

export default function TripList() {
  const navigate = useNavigate();

  // 仮の旅行データ（本来はバックエンドから取得）
  const TripList = [
    { id: 1, location_name: "東京", first_date: "1/1", last_date: "1/3" },
    { id: 2, location_name: "東京", first_date: "1/1", last_date: "1/3" },
  ];

  const [trips, setTrips] = useState([]); // APIから取得した旅行データ用のstate

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

      <div className="tripList">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="tripCard"
            onClick={() => navigate(`/checklist/${trip.id}`)}
          >
            <p className="tripCardTitle">{trip.location_name}</p>
            <p className="tripDate">
              {trip.first_date}~{trip.last_date}
            </p>
          </div>
        ))}
      </div>

      <button className="addButton" onClick={() => navigate("/createtrip")}>
        +
      </button>
    </div>
  );
}
