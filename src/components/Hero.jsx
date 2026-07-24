import React from 'react';
import styles from './Hero.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const SHOWCASE_ITEMS = [
  {
    label: "Hygiene",
    category: "Hygiene",
    image: "https://res.cloudinary.com/su6mdywy/image/upload/v1784741046/ChatGPT_Image_Jul_22_2026_10_53_33_PM_ll7hfr.png",
    subtitle: "Premium soaps & hygiene essentials"
  },
  {
    label: "Skincare",
    category: "Skincare",
    image: "https://res.cloudinary.com/su6mdywy/image/upload/v1784741861/skincare_m825vx.png",
    subtitle: "Creams, lotions & face care"
  },
  {
    label: "Hair Care",
    category: "Hair Care",
    image: "https://res.cloudinary.com/su6mdywy/image/upload/v1784742291/haircare_moefgx.png",
    subtitle: "Shampoo & conditioners"
  },
  {
    label: "Oral Care",
    category: "Oral Care",
    image: "https://res.cloudinary.com/su6mdywy/image/upload/v1784742393/oralcare_aibe4p.png",
    subtitle: "Toothpaste & brushes"
  },
  {
    label: "Kitchen",
    category: "Kitchen",
    image: "https://res.cloudinary.com/su6mdywy/image/upload/v1784743069/kitchen_djmxgd.png",
    subtitle: "Daily kitchen essentials"
  },
  {
    label: "Crockery",
    category: "Crockery",
    image: "https://res.cloudinary.com/su6mdywy/image/upload/v1784742757/crockery_zq9we4.png",
    subtitle: "Beautiful dinnerware"
  },
  {
    label: "Cosmetics",
    category: "Cosmetics",
    image: "https://res.cloudinary.com/su6mdywy/image/upload/v1784743169/cosmetics_d3wvxj.png",
    subtitle: "Beauty & makeup"
  },
  {
    label: "Gifting",
    category: "Gifting",
    image: "https://res.cloudinary.com/su6mdywy/image/upload/v1784743269/gifting_elunyx.png",
    subtitle: "Gift hampers & more"
  }
];

export default function Hero({ totalProducts, inStockCount, categoryCount, onCategoryClick }) {
  // const [activeIndex, setActiveIndex] = useState(0);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setActiveIndex(i => (i + 1) % SHOWCASE_ITEMS.length);
  //   }, 3000);
  //   return () => clearInterval(timer);
  // }, []);

  function handleCategoryClick(category) {
    onCategoryClick(category);
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function scrollToProducts() {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {/* Left: text */}
        <div className={styles.left}>
          <p className={styles.eyebrow}>✦ Welcome to Divine Collections</p>
          <h1 className={styles.heading}>
            Your Trusted Store for{' '}
            <em className={styles.accent}>Premium Products at Factory Prices</em>
          </h1>
          <p className={styles.sub}>
            Skincare, cosmetics, crockery, kitchen essentials, gifting &amp; more — all under one roof.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNum}>{totalProducts}+</div>
              <div className={styles.statLabel}>Products</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <div className={styles.statNum}>{inStockCount}</div>
              <div className={styles.statLabel}>In Stock</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <div className={styles.statNum}>{categoryCount}</div>
              <div className={styles.statLabel}>Categories</div>
            </div>
          </div>

          <button className={styles.scrollBtn} onClick={scrollToProducts}>
            Shop Now ↓
          </button>
        </div>

        <div className={styles.right}>
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1.25}
            centeredSlides={true}
            spaceBetween={18}
            loop={true}
            speed={500}
            preloadImages={true}
            updateOnImagesReady={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            className={styles.heroSlider}
            breakpoints={{
              768: {
                slidesPerView: 1.4,
              },
              1024: {
                slidesPerView: 1.35,
              },
            }}
          >

            {SHOWCASE_ITEMS.map((item, index) => (

              <SwiperSlide key={index}>

                <div
                  className={styles.slideCard}
                  onClick={() => handleCategoryClick(item.category)}
                >

                  <img
                    src={item.image}
                    alt={item.label}
                    className={styles.slideImage}
                  />

                  <div className={styles.slideOverlay}>

                    <h3>{item.label}</h3>

                    <p>{item.subtitle}</p>

                  </div>

                </div>

              </SwiperSlide>

            ))}

          </Swiper>

        </div>

      </div>

      <div className={styles.scrollIndicator} onClick={scrollToProducts}>
        <div className={styles.scrollDot} />
      </div>
    </section>
  );
}