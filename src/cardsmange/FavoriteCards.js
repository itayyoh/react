import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import CallIcon from '@mui/icons-material/Call';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import { GeneralContext } from '../App';
import './Cards.css';


export default function FavoriteCards() {
  const [favoriteCards, setFavoriteCards] = useState([]);
  const { setLoading, snackbar } = useContext(GeneralContext);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.shipap.co.il/cards/favorite?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setFavoriteCards(data);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const unfavorite = (id) => {
    setLoading(true);
    fetch(`https://api.shipap.co.il/cards/${id}/unfavorite?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`, {
      credentials: 'include',
      method: 'PUT',
    })
      .then(() => {
        setFavoriteCards(favoriteCards.filter(c => c.id !== id));
        snackbar("Card removed from favorites");
      })
      .finally(() => setLoading(false));
  }
  return (
    <div className='Cards'>
      <header>
        <h1>My Favorite Cards</h1>
        <p>Here you can find your favorite cards</p>
      </header>
      <div className='row'>

        {
          favoriteCards.map(c =>
            <Card className='column' sx={{ width: 300, mb: 5, boxShadow: '5px 5px 5px 5px rgba(0, 0, 0, 0.11)', borderRadius: '10px' }} key={c.title}>
              <CardMedia
                component="img"
                height="190"
                image={c.imgUrl}
                alt={c.imgAlt}
              />
              <CardContent>
                <Typography gutterBottom variant="h1" component="h1" sx={{ fontFamily: "Oswald, sans-serif", fontWeight: 500, color: "black", fontSize: 32 }}>
                  {c.title}
                </Typography>
                <Typography style={{ marginTop: 20, fontSize: 16 }}>
                  <b>Phone:</b> {c.phone}<br />
                  <b>Adress:</b> {c.houseNumber} {c.street} <br /> {c.country}, {c.city}  {c.zip} <br />
                  <b>Card Number:</b> 0000000{c.id}
                </Typography>
              </CardContent>
              <CardActions style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                <IconButton className='heart-icon' aria-label="add to favorites" onClick={() => unfavorite(c.id)}>
                  <FavoriteIcon style={{ color: "red" }} />
                </IconButton>
                <IconButton className='phone-icon' aria-label="call">
                  <CallIcon style={{ color: "grey" }} />
                </IconButton>
              </CardActions>
            </Card>
          )
        }

      </div>

    </div>
  );
}