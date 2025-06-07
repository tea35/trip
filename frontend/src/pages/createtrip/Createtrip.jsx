import axios from "axios";
import React, { useRef, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { useNavigate } from "react-router-dom";
import { ja } from "date-fns/locale";
import "./Createtrip.css";

// 旅行日程を追加
export default function Createtrip() {
  const user = useRef();
  const place = useRef();
  const navigate = useNavigate();

  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const trip = {
        user: user.current.value,
        place: place.current.value,
        latitude: 35.6895,   // 仮の緯度（東京）
        longitude: 139.6917, // 仮の経度（東京）
        startDate: selectedDateRange[0].startDate,
        endDate: selectedDateRange[0].endDate,
      };
      console.log(trip);
      await axios.post("/triplist", trip);
      navigate("/tripList"); // 登録後にtripList画面へ遷移
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="headerBar">
        <h1>TripList</h1>
      </div>

      <div className="createtripBackground"
        style={{ backgroundImage: 'url("/sample2.png")' }}
      ></div>

      <form className="tripBox" onSubmit={(e) => handleClick(e)}>
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
              // className="customDateRange"
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

        <div className="divider" />
        <button className="go2registerButton" type="submit">
          登録
        </button>
      </form>
    </div>
  );
}
