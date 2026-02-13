import { useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { Clock, Play, Smartphone, Bell, Map, Users, Shield, Zap, MapPin, Star, Check, Navigation, Activity, Apple } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import { Button, Card } from "../components/UI.component";


function Hero() {
  const screenshots = [
    {
      title: 'Real-Time Map',
      icon: Map,
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Alert Dashboard',
      icon: Bell,
      gradient: 'from-orange-400 to-red-600'
    },
    {
      title: 'Community Feed',
      icon: Users,
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Safety Center',
      icon: Shield,
      gradient: 'from-green-400 to-emerald-600'
    },
    {
      title: 'Route Planner',
      icon: Navigation,
      gradient: 'from-indigo-400 to-indigo-600'
    },
  ]

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24">
          <div className="w-full lg:w-auto lg:max-w-xl shrink-0">
            <div className="inline-flex items-center gap-2 bg-secondary-500/60 text-secondary-700 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
              <Clock className="w-4 h-4" />
              Real-Time Flood Monitoring
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Stay Safe During
              <span className="block text-primary-600">Floods & Disasters</span>
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Get instant flood alerts, monitor water levels in real-time, and access critical safety information when it matters most.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button className="px-8 py-2.5 flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5" />
                Google Play
              </Button>
              <Button className="px-8 py-2.5 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800">
                <Apple className="w-5 h-5" />
                App Store
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold text-gray-900">150+</div>
                <div className="text-xs text-gray-600">Users</div>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.6★</div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-xs text-gray-600">Support</div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end shrink-0">
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500 w-64 shrink-0">
              <div className="bg-gray-900 rounded-3xl shadow-2xl p-2">
                <div className="aspect-[9/16] bg-white rounded-2xl overflow-hidden">
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    slidesPerView={1}
                    loop={true}
                    loopAdditionalSlides={2}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    className="h-full"
                  >
                    {screenshots.map((screenshot, index) => {
                      const Icon = screenshot.icon
                      return (
                        <SwiperSlide key={index}>
                          <div className="h-full bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
                            <div className="text-center">
                              <div className={`w-16 h-16 bg-gradient-to-br ${screenshot.gradient} rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg`}>
                                <Icon className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-sm font-semibold text-gray-900">{screenshot.title}</h3>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-blue-200 rounded-3xl blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: Bell,
      title: 'Real-Time Alerts',
      description: 'Instant notifications about flood warnings and water level changes in your area.',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: Map,
      title: 'Interactive Map',
      description: 'Visualize flood zones and safe routes with live updates.',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: Users,
      title: 'Community Reports',
      description: 'Real-time updates from your community about local conditions.',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Safety Resources',
      description: 'Emergency contacts and evacuation guides at your fingertips.',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: Zap,
      title: 'Offline Mode',
      description: 'Access critical information even without internet connection.',
      gradient: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Clock,
      title: 'Historical Data',
      description: 'Review past flood events to understand risk levels.',
      gradient: 'from-indigo-500 to-indigo-600',
    },
  ]

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Powerful Features for Your Safety
          </h2>
          <p className="text-lg text-gray-700">
            Real-time data combined with intelligent alerts to keep you informed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Download the App',
      description: 'Get SnapFlood from Google Play or App Store in seconds.',
      icon: Smartphone,
    },
    {
      number: '02',
      title: 'Set Your Location',
      description: 'Allow location access for personalized alerts.',
      icon: MapPin,
    },
    {
      number: '03',
      title: 'Stay Protected',
      description: 'Receive instant alerts and monitor conditions 24/7.',
      icon: Shield,
    },
  ]

  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Get Started in Minutes
          </h2>
          <p className="text-lg text-gray-700">
            Three simple steps to protect yourself and your loved ones.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200"></div>

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow h-full relative z-10">
                  <div className="absolute -top-4 left-6 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {step.number}
                  </div>

                  <div className="mt-6 mb-4 text-primary-600">
                    <Icon className="w-10 h-10" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-gray-700 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function AboutMission() {
  return (
    <section id='mission' className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            About Our Mission
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 space-y-6">
          <p className="text-gray-700 leading-relaxed">
            SnapFlood emerged from critical research funded by the <span className="font-semibold text-primary-700">Government of India's Department of Science and Technology (DST-SPLICE)</span> as part of the National Network Programme on Urban Climate. Our current work is supported by the AI CoE for Sustainable Cities project.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Urban flooding presents unique challenges that traditional riverine flood monitoring cannot address. The great spatial and temporal variability of city floods demands innovative data collection methods. That's where you come in.
          </p>

          <p className="text-gray-700 leading-relaxed">
            <span className="font-semibold text-primary-700">RAFT (Rainfall-runoff Analysis and Forecasting Tools)</span> at IIT Hyderabad developed SnapFlood to democratize flood documentation. Every image and video you share becomes part of a crucial scientific resource that informs policy, engineering decisions, and emergency preparedness.
          </p>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2 text-primary-700">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="font-medium">DST-SPLICE Funded</span>
              </div>
              <div className="flex items-center gap-2 text-primary-700">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="font-medium">IIT Hyderabad</span>
              </div>
              <div className="flex items-center gap-2 text-primary-700">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="font-medium">AI CoE Supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function BackedBy() {
  const logos = [
    { name: 'TechVentures', img: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Ministry_of_Education_India.svg' },
    {
      name: 'GreenCapital',
      img: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
    },
  ]

  const shouldAutoplay = logos.length >= 6

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Backed By
          </h2>
          <p className="text-lg text-gray-700">
            Backed by leading investors committed to public safety
          </p>
        </div>

        {shouldAutoplay ? (
          <div className="py-4 overflow-hidden">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={60}
              slidesPerView="auto"
              loop={true}
              speed={3000}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="logo-swiper"
            >
              {[...logos, ...logos, ...logos].map((logo, index) => (
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  <div className="flex items-center justify-center h-24 px-8">
                    <img
                      src={logo.img}
                      alt={logo.name}
                      className="h-12 w-auto max-w-[180px] object-contain logo-image"
                      style={{ minWidth: '120px' }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="py-4">
            <div className="flex items-center justify-center gap-12 flex-wrap">
              {logos.map((logo, index) => (
                <div key={index} className="flex items-center justify-center h-24">
                  <img
                    src={logo.img}
                    alt={logo.name}
                    className="h-12 w-auto max-w-[180px] object-contain filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 ease-in-out"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .logo-swiper {
          overflow: visible !important;
        }
        
        .logo-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }

        .logo-image {
          filter: grayscale(100%) opacity(0.5);
          transition: filter 0.4s ease-in-out;
        }

        .logo-image:hover {
          filter: grayscale(0%) opacity(1);
        }
      `}</style>
    </section>
  )
}

function DownloadCTA() {
  const features = ['Free to Download', 'No Ads', 'Regular Updates', '24/7 Support']

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Download SnapFlood Today
        </h2>
        <p className="text-lg text-primary-100 mb-8 leading-relaxed">
          Join thousands who trust SnapFlood to keep them safe. Get real-time alerts and stay prepared.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button variant="secondary" className="px-8 py-3 bg-white hover:bg-gray-50 inline-flex items-center gap-2 font-semibold" style={{ color: '#111827' }}>
            <Smartphone className="w-5 h-5" />
            Google Play Store
          </Button>
          <Button variant="secondary" className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 inline-flex items-center gap-2 font-semibold">
            <Apple className="w-5 h-5" />
            Apple App Store
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-primary-100 text-sm">
          {features.map((item) => (
            <div key={item} className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);
  return (
    <>
      <Hero />
      <AboutMission />
      <Features />
      <HowItWorks />
      <BackedBy />
      <DownloadCTA />
    </>
  )
}

export default Home