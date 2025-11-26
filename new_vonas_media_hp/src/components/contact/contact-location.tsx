import React from "react";
import Image from "next/image";
// images
import location_1 from "@/assets/img/inner-contact/contact/info-1.png";
import location_2 from "@/assets/img/inner-contact/contact/info-2.png";
import location_3 from "@/assets/img/inner-contact/contact/info-3.png";

// data
const location_data = [
  {
    id: 1,
    img: location_1,
    country: "Philippines",
    time: "2:00 pm GMT+8",
    location_title: "Vonas Media",
    address: "Content Channel Lab <br /> Manila, Philippines",
    phone: "(+63) 967 145 5245",
    email: "hello@vonas-media.com",
  },
  {
    id: 2,
    img: location_2,
    country: "Collaborations",
    time: "Brand Partnerships",
    location_title: "Brand Collab",
    address: "For brand partnerships <br /> and channel building",
    phone: "(+63) 967 145 5245",
    email: "hello@vonas-media.com",
  },
  {
    id: 3,
    img: location_3,
    country: "Careers",
    time: "Join the Team",
    location_title: "Work with Us",
    address: "Creators, editors, strategists <br /> always welcome",
    phone: "(+63) 967 145 5245",
    email: "higher@vonas-media.com",
  },
];

const ContactLocation = () => {
  return (
    <div className="cn-contact-info-area">
      <div className="container container-1840">
        <div className="cn-contact-info-bg black-bg">
          {location_data.map((item) => (
            <div key={item.id} className="cn-contact-info-item">
              <div className="row">
                <div className="col-xl-7">
                  <div className="cn-contact-left d-flex flex-wrap align-items-center">
                    <div className="cn-contact-info-thumb">
                      <Image src={item.img} alt="image" style={{ height: "auto" }} />
                    </div>
                    <div className="cn-contact-left-info">
                      <h4 className="cn-contact-left-title">{item.country}</h4>
                      <span>
                        <i className="fa-regular fa-clock"></i>
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xl-5">
                  <div className="cn-contact-right-wrap d-flex align-items-start justify-content-between">
                    <div className="cn-contact-right">
                      <div className="cn-contact-location">
                        <span className="cn-contact-location-title">
                          {item.location_title}
                        </span>
                        <a
                          href="https://www.google.com/maps"
                          target="_blank"
                          dangerouslySetInnerHTML={{ __html: item.address }}
                        ></a>
                      </div>
                      <div className="cn-contact-map">
                        <a href="https://www.google.com/maps/place/Platinum+2000/@14.6057631,121.0560092,17z/data=!4m14!1m7!3m6!1s0x3397b7ddf3db85c1:0xe46177e2c9c94c6a!2sPlatinum+2000!8m2!3d14.6059385!4d121.0560538!16s%2Fg%2F11c3tr3r21!3m5!1s0x3397b7ddf3db85c1:0xe46177e2c9c94c6a!8m2!3d14.6059385!4d121.0560538!16s%2Fg%2F11c3tr3r21?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D">Google Maps</a>
                      </div>
                    </div>
                    <div className="cn-contact-right-info text-start text-md-end">
                      <a href="tel:(+91)76001726">{item.phone}</a> <br />
                      <a href="mailto:Hello@contact.com">{item.email}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactLocation;
