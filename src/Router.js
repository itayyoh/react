import { Route, Routes } from "react-router-dom";
import Cards from "./cardsmange/Cards";
import Login from "./usersmanage/Login";
import Signup from "./usersmanage/Signup";
import EditCard from "./cardsmange/EditCard";
import CreateCard from "./cardsmange/CreateCard";
import MyCards from "./cardsmange/MyCards";
import FavoriteCards from "./cardsmange/FavoriteCards";
import Account from "./pages/Account";
import ClientManagement from "./management/ClientManagement";
import EditClient from "./management/EditClient";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Cards />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cards/favorite" element={<FavoriteCards />} />
      <Route path="/business/cards" element={<MyCards />} />
      <Route path="/business/cards/new" element={<CreateCard />} />
      <Route path="/business/cards/:id" element={<EditCard />} />
      <Route path="/admin/clients" element={<ClientManagement />} />
      <Route path="/admin/clients/:id" element={<EditClient />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}
