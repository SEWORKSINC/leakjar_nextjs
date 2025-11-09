import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Award, Users, TrendingUp, MapPin, Calendar, Zap } from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { SharedFooter } from '@/components/shared-footer';

export const metadata: Metadata = {
  title: "About Us - White Hat Hacker Driven Cybersecurity",
  description: "Learn about LeakJar's mission to protect organizations with offensive security expertise. 98%+ satisfaction rate, backed by Qualcomm Ventures. 25+ years of white hat hacking experience.",
  openGraph: {
    title: "About LeakJar - White Hat Hacker Driven Security",
    description: "Offensive security experts protecting organizations from credential-based attacks. 98%+ satisfaction, 95%+ renewal rate.",
    url: "https://www.leakjar.com/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About LeakJar - White Hat Hacker Driven Security",
    description: "Offensive security experts protecting organizations from credential-based attacks.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <SharedHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            White Hat Hacker Driven Cybersecurity
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Cutting-edge technology and real-world hacking techniques to solve security issues
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-foreground mb-6 leading-relaxed">
            We believe that understanding your cyber weaknesses is the foundation of an effective cybersecurity strategy. 
            Our DNA is rooted in offensive security, enabling our customers to discover vulnerabilities from an attacker's perspective.
          </p>
          <p className="text-lg text-foreground leading-relaxed">
            We specialize in Web Applications and API penetration Testing, Cyber Threat Intelligence, and Detecting Account 
            Takeovers (ATOs) from attackers. Our other businesses offer separate services for automated and manual penetration 
            testing, vulnerability assessment, and zero-day (0-day) vulnerability hunting.
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">12+</div>
              <p className="text-lg text-gray-300">Years of Excellence</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">$12m</div>
              <p className="text-lg text-gray-300">Funding</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">3</div>
              <p className="text-lg text-gray-300">Core Products</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <p className="text-lg text-gray-300">Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Satisfaction Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            We don't just talk about customer satisfaction, we deliver.
          </h2>
          <p className="text-xl text-muted-foreground">
            Our 98%+ satisfaction rate and 95%+ renewal rate are proof
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-5xl font-bold text-primary mb-2">98%+</div>
              <p className="text-lg text-muted-foreground">Satisfaction Rate</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-5xl font-bold text-primary mb-2">95%+</div>
              <p className="text-lg text-muted-foreground">Renewal Rate</p>
            </CardContent>
          </Card>
        </div>

        <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto">
          We partner with clients across a range of industries, including <span className="font-semibold text-foreground">SaaS and technology, 
          eCommerce, iGaming and casinos, gaming, fintech and banking, healthcare, education, and more</span>. Our industry 
          expertise and tailored approach enable us to deliver results-driven solutions that meet the unique needs of each client.
        </p>
      </section>

      {/* Leadership Section */}
      {/* <section className="container mx-auto px-4 py-16 bg-muted/30 hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Leadership
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-1">Min Pyo Hong</CardTitle>
                    <CardDescription className="text-lg text-primary font-semibold">Founder & CEO</CardDescription>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Min is the founder and CEO of SEWORKS. He has worked as a white hat hacker for over 25 years, 
                  helping enterprises and governments strengthen their security. He is a serial entrepreneur as he 
                  previously founded and made an exit of SHIFTWORKS, a mobile anti-virus and MDM company. He also 
                  served as part of the review board of Hack In The Box.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-1">Songyee Yoon</CardTitle>
                    <CardDescription className="text-lg text-primary font-semibold">Board Member</CardDescription>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Songyee is an investor, start up advisor and a gaming industry veteran. She is a trustee of the 
                  Carnegie Endowment for International Peace, and a member of the MIT Corporation. As a member of the 
                  advisory council at Stanford University's Institute for Human-Centered Artificial Intelligence, she 
                  studies the social impacts of AI and the ethics of technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}
      <section className="hidden9">
        <div className="container mx-auto my-24">
          {/* <h3 className="text-2xl mb-5 text-center">Leadership</h3> */}
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Leadership
          </h2>
          <div className="mx-auto mt-8 flex flex-wrap max-w-220">
            <div className="mr-6">
              <div className="w-40 h-40 rounded-xl bg-black bg-[url('/c1.png')] bg-cover grayscale bg-position-[center_top_16%]"></div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <strong className="text-xl">Min Pyo Hong</strong>
                <a 
                  href="https://www.linkedin.com/in/silverdel/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Min Pyo Hong's LinkedIn profile"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <span className="mb-2">Founder & CEO</span>
              <p>Min is the founder and CEO of SEWORKS. He has worked as a white hat hacker for over 25 years, helping enterprises and governments strengthen their security. He is a serial entrepreneur as he previously founded and made an exit of SHIFTWORKS, a mobile anti-virus and MDM company. He also served as part of the review board of Hack In The Box.</p>
            </div>
          </div>
          <div className="mx-auto mt-8 flex flex-wrap max-w-220 hidden">
            <div className="mr-6">
              <div className="w-40 h-40 rounded-xl bg-black bg-[url(/c5.png)] bg-cover grayscale"></div>
            </div>
            <div className="flex-1 flex flex-col">
              <strong className="mb-1 text-xl">Songyee Yoon</strong>
              <span className="mb-2">Board Member</span>
              <p>Songyee is an investor, start up advisor and a gaming industry veteran. She is a trustee of the Carnegie Endowment for International Peace, and a member of the MIT Corporation. As a member of the advisory council at Stanford University's Institute for Human-Centered Artificial Intelligence, she studies the social impacts of AI and the ethics of technology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory Board Section */}
      {/* <section className="container mx-auto px-4 py-16 hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Advisory Board
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Andrew Kim</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Former Sr. Intelligence Officer, CIA</li>
                  <li>• Director of the CIA for K-Mission Center</li>
                  <li>• Presidential Rank Award</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Zuk Avraham</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Former Founder & Co-Founder of ZecOps</li>
                  <li>• Former Founder & Chairman of Zimperium</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Perry Ha</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Founder & Managing Director, Draper Athena</li>
                  <li>• Board of Trustees & Leadership Board, MIT</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}
      <section className="hidden9">
        <div className="container mx-auto my-24">
          {/* <h3 className="text-2xl mb-5 text-center">Advisory Board</h3> */}
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Advisory Board
          </h2>
          <div className="mx-auto flex flex-col lg:flex-row flex-wrap items-center lg:items-start lg:justify-between max-w-220 text-center">
            <div className="mt-5 w-40">
              <div className="w-40 h-40 rounded-xl bg-black bg-[url(/c2.png)] bg-cover grayscale"></div>
              <div className="mt-5">
                <div className="flex flex-col justify-center">
                  <strong className="mb-1 text-xl">Andrew Kim</strong>
                  <p className="-mx-12">Former Sr. Intelligence Officer, CIA Director of the CIA for K-Mission Center Presidential Rank Award</p>
                </div>
              </div>
            </div>
            <div className="mt-5 w-40">
              <div className="w-40 h-40 rounded-xl bg-black bg-[url(/c3.png)] bg-cover grayscale"></div>
              <div className="mt-5">
                <div className="flex flex-col justify-center">
                  <strong className="mb-1 text-xl">Zuk Avraham</strong>
                  <p className="-mx-12">Former Founder & Co-Founder of ZecOps Former Founder & Founder & Chairman of Zimperium</p>
                </div>
              </div>
            </div>
            <div className="mt-5 w-40">
              <div className="w-40 h-40 rounded-xl bg-black bg-[url(/c4.png)] bg-cover grayscale"></div>
              <div className="mt-5">
                <div className="flex flex-col justify-center">
                  <strong className="mb-1 text-xl">Perry Ha</strong>
                  <p className="-mx-12">Founder & Managing Director, Draper Athena Board of Trustees & Leadership Board, MIT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investors Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Investors
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-sm border">
                {/* <p className="text-2xl font-bold text-gray-800">Qualcomm Ventures</p> */}
                <div className="inline-block mx-5 w-60 h-16 bg-[url(/i2.png)] bg-contain bg-center bg-no-repeat grayscale"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-sm border">
                {/* <p className="text-2xl font-bold text-gray-800">Fast Investment</p> */}
                <div className="inline-block mx-5 w-60 h-16 bg-[url(/i1.png)] bg-contain bg-center bg-no-repeat grayscale"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="hidden">
        <div className="container mx-auto my-24">
          <h3 className="text-2xl text-center">Investors</h3>
          <div className="mt-10 text-center">
            <div className="inline-block mx-5 w-60 h-16 bg-[url(/i2.png)] bg-contain bg-center bg-no-repeat grayscale"></div>
            <div className="inline-block mx-5 w-60 h-16 bg-[url(/i1.png)] bg-contain bg-center bg-no-repeat grayscale"></div>
          </div>
        </div>
      </section> */}

      {/* Headquarters Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Headquarters
          </h2>
          
          <div className="flex justify-center">
            <Card className="max-w-md w-full">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-center gap-4">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-foreground mb-1">San Francisco</p>
                    <p className="text-xl text-muted-foreground">California</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Left side - Story Text */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Story</h2>
              
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  Founded in 2013 by a team of ethical white-hat hackers in San Francisco, SEWORKS emerged from a simple yet powerful vision: to 
                  make enterprise cybersecurity more intelligent, accessible, and effective.
                </p>
                
                <p>
                  Our founders, with decades of combined experience in cybersecurity and penetration testing, recognized the need for AI-powered 
                  solutions that could keep pace with evolving cyber threats.
                </p>
                
                <p>
                  In 2018, we made history by launching Pentoma®, the world's first AI-powered penetration testing service, powered by our proprietary 
                  GAMAN® technology.
                </p>
              </div>
            </div>

            {/* Right side - Achievement Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardContent className="pt-6 pb-6">
                  <Calendar className="h-12 w-12 mb-4 text-white" />
                  <h3 className="text-xl font-bold mb-2">Founded 2013</h3>
                  <p className="text-sm text-gray-300">
                    Established by white-hat hackers with a vision for intelligent cybersecurity
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardContent className="pt-6 pb-6">
                  <MapPin className="h-12 w-12 mb-4 text-white" />
                  <h3 className="text-xl font-bold mb-2">San Francisco</h3>
                  <p className="text-sm text-gray-300">
                    Headquartered in the heart of tech innovation
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardContent className="pt-6 pb-6">
                  <Zap className="h-12 w-12 mb-4 text-white" />
                  <h3 className="text-xl font-bold mb-2">AI Pioneer</h3>
                  <p className="text-sm text-gray-300">
                    First AI-powered penetration testing service (2018)
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardContent className="pt-6 pb-6">
                  <Award className="h-12 w-12 mb-4 text-white" />
                  <h3 className="text-xl font-bold mb-2">Industry Leader</h3>
                  <p className="text-sm text-gray-300">
                    Trusted by enterprise clients worldwide
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-destructive/10 rounded-2xl p-8 md:p-12 text-center border-2 border-destructive/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              80% of Data Breaches Involve Compromised Credentials
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Leaked credentials from unknown attacks can go undetected for months
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}

