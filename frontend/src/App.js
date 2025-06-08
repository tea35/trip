import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TripList from "./pages/tripList/TripList";
import Createtrip from "./pages/createtrip/Createtrip";
import Checklist from "./pages/checklist/Checklist";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createtrip" element={<Createtrip />} />
          <Route path="/tripList" element={<TripList />} />
          <Route path="/checklist/:checklist_id" element={<Checklist />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
