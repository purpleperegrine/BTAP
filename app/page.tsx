/* eslint-disable @next/next/no-img-element -- These small local restaurant assets are served directly by the Sites worker. */

import { MobileMenu } from "./MobileMenu";

const PHONE_DISPLAY = "(828) 288-8388";
const PHONE_LINK = "tel:+18282888388";
const FACEBOOK = "https://www.facebook.com/barleysinspindale/";

type MenuItem = {
  name: string;
  price: string;
  description?: string;
};

const specialtyPizzas: MenuItem[] = [
  {
    name: "Barleys",
    price: "M 24 · L 30",
    description:
      "Pepperoni, Italian sausage, green bell pepper, mushrooms & onion",
  },
  {
    name: "The Meat",
    price: "M 24 · L 30",
    description: "Pepperoni, Italian sausage, bacon, ham & beef",
  },
  {
    name: "The Veggie",
    price: "M 24 · L 30",
    description: "Spinach, mushroom, onion, broccoli & tomato",
  },
  {
    name: "The Greek",
    price: "M 24 · L 30",
    description: "Spinach, black olive, feta, onion & sun-dried tomato",
  },
  {
    name: "The Caribbean",
    price: "M 24 · L 30",
    description:
      "Jerk chicken, artichoke, onion, spinach & olive oil — no sauce",
  },
  {
    name: "Pizza of the Month",
    price: "Tiny 15 · M 24 · L 30",
    description: "Ask what’s coming hot out of the oven this month",
  },
];

const pizzaClassics: MenuItem[] = [
  { name: "Cheese", price: "Slice 3 · Tiny 10 · M 15 · L 17" },
  { name: "White or Pesto", price: "M 16 · L 18" },
  { name: "Vegan", price: "M 16 · L 18" },
  { name: "Gluten-free", price: "10-inch 12" },
  {
    name: "Calzone",
    price: "16",
    description: "Two toppings with marinara on the side<br>2.50 for each topping",
  },
];

const starters: MenuItem[] = [
  { name: "Wings!", price: "10" },
  { name: "Fiddlesticks", price: "9" },
  { name: "Garlic knots", price: "½ dozen 6 · dozen 10" },
  { name: "Bruschetta", price: "10" },
  { name: "Soup", price: "Cup 5 · bowl 7" },
  { name: "Chili", price: "Cup 6 · bowl 8" },
  { name: "Chips & salsa", price: "5" },
  { name: "Garlic bread", price: "6" },
  { name: "Spinach-artichoke dip", price: "10", description: "When available" },
  { name: "Chorizo dip", price: "9" },
  { name: "Hummus", price: "9" },
  { name: "Nachos", price: "9" },
];

const pastasAndMains: MenuItem[] = [
  { name: "Spaghetti", price: "12" },
  { name: "Spaghetti & meatballs", price: "14" },
  { name: "Baked spaghetti & meatballs", price: "16" },
  { name: "Fettuccine Alfredo", price: "12" },
  { name: "Lasagna", price: "16" },
  { name: "Pasta Prima", price: "14" },
  { name: "Voodoo Pasta", price: "14" },
  { name: "Salmon", price: "17" },
  { name: "Four-topping stir-fry", price: "12" },
];

const sandwiches: MenuItem[] = [
  { name: "Beef Burger", price: "12" },
  { name: "Italian Sub", price: "10" },
  { name: "Black Bean Burger", price: "12" },
  { name: "BBQ Chicken", price: "12" },
  { name: "Chicken Parmesan", price: "12" },
  { name: "Chicken Sandwich", price: "12" },
  { name: "Chicken Wrap", price: "12" },
  { name: "Steak & Cheese", price: "13" },
  { name: "Turkey", price: "13" },
  { name: "Reuben", price: "14" },
  { name: "Jerk Tofu", price: "12" },
  { name: "Meatball", price: "12" },
  { name: "Veggie Sandwich", price: "12" },
  { name: "Veggie Wrap", price: "12" },
  { name: "Burger of the Month", price: "14" },
];

const kidsPasta: MenuItem[] = [
  { name: "Butter Noodles", price: "4" },
  { name: "Fettuccine Alfredo", price: "7" },
  { name: "Spaghetti", price: "7" },
  { name: "Baked Spaghetti", price: "10" },
  { name: "Spaghetti & Meatball", price: "8" },
  { name: "Pasta Prima", price: "8" },
  { name: "Voodoo Chicken Pasta", price: "8" },
];

const sweets: MenuItem[] = [
  { name: "Ice Cream", price: "2" },
  { name: "Brownie", price: "6" },
  { name: "Cheesecake", price: "6" },
  { name: "Lemon mascarpone", price: "8" },
  { name: "Oreo cheesecake", price: "9" },
];

const zeroProof: MenuItem[] = [
  { name: "Guinness N/A", price: "4" },
  { name: "Trail Pass IPA N/A", price: "4" },
  { name: "Athletic seasonal", price: "4" },
  { name: "Ultra Zero", price: "3" },
];

function MenuList({ items }: { items: MenuItem[] }) {
  return (
    <div className="menu-list">
      {items.map((item) => (
        <div className="menu-item" key={item.name}>
          <div>
            <h3>{item.name}</h3>
            {item.description ? <p>{item.description}</p> : null}
          </div>
          <span className="menu-price">{item.price}</span>
        </div>
      ))}
    </div>
  );
}

function CallButton({ className = "" }: { className?: string }) {
  return (
    <a
      className={`button button-primary primary-CTA ${className}`.trim()}
      data-cta="primary-CTA"
      href={PHONE_LINK}
      aria-label={`Call Barley's at ${PHONE_DISPLAY}`}
    >
      <span className="button-kicker">Call Barley’s</span>
      <strong>{PHONE_DISPLAY}</strong>
    </a>
  );
}

function FacebookButton({ className = "" }: { className?: string }) {
  return (
    <a
      className={`button button-secondary secondary-CTA ${className}`.trim()}
      data-cta="secondary-CTA"
      href={FACEBOOK}
      target="_blank"
      rel="noreferrer"
    >
      Facebook <span aria-hidden="true">↗</span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="nav-shell">
          <a className="brand-lockup" href="#top" aria-label="Barley's home">
            <img
              src="/barleysICON.png"
              width="1200"
              height="889"
              alt="Barley’s Taproom & Pizzeria"
            />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#food-menu">Food</a>
            <a href="#beer-menu">Beer</a>
            <a href="#live-music">Live music</a>
            <a href="#visit">Visit</a>
          </nav>

          <a
            className="nav-call"
            href={PHONE_LINK}
            aria-label={`Call Barley's at ${PHONE_DISPLAY}`}
          >
            <span>Call now</span>
            <strong>{PHONE_DISPLAY}</strong>
          </a>

          <MobileMenu />
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-grid page-shell">
            <div className="hero-copy">
              <p className="eyebrow">
                <span aria-hidden="true" /> Spindale, NC · Since 2006
              </p>
              <h1 id="hero-title">
                Pizza, pints <em>&amp;</em> a good night out.
              </h1>
              <p className="hero-lede">
                Hot pies, many rotating taps, and live music in the heart of
                downtown Spindale. Come as you are and pull up a chair.
              </p>
              <div className="hero-actions">
                <CallButton />
                <FacebookButton />
              </div>
              <a className="text-link" href="#food-menu">
                Start with the food menu <span aria-hidden="true">↓</span>
              </a>
              <ul className="hero-facts" aria-label="Barley's highlights">
                <li>Family-friendly</li>
                <li>Live Music</li>
                <li>Downtown Spindale</li>
              </ul>
            </div>

            <div className="hero-media" aria-label="Pizza photo placeholder">
              <div className="hero-photo-frame">
                <img
                  src="/public/barleys-roni.jpg"
                  width="1200"
                  height="800"
                  alt="Placeholder photo of a specialty pizza"
                  fetchPriority="high"
                />
              </div>
              <div className="oven-badge" aria-hidden="true">
                <strong>Hot pies</strong>
                <span>Cold pints</span>
              </div>
              <p className="hero-caption">Where suit &amp; tie meets tie-dye.</p>
            </div>
          </div>
        </section>

        <section className="food-section" id="food-menu" aria-labelledby="food-title">
          <div className="page-shell">
            <div className="section-heading food-heading">
              <div>
                <p className="eyebrow eyebrow-dark">
                  <span aria-hidden="true" /> The main event
                </p>
                <h2 id="food-title">Food worth coming back for.</h2>
              </div>
              <p>
                Start with a pie, stay for the vibes, and save
                room for something sweet.
              </p>
            </div>

            <nav className="menu-jump" aria-label="Food menu categories">
              <a href="#specialty-pizza">Specialty pizza</a>
              <a href="#starters">Starters</a>
              <a href="#pasta">Pasta &amp; mains</a>
              <a href="#sandwiches">Sandwiches</a>
            </nav>

            <div className="menu-bento">
              <article className="menu-panel pizza-panel" id="specialty-pizza">
                <div className="panel-heading">
                  <span className="menu-number">01</span>
                  <div>
                    <p className="panel-kicker">House favorites</p>
                    <h2>Specialty pizzas</h2>
                  </div>
                </div>
                <MenuList items={specialtyPizzas} />
              </article>

              <article className="menu-panel classics-panel">
                <div className="panel-heading">
                  <span className="menu-number">02</span>
                  <div>
                    <p className="panel-kicker">Make it yours</p>
                    <h2>Pizza classics</h2>
                  </div>
                </div>
                <MenuList items={pizzaClassics} />
              </article>

              <article className="menu-panel starters-panel" id="starters">
                <div className="panel-heading compact-heading">
                  <span className="menu-number">03</span>
                  <div>
                    <p className="panel-kicker">Pass ’em around</p>
                    <h2>Starters</h2>
                  </div>
                </div>
                <MenuList items={starters} />
              </article>

              <article className="menu-panel pasta-panel" id="pasta">
                <div className="panel-heading compact-heading">
                  <span className="menu-number">04</span>
                  <div>
                    <p className="panel-kicker">From the kitchen</p>
                    <h2>Pasta &amp; Entrees</h2>
                  </div>
                </div>
                <MenuList items={pastasAndMains} />
              </article>

              <article className="menu-panel sandwich-panel" id="sandwiches">
                <div className="panel-heading compact-heading">
                  <span className="menu-number">05</span>
                  <div>
                    <p className="panel-kicker">Handhelds</p>
                    <h2>Sandwiches</h2>
                  </div>
                </div>
                <MenuList items={sandwiches} />
              </article>

              <article className="menu-panel extras-panel">
                <div className="extras-block">
                  <p className="panel-kicker">Salads</p>
                  <h2>Fresh &amp; simple</h2>
                  <div className="mini-price-row">
                    <span>Side / whole</span>
                    <strong>5 / 10</strong>
                  </div>
                  <div className="mini-price-row">
                    <span>With chicken or tofu</span>
                    <strong>13</strong>
                  </div>
                  <div className="inline-menu-divider" />
                  <p className="panel-kicker">For kids</p>
                  <h2>Kids pasta</h2>
                  <MenuList items={kidsPasta} />
                </div>
                <div className="extras-divider" />
                <div className="extras-block">
                  <p className="panel-kicker">Something sweet</p>
                  <h2>Desserts</h2>
                  <MenuList items={sweets} />
                </div>
              </article>
            </div>

            <div className="menu-footer-note">
              <p>
                Prices and availability can change. The online menu discloses a
                3% credit-card surcharge.
              </p>
              <a href={PHONE_LINK}>Questions? Call {PHONE_DISPLAY}</a>
            </div>
          </div>
        </section>

        <section className="beer-section" id="beer-menu" aria-labelledby="beer-title">
          <div className="page-shell beer-grid">
            <div className="beer-photo">
              <img
                src="/barleys-taproom.jpg"
                width="1200"
                height="800"
                alt="Placeholder photo of assorted craft beer styles"
                loading="lazy"
              />
              <div className="beer-photo-tag" aria-hidden="true">
                <span>Taproom</span>
                <strong>Pouring since ’06</strong>
              </div>
            </div>

            <div className="beer-content">
              <p className="eyebrow">
                <span aria-hidden="true" /> From the taps
              </p>
              <h2 id="beer-title">Find your next pint.</h2>
              <p className="beer-lede">
                The draft board rotates, which means there’s often something new
                to try. For the most accurate tap list, give the bar a call or
                check the latest update on Facebook.
              </p>

              <div className="beer-cards">
                <article className="tap-card tap-card-featured">
                  <div>
                    <p className="panel-kicker">Try a little of everything</p>
                    <h3>Sample Rack</h3>
                    <p>A flight from the current draft lineup.</p>
                  </div>
                  <strong className="tap-price">$7</strong>
                </article>

                <article className="tap-card tap-board-card">
                  <p className="panel-kicker">Today’s tap board</p>
                  <h3>Rotating pours</h3>
                  <p>
                    Beer from one of our many taps. Selection changes — ask your
                    server what’s pouring now.
                  </p>
                  <a href={PHONE_LINK}>Call for today’s taps</a>
                </article>

                <article className="tap-card zero-proof-card">
                  <div className="tap-card-heading">
                    <div>
                      <p className="panel-kicker">Still part of the round</p>
                      <h3>Zero proof</h3>
                    </div>
                    <span>Can / bottle</span>
                  </div>
                  <MenuList items={zeroProof} />
                </article>
              </div>

              <div className="beer-actions">
                <CallButton />
                <FacebookButton />
              </div>
            </div>
          </div>
        </section>

        <section className="callout-band" aria-label="Call Barley's">
          <div className="page-shell callout-inner">
            <div>
              <p className="panel-kicker">Hungry yet?</p>
              <h2>Ready for pizza and a pint?</h2>
            </div>
            <CallButton className="callout-button" />
          </div>
        </section>

        <section className="events-section" id="live-music" aria-labelledby="events-title">
          <div className="page-shell">
            <div className="section-heading events-heading">
              <div>
                <p className="eyebrow">
                  <span aria-hidden="true" /> On the Barley’s stage
                </p>
                <h2 id="events-title">Live music feels better up close.</h2>
              </div>
              <p>
                Bluegrass, country, jazz, and Americana — several nights a week,
                with no cover. Facebook carries the latest confirmed dates and
                schedule changes.
              </p>
            </div>

            <div className="events-grid">
              <article className="featured-event">
                <div className="event-date calendar-mark" aria-hidden="true">
                  <span>Live</span>
                  <strong>♪</strong>
                  <small>Music</small>
                </div>
                <div className="event-copy">
                  <p className="panel-kicker">Live music calendar</p>
                  <h3>New dates are tuning up.</h3>
                  <p className="event-time">The latest lineup lives on Facebook.</p>
                  <p>
                    We update the band calendar as shows are confirmed. Check the
                    latest post before heading over, then settle in with a fresh
                    pizza and your favorite pour.
                  </p>
                  <FacebookButton />
                </div>
              </article>

              <div className="event-stack">
                <article className="event-row">
                  <div className="event-date event-date-small" aria-hidden="true">
                    <span>No</span>
                    <strong>$</strong>
                    <small>Cover</small>
                  </div>
                  <div>
                    <p className="panel-kicker">Come as you are</p>
                    <h3>No cover</h3>
                    <p>Good music, up close, several nights a week.</p>
                  </div>
                </article>

                <article className="schedule-card">
                  <p className="panel-kicker">Planning tonight’s visit?</p>
                  <h3>Call the taproom.</h3>
                  <p>
                    We’ll help with today’s hours, taps, and the latest music
                    schedule.
                  </p>
                  <CallButton />
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="visit-section" id="visit" aria-labelledby="visit-title">
          <div className="page-shell visit-grid">
            <div className="visit-intro">
              <p className="eyebrow eyebrow-dark">
                <span aria-hidden="true" /> Your neighborhood table
              </p>
              <h2 id="visit-title">Come on in. You’re among friends.</h2>
              <p>
                Barley’s has called downtown Spindale home since 2006, inside a
                1920s building with plenty of stories in its woodwork.
              </p>
              <div className="visit-actions">
                <CallButton />
                <a
                  className="button button-outline-dark"
                  href="https://maps.google.com/?q=123+W+Main+St+Spindale+NC+28160"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get directions <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <address className="info-card address-card">
              <p className="panel-kicker">Find us</p>
              <h3>123 W Main Street</h3>
              <p>Spindale, NC 28160</p>
              <a href={PHONE_LINK}>{PHONE_DISPLAY}</a>
            </address>

            <div className="info-card hours-card">
              <p className="panel-kicker">Hours</p>
              <dl>
                <div>
                  <dt>Monday</dt>
                  <dd>Closed</dd>
                </div>
                <div>
                  <dt>Tue–Thu</dt>
                  <dd>11 AM–9 PM</dd>
                </div>
                <div>
                  <dt>Friday</dt>
                  <dd>11 AM–10 PM</dd>
                </div>
                <div>
                  <dt>Saturday</dt>
                  <dd>11 AM–9 PM</dd>
                </div>
                <div>
                  <dt>Sunday</dt>
                  <dd>12–9 PM</dd>
                </div>
              </dl>
              <p className="hours-note">Holiday hours can change. Call to confirm.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-grid">
          <div className="footer-brand">
            <img
              src="/barleys-logo.png"
              width="1200"
              height="889"
              alt="Barley’s Taproom & Pizzeria"
              loading="lazy"
            />
            <p>Pizza · Pints · Live music · Spindale, NC</p>
          </div>

          <nav aria-label="Footer navigation">
            <a href="#food-menu">Food menu</a>
            <a href="#beer-menu">Beer menu</a>
            <a href="#live-music">Live music</a>
            <a href="#visit">Visit</a>
          </nav>

          <div className="footer-contact">
            <a href={PHONE_LINK}>{PHONE_DISPLAY}</a>
            <a href={FACEBOOK} target="_blank" rel="noreferrer">
              Facebook ↗
            </a>
            <p>© 2026 Barley’s Taproom &amp; Pizzeria</p>
          </div>
        </div>
      </footer>

      <div className="mobile-cta-bar" aria-label="Quick contact actions">
        <a
          className="mobile-call primary-CTA"
          data-cta="primary-CTA"
          href={PHONE_LINK}
        >
          <span>Call now</span>
          <strong>{PHONE_DISPLAY}</strong>
        </a>
        <a
          className="mobile-facebook secondary-CTA"
          data-cta="secondary-CTA"
          href={FACEBOOK}
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </a>
      </div>
    </>
  );
}
