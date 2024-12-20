import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation } from 'swiper/modules';

import image_1 from "../assets/rb-1.jpg";
import image_2 from "../assets/rb-2.jpg";
import image_3 from "../assets/rb-3.jpg";

function SwiperSlider() {
  return (
    <div className="container">
      <Swiper
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        autoplay={{
            delay: 2000
        }}
        slidesPerView={1}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[ Pagination, Navigation]}
        className="swiper_container"
      >
        <SwiperSlide>
          <img src={image_1} alt="image1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image_2} alt="image2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image_3} alt="image3" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image_1} alt="image4" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image_2} alt="image5" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image_3} alt="image6" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image_1} alt="image7" />
        </SwiperSlide>

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </div>
          <div className="swiper-button-next slider-arrow">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
}

export default SwiperSlider;