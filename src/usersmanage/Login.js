import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Joi from "joi";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTypes } from "../components/Navbar";

const defaultTheme = createTheme();

export default function Login() {
  const { setUser, setLoading, snackbar, setRoleType, navigate } =
    useContext(GeneralContext);

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (sessionStorage.email) {
      formData.email = sessionStorage.email;
      setFormData({ ...formData });
    }
  }, []);

  const login = (ev) => {
    ev.preventDefault();
    setLoading(true);

    fetch(
      "https://api.shipap.co.il/clients/login?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0",
      {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    )
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

        snackbar(`${data.fullName} logged in successfully!`);
        navigate("/");
      })
      .catch((err) => {
        snackbar(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInput = (ev) => {
    const { id, value } = ev.target;

    const obj = {
      ...formData,
      [id]: value,
    };

    setFormData(obj);

    const schema = loginSchema.validate(obj, { abortEarly: false });
    const errors = {};

    if (schema.error) {
      const error = schema.error.details.find((e) => e.context.key === id);

      if (error) {
        errors[id] = error.message;
      }
      setIsValid(false);
    } else {
      setIsValid(true);
    }

    setErrors(errors);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleInput}
            />
            {errors.email ? (
              <div className="fieldError">{errors.email}</div>
            ) : (
              ""
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleInput}
            />
            {errors.password ? (
              <div className="fieldError">{errors.password}</div>
            ) : (
              ""
            )}

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
