import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import AllWards from "./pages/Dashboard/AllWards";
import WardDetails from "./pages/WardDetails/WardDetails";
import MapView from "./pages/MapView/MapView";
import WeatherCorrelation from "./pages/WeatherCorrelation/WeatherCorrelation";
import PredictiveAQI from "./pages/PredictiveAQI/PredictiveAQI";
import Solutions from "./pages/Solutions/Solutions";
import PortalSelect from "./pages/PortalSelect/PortalSelect";
import ConsumerOnboarding from "./pages/ConsumerOnboarding/ConsumerOnboarding";
import ConsumerDashboard from "./pages/ConsumerDashboard/ConsumerDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalSelect />} />
        <Route path="/government" element={<Home />} />
        <Route path="/consumer" element={<ConsumerDashboard />} />
        <Route path="/consumer/onboarding" element={<ConsumerOnboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/weather-correlation" element={<WeatherCorrelation />} />
        <Route path="/predictive-aqi" element={<PredictiveAQI />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/wards" element={<AllWards />} />
        <Route path="/wards/:wardName" element={<WardDetails />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
