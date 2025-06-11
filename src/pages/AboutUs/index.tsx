import "./styles.css"; // Assuming you have a CSS file for styles
import { motion } from "framer-motion";
import {
	LinkedinOutlined,
	GithubOutlined,
	RobotOutlined,
	SearchOutlined,
	MessageOutlined,
	ReadOutlined,
	TeamOutlined
  } from "@ant-design/icons";


interface Member {
  name: string;
  image: string;
  description: string;
  education?: string[];
  contributions?: string[];
  git?: string;
  linkedin?: string;

}

export default function AboutUsPage() {
  const members = [
    {
      name: "Hasmik - Team Lead",
      image: "src/assets/team/Hasmik.jpg",
	  description: "Built doctor authentication, payment system, and homepage.",
	  education : [
		"Bachelor's degree in IT Automation, NPUA Armenia",
		"Master's degree in IT Automation, NPUA Armenia"
	  ],
	  contributions : [
		"Implemented authentication using Firebase and stored user data in Redux.",
		"Designed the homepage and header with React states for dynamic UI.",
		"Used Firebase Functions to integrate Stripe payment processing."
	  ],	  
	git : "https://github.com/Hasmik-Gevorgyan",
	linkedin : "https://www.linkedin.com/in/gevorgyan-hasmik/",
	},
	{
		name: "Eliza - Content Manager",
		image: "src/assets/team/Eliza.jpg",
		description: "Built articles section with Firebase CRUD and Redux state management.",
		education: [
			"Bachelor's degree in Data Processing in Physics with AI, YSU"
		],
		contributions: [
		  "Developed articles feature with Firebase CRUD operations.",
		  "Handled state management using Redux.",
		  "Improved UI styling with React, HTML, and CSS."
		],
		git: "https://github.com/elizhov",  // Replace with actual GitHub if available
		linkedin: "https://www.linkedin.com/in/eliza-hovhannisyan-b62b33329/"  // Replace with actual LinkedIn
	},
	{
		name: "Dianna - AI & Backend Specialist",
		image: "",
		description: "Built doctor certification system with AI-powered Firebase functions and backend filtering.",
		education: [
		  "Bachelor's degree in IT, NPUA",
		  "Full Stack Development training, RELQ",
		],
		contributions: [
		  "Developed AI-based doctor certification using Firebase Functions.",
		  "Implemented doctor list filtering and searching handled by Firebase backend.",
		  "Managed doctor data storage using Redux.",
		],
		git: "https://github.com/dianna-paronyan",  // Replace with actual GitHub
		linkedin: "https://www.linkedin.com/in/dianna-paronyan-bb7baa240/"  // Replace with actual LinkedIn
	},
    {
		name: "David Hovhannisyan - Backend & Dashboard Developer",
		image: "src/assets/team/DavidH.jpeg",
		description: "Built doctor profile view and dashboard with backend-powered data filtering.",
		education: [
		  "Graduated from Kotayk State Regional College",
		  "Completed JavaScript Intro Course at ACA"
		],
		contributions: [
		  "Fetched and displayed doctor profiles and specifications using Firebase.",
		  "Implemented profile editing functionality for doctors.",
		  "Developed the doctor dashboard with query filtering and searching handled in the backend."
		],
		git: "https://github.com/DavidHovhannisyan888",  // Replace with actual GitHub
		linkedin: "http://linkedin.com/in/davit-hovhannisyan-64722136b"  // Replace with actual LinkedIn
	  },	  
	  {
		name: "David Sargsian - AI & Interaction Developer",
		image: "src/assets/team/DavidS.jpeg",
		description: "Integrated AI assistant and built key features for appointments, chat, and messaging.",
		education: [
		  "Student at NPUA Armenia, Hardware Engineering Faculty",
		  "Completed PHP, Laravel, MySQL Internship at ACA",
		  "Learned C programming at 42 Yerevan"
		],
		contributions: [
		  "Integrated AI assistant using Firebase Functions.",
		  "Built the appointment submission system by day, date, and file — with logic to prevent double booking (not using Firebase validation).",
		  "Implemented doctor-patient chat with file attachment support.",
		  "Developed the About Us page with added interactivity using React.",
		  "Created the messaging system to notify patients upon booking and deliver messages from doctors by email."
		],
		git: "https://www.linkedin.com/in/david-sargsyan-a059a9213/",  // Replace with actual GitHub
		linkedin: "https://www.linkedin.com/in/david-sargsian"  // Replace with actual LinkedIn
	  }	  
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
		  <RobotOutlined /> We built a doctor consulting website where users can easily connect with doctors. The platform includes an AI assistant to guide users, a session registration form, and a system to verify doctors.
		  </p>
		  <p className="about-intro">
		    <SearchOutlined /> Users can search for doctors by their <strong>specialty</strong> to find the right help. Doctors can register, manage their tasks through a personal dashboard, and receive payments securely.
		  </p>
		  <p className="about-intro">
		    <MessageOutlined /> The system includes a chat feature so users and doctors can communicate directly, and email notifications keep users informed about their sessions and updates.
		  </p>
		  <p className="about-intro">
		    <ReadOutlined /> We also share helpful medical articles written by our verified doctors, with filters to search by topic or specialty.
		  </p>
		  <p className="about-intro">
		    <TeamOutlined /> This project is a demo showing how technology can make healthcare simpler, smarter, and more accessible. None of this would have been possible without working together as a real team — combining our ideas, skills, and effort to bring it to life.
		  </p>


			<h2 className="opening-title">Project Github</h2>
		  	<div className="opening-links">
		  	<a
				  href="https://github.com/Hasmik-Gevorgyan/Medical-Form-App"
				  target="_blank"
				  rel="noopener noreferrer"
				  className="opening-icon"
				>
				  <GithubOutlined />
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
			{
				member?.education?.map((edu, idx) => {
					return <li key={idx}>{edu}</li>;
				})
			}
			</ul>
		
			<h3>Project Contributions</h3>
			<ul className="about-list">
				{
					member?.contributions?.map((contribution, idx) => {
						return <li key={idx}>{contribution}</li>;
					})
				}
			</ul>
			</div>
		) : ''} 
		<div className={`info-box ${isLeft ? "to-right" : "to-left"}`}>
			{member.image && (<img src={member.image} alt={member.name} className="member-image" />)}
			  <h2 className="member-name">{member.name}</h2>
			  <div className="member-role">
      	</div>
		  <p className="member-description">
			{member.description.split(".")[0]}.
		  </p>
		  <div className="member-icons">
			<a href={member.linkedin} aria-label="LinkedIn">
				<LinkedinOutlined />
			</a>
			<a href={member.git} aria-label="GitHub">
			  <GithubOutlined />
			</a>
		  </div>
		</div>
	{isLeft ? (
			<div className="member-about">
			<h3>Education</h3>
			<ul className="about-list">
			{
				member?.education?.map((edu, idx) => {
					return <li key={idx}>{edu}</li>;
				})
			}
			</ul>
		  
			<h3>Project Contributions</h3>
			<ul className="about-list">
				{
					member?.contributions?.map((contribution, idx) => {
						return <li key={idx}>{contribution}</li>;
					})
				}
			</ul>
		  </div>
		) : ''} 
	  </motion.div>
	  </>
	);
  }