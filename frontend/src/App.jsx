import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateLink from "./pages/CreateLink";
import LinkDetails from "./pages/LinkDetails";
import Status from "./pages/Status";
import Header from "./components/Header";
import "./styles/ui.css";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <main className="container" style={{ paddingTop: 20 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateLink />} />
          <Route path="/link/:code" element={<LinkDetails />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
