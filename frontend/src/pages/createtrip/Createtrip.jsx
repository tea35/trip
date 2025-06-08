import axios from "axios";
import React, { useRef, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { useNavigate } from "react-router-dom";
import { ja } from "date-fns/locale";
import "./Createtrip.css";
import { format } from "date-fns";
import { useSelector } from "react-redux";

export default function Createtrip() {
  const user = useSelector((state) => state.auth.user);
  const place = useRef();
  const navigate = useNavigate();

  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [error, setError] = useState(null);

  // 地域名から緯度経度を取得する関数
  const fetchLatLng = async (address) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    console.log("process.env:", process.env);
    console.log("Google Maps APIキー:", apiKey);
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: apiKey,
        },
      }
    );

    if (response.data.status !== "OK") {
      throw new Error("Geocoding API error: " + response.data.status);
    }

    const location = response.data.results[0].geometry.location;
    return location;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const address = place.current.value;
      const location = await fetchLatLng(address);

      const first_date = format(selectedDateRange[0].startDate, "yyyy-MM-dd");
      const last_date = format(selectedDateRange[0].endDate, "yyyy-MM-dd");

      const trip = {
        user: user,
        location_name: address,
        location_latitude: location.lat,
        location_longitude: location.lng,
        first_date: first_date,
        last_date: last_date,
      };

      console.log(trip);

      await axios.post("http://localhost:5001/triplist", trip);
      const res = await axios.post("http://localhost:5001/insert_template", { user });
      console.log(res.data.trip_id);
      navigate(`/checklist/${res.data.trip_id}`);
    } catch (err) {
      console.log(err);
      setError("地域名から緯度経度の取得に失敗しました。入力内容を確認してください。");
    }
  };

  return (
    <div>
      <div className="headerBar">
        <h1>TripList</h1>
      </div>

      <div
        className="createtripBackground"
        style={{ backgroundImage: 'url("/sample2.png")' }}
      ></div>

      <form className="tripBox" onSubmit={handleClick}>
        <p className="tripFormTitle">新しい旅行を作成</p>
        <p className="tripMsg">旅行情報を入力してください</p>

        <div className="inputRow">
          <div className="tripPlaceGroup">
            <div className="tripPlaceLabel">場所</div>
            <input
              type="text"
              className="tripPlaceInput"
              placeholder="東京"
              required
              ref={place}
            />
          </div>

          <div className="tripDateGroup">
            <div className="tripDateLabel">日付</div>
            <DateRange
              onChange={(ranges) => setSelectedDateRange([ranges.selection])}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={selectedDateRange}
              dateDisplayFormat={"yyyy/MM/dd(E)"}
              direction="horizontal"
              locale={ja}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 mt-2">{error}</div>
        )}

        <div className="divider" />
        <button className="go2registerButton" type="submit">
          登録
        </button>
      </form>
    </div>
  );
}

