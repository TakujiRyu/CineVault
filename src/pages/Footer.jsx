import React from "react";
import "./footer.css";
import FooterNavItem from "../components/FooterNavItem";

function Footer() {
  const usefulLinks = [
    "Home",
    "Movies",
    "My List",
    "Terms of Service",
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
                CineVault is a privacy-aware movie streaming platform designed
                to let users watch content, manage their lists, and control
                their data preferences in one place.
              </p>
              <div className="social-links mt-3">
                <a
                  href="https://twitter.com"
                  className="twitter"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                >
                  <ion-icon name="logo-twitter"></ion-icon>
                </a>
                <a
                  href="https://facebook.com"
                  className="facebook"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <ion-icon name="logo-facebook"></ion-icon>
                </a>
                <a
                  href="https://instagram.com"
                  className="instagram"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <ion-icon name="logo-instagram"></ion-icon>
                </a>
                <a
                  href="https://youtube.com"
                  className="youtube"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                >
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
                <strong>Phone:</strong> +975 77216679 <br />
                <strong>Email:</strong> kinchap176@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="copyright">
          &copy; Copyright{" "}
          <strong>
            <span>DStudio Technology</span>
          </strong>
          . All Rights Reserved
        </div>
        <div className="credits">Designed by DStudio Technology</div>
      </div>
    </footer>
  );
}

export default Footer;
