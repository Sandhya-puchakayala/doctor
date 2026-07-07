import { useState, useEffect } from 'react';
import { CATEGORIES } from './CardCarousel';
import './ContactForm.css';

/*
 * Web3Forms access key — get a free one in seconds:
 *   1. Go to https://web3forms.com
 *   2. Enter the email where you want to receive submissions:
 *        sandhyapuchakayala716@gmail.com   (testing — change later)
 *   3. Copy the access key they email to that inbox and paste it below.
 * Every form submission is then delivered straight to that Gmail inbox.
 */
const WEB3FORMS_ACCESS_KEY = 'c287338a-f229-4a8a-9f79-9ce0a0415090';

/**
 * Transparent contact form shown below the card carousel on page 2.
 * The Category field auto-fills with whichever card the user selected,
 * and can still be changed manually. On submit it emails the details
 * via Web3Forms.
 */
const ContactForm = ({ category }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    category: category || CATEGORIES[0],
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  /* Keep the category in sync with the card the user picked on the carousel */
  useEffect(() => {
    if (category) setForm((f) => ({ ...f, category }));
  }, [category]);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New session request — ${form.category}`,
          from_name: 'N4Y Website',
          Name: form.name,
          Phone: form.phone,
          Email: form.email,
          Category: form.category,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? 'sent' : 'error');
    } catch (err) {
      setStatus('error');
    }
  };

  const sent = status === 'sent';
  const sending = status === 'sending';

  return (
    <div className="cf__card">
        <h2 className="cf__title">
          Book Your <span>Session</span>
        </h2>
        <p className="cf__subtitle">
          Tell us a little about you and we’ll reach out to support your healing.
        </p>

        {sent ? (
          <div className="cf__thanks">
            Thank you, {form.name || 'friend'}. We’ve received your request for
            <strong> {form.category}</strong> and will contact you shortly.
          </div>
        ) : (
          <form className="cf__form" onSubmit={onSubmit}>
            <div className="cf__field">
              <label htmlFor="cf-name">Name</label>
              <input
                id="cf-name"
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="cf__field">
              <label htmlFor="cf-phone">Phone</label>
              <input
                id="cf-phone"
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                placeholder="+91 00000 00000"
                required
              />
            </div>

            <div className="cf__field">
              <label htmlFor="cf-email">Email</label>
              <input
                id="cf-email"
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="cf__field">
              <label htmlFor="cf-category">Category</label>
              <select
                id="cf-category"
                value={form.category}
                onChange={update('category')}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {status === 'error' && (
              <p className="cf__error">
                Something went wrong sending your request. Please try again.
              </p>
            )}

            <button className="cf__submit" type="submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send Request'}
            </button>
          </form>
        )}
    </div>
  );
};

export default ContactForm;
