import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImage1 from "../assets/banner1.png";
import bannerImage2 from "../assets/banner2.png";
import bannerImage3 from "../assets/banner3.png";
import bannerImage4 from "../assets/banner4.png";
import featureImage1 from "../assets/people.jpg";
import featureImage2 from "../assets/card.png";
import featureImage3 from "../assets/about.png";
import "./Home.css";

const Home = () => {
  return (
    <>
      <section className="marquee">
        <Container>
          <Typography variant="body1" component="p" className="marquee-text">
            Welcome to Unique Bank - Your Trusted Banking Partner for a Brighter Future
          </Typography>
        </Container>
      </section>

      <section className="banner">
        <Container>
          <div className="banner-content">
            <Carousel
              autoPlay
              infiniteLoop
              showThumbs={false}
              showStatus={false}
              emulateTouch
              swipeable
              dynamicHeight
              renderIndicator={(clickHandler, isSelected, index) => (
                <button
                  type="button"
                  onClick={clickHandler}
                  className={`indicator ${isSelected ? "active" : ""}`}
                  key={index}
                />
              )}
            >
              <div>
                <img src={bannerImage1} alt="Banner 1" />
              </div>
              <div>
                <img src={bannerImage2} alt="Banner 2" />
              </div>
              <div>
                <img src={bannerImage3} alt="Banner 3" />
              </div>
              <div>
                <img src={bannerImage4} alt="Banner 4" />
              </div>
            </Carousel>
            <Typography variant="h3" component="h1" gutterBottom>
              UNIQUE BANK
            </Typography>
            <Typography variant="h4" component="h4" gutterBottom>
              Banking Reinvented
            </Typography>
            <Button component={Link} to="/register" variant="contained" color="primary">
              Get Started
            </Button>
          </div>
        </Container>
      </section>

      <section className="features">
        <Container>
          <div className="feature">
            <img src={featureImage1} alt="Feature 1" className="feature-image" />
            <div className="feature-content">
              <Typography variant="h5" component="h2" gutterBottom>
                Personal Banking
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Manage your finances with ease through our comprehensive personal banking services.
              </Typography>
              <Button component={Link} to="/personal-banking" variant="outlined" color="primary">
                Learn More
              </Button>
            </div>
          </div>
          <div className="feature">
            <div className="feature-content">
              <Typography variant="h5" component="h2" gutterBottom>
                Business Banking
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Discover specialized banking solutions to support your business growth and success.
              </Typography>
              <Button component={Link} to="/business-banking" variant="outlined" color="primary">
                Learn More
              </Button>
            </div>
            <img src={featureImage2} alt="Feature 2" className="feature-image" />
          </div>
          <div className="feature">
            <img src={featureImage3} alt="Feature 3" className="feature-image" />
            <div className="feature-content">
              <Typography variant="h5" component="h2" gutterBottom>
                Loans and Investments
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Explore our range of loan options and investment opportunities tailored to your needs.
              </Typography>
              <Button component={Link} to="/loans-investments" variant="outlined" color="primary">
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Home;