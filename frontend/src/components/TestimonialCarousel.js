import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import "./TestimonialCarousel.css";

const testimonials = [
  {
    id: 1,
    text: "SAGE found 37 issues our old agency never even mentioned. Fixed in a day — our calls doubled the next week.",
    name: "Ray M.",
    company: "Akron HVAC Solutions",
    rating: 5
  },
  {
    id: 2,
    text: "We went from invisible on Google to ranking for 14 keywords in two weeks. SAGE is stupid good.",
    name: "Jenna K.",
    company: "ShopLift Boutique",
    rating: 5
  },
  {
    id: 3,
    text: "The AEO insights alone are worth 10x the price. We finally understand how to show up in AI results.",
    name: "Owen P.",
    company: "Finch AI Tools",
    rating: 5
  },
  {
    id: 4,
    text: "We used the GEO Engine and immediately outranked 3 competitors in our area. Unreal.",
    name: "Maria L.",
    company: "Ohio Home Group",
    rating: 5
  },
  {
    id: 5,
    text: "SAGE replaced three different tools I was paying for. The audit reports are insane.",
    name: "Thomas B.",
    company: "BrandShift Media",
    rating: 5
  },
  {
    id: 6,
    text: "Traffic went up 42% after fixing the issues SAGE flagged. Wish we found this earlier.",
    name: "Lindsey C.",
    company: "Harbor Café",
    rating: 5
  },
  {
    id: 7,
    text: "SAGE pointed out a broken schema issue I didn't even know existed. Fixed it, and my map rankings jumped within days.",
    name: "Jordan F.",
    company: "Boost Landscaping",
    rating: 5
  },
  {
    id: 8,
    text: "The audit explained things in plain English. I finally understood what was hurting my visibility.",
    name: "Ashley W.",
    company: "Cleveland Pet Grooming",
    rating: 5
  },
  {
    id: 9,
    text: "We've paid for SEO tools for years — none of them showed half the insights SAGE did in one scan.",
    name: "Derek L.",
    company: "SafeHome Roofing",
    rating: 5
  },
  {
    id: 10,
    text: "Honestly didn't expect much, but the report came back with super-specific fixes. Traffic upticked the same week.",
    name: "Haley T.",
    company: "Coffee Run Co.",
    rating: 5
  },
  {
    id: 11,
    text: "Our site was loading slow on mobile. SAGE told us exactly why — and how to fix it. Huge difference.",
    name: "Marcus V.",
    company: "Lumen Outdoor Lighting",
    rating: 5
  },
  {
    id: 12,
    text: "My agency uses SAGE now for all audits. It saves us time and makes us look like geniuses.",
    name: "Natalie R.",
    company: "Grey Harbor Creative",
    rating: 5
  },
  {
    id: 13,
    text: "The GEO recommendations were spot on. We finally show up in searches past our neighborhood.",
    name: "Ryan P.",
    company: "Lakeview Plumbing",
    rating: 5
  },
  {
    id: 14,
    text: "We aren't tech people. SAGE made everything simple. The checklist alone is worth using.",
    name: "Michelle H.",
    company: "Kids Corner Daycare",
    rating: 5
  },
  {
    id: 15,
    text: "I sent the audit to my developer and he literally said, 'This is the most useful SEO report I've ever seen.'",
    name: "Paul K.",
    company: "Urban Trail Fitness",
    rating: 5
  },
  {
    id: 16,
    text: "Our blog posts were indexed wrong. SAGE caught it. Fixed it. Our impressions doubled.",
    name: "Elena S.",
    company: "ShopNest Decor",
    rating: 5
  },
  {
    id: 17,
    text: "We were stuck on page 3 forever. Two fixes from SAGE pushed us to the bottom of page 1.",
    name: "Henry C.",
    company: "AutoCare Mobile",
    rating: 5
  },
  {
    id: 18,
    text: "I didn't believe in AEO until SAGE showed how AI assistants were ignoring our content. Game changer.",
    name: "Vera M.",
    company: "Prime Legal Advisors",
    rating: 5
  },
  {
    id: 19,
    text: "This tool pays for itself. No fluff — just things you can actually fix right away.",
    name: "David L.",
    company: "Iron Works Supplements",
    rating: 5
  },
  {
    id: 20,
    text: "Our conversions went up after fixing the layout issues SAGE flagged. Didn't realize how much it mattered.",
    name: "Jessica G.",
    company: "Home Glow Interiors",
    rating: 5
  },
  {
    id: 21,
    text: "We run five locations. SAGE organized our listing issues better than anything else we've used.",
    name: "Ronald J.",
    company: "FastWash Auto Spa",
    rating: 5
  },
  {
    id: 22,
    text: "Found 12 duplicate title tags in seconds. We've been trying to diagnose that for months.",
    name: "Tina P.",
    company: "PixelTech IT Services",
    rating: 5
  },
  {
    id: 23,
    text: "The audit was like having an expert sit next to me explaining everything. No fluff, no jargon.",
    name: "Sam O.",
    company: "GardenRoot Organics",
    rating: 5
  },
  {
    id: 24,
    text: "Our site accessibility score improved a ton after following SAGE's suggestions. Unexpected bonus.",
    name: "Kate L.",
    company: "Summit Wellness Therapy",
    rating: 5
  },
  {
    id: 25,
    text: "Even our agency partner asked what tool we used for the audit. Told them SAGE — now they want it too.",
    name: "Lydia C.",
    company: "Northern Coast Realty",
    rating: 5
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev + itemsPerView >= testimonials.length ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, itemsPerView]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev + itemsPerView >= testimonials.length ? 0 : prev + 1
    );
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, testimonials.length - itemsPerView) : prev - 1
    );
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  return (
    <section className="testimonial-section" id="testimonials">
      <div className="testimonial-container">
        <div className="testimonial-header">
          <h2 className="testimonial-title">
            Wall of <span className="testimonial-gradient">Love</span>
          </h2>
          <p className="testimonial-subtitle">
            See what real businesses are saying about SAGE
          </p>
        </div>

        <div className="testimonial-carousel-wrapper">
          <button 
            onClick={goToPrev}
            className="testimonial-nav-button testimonial-nav-prev"
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="testimonial-carousel">
            {visibleTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#10b981" color="#10b981" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-company">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={goToNext}
            className="testimonial-nav-button testimonial-nav-next"
            aria-label="Next testimonials"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="testimonial-dots">
          {Array.from({ length: Math.ceil(testimonials.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index * itemsPerView);
                setIsAutoPlaying(false);
              }}
              className={`testimonial-dot ${Math.floor(currentIndex / itemsPerView) === index ? "active" : ""}`}
              aria-label={`Go to testimonial set ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
