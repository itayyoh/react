import { createContext, useEffect, useState } from "react";
import Router from "./Router";
import Navbar, { RoleTypes } from "./components/Navbar";
import Snackbar from "./components/Snackbar";
import Loader from "./components/Loader";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";

export const GeneralContext = createContext();

export default function App() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [roleType, setRoleType] = useState(RoleTypes.none);
  const navigate = useNavigate();

  const snackbar = (text) => {
    setSnackbarText(text);
    setTimeout(() => setSnackbarText(""), 3 * 1000);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.shipap.co.il/clients/login`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.text().then((x) => {
            throw new Error(x);
          });
        }
      })
      .then((data) => {
        setUser(data);
        setRoleType(RoleTypes.user);

        if (data.business) {
          setRoleType(RoleTypes.business);
        } else if (data.admin) {
          setRoleType(RoleTypes.admin);
        }

        navigate("/");
      })
      .catch((err) => {
        setRoleType(RoleTypes.none);
        snackbar(err.message);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GeneralContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        snackbar,
        roleType,
        setRoleType,
        navigate,
      }}
    >
      <Navbar />
      <Router />
      <Footer />
      {loading && <Loader />}
      {snackbarText && <Snackbar text={snackbarText} />}
    </GeneralContext.Provider>
  );
}
