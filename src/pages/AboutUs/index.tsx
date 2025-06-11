import "./styles.css"; // Assuming you have a CSS file for styles
import { motion } from "framer-motion";
import {
	LinkedinOutlined,
	MailOutlined,
	GithubOutlined,
	InstagramOutlined,
	FireOutlined,
	LinkOutlined,
  } from "@ant-design/icons";

import { Carousel } from "antd";


interface Member {
  name: string;
  image: string;
  description: string;
  about: string;
}

export default function AboutUsPage() {
	const slideImages = [
		'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		'https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
	];


  const members = [
    {
      name: "Ann - Founder",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Visionary behind the agency, bringing design and strategic insight.",
	  about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      name: "Kurt & David - Founders",
      image: "https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Together, they blend creativity and strategy to lead Skinn Branding Agency forward.",
	  about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      name: "Anna - Creative Director",
      image: "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Crafting the visual identity and leading the design team.",
	  about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      name: "Tom - Marketing Strategist",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHJhbmRvbSUyMHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
      description: "Develops strategies to position brands effectively.",
	  about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
	},
	{
		name: "Lena - UX Specialist",
		image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		description: "Ensures intuitive and engaging digital experiences.",

		about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
	},
  ];

  return (
    <div className="about-page">
      <motion.div
        className="about-wrapper"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
		<div className="Opening-Title">
		  <h1 className="about-title">About Us</h1>
		  <p className="about-intro">
  			  Our journey began with a vision to bridge people and doctors in a faster, friendlier, and more accessible way. Our first project — a smart medical consulting platform — allowed patients to send their symptoms and get timely feedback from doctors, seamlessly and securely.
  			</p>
  			<p className="about-intro">
  			  With that foundation, we’ve grown into a team driven by purpose: designing experiences that help, heal, and inspire.
  			</p>
			  <h2 className="opening-title">Project credentials</h2>
			  <Carousel autoplay className="oceanic-carousel" dots swipeToSlide adaptiveHeight>
				  <div>
				    <img src={slideImages[0]} alt="Ocean 1" className="slide-image" />
				  </div>
				  <div>
				    <img src={slideImages[1]} alt="Ocean 2" className="slide-image" />
				  </div>
				  <div>
				    <img src={slideImages[2]} alt="Ocean 3" className="slide-image" />
				  </div>
			</Carousel>
		  <div className="opening-links">
		  <a
			  href="https://github.com/your-repo"
			  target="_blank"
			  rel="noopener noreferrer"
			  className="opening-icon"
			>
			  <GithubOutlined />
			</a>
			<a
			  href="https://console.firebase.google.com/project/your-project"
			  target="_blank"
			  rel="noopener noreferrer"
			  className="opening-icon"
			>
			  <FireOutlined />
			</a>
			<a
			  href="https://your-domain.atlassian.net/jira/software/projects/PROJECTKEY"
			  target="_blank"
			  rel="noopener noreferrer"
			  className="opening-icon"
			>
			  <LinkOutlined />
			</a>    
		  </div>
	
		</div>
        {members.map((member, index) => (
          <div
            key={index}
            className={`member-row ${index % 2 === 0 ? "left" : "right"}`}
          >
            <MemberCard member={member} index={index} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function MemberCard({ member, index }: { member: Member; index: number }) {
	const isLeft = index % 2 === 0;
  
	return (
		<>
	  <motion.div
		className={`member-card ${isLeft ? "align-left" : "align-right"}`}
		initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
		whileInView={{ opacity: 1, x: 0 }}
		transition={{ duration: 0.6, ease: "easeInOut" }}
		viewport={{ once: false, amount: 0.3 }}
	  >
		{!isLeft ? (
			<div className="member-about">
			<h3>Education</h3>
			<ul className="about-list">
			  <li>Bachelor's in Graphic Design – Art & Design University (2018–2022)</li>
			  <li>Certified UX/UI Designer – Coursera (Google UX Certificate, 2023)</li>
			</ul>
		  
			<h3>Project Contributions</h3>
			<ul className="about-list">
			  <li>Designed intuitive UI for a mobile health app used by over 10k users.</li>
			  <li>Implemented brand identity for a startup that raised $1M in funding.</li>
			  <li>Built interactive prototypes to streamline client feedback cycles.</li>
			  <li>Led a redesign initiative that boosted website engagement by 40%.</li>
			</ul>
			</div>
		) : ''} 
		<div className={`info-box ${isLeft ? "to-right" : "to-left"}`}>
				<img src={member.image} alt={member.name} className="member-image" />
			  <h2 className="member-name">{member.name}</h2>
			  <div className="member-role">
      	</div>
		  <p className="member-description">
			{member.description.split(".")[0]}.
		  </p>
		  <div className="member-icons">
			<a href="#" aria-label="LinkedIn">
				<LinkedinOutlined />
			</a>
			<a href="#" aria-label="Instagram">
				<InstagramOutlined />
			</a>
			<a href="#" aria-label="GitHub">
			  <GithubOutlined />
			</a>
			<a href="#" aria-label="Mail">
				<MailOutlined />
			</a>
		  </div>
		</div>
	{isLeft ? (
			<div className="member-about">
			<h3>Education</h3>
			<ul className="about-list">
			  <li>Bachelor's in Graphic Design – Art & Design University (2018–2022)</li>
			  <li>Certified UX/UI Designer – Coursera (Google UX Certificate, 2023)</li>
			</ul>
		  
			<h3>Project Contributions</h3>
			<ul className="about-list">
			  <li>Designed intuitive UI for a mobile health app used by over 10k users.</li>
			  <li>Implemented brand identity for a startup that raised $1M in funding.</li>
			  <li>Built interactive prototypes to streamline client feedback cycles.</li>
			  <li>Led a redesign initiative that boosted website engagement by 40%.</li>
			</ul>
		  </div>
		) : ''} 
	  </motion.div>
	  </>
	);
  }