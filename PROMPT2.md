# System Role
Act as an expert frontend developer. Your task is to write the HTML and CSS (using Tailwind CSS for styling) for a personal portfolio website. 

## Design System & Vibe
* **Aesthetic:** Modern, minimalist, and geometric.
* **Color Palette:** High-contrast monochrome (black, white, and light grey). 
* **Typography:** Clean sans-serif fonts. High contrast between bold headings and lightweight body text.

## Section-by-Section Structure

### 1. Hero Section (Split-Screen Layout)
* **Layout:** A full-height section split diagonally or vertically into two main blocks.
* **Left Side (Light Grey Background):**
    * A minimalist logo in the top left corner.
    * A greeting text saying "Hi, I am".
    * The main heading with my name: **Mehmet Akif**.
    * A subheading for my title: "Backend Developer & DevOps Enthusiast".
    * Three minimalist social media icons arranged horizontally (GitHub, LinkedIn, Email).
* **Right Side (Dark/Black Background):**
    * Top right navigation menu with the links: "About me", "Skills", "Portfolio", and a distinct "CONTACT ME" button (white pill shape with black text).
    * A large, professional portrait image centered in this dark section.

### 2. Featured Project Banner
* **Layout:** Directly below the hero, a full-width dark/black banner section.
* **Content:** * A bold title on the left: "NGO DIGITAL TRANSFORMATION".
    * A brief paragraph of placeholder text describing the project infrastructure and documentation.
    * A stylized "READ MORE" text link at the bottom left with a vertical line indicator.

### 3. Skills Section
* **Layout:** A clean grid grouping skills into distinct categories on a light background.
* **Categories & Content:**
    * **USING NOW:** Python, PHP, Docker, Laravel, FastAPI, Tailwind CSS, Git.
    * **LEARNING:** Reinforcement Learning.
    * **OTHER SKILLS:** Project Management, Calculus.

### 4. Contact Section
* **Layout:** Centered content on a light grey background.
* **Header:** A bold "CONTACT" title enclosed in a thin rectangular black border.
* **Divider:** A minimalist text divider underneath the title (e.g., `-///-`).
* **Form Design:** A minimalist contact form. The input fields must NOT have full borders; they should only have a solid black bottom border.
    * Fields needed: "ENTER YOUR NAME", "ENTER YOUR EMAIL", "PHONE NUMBER", and a larger "YOUR MESSAGE" textarea.
* **Submit Button:** A "SUBMIT" button at the bottom, styled with vertical lines on either side (e.g., `| SUBMIT |`).

### 5. Footer
* **Layout:** A simple dark footer at the very bottom.
* **Content:** Copyright text ("© 2026 Mehmet Akif. All Rights Reserved.") centered.

## Technical Constraints
* Write semantic HTML5.
* Use Tailwind CSS utility classes for all styling. Do not write a separate CSS file unless absolutely necessary for the diagonal split-screen effect.
* Ensure the design is fully responsive. On mobile devices, the split-screen hero should stack vertically, and the navigation should collapse into a hamburger menu.