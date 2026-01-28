
import { 
  Hammer, 
  Wrench, 
  Paintbrush, 
  Droplets, 
  Shield, 
  Clock, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

// --- Types ---

export type ComponentType = 
  | 'hero' 
  | 'business-overview' 
  | 'services' 
  | 'portfolio' 
  | 'testimonials' 
  | 'pricing' 
  | 'process' 
  | 'emergency' 
  | 'certifications' 
  | 'contact' 
  | 'footer';

export type ComponentVariant = 'simple' | 'premium' | 'urgent' | 'creative';

export interface BuilderComponent {
  id: string;
  type: ComponentType;
  variant: ComponentVariant;
  content: any; // Flexible content structure
}

export interface ProviderDemoConfig {
  id: string;
  name: string;
  category: string;
  themeColor: string; // Tailwind color class prefix (e.g., 'amber', 'blue', 'emerald')
  components: BuilderComponent[];
}

// --- Mock Data ---

export const PROVIDER_DEMOS: ProviderDemoConfig[] = [
  {
    id: 'carpenter-simple',
    name: "Joe's Custom Carpentry",
    category: "Small Carpenter",
    themeColor: "amber",
    components: [
      {
        id: 'c1',
        type: 'hero',
        variant: 'simple',
        content: {
          headline: "Handcrafted Woodwork for Your Home",
          subheadline: "Custom furniture, cabinetry, and repairs with a personal touch.",
          cta: "Get a Free Quote",
          image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        }
      },
      {
        id: 'c2',
        type: 'business-overview',
        variant: 'simple',
        content: {
          title: "About Joe",
          description: "I've been working with wood for over 15 years. My goal is to bring quality craftsmanship back to local homes at affordable prices."
        }
      },
      {
        id: 'c3',
        type: 'services',
        variant: 'simple',
        content: {
          title: "My Services",
          services: [
            { title: "Custom Cabinets", icon: "box" },
            { title: "Furniture Repair", icon: "wrench" },
            { title: "Deck Building", icon: "hammer" }
          ]
        }
      },
      {
        id: 'c4',
        type: 'testimonials',
        variant: 'simple',
        content: {
          reviews: [
            { text: "Joe built a beautiful bookshelf for us. Highly recommended!", author: "Sarah M." },
            { text: "Honest, reliable, and great work.", author: "Mike T." }
          ]
        }
      },
      {
        id: 'c5',
        type: 'contact',
        variant: 'simple',
        content: {
          phone: "(555) 123-4567",
          email: "joe@carpentry.com",
          location: "Portland, OR"
        }
      },
      {
        id: 'c6',
        type: 'footer',
        variant: 'simple',
        content: { copyright: "© 2024 Joe's Custom Carpentry" }
      }
    ]
  },
  {
    id: 'carpenter-showroom',
    name: "Elite Woodworks Studio",
    category: "Mid-size Carpenter Showroom",
    themeColor: "stone",
    components: [
      {
        id: 'w1',
        type: 'hero',
        variant: 'premium',
        content: {
          headline: "Master Craftsmanship. Timeless Design.",
          subheadline: "Transforming spaces with bespoke joinery and premium wood materials.",
          cta: "Visit Our Showroom",
          secondaryCta: "View Portfolio",
          image: "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        }
      },
      {
        id: 'w2',
        type: 'certifications',
        variant: 'premium',
        content: {
          badges: ["Master Guild Certified", "Eco-Friendly Materials", "25 Year Warranty", "Best of Houzz 2024"]
        }
      },
      {
        id: 'w3',
        type: 'portfolio',
        variant: 'premium',
        content: {
          title: "Featured Projects",
          images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          ]
        }
      },
      {
        id: 'w4',
        type: 'pricing',
        variant: 'premium',
        content: {
          title: "Investment Packages",
          packages: [
            { name: "Kitchen Refresh", price: "$5,000+", features: ["Cabinet Refacing", "New Hardware", "Countertop Install"] },
            { name: "Full Custom Kitchen", price: "$25,000+", features: ["Bespoke Cabinetry", "Island Design", "Premium Woods"] },
            { name: "Whole Home Joinery", price: "$50,000+", features: ["Kitchen, Bath & Closets", "Custom Built-ins", "Architectural Millwork"] }
          ]
        }
      },
      {
        id: 'w5',
        type: 'contact',
        variant: 'premium',
        content: {
          phone: "(555) 987-6543",
          email: "design@elitewoodworks.com",
          location: "Design District, NY"
        }
      },
      {
        id: 'w6',
        type: 'footer',
        variant: 'premium',
        content: { copyright: "© 2024 Elite Woodworks Studio. All rights reserved." }
      }
    ]
  },
  {
    id: 'interior-designer',
    name: "Studio Aura",
    category: "Interior Designer",
    themeColor: "teal",
    components: [
      {
        id: 'i1',
        type: 'hero',
        variant: 'creative',
        content: {
          headline: "Curating Soulful Spaces",
          subheadline: "Interior design that reflects your personality and elevates your lifestyle.",
          cta: "Start Your Project",
          image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        }
      },
      {
        id: 'i2',
        type: 'process',
        variant: 'creative',
        content: {
          steps: [
            { title: "Discovery", desc: "We learn about your style and needs." },
            { title: "Concept", desc: "Moodboards and initial sketches." },
            { title: "Execution", desc: "Bringing the vision to life." },
            { title: "Reveal", desc: "Welcome to your new home." }
          ]
        }
      },
      {
        id: 'i3',
        type: 'portfolio',
        variant: 'creative',
        content: {
          title: "Recent Transformations",
          images: [
            "https://images.unsplash.com/photo-1616137466211-f939a420be84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1616594039964-40891a90b3b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1616486029423-aaa478965c96?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          ]
        }
      },
      {
        id: 'i4',
        type: 'testimonials',
        variant: 'creative',
        content: {
          reviews: [
            { text: "Studio Aura completely transformed our living space. It feels like a magazine cover now!", author: "Elena R." },
            { text: "Incredible eye for detail and color.", author: "James P." }
          ]
        }
      },
      {
        id: 'i5',
        type: 'contact',
        variant: 'creative',
        content: {
          phone: "(555) 333-2222",
          email: "hello@studioaura.com",
          location: "Los Angeles, CA"
        }
      },
      {
        id: 'i6',
        type: 'footer',
        variant: 'simple',
        content: { copyright: "© 2024 Studio Aura" }
      }
    ]
  },
  {
    id: 'plumber-urgent',
    name: "Rapid Response Plumbing",
    category: "Home Plumber",
    themeColor: "blue",
    components: [
      {
        id: 'p1',
        type: 'emergency',
        variant: 'urgent',
        content: {
          message: "24/7 Emergency Service Available - We arrive in under 60 mins!",
          phone: "(555) 911-HELP"
        }
      },
      {
        id: 'p2',
        type: 'hero',
        variant: 'urgent',
        content: {
          headline: "Plumbing Disaster? We Fix It Fast.",
          subheadline: "Licensed, bonded, and insured. Serving the metro area for 20 years.",
          cta: "Call Now For Service",
          image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        }
      },
      {
        id: 'p3',
        type: 'services',
        variant: 'urgent',
        content: {
          title: "Our Services",
          services: [
            { title: "Leak Detection", icon: "droplets" },
            { title: "Pipe Repair", icon: "wrench" },
            { title: "Water Heaters", icon: "flame" },
            { title: "Drain Cleaning", icon: "waves" }
          ]
        }
      },
      {
        id: 'p4',
        type: 'pricing',
        variant: 'simple',
        content: {
          title: "Transparent Pricing",
          packages: [
            { name: "Service Call", price: "$79", features: ["Diagnosis", "Trip Charge"] },
            { name: "Drain Cleaning", price: "$149", features: ["Up to 50ft", "Camera Inspection"] }
          ]
        }
      },
      {
        id: 'p5',
        type: 'contact',
        variant: 'urgent',
        content: {
          phone: "(555) 911-HELP",
          email: "emergency@rapidplumbing.com",
          location: "Chicago, IL"
        }
      },
      {
        id: 'p6',
        type: 'footer',
        variant: 'simple',
        content: { copyright: "© 2024 Rapid Response Plumbing" }
      }
    ]
  }
];
