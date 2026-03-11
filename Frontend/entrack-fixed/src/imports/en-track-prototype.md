THE ENCYCLOPEDIC ARCHITECT PROMPT: PROJECT "EN-TRACK" (ULTIMATE REFINEMENT)
Role Identification: You are acting as a Senior Principal UI/UX Designer and Lead Interaction Architect. Your objective is to generate a comprehensive, 8-page high-fidelity web application prototype for "En-Track"—a Secure & Transparent Digital Donation System.

🎨 SECTION 1: CORE DESIGN SYSTEM (THE VISUAL DNA)
Branding & Logic: Strictly replace all "Decentralized Blockchain" mentions with "Secure & Transparent Digital Donation System" and "Data Integrity Protocols".

Default Theme (Light Mode): The website must load in Light Mode by default.

Background: Off-White (#F8FAFC) base. To ensure the site doesn't feel empty, add modern "Tracking" elements: subtle 2px dotted grids, thin connecting SVG lines (data nodes), and soft-edged translucent geometric shapes that react to scroll.

Dark Mode (Refined Tech Vibe): Toggleable via navbar. DO NOT use the Matrix/Digital Rain pattern.

Background: Deep Charcoal (#0B0E14) with minimalist tracking-themed elements like glowing micro-dots and thin, low-opacity vector paths representing data movement.

Typography: * Headlines: Use "Clash Display" for a bold, high-end fintech look.

Body: Use "Geist" or "Inter" with varying weights for clear hierarchy.

Color Palette: Emerald Green (#50C878) for success/actions, Deep Navy for trust, and high-quality Gradients for interactive elements.

Currency: All donation UI must use INR (₹). REMOVE all Ethereum icons, coin symbols, gas fee mentions, and MetaMask references.

🕹️ SECTION 2: GLOBAL COMPONENTS & SCROLL INTERACTION
A. The "Smooth-Glide" Pill Navbar (FIXING SYMMETRY ERROR)
Initial State: A full-width frosted glass header (88px height) with the "En-Track" logo on the left, centered navigation links (Home, About, History, Dashboard, Contact), and the Theme Toggle + Login button on the right.

Scroll Transition: As the user scrolls, the navbar must smoothly (Smart Animate, NO bouncy effect) shrink into a compact Pill-Shape centered at the top.

Symmetry & Style Fix: * The Error Fix: Inside the floating pill, all buttons and links must be perfectly symmetrical. The Primary Action Button (Login) must be fully contained within the pill's padding and border boundaries. It should NOT stick out or overlap the edges.

Button Gradient: Apply a vibrant Linear Gradient (Emerald Green to Cyan) to the Login button within the pill.

Glassmorphism: 40px background blur with a 1px solid border (15% opacity white) and a subtle outer glow.

B. Home Page Hero Refinement
Heading: "Don't Just Give, Witness the Change.". Use a text-gradient on "Witness the Change" for a premium feel.

Buttons: REMOVE the "Register NGO" button from the home page hero section.

Primary CTA: Only one large, centered button: "Donate Now" with a soft glow effect.

Visual Movement: Below the CTA, keep the Infinite Rotating Marquee Strip showing live verified donation logs to maintain a "movable/dynamic" feel: User#2024 donated ₹5,000 to EarthGuard • Verified ✓ • Hash: 8b2...f12.

📑 SECTION 3: AUTHENTICATION FLOW & PAGE ARCHITECTURE
1. The Login Experience
Trigger: Clicking the "Login" button in the navbar/pill opens a sleek, centered Login modal or page.

Fields: * Email Input: Minimalist with a focus-state emerald glow.

Password Input: Includes a "Show/Hide" icon.

CTA: Large gradient button: "Login".

Footer Link: Below the button, add the text: "Don't have an account? Register here" which links to the Registration Page.

2. The Registration Page
Layout: A dedicated high-fidelity page.

Fields: 1.  Full Name
2.  Email Address
3.  Password
4.  Confirm Password

Logic: Add a subtle label: "Passwords are hashed in our secure backend for maximum privacy".

3. NGO Listing & Donation Flow
Listing Page: A grid of cards showing verified NGOs with a direct "Donate" button.

Donation Form: Enter Amount in INR (₹).

Data Integrity Section: Explain that every donation is secured with a SHA-256 Verification Hash to prevent tampering.

4. History & Impact Dashboard
History Table: Columns for | User | NGO | Amount | Date | Verification Code (Hash) |.

Dashboard Stats: Cards for "Total Donations," "Total NGOs," and "Total Users".

Feature: Add an "Export as PDF" button for official donation reports.

🎞️ SECTION 4: INTERACTION & MOTION GUIDELINES
Navbar Transformation: Use a Smart Animate transition (450ms, Ease-In-Out) for the navbar-to-pill change. Ensure the "Login" button's gradient is perfectly centered and symmetrical within the pill container.

Theme Switch: When toggled, use a "Circular Reveal" animation that spreads from the switch to change the colors of the entire page.

Hover Effects: Buttons should scale 1.05x with a soft emerald glow. Cards should have a 10px vertical float effect.

Scroll Reveal: Elements like Dashboard cards and NGO listings should fade in and slide up as the user scrolls.

🛠️ FINAL INSTRUCTION FOR FIGMA AI
Build a connected, symmetrical prototype consisting of 8 frames (Home, Login, Register, About, NGO Listing, Donation Form, History, Dashboard). Ensure the default is Light Mode. The floating pill-navbar must be the pinnacle of symmetry—ensure no buttons stick out and the padding is perfectly balanced on all sides. DELETE all blockchain/crypto assets.

Bhai ke liye Fix Tip:
Maine prompt mein specifically mention kiya hai ki "Login button must be fully contained within the pill boundaries" taaki Figma AI vo error repeat na kare jo image_f252a4.png mein dikh raha hai. Saath hi, "Auto-layout" ka use symmetry ko maintain karne mein madad karega.