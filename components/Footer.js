import Link from "next/link";
import { INSTAGRAM_URL } from "./Header";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="footer-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/brand/logo-mark.png" alt="Friction Point logo" />
              <span className="name">FRICTION POINT</span>
            </div>
            <p className="footer-tagline">Trust what you carry.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><Link href="/pull-the-trigger">Pull the Trigger</Link></li>
                <li><Link href="/edc">EDC</Link></li>
                <li><Link href="/knives">Knives</Link></li>
                <li><Link href="/range">Range</Link></li>
                <li><Link href="/gear">Gear</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Friction Point</h4>
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><Link href="/affiliate-disclosure">Affiliate Disclosure</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Friction Point. All rights reserved.</span>
          <span>Friction Point may earn a commission from qualifying purchases.</span>
        </div>
      </div>
    </footer>
  );
}
