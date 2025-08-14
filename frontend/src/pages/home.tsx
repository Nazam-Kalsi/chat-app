import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Zap, Shield, Star, ArrowRight, Check, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { Highlighter } from "@/components/ui/highlighter";
import { TextHoverEffect } from '@/components/ui/text-hover-effect';
import { useUser } from '@/context/session';

const ChatHomepage = () => {
    const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleCards, setVisibleCards] = useState(new Set());
    const {user} = useUser();
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which cards are in viewport
      const cards = document.querySelectorAll('.scroll-card');
      const newVisibleCards = new Set();
      
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          newVisibleCards.add(index);
        }
      });
      
      setVisibleCards(newVisibleCards);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Instant Messaging",
      description: "Real-time conversations with lightning-fast delivery and seamless synchronization across all devices.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Conversations",
      description: "Create dynamic group chats with unlimited participants and advanced moderation tools.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Features",
      description: "Smart message suggestions, language translation, and intelligent conversation insights.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "End-to-End Security",
      description: "Military-grade encryption ensures your conversations remain private and secure at all times.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      content: "This chat app revolutionized how our team communicates. The AI features save us hours every day.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      content: "The security features give me complete peace of mind. Finally, a chat app I can trust with sensitive business discussions.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Emily Watson",
      role: "Team Lead",
      content: "Group management is incredibly intuitive. Our distributed team feels more connected than ever before.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      
      <nav className="sm:fixed sm:left-8 mx-auto bg-black/10 top-4 sm:w-[95%] z-50 0 backdrop-blur-md sm:rounded-4xl border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="size-7 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Chat-it
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
              
              {user ? <RainbowButton onClick={()=>navigate('/chat')} className='rounded-2xl'>
                Chat
              </RainbowButton>:
              <RainbowButton onClick={()=>navigate('/sign-in')} className='rounded-2xl'>
                Sign-in
              </RainbowButton>              
              }
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
               <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg w-full">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div 
            className="transform transition-all duration-1000"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              opacity: Math.max(0, 1 - scrollY / 500)
            }}
          >
            <div className='min-h-[70vh] items-center flex flex-col justify-center'>
            <h1 className="text-5xl md:text-8xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
              Chat Without
              <br />
               <Highlighter action="underline" color="#87CEFA">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">

                Boundaries
              </span>
               </Highlighter>
            </h1>            
            <div className=" flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <RainbowButton onClick={()=>navigate('/sign-up')} className='rounded-2xl'>
                Start Chatting Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </RainbowButton>
             
            </div>
            </div>

            {/* Floating Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { label: "Active Users", value: "2M+", color: "from-blue-400 to-cyan-400" },
                { label: "Messages Sent", value: "1B+", color: "from-purple-400 to-pink-400" },
                { label: "Countries", value: "150+", color: "from-green-400 to-emerald-400" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need for seamless communication, packed into one beautiful application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`scroll-card bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 hover:bg-white/10 ${
                  visibleCards.has(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 hover:rotate-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See what professionals are saying about Chat-it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`scroll-card bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 ${
                  visibleCards.has(index + 4) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`
                }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black">
        <div className="mx-auto">
            <div className='flex justify-end items-end w-full'>
          <TextHoverEffect text="CHAT-IT" />
          {/* <TextHoverEffect text="" /> */}
            </div>
        </div>
          <p className="absolute bottom-16 right-4 text-gray-400">
            made with ❤️
          </p>
      </footer>
    </div>
  );
};

export default ChatHomepage;