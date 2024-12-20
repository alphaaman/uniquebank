import React from "react";
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      Phone: 123-456-7890 <br />
      Email: info@abcbank.com <br />
      Address: 123 Main Street, Noida, Uttar Pradesh, India <br />
      <br />
      {"© "}
      {new Date().getFullYear()}{" "}
      <Link color="inherit" href="https://uniquebank.com/">
        UNIQUE BANK
      </Link>{" "}
    </Typography>
  );
};

export default Footer;
