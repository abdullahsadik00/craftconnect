import React from 'react';
import {
  Hammer, Wrench, Paintbrush, Droplets, Shield, Clock, Award, Phone, Mail, MapPin, Star, CheckCircle, AlertTriangle, ArrowRight, Flame, Waves, Box
} from 'lucide-react';
import type { BuilderComponent, ComponentVariant } from '../../data/builder-demo';

// Helper to get icon by name
const getIcon = (name: string) => {
  const icons: Record<string, any> = {
    hammer: Hammer,
    wrench: Wrench,
    paintbrush: Paintbrush,
    droplets: Droplets,
    shield: Shield,
    clock: Clock,
    award: Award,
    phone: Phone,
    mail: Mail,
    map: MapPin,
    star: Star,
    check: CheckCircle,
    alert: AlertTriangle,
    flame: Flame,
    waves: Waves,
    box: Box
  };
  const Icon = icons[name] || Star;
  return <Icon className="w-6 h-6" />;
};

// --- Base Props ---
interface SectionProps {
  content: any;
  variant: ComponentVariant;
  themeColor: string;
}

// --- Components ---

export const EmergencyBanner: React.FC<SectionProps> = ({ content, variant, themeColor }) => {
  const bgColors: Record<string, string> = {
    urgent: 'bg-red-600',
    simple: 'bg-gray-800',
    premium: 'bg-gray-900',
    creative: 'bg-purple-600'
  };

  return (
    <div className={`${bgColors[variant] || 'bg-red-600'} text-white py-3 px-4 text-center animate-pulse`}>
      <div className="flex items-center justify-center gap-2 font-bold">
        <AlertTriangle className="w-5 h-5" />
        <span>{content.message}</span>
        <a href={`tel:${content.phone}`} className="underline ml-2">{content.phone}</a>
      </div>
    </div>
  );
};

export const HeroSection: React.FC<SectionProps> = ({ content, variant, themeColor }) => {
  const isCreative = variant === 'creative';
  const isPremium = variant === 'premium';
  const isUrgent = variant === 'urgent';

  return (
    <div className={`relative ${isCreative ? 'min-h-[80vh]' : 'min-h-[60vh]'} flex items-center overflow-hidden`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={content.image} alt="Hero" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${isPremium ? 'bg-black/60' : 'bg-black/50'}`}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        {isUrgent && (
          <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-6">
            <Clock className="w-4 h-4" /> 24/7 Emergency Service
          </div>
        )}

        <h1 className={`font-bold mb-6 ${isCreative ? 'text-6xl font-serif' : 'text-4xl md:text-5xl'}`}>
          {content.headline}
        </h1>

        <p className={`text-xl mb-8 max-w-2xl mx-auto ${isPremium ? 'font-light tracking-wide' : ''}`}>
          {content.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className={`px-8 py-4 rounded-lg font-bold transition-all ${
            isUrgent ? 'bg-red-600 hover:bg-red-700 text-white' :
            isPremium ? 'bg-white text-black hover:bg-gray-100' :
            `bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white`
          }`}>
            {content.cta}
          </button>

          {content.secondaryCta && (
            <button className="px-8 py-4 rounded-lg font-bold border-2 border-white text-white hover:bg-white/10 transition-all">
              {content.secondaryCta}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const BusinessOverview: React.FC<SectionProps> = ({ content, variant, themeColor }) => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className={`text-3xl font-bold mb-6 text-gray-900`}>{content.title}</h2>
        <div className="w-20 h-1 bg-gray-200 mx-auto mb-8"></div>
        <p className="text-lg text-gray-600 leading-relaxed">
          {content.description}
        </p>
      </div>
    </div>
  );
};

export const ServicesList: React.FC<SectionProps> = ({ content, variant, themeColor }) => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">{content.title}</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {content.services.map((service: any, i: number) => (
            <div key={i} className={`bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all ${
              variant === 'urgent' ? 'border-l-4 border-red-500' : ''
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-${themeColor}-600 bg-${themeColor}-50`}>
                {getIcon(service.icon)}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600">Professional {service.title.toLowerCase()} services for your home.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PortfolioGallery: React.FC<SectionProps> = ({ content, variant, themeColor }) => {
  const isCreative = variant === 'creative';

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">{content.title}</h2>

        <div className={`grid gap-4 ${isCreative ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {content.images.map((img: string, i: number) => (
            <div key={i} className={`relative overflow-hidden group ${
              isCreative && i === 0 ? 'md:row-span-2 md:col-span-1 h-full' : 'h-64'
            }`}>
              <img
                src={img}
                alt={`Portfolio ${i}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Testimonials: React.FC<SectionProps> = ({ content, variant, themeColor }) => {
  return (
    <div className={`py-20 ${variant === 'creative' ? 'bg-stone-900 text-white' : 'bg-${themeColor}-50'}`}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {content.reviews.map((review: any, i: number) => (
            <div key={i} className={`p-8 rounded-2xl ${
              variant === 'creative' ? 'bg-stone-800' : 'bg-white shadow-sm'
            }`}>
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
              </div>
              <p className={`mb-6 italic ${variant === 'creative' ? 'text-gray-300' : 'text-gray-600'}`}>
                "{review.text}"
              </p>
              <div className="font-bold">- {review.author}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PricingPackages: React.FC<SectionProps> = ({ content, variant, themeColor }) => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">{content.title}</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {content.packages.map((pkg: any, i: number) => (
            <div key={i} className="border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors relative overflow-hidden">
              {i === 1 && variant === 'premium' && (
                <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-3 py-1">POPULAR</div>
              )}
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <div className="text-3xl font-bold mb-6 text-gray-900">{pkg.price}</div>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feat: string, j: number) => (
                  <li key={j} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {feat}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-bold border-2 transition-all hover:bg-gray-50 border-gray-900 text-gray-900`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProcessSteps: React.FC<SectionProps> = ({ content, variant, themeColor }) => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {content.steps.map((step: any, i: number) => (
            <div key={i} className="text-center relative">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6 text-xl font-serif font-bold">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
              {i < content.steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-gray-200 -z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Certifications: React.FC<SectionProps> = ({ content, variant, themeColor }) => {
  return (
    <div className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all">
          {content.badges.map((badge: string, i: number) => (
            <div key={i} className="flex items-center gap-2 font-bold text-lg">
              <Award className="w-6 h-6 text-yellow-500" />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ContactCTA: React.FC<SectionProps> = ({ content, variant, themeColor }) => {
  return (
    <div className={`py-20 ${variant === 'urgent' ? 'bg-red-50' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6 text-center max-w-2xl">
        <h2 className="text-3xl font-bold mb-8">Ready to get started?</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm">
            <Phone className={`w-6 h-6 text-${themeColor}-600`} />
            <div className="text-left">
              <div className="text-xs text-gray-500">Call Us</div>
              <div className="font-bold">{content.phone}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm">
            <Mail className={`w-6 h-6 text-${themeColor}-600`} />
            <div className="text-left">
              <div className="text-xs text-gray-500">Email Us</div>
              <div className="font-bold">{content.email}</div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500">
          <MapPin className="w-4 h-4" /> {content.location}
        </div>
      </div>
    </div>
  );
};

export const Footer: React.FC<SectionProps> = ({ content, variant, themeColor }) => {
  return (
    <div className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="container mx-auto px-6 text-center">
        <p className="mb-4">{content.copyright}</p>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span>Powered by</span>
          <span className="font-bold text-white flex items-center gap-1">
             CraftConnect
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Main Renderer ---

export const ComponentRenderer: React.FC<{ component: BuilderComponent, themeColor: string }> = ({ component, themeColor }) => {
  const components: Record<string, React.FC<SectionProps>> = {
    'hero': HeroSection,
    'business-overview': BusinessOverview,
    'services': ServicesList,
    'portfolio': PortfolioGallery,
    'testimonials': Testimonials,
    'pricing': PricingPackages,
    'process': ProcessSteps,
    'emergency': EmergencyBanner,
    'certifications': Certifications,
    'contact': ContactCTA,
    'footer': Footer
  };

  const Component = components[component.type];
  if (!Component) return null;

  return <Component content={component.content} variant={component.variant} themeColor={themeColor} />;
};
