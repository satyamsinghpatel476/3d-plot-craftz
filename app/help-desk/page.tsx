import Link from "next/link";
import { HelpDeskForm } from "@/components/HelpDeskForm";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Help Desk"
};

const faqs = [
  ["Which STL files can I upload?", "Binary and ASCII .stl files up to 50 MB are accepted by the upload API."],
  ["How are prices calculated?", "The quote includes material, estimated weight, print time, density, color, finish, urgency, quantity, handling, and GST."],
  ["Can I request manual review?", "Choose manual quote during checkout or create a help desk ticket with your requirements."],
  ["How do I track support?", "Tickets are stored in Supabase and visible in the protected admin panel."]
];

export default function HelpDeskPage() {
  return (
    <section className="container-px section-y">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow">Help Desk</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Support for orders, uploads, files, and quotes.</h1>
          <div className="mt-8 grid gap-3">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-md border border-black/10 p-4 dark:border-white/10">
                <h2 className="font-bold">{question}</h2>
                <p className="mt-2 text-sm leading-6 text-forge-steel">{answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-3 text-sm">
            <Link href={siteConfig.whatsapp} className="font-semibold text-forge-mint">WhatsApp support</Link>
            <a href={`mailto:${siteConfig.email}`} className="font-semibold text-forge-mint">Email support</a>
          </div>
        </div>
        <HelpDeskForm />
      </div>
    </section>
  );
}
