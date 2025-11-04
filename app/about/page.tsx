import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Award, Users, TrendingUp } from 'lucide-react';
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
      <section className="container mx-auto px-4 py-16 bg-muted/30">
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
      </section>

      {/* Advisory Board Section */}
      <section className="container mx-auto px-4 py-16">
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
                <p className="text-2xl font-bold text-gray-800">Qualcomm Ventures</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-sm border">
                <p className="text-2xl font-bold text-gray-800">Fast Investment</p>
              </div>
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

