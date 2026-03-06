import { getUserFromRequest } from "@/lib/auth";
import { MarketingNavbar } from "../components/marketing/marketing-navbar";
import { MarketingHero } from "../components/marketing/marketing-hero";
import { FeatureSection } from "../components/marketing/feature-section";
import { AppPreviewSection } from "../components/marketing/app-preview-section";
import { HowItWorksSection } from "../components/marketing/how-it-works-section";
import { PricingSection } from "../components/marketing/pricing-section";
import { TestimonialsSection } from "../components/marketing/testimonials-section";
import { CtaSection } from "../components/marketing/cta-section";
import { MarketingFooter } from "../components/marketing/marketing-footer";
import { AuthedOverview } from "../components/marketing/authed-overview";

export default async function HomePage() {
  const user = await getUserFromRequest();

  return (
    <div className="min-h-screen">
      <MarketingNavbar user={user} />
      <main>
        {user ? <AuthedOverview username={user.username} /> : <MarketingHero />}
        <FeatureSection />
        <AppPreviewSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
