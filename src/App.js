// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/HeaderAndFooter/Header";
import Footer from "./components/HeaderAndFooter/Footer";
import Home from "./pages/Main/Home";
import InvitationCards from "./pages/Invitation/InvitationCards";
import InvitationAdd from "./pages/Invitation/InvitationAdd";
import InvitationList from "./pages/Invitation/InvitationList";
import InvitationEdit from "./pages/Invitation/InvitationEdit";
import FAQ from "./pages/FAQ/FAQ";
import InquiryPage from "./pages/FAQ/InquiryPage";
import Frame from "./pages/Frame/Frame";
import Letter from "./pages/Letter/Letter";
import Ticket from "./pages/Ticket/Ticket";
import Login from "./pages/Login/Login";
import Review from "./pages/Review/Review";
import CartList from "./pages/Cart/CartList";
import { CartProvider } from "./cart/CartContext"; // ✅ 경로 고정
import OrderComplete from "./pages/Cart/OrderComplete";

const HEADER_HEIGHT = 60;

export default function App() {
  return (
    <CartProvider>
      {/* ✅ index.js에서 감싸고 있다면 한쪽만 남기기 */}
      <Router>
        <Header />
        <main style={{ marginTop: `${HEADER_HEIGHT}px` }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/invitation-cards" element={<InvitationCards />} />
            <Route path="/invitation-add" element={<InvitationAdd />} />
            <Route path="/invitation-edit/:ino" element={<InvitationEdit />} />
            <Route path="/invitation-list" element={<InvitationList />} />

            <Route path="/cart-list" element={<CartList />} />
            <Route path="/order-complete" element={<OrderComplete />} />

            <Route path="/review" element={<Review />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/faq-query" element={<InquiryPage />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/letter" element={<Letter />} />
            <Route path="/frame" element={<Frame />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}
