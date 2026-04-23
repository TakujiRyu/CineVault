import React from "react";
import "./footer.css";
import FooterNavItem from "../components/FooterNavItem";

function Footer() {
  const usefulLinks = [
    "Home",
    "Movies",
    "My List",
    "Terms of service",
    "Privacy Policy",
  ];
  const locations = [
    "Dolorum optia",
    "Non rem rerum",
    "Cras fermentum odio",
    "Justo eget",
    "Fermentum iaculis",
  ];
  return (
    <footer id="footer" className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-5 col-md-12 footer-info">
              <a href="/" className="logo d-flex algin-items-center">
                <span>CINEVault</span>
              </a>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut
                reiciendis suscipit aspernatur incidunt, sed, velit magni
                inventore illo aliquid architecto eum ad sit atque vero libero
                facere omnis, nihil tenetur.
              </p>
              <div className="social-links mt-3">
                <a href="#" className="twitter">
                  <ion-icon name="logo-twitter"></ion-icon>
                </a>
                <a href="#" className="facebook">
                  <ion-icon name="logo-facebook"></ion-icon>
                </a>
                <a href="#" className="instagram">
                  <ion-icon name="logo-instagram"></ion-icon>
                </a>
                <a href="#" className="youtube">
                  <ion-icon name="logo-youtube"></ion-icon>
                </a>
              </div>
            </div>

            <div className="col-lg-2 col-6 footer-links">
              <h4>Useful Links</h4>
              <ul>
                {usefulLinks.map((link) => (
                  <FooterNavItem key={link} name={link} />
                ))}
              </ul>
            </div>

            <div className="col-lg-2 col-6 footer-links">
              <h4>Our Cinemas</h4>
              <ul>
                {locations.map((link) => (
                  <FooterNavItem key={link} name={link} />
                ))}
              </ul>
            </div>

            <div className="col-lg-3 col-md-12 footer-contact text-center text-no-start">
              <h4>Contact Us</h4>
              <p>
                Street Name <br />
                City Name, State 123456
                <br />
                Bhutan <br />
                <br />
                <strong>Phone:</strong> +975 77216679
                <strong>Email:</strong> kinchap176@gmail.com
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="copyright">
          &copy; Copyright{""}
          <strong>
            <span>DStudio Techonology</span>
          </strong>
          .All Rights Reserved
        </div>
        <div className="credits">
          Designed by <a href="#"> DStudio Technology</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
