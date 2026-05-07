import Navbar from "../components/Navbar";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import banner1 from "../assets/hero.png";
import banner2 from "../assets/hero.png";
import banner3 from "../assets/hero.png";
import banner4 from "../assets/hero.png";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Footer from "./Footer.jsx";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-blue-900">

      <Navbar />

      {/* ================= HERO SLIDER ================= */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        navigation
        className="h-[92vh]"
      >

        {/* Slide 1 */}
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${banner1})` }}
          >
            <div className="bg-black/60 p-8 rounded-xl text-center">
              <h1 className="text-5xl font-extrabold text-white">
                Welcome to <span className="text-cyan-400">Aura Shops</span>
              </h1>
              <p className="mt-4 text-gray-300">
                Discover the best products from trusted vendors.
              </p>

              <Link
                to="/products"
                className="inline-block mt-6 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${banner2})` }}
          >
            <div className="bg-black/60 p-8 rounded-xl text-center">
              <h1 className="text-5xl font-extrabold text-white">
                Latest <span className="text-cyan-400">Collections</span>
              </h1>
              <p className="mt-4 text-gray-300">
                Stay ahead with trending products.
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${banner3})` }}
          >
            <div className="bg-black/60 p-8 rounded-xl text-center">
              <h1 className="text-5xl font-bold text-white">
                Best Deals Everyday
              </h1>
              <p className="mt-4 text-gray-300">
                Grab amazing offers at the best prices.
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 4 */}
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${banner4})` }}
          >
            <div className="bg-black/60 p-8 rounded-xl text-center">
              <h1 className="text-5xl font-bold text-white">
                Fast & Secure Shopping
              </h1>
              <p className="mt-4 text-gray-300">
                Safe payments with quick delivery.
              </p>
            </div>
          </div>
        </SwiperSlide>

      </Swiper>

      {/* ================= FEATURES ================= */}
      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-white shadow-xl hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2 text-cyan-400">
              Wide Range
            </h3>
            <p className="text-gray-300">
              Explore products across multiple categories.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-white shadow-xl hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2 text-cyan-400">
              Best Prices
            </h3>
            <p className="text-gray-300">
              Affordable pricing with great deals.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-white shadow-xl hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2 text-cyan-400">
              Trusted Vendors
            </h3>
            <p className="text-gray-300">
              Shop from verified and reliable sellers.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;