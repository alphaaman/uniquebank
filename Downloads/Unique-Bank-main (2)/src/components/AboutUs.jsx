import React from 'react';
import laptopImage from '../assets/laptop.png';
import peopleImage from '../assets/people.jpg';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="banner-image">
        <div className="image-overlay"></div>
        
        <img src={laptopImage} alt="Laptop" />
       
      </div>
      <div className="content-container">
        <p style={{ fontSize: "20px", lineHeight: "1.7", textAlign: "left" }}>
  Welcome to Unique Bank, a trusted financial institution with a rich history of serving our customers' banking needs. We are committed to providing exceptional banking services and personalized solutions to individuals, businesses, and communities.
</p>
<p style={{ fontSize: "20px", lineHeight: "1.7", textAlign: "left" }}>
  At Unique Bank, we prioritize customer satisfaction and strive to exceed expectations in every interaction. Our team of experienced professionals is dedicated to understanding and fulfilling the unique financial goals of our clients.
</p>
<p style={{ fontSize: "20px", lineHeight: "1.7", textAlign: "left" }}>
  We offer a wide range of banking services, including personal and business accounts, loans, mortgages, investment options, and more. Our advanced online banking platform allows you to conveniently manage your finances from anywhere, anytime.
</p>
<p style={{ fontSize: "20px", lineHeight: "1.7", textAlign: "left" }}>
  Whether you're planning for the future, expanding your business, or seeking expert financial advice, Unique Bank is here to support you every step of the way. We value the trust our customers place in us and continuously strive to provide reliable, secure, and innovative banking solutions.
</p>

<p style={{ fontSize: "20px", lineHeight: "1.7", textAlign: "left" }}>
  At Unique Bank, we believe in giving back to the communities we serve. We actively participate in community initiatives, supporting local businesses, educational programs, and charitable organizations. Together, we can make a positive impact and create a brighter future.
</p>
<p style={{ fontSize: "20px", lineHeight: "1.7", textAlign: "left" }}>
  With our innovative financial products, cutting-edge technology, and a team of dedicated professionals, we are constantly striving to reinvent the banking experience. Our goal is to provide you with seamless, secure, and convenient banking solutions that meet your evolving needs. We invite you to explore our comprehensive range of banking services and experience the Unique Bank difference. Contact us today or visit one of our branches to learn more about how we can help you achieve financial success.
</p>
<p style={{ fontSize: "20px", lineHeight: "1.7", textAlign: "left" }}>
  Thank you for choosing Unique Bank as your financial partner. We are committed to building long-term relationships with our clients and helping them achieve their financial goals.
</p>

        <h2>Core Values</h2>
        <ul style={{ fontSize: "20px" }}>
          <li><strong>Customer-centric:</strong> We prioritize the needs and preferences of our customers in everything we do.</li>
          <li><strong>Innovation:</strong> We embrace innovative solutions to enhance the banking experience and stay ahead in a dynamic industry.</li>
          <li><strong>Integrity:</strong> We uphold the highest ethical standards and maintain transparency in all our operations.</li>
          <li><strong>Teamwork:</strong> We foster a collaborative environment that encourages teamwork, diversity, and inclusion.</li>
          <li><strong>Excellence:</strong> We strive for excellence in all aspects of our work, continuously improving and exceeding expectations.</li>
        </ul>

        <h2>Our Team</h2>
        <div className="team-image">
          <img src={peopleImage} alt="Bank Team" className="cover-image" />
        </div>
        <p style={{ fontSize: "20px", lineHeight: "1.7", textAlign: "left" }}>Our dedicated team of professionals is the backbone of Unique Bank. With expertise across various domains, they work diligently to provide you with the best banking experience. We pride ourselves on having a diverse team that brings unique perspectives to serve our diverse clientele.

At Unique Bank, we foster a culture of continuous learning and professional growth. Our employees are encouraged to stay updated with the latest industry trends and undergo regular training to enhance their skills and knowledge. This ensures that they are well-equipped to address your financial needs and provide tailored solutions.

We believe in the power of collaboration and teamwork. Our employees collaborate across departments to deliver seamless and integrated services to our customers. This collaborative approach enables us to provide comprehensive solutions that address your financial goals and challenges.

In addition to their expertise, our team is known for their commitment to exceptional customer service. They go the extra mile to understand your individual needs and preferences, providing personalized guidance and support throughout your banking journey. We are dedicated to building strong and lasting relationships with our customers based on trust, transparency, and open communication.

As we continue to grow and evolve, we are always on the lookout for talented individuals who share our passion for banking and customer service. If you are interested in joining our team, we invite you to explore career opportunities at Unique Bank. Together, we can make a difference in the lives of our customers and contribute to their financial success.

Thank you for choosing Unique Bank. We are honored to be your financial partner and look forward to serving you with excellence and integrity.</p>

        <h2>Our Services</h2>
        <p style={{ fontSize: "20px", lineHeight: "1.7", textAlign: "left" }}>Unique Bank offers a comprehensive range of banking services to cater to your financial needs. Whether you're looking for personal banking solutions, business accounts, loans, or investments, we have you covered. Our dedicated team of professionals is here to assist you at every step, providing personalized guidance and support.</p>
      </div>
    </div>
  );
};

export default AboutUs;