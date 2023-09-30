import Joi from 'joi';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import { GeneralContext } from '../App';
import { useParams } from 'react-router-dom';

const defaultTheme = createTheme();

export default function CreateCard() {
    const { snackbar, setLoading, navigate } = useContext(GeneralContext);
    const { id } = useParams();
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    const structure = [
        { name: 'subtitle', type: 'text', label: 'Subtitle', required: true, halfWidth: true },
        { name: 'description', type: 'text', label: 'Description', required: true, halfWidth: true },
        { name: 'phone', type: 'tel', label: 'Phone', required: true, halfWidth: true },
        { name: 'email', type: 'email', label: 'Email', required: true, halfWidth: true },
        { name: 'web', type: 'text', label: 'Web', required: false, halfWidth: true },
        { name: 'imgUrl', type: 'text', label: 'Image url', required: false, halfWidth: true },
        { name: 'imgAlt', type: 'text', label: 'Image alt', required: false, halfWidth: true },
        { name: 'state', type: 'text', label: 'State', required: false, halfWidth: true },
        { name: 'country', type: 'text', label: 'Country', required: true, halfWidth: true },
        { name: 'city', type: 'text', label: 'City', required: true, halfWidth: true },
        { name: 'street', type: 'text', label: 'Street', required: true, halfWidth: true },
        { name: 'houseNumber', type: 'number', label: 'House number', required: true, halfWidth: true },
        { name: 'zip', type: 'number', label: 'Zip', required: false, halfWidth: true },
    ]

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        phone: '',
        email: '',
        web: '',
        imgUrl: '',
        imgAlt: '',
        state: '',
        country: '',
        city: '',
        street: '',
        houseNumber: '',
        zip: '',
    });
    const formSchema = Joi.object({
        title: Joi.string().min(3).max(20).required(),
        subtitle: Joi.string().min(3).max(25).required(),
        description: Joi.string().min(3).max(150).required(),
        phone: Joi.string().regex(/^[0-9]{9,15}$/).messages({ 'string.pattern.base': `Phone number must have between 9-15 digits.` }).required(),
        email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        web: Joi.string().min(0).max(300),
        imgUrl: Joi.string().min(0).max(500),
        imgAlt: Joi.string().min(0).max(30),
        state: Joi.string().min(0).max(30),
        country: Joi.string().min(3).max(30).required(),
        city: Joi.string().min(3).max(30).required(),
        street: Joi.string().min(3).max(30).required(),
        houseNumber: Joi.string().min(1).max(10).required(),
        zip: Joi.string().min(0),
        id: Joi.any(),
        clientId: Joi.any(),
        createdTime: Joi.any(),
        favorite: Joi.any()
    });

    useEffect(() => {
        setLoading(true);
        fetch("https://api.shipap.co.il/business/cards?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0", {
          credentials: "include",
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            setFormData(data.filter(c => c.id == id)[0])
            console.log(data.filter(c => c.id == id)[0]);
            /* eslint eqeqeq: 0 */
          })
          .catch(err => console.error(err))
          .finally(() => setLoading(false));
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    const handleInput = ev => {
        const { id, value } = ev.target;
        let obj = {
            ...formData,
            [id]: value,
        };

        const schema = formSchema.validate(obj, { abortEarly: false });
        console.log(schema);
        const err = { ...errors, [id]: undefined };

        if (schema.error) {
            const error = schema.error.details.find(e => e.context.key === id);

            if (error) {
                err[id] = error.message;
            }
            setIsValid(false);
        } else {
            setIsValid(true);
        }

        setFormData(obj);
        setErrors(err);
    };

    function submit(ev) {
        ev.preventDefault();

        setLoading(true);
        fetch(`https://api.shipap.co.il/business/cards/${id}?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then(data => {
                setFormData(data);
                snackbar("Card saved successfully");
                navigate('/business/cards');

            })
            .catch(err => snackbar(err.message))
            .finally(() => setLoading(false));
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'info.main' }}>
                        <EditIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Edit Card
                    </Typography>
                    <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={1.9}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={formData.title}
                                    onChange={handleInput}
                                    name="title"
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    autoFocus
                                />
                                {errors.title ? <div className='fieldError'  style={{color:"red"}}>{errors.title}</div> : ''}
                            </Grid>

                            {
                                structure.map(item =>
                                    <Grid item xs={12} sm={item.halfWidth ? 6 : 12} key={item.name}>
                                        <TextField
                                            onChange={handleInput}
                                            value={formData[item.name]}
                                            name={item.name}
                                            type={item.type}
                                            required={item.required}
                                            fullWidth
                                            id={item.name}
                                            label={item.label}
                                        />
                                        {errors[item.name] ? <div className='fieldError'  style={{color:"red"}}>{errors[item.name]}</div> : ''}
                                    </Grid>
                                )
                            }
                        </Grid>
                        <Button
                            onClick={submit}
                            disabled={!isValid}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}