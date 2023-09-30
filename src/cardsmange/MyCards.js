import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import CallIcon from '@mui/icons-material/Call';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import { GeneralContext } from '../App';
import { Link } from 'react-router-dom';
import CreateCard from './CreateCard';
import './Cards.css'

export default function MyCards() {
  const { setLoading, user, snackbar } = useContext(GeneralContext);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch("https://api.shipap.co.il/business/cards?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setCards(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removeCard = (id) => {
    if (!window.confirm('Are you sure you want to remove this card?')) {
      return;
    }
    setLoading(true);
    fetch(`https://api.shipap.co.il/business/cards/${id}?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(() => {
      setCards(cards.filter(c => c.id !== id));
      snackbar("Card removed successfully");
    })
    .catch(err => console.log(err))
    .finally(() =>setLoading(false));
  };

  const favorite = (card) => {
    fetch(`https://api.shipap.co.il/cards/${card.id}/favorite?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`, {
        credentials: 'include',
        method: 'PUT',
    })
        .then(() => {
            snackbar("Card added to favorites");
            card.favorite = true;
        });
}

const unfavorite = (card) => {
    fetch(`https://api.shipap.co.il/cards/${card.id}/unfavorite?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`, {
        credentials: 'include',
        method: 'PUT',
    })
        .then(() => {
            snackbar("Card removed from favorites");
            card.favorite = false;
        });
}

  return (
    <div className='MyCards'>
      {cards.length ?
        <div className='Cards'>
        <header>
            <h1>Truly for every occasion</h1>
            <p>Here you can find business cards from all categories</p>
        </header>
        <div className='row'>

            {
                cards.map(c =>
                    <Card className='column' sx={{ width: 300, mb: 5, boxShadow: '5px 5px 5px 5px rgba(0, 0, 0, 0.11)', borderRadius: '10px' }} key={c.title}>
                            <CardMedia
                                component="img"
                                height="190"
                                image={c.imgUrl}
                                alt={c.imgAlt}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h1" component="h1" sx={{ fontFamily: "Oswald, sans-serif", fontWeight: 500, color: "black", fontSize: 32}}>
                                    {c.title}
                                </Typography>
                                <Typography gutterBottom variant="h1" component="h1" sx={{ ml: '2px', fontWeight: 300, color: "black", fontSize: 16, borderBottom: "1px solid lightgray", pb: 2}}>
                                    {c.subtitle}
                                </Typography>
                                <Typography style={{marginTop: 20, fontSize: 16}}>
                                    <b>Phone:</b> {c.phone}<br/>
                                    <b>Adress:</b> {c.houseNumber} {c.street} <br /> {c.country}, {c.city}  {c.zip} <br />
                                    <b>Card Number:</b> 0000000{c.id}
                                </Typography>
                            </CardContent>
                        <CardActions style={{display: 'flex', justifyContent: 'space-between'}}>
                          <div>

                        <IconButton className='trash-icon' onClick={() => removeCard(c.id)} aria-label="delete">
                                <DeleteIcon style={{color:"grey"}} />
                            </IconButton> 
                            <IconButton className='edit-icon' aria-label="edit">
                            <Link to={`/business/cards/${c.id}`} style={{ textDecoration: 'none', color: 'grey', height: '24px' }}><EditIcon /></Link>
                            </IconButton>
                          </div>
                          <div>
                          <IconButton className='heart-icon' aria-label="add to favorites" onClick={() => c.favorite ? unfavorite(c) : favorite(c)}>
                                    <FavoriteIcon style={{ color: c.favorite ? "red" : "grey" }} />
                                </IconButton>
                            <IconButton className='phone-icon' aria-label="call">
                                <CallIcon style={{color:"grey"}} />
                            </IconButton>
                          </div>
                        </CardActions>
                    </Card>
                )
            }

        </div>
        {user && <button className='addCard'><Link to={'/business/cards/new'}>+</Link></button>}

    </div>
        :
        <CreateCard />

      }
    </div>
  )
}
