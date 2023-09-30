import Avatar from '@mui/material/Avatar';
import Joi from 'joi';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext, useState } from 'react';
import { GeneralContext } from '../App';

const defaultTheme = createTheme();

export default function Signup() {

  const structure = [
    { name: 'middleName', type: 'text', label: 'Middle name', required: false, halfWidth: true },
    { name: 'lastName', type: 'text', label: 'Last name', required: true, halfWidth: true },
    { name: 'phone', type: 'tel', label: 'Phone', required: true, halfWidth: true },
    { name: 'email', type: 'email', label: 'Email', required: true, halfWidth: false },
    { name: 'password', type: 'password', label: 'Password', required: true, halfWidth: true },
    { name: 'imgAlt', type: 'text', label: 'Image alt', required: false, halfWidth: true },
    { name: 'imgUrl', type: 'text', label: 'Image url', required: false, halfWidth: false },
    { name: 'state', type: 'text', label: 'State', required: false, halfWidth: true },
    { name: 'country', type: 'text', label: 'Country', required: true, halfWidth: true },
    { name: 'city', type: 'text', label: 'City', required: true, halfWidth: true },
    { name: 'street', type: 'text', label: 'Street', required: true, halfWidth: true },
    { name: 'houseNumber', type: 'number', label: 'House number', required: true, halfWidth: true },
    { name: 'zip', type: 'number', label: 'Zip', required: false, halfWidth: true },
  ]

  const { snackbar, setLoading, navigate } = useContext(GeneralContext);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    imgUrl: '',
    imgAlt: '',
    state: '',
    country: '',
    city: '',
    street: '',
    houseNumber: '',
    zip: '',
    business: false,
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const loginSchema = Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    middleName: Joi.string().min(0).max(20).empty(),
    lastName: Joi.string().min(3).max(20).required(),
    phone: Joi.string().regex(/^[0-9]{10,15}$/).messages({ 'string.pattern.base': `Phone number must have between 10-15 digits.` }).required(),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4})(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,30}$/)
      .message('user "password" must be at least nine characters long and contain an uppercase letter, a lowercase letter, 4 numbers and one of the following characters !@#$%^&*'),
    imgUrl: Joi.string().min(0).max(50),
    imgAlt: Joi.string().min(0).max(20),
    state: Joi.string().min(0).max(20),
    country: Joi.string().min(3).required(),
    city: Joi.string().min(3).required(),
    street: Joi.string().min(3).required(),
    houseNumber: Joi.number().min(1).required(),
    zip: Joi.any(),
    business: Joi.boolean().default(false),
  });

  const handleInput = ev => {
    const { id, value } = ev.target;
    let obj = {
      ...formData,
      [id]: value,
    };

    if (id === 'business') {
      const { id, checked } = ev.target;
      obj = {
        ...formData,
        [id]: checked
      }
    }
    console.log(obj);
    const schema = loginSchema.validate(obj, { abortEarly: false });
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

  function signup(ev) {
    ev.preventDefault();

    setLoading(true);
    fetch(`https://api.shipap.co.il/clients/signup?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (res.ok) {
          return res.json()
            .then(() => {
              sessionStorage.email = formData.email;
              snackbar("User was created successfully")
              navigate('/login');
            })
        } else {
          return res.text()
            .then(x => {
              throw new Error(x);
            });
        }
      })
      .catch(err => {
        snackbar(err.message);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      })
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={1.9}>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={formData.firstName}
                  onChange={handleInput}
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
                {errors.firstName ? <div className='fieldError' style={{color:"red"}}>{errors.firstName}</div> : ''}
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
                    {errors[item.name] ? <div className='fieldError' style={{color:"red"}}>{errors[item.name]}</div> : ''}
                  </Grid>
                )
              }

              <Grid item xs={12}>
                <FormControlLabel
                    label="Business"
                  control={<Checkbox
                    id="business"
                    color="primary"
                    checked={formData.business}
                    onChange={handleInput}
                    name="business"
                  />}
                />
              </Grid>
            </Grid>
            <Button
              onClick={signup}
              disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/login">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}