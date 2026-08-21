/* ============================================================
   AVA DERMATOLOGY — Content data
   All clinic-specific facts use clearly-marked [ placeholders ].
   Configure WHATSAPP_NUMBER below with your clinic's number.
   ============================================================ */

// Configurable WhatsApp number placeholder (international format, no + or spaces).
// e.g. "15551234567". Leave as-is to show a friendly placeholder notice.
window.AVA_CONFIG = {
  WHATSAPP_NUMBER: "0000000000", // <-- replace with real number
  WHATSAPP_MESSAGE: "Hello Ava Dermatology, I'd like to book an appointment.",
  CLINIC_NAME: "Ava Dermatology"
};

window.AVA_TREATMENTS = [
  {
    icon: "◍",
    title: "Acne & Acne Scars",
    short: "Personalized plans for active breakouts and the marks they can leave behind.",
    desc: "We assess the type and severity of acne to build a care plan suited to your skin, addressing both active breakouts and the texture or discoloration that can follow.",
    points: ["Individual skin assessment", "Options for active acne and scarring", "Ongoing guidance and follow-up", "Focus on gentle, sustainable routines"]
  },
  {
    icon: "❂",
    title: "Pigmentation & Melasma",
    short: "Thoughtful approaches to uneven tone, dark spots and melasma.",
    desc: "Pigmentation concerns are highly individual. We take time to understand contributing factors and discuss suitable, evidence-informed options for a more even-looking complexion.",
    points: ["Careful evaluation of pigment concerns", "Discussion of triggers and sun care", "Tailored treatment options", "Realistic, patient-centered expectations"]
  },
  {
    icon: "❈",
    title: "Anti-Aging & Wrinkle Treatments",
    short: "Refined care for fine lines, wrinkles and skin firmness.",
    desc: "From preventative care to targeted treatments, we help you make informed choices about maintaining healthy, comfortable skin as it changes over time.",
    points: ["Fine line and wrinkle assessment", "Preventative and corrective options", "Natural-looking, measured approach", "Personalized maintenance guidance"]
  },
  {
    icon: "✦",
    title: "Laser Skin Treatments",
    short: "Modern laser technology applied with care and precision.",
    desc: "Laser treatments can address a range of concerns. We discuss whether a laser-based option is appropriate for you and what the process involves.",
    points: ["Modern laser technology", "Suitability assessment first", "Clear pre- and post-care guidance", "Comfort-focused sessions"]
  },
  {
    icon: "❃",
    title: "Skin Rejuvenation",
    short: "Treatments that support fresh, healthy-looking skin.",
    desc: "Rejuvenation care focuses on overall skin health, texture and radiance, tailored to your skin's needs and your personal goals.",
    points: ["Whole-skin health focus", "Texture and radiance support", "Customized session planning", "Guidance on daily skincare"]
  },
  {
    icon: "❋",
    title: "Hair Loss & Hair Restoration",
    short: "Careful evaluation and options for thinning hair and hair loss.",
    desc: "Hair loss has many possible causes. We aim to understand yours and discuss appropriate, evidence-informed management or restoration options.",
    points: ["Assessment of possible causes", "Discussion of suitable options", "Ongoing monitoring", "Individualized care plan"]
  },
  {
    icon: "◈",
    title: "Mole & Skin Lesion Treatments",
    short: "Evaluation and management of moles and skin lesions.",
    desc: "We examine moles and skin lesions and discuss appropriate next steps, prioritizing your skin health and peace of mind.",
    points: ["Careful clinical examination", "Discussion of appropriate options", "Focus on skin health", "Clear communication throughout"]
  },
  {
    icon: "✧",
    title: "Cosmetic Injectables",
    short: "Subtle, considered cosmetic injectable options.",
    desc: "For those considering injectables, we prioritize a measured, natural-looking approach and thorough discussion before any treatment.",
    points: ["Consultation-led approach", "Natural-looking results as a goal", "Transparent discussion of options", "Comfort and safety focus"]
  },
  {
    icon: "❖",
    title: "General Dermatology",
    short: "Comprehensive care for everyday skin health concerns.",
    desc: "From common rashes to ongoing skin conditions, general dermatology care supports the everyday health of your skin.",
    points: ["Broad skin health support", "Assessment of common concerns", "Ongoing condition management", "Preventative skin care advice"]
  },
  {
    icon: "❉",
    title: "Personalized Skincare",
    short: "A skincare routine designed specifically around your skin.",
    desc: "We help you build a practical, personalized routine that fits your skin type, concerns and daily life — no one-size-fits-all products.",
    points: ["Routine tailored to your skin", "Practical, sustainable steps", "Product guidance", "Adjustments over time"]
  }
];

// Soft luxury pastel hue per treatment (index-aligned with AVA_TREATMENTS)
window.AVA_TREATMENT_HUES = [10, 275, 42, 196, 152, 30, 214, 330, 208, 172];

// Section-matched royalty-free photos (Unsplash CDN), index-aligned with AVA_TREATMENTS.
// Swap any URL for your own photography; if a URL is removed, the card falls back to a gradient.
var _uq = "?auto=format&fit=crop&w=700&q=80";
window.AVA_TREATMENT_IMAGES = [
  "https://images.unsplash.com/photo-1541752988809-6073b61ad3db" + _uq, // Acne & Acne Scars
  "https://images.unsplash.com/photo-1730288951113-9cc087c14b83" + _uq, // Pigmentation & Melasma
  "https://images.unsplash.com/photo-1728727267814-792db55ce678" + _uq, // Anti-Aging & Wrinkles
  "https://images.unsplash.com/photo-1785861433534-8cd4c7b994fa" + _uq, // Laser Skin Treatments
  "https://images.unsplash.com/photo-1761718209835-c8586b7dcac0" + _uq, // Skin Rejuvenation
  "https://images.unsplash.com/photo-1654864471383-50ac3ed9b4f6" + _uq, // Hair Loss & Restoration
  "https://images.unsplash.com/photo-1731514798247-2d7ecb6fa45a" + _uq, // Mole & Skin Lesion
  "https://images.unsplash.com/photo-1746708810803-722593e53772" + _uq, // Cosmetic Injectables
  "https://images.unsplash.com/photo-1638202993928-7267aad84c31" + _uq, // General Dermatology
  "https://images.unsplash.com/photo-1748543669178-efd3de4e64e0" + _uq  // Personalized Skincare
];

// Illustrative before/after photos (clearly labelled; results vary — see disclaimer).
window.AVA_RESULT_IMAGES = {
  before: "https://images.unsplash.com/photo-1732993486279-9d0f3b91adb2" + _uq,
  after:  "https://images.unsplash.com/photo-1731509721871-ed469414804f" + _uq
};

// Generates a cohesive, self-contained premium gradient thumbnail (data URI).
// Replace with real photography by setting card.querySelector('img').src if desired.
window.avaThumb = function (hue) {
  var h2 = (hue + 26) % 360;
  var svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 320'>" +
      "<defs>" +
        "<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
          "<stop offset='0' stop-color='hsl(" + hue + ",62%,91%)'/>" +
          "<stop offset='1' stop-color='hsl(" + h2 + ",56%,74%)'/>" +
        "</linearGradient>" +
        "<radialGradient id='r' cx='28%' cy='26%' r='75%'>" +
          "<stop offset='0' stop-color='white' stop-opacity='.75'/>" +
          "<stop offset='1' stop-color='white' stop-opacity='0'/>" +
        "</radialGradient>" +
        "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='linear' slope='0.05'/></feComponentTransfer><feComposite operator='over' in2='SourceGraphic'/></filter>" +
      "</defs>" +
      "<rect width='600' height='320' fill='url(#g)'/>" +
      "<circle cx='160' cy='120' r='150' fill='url(#r)'/>" +
      "<circle cx='470' cy='96' r='64' fill='white' opacity='.22'/>" +
      "<circle cx='520' cy='150' r='24' fill='white' opacity='.3'/>" +
      "<path d='M0 232 Q150 182 300 220 T600 210 V320 H0 Z' fill='white' opacity='.18'/>" +
      "<rect width='600' height='320' filter='url(#n)' opacity='.6'/>" +
    "</svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
};

window.AVA_CONCERNS = [
  "Acne", "Acne scars", "Pigmentation", "Melasma", "Fine lines",
  "Wrinkles", "Uneven skin tone", "Hair loss", "Skin texture", "General skin health"
];

window.AVA_RESULTS = [
  { title: "Skin clarity", note: "Illustrative placeholder — replace with consented photos." },
  { title: "Even tone", note: "Illustrative placeholder — replace with consented photos." },
  { title: "Smoother texture", note: "Illustrative placeholder — replace with consented photos." }
];

window.AVA_TRUST = [
  { icon: "✦", title: "Personalized care", text: "Every plan is built around your individual skin and goals." },
  { icon: "◈", title: "Modern technology", text: "Thoughtful use of current dermatology tools and techniques." },
  { icon: "❖", title: "Patient-focused", text: "Your comfort and understanding guide every visit." },
  { icon: "❂", title: "Comprehensive", text: "Medical and cosmetic dermatology under one roof." },
  { icon: "❋", title: "Calm environment", text: "A welcoming, comfortable setting designed to ease anxiety." },
  { icon: "❃", title: "Evidence-informed", text: "Care grounded in current, credible dermatological practice." }
];

window.AVA_REVIEWS = [
  { name: "S.", meta: "Acne care", stars: 5, quote: "The consultation was calm and unhurried, and I finally understood my skin. [Sample placeholder testimonial — replace with a real, consented review.]" },
  { name: "M.", meta: "Pigmentation", stars: 5, quote: "I appreciated how personalized everything felt, from the plan to the follow-up. [Sample placeholder testimonial — replace before publishing.]" },
  { name: "A.", meta: "General dermatology", stars: 5, quote: "A genuinely comfortable experience — attentive, clear and reassuring throughout. [Sample placeholder testimonial.]" },
  { name: "R.", meta: "Skin rejuvenation", stars: 5, quote: "Modern, professional and welcoming. I left feeling informed about my options. [Sample placeholder testimonial.]" }
];

window.AVA_FAQ = [
  { q: "How do I book an appointment?", a: "You can request an appointment using the booking form on this page, or reach us instantly via the WhatsApp button. Our team will follow up to confirm your preferred date and time." },
  { q: "What happens during a first consultation?", a: "A first visit typically involves discussing your concerns and goals, reviewing relevant history, and examining your skin. From there we outline suitable options and answer your questions. [Adjust to reflect your clinic's process.]" },
  { q: "How should I prepare for my appointment?", a: "In general, arrive with clean skin where possible and bring a list of any products or medications you use, along with your questions. Specific preparation depends on the treatment discussed." },
  { q: "Will treatments be tailored to my skin?", a: "Yes. We prioritize personalized care — plans are based on your individual skin type, concerns and goals rather than a fixed template." },
  { q: "What does aftercare involve?", a: "Aftercare varies by treatment. You'll receive clear, individualized guidance following any procedure, and we're available for follow-up questions." },
  { q: "Do results vary between individuals?", a: "Yes. Outcomes depend on many personal factors, and results naturally vary from person to person. We aim to set realistic, honest expectations." },
  { q: "Is this website's information medical advice?", a: "No. The information here is general and for orientation only. It is not a substitute for a personalized consultation. Please book an appointment for guidance specific to you." }
];
