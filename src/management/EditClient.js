import Avatar from "@mui/material/Avatar";
import Joi from "joi";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../App";
import { useParams } from "react-router-dom";

const defaultTheme = createTheme();

export default function EditClient() {
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.shipap.co.il/admin/clients?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFormData(data.filter((c) => c.id === id)[0]);
        console.log(data.filter((c) => c.id === id)[0]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const structure = [
    {
      name: "middleName",
      type: "text",
      label: "Middle name",
      required: false,
      halfWidth: true,
    },
    {
      name: "lastName",
      type: "text",
      label: "Last name",
      required: true,
      halfWidth: true,
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone",
      required: true,
      halfWidth: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      required: true,
      halfWidth: true,
    },
    {
      name: "imgAlt",
      type: "text",
      label: "Image alt",
      required: false,
      halfWidth: true,
    },
    {
      name: "imgUrl",
      type: "text",
      label: "Image url",
      required: false,
      halfWidth: false,
    },
    {
      name: "state",
      type: "text",
      label: "State",
      required: false,
      halfWidth: true,
    },
    {
      name: "country",
      type: "text",
      label: "Country",
      required: true,
      halfWidth: true,
    },
    {
      name: "city",
      type: "text",
      label: "City",
      required: true,
      halfWidth: true,
    },
    {
      name: "street",
      type: "text",
      label: "Street",
      required: true,
      halfWidth: true,
    },
    {
      name: "houseNumber",
      type: "number",
      label: "House number",
      required: true,
      halfWidth: true,
    },
    {
      name: "zip",
      type: "number",
      label: "Zip",
      required: false,
      halfWidth: true,
    },
  ];

  const { snackbar, setLoading, navigate } = useContext(GeneralContext);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    imgUrl: "",
    imgAlt: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
    business: false,
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const formSchema = Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    middleName: Joi.string().min(0).max(20).empty(),
    lastName: Joi.string().min(3).max(20).required(),
    phone: Joi.string()
      .regex(/^[0-9]{10,15}$/)
      .messages({
        "string.pattern.base": `Phone number must have between 10-15 digits.`,
      })
      .required(),
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    imgUrl: Joi.string().min(0).max(50),
    imgAlt: Joi.string().min(0).max(20),
    state: Joi.string().min(0).max(20),
    country: Joi.string().min(3).required(),
    city: Joi.string().min(3).required(),
    street: Joi.string().min(3).required(),
    houseNumber: Joi.number().min(1).required(),
    zip: Joi.number().min(0),
    business: Joi.boolean().default(false),
    fullName: Joi.any(),
    id: Joi.any(),
  });

  const handleInput = (ev) => {
    const { id, value } = ev.target;
    let obj = {
      ...formData,
      [id]: value,
    };

    if (id === "business") {
      const { id, checked } = ev.target;
      obj = {
        ...formData,
        [id]: checked,
      };
    }
    console.log(obj);
    const schema = formSchema.validate(obj, { abortEarly: false });
    console.log(schema);
    const err = { ...errors, [id]: undefined };

    if (schema.error) {
      const error = schema.error.details.find((e) => e.context.key === id);

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

  function editInfo(ev) {
    fetch(
      `https://api.shipap.co.il/admin/clients/${id}?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`,
      {
        credentials: "include",
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      }
    )
      .then(() => {
        snackbar("Client updated successfully");
        navigate("/admin/clients");
      })
      .catch((err) => snackbar(err));
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Account Information
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
                {errors.firstName ? (
                  <div className="fieldError" style={{ color: "red" }}>
                    {errors.firstName}
                  </div>
                ) : (
                  ""
                )}
              </Grid>

              {structure.map((item) => (
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
                  {errors[item.name] ? (
                    <div className="fieldError" style={{ color: "red" }}>
                      {errors[item.name]}
                    </div>
                  ) : (
                    ""
                  )}
                </Grid>
              ))}

              <Grid item xs={12}>
                <FormControlLabel
                  label="Business"
                  control={
                    <Checkbox
                      id="business"
                      color="primary"
                      checked={formData.business}
                      onChange={handleInput}
                      name="business"
                    />
                  }
                />
              </Grid>
            </Grid>
            <Button
              onClick={editInfo}
              disabled={!isValid}
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 20 }}
            >
              Save Info
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
