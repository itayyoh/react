import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import CallIcon from "@mui/icons-material/Call";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { Link } from "react-router-dom";
import "./Cards.css";

export default function Cards() {
  const [cards, setCards] = useState([]);
  const { setLoading, user, roleType, snackbar } = useContext(GeneralContext);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.shipap.co.il/cards?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const adminRemoveCard = (id) => {
    if (!window.confirm("Are you sure you want to remove this card?")) {
      return;
    }
    setLoading(true);
    fetch(
      `https://api.shipap.co.il/admin/cards/${id}?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`,
      {
        credentials: "include",
        method: "DELETE",
      }
    )
      .then(() => {
        setCards(cards.filter((c) => c.id !== id));
        snackbar("Card removed successfully");
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const favorite = (card) => {
    fetch(
      `https://api.shipap.co.il/cards/${card.id}/favorite?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`,
      {
        credentials: "include",
        method: "PUT",
      }
    ).then(() => {
      snackbar("Card added to favorites");
      card.favorite = true;
    });
  };

  const unfavorite = (card) => {
    fetch(
      `https://api.shipap.co.il/cards/${card.id}/unfavorite?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`,
      {
        credentials: "include",
        method: "PUT",
      }
    ).then(() => {
      snackbar("Card removed from favorites");
      card.favorite = false;
    });
  };

  return (
    <div className="Cards">
      <header>
        <h3>CARDS</h3>
      </header>
      <div className="row">
        {cards.map((c) => (
          <Card
            className="column"
            sx={{
              width: 300,
              mb: 5,
              boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.11)",
              borderRadius: "10px",
            }}
            key={c.title}
          >
            <CardMedia
              component="img"
              height="190"
              image={c.imgUrl}
              alt={c.imgAlt}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h1"
                component="h1"
                sx={{
                  fontFamily: "Oswald, sans-serif",
                  fontWeight: 500,
                  color: "black",
                  fontSize: 32,
                }}
              >
                {c.title}
              </Typography>
              <Typography style={{ marginTop: 20, fontSize: 16 }}>
                <b>Phone:</b> {c.phone}
                <br />
                <b>Adress:</b> {c.houseNumber} {c.street} <br /> {c.country},{" "}
                {c.city} {c.zip} <br />
                <b>Card Number:</b> 0000000{c.id}
              </Typography>
            </CardContent>
            <CardActions
              style={{
                display: "flex",
                justifyContent: "flex-end",
                position: "relative",
              }}
            >
              {roleType === 3 && (
                <IconButton
                  className="trash-icon"
                  sx={{ position: "absolute", left: "5px" }}
                  onClick={() => adminRemoveCard(c.id)}
                  aria-label="delete"
                >
                  <DeleteIcon style={{ color: "grey" }} />
                </IconButton>
              )}

              {user && (
                <IconButton
                  className="heart-icon"
                  aria-label="add to favorites"
                  onClick={() => (c.favorite ? unfavorite(c) : favorite(c))}
                >
                  <FavoriteIcon
                    style={{ color: c.favorite ? "red" : "grey" }}
                  />
                </IconButton>
              )}
              <IconButton className="phone-icon" aria-label="call">
                <CallIcon style={{ color: "grey" }} />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </div>
      {user && (
        <button className="addCard">
          <Link to={"/business/cards/new"}>+</Link>
        </button>
      )}
    </div>
  );
}
