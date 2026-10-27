import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brand } from './Nav';
import { Arrow } from './Icons';
import { useToast } from './Toast';
import { scrollToTop } from '../lib/smooth';
import { site } from '../data/site';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!EMAIL.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setEmail('');
    toast('Welcome to the Maison. Our next letter arrives with the new moon.');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__letter">
            <p className="eyebrow">La Lettre</p>
            <h2 className="footer__title">
              Four letters a year, <em>one for each season.</em>
            </h2>
            <form className="footer__form" onSubmit={submit} noValidate>
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                aria-invalid={!!error}
                aria-describedby={error ? 'newsletter-error' : undefined}
                autoComplete="email"
              />
              <button type="submit" className="footer__submit" aria-label="Subscribe">
                <Arrow />
              </button>
            </form>
            {error && (
              <p id="newsletter-error" className="field__error">
                {error}
              </p>
            )}
          </div>
          <div className="footer__cols">
            <div>
              <p className="footer__head">Maison</p>
              <Link to="/atelier">The Atelier</Link>
              <Link to="/collections">Collections</Link>
              <Link to="/case-study">Design Case Study</Link>
            </div>
            <div>
              <p className="footer__head">Services</p>
              <Link to="/configure">Configure a watch</Link>
              <Link to="/appointment">Private appointment</Link>
            </div>
            <div>
              <p className="footer__head">Boutiques</p>
              <span>Genève</span>
              <span>Paris</span>
              <span>London</span>
              <span>Dubai · Tokyo</span>
            </div>
          </div>
        </div>
        <p className="footer__word" aria-hidden="true">
          Aurelle
        </p>
        <div className="footer__bottom">
          <Brand />
          <p>
            © 2026 Maison Aurelle — a fictional brand. Concept, UX &amp; build by {site.author}.
          </p>
          <button className="link-arrow" onClick={scrollToTop}>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
