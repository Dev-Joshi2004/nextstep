import { Brain } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      {/* <nav className="relative z-50 flex items-center justify-between p-6 lg:px-12">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">CareerPath</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              Sign In
            </Button>
          </Link>
        </div>
      </nav> */}

      <div className="px-6 lg:px-12 pb-20">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto pt-20 pb-16 text-center">
          <h1 className="text-5xl lg:text-6xl md:inline-flex gap-3 font-bold text-white mb-6 leading-tight">
            Privacy
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal
            information.
          </p>
          <p className="text-gray-400">Last updated: September 2025</p>
        </section>

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 lg:p-12">
              <div className="prose prose-invert max-w-none">
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">1. Information We Collect</h2>
                  <div className="space-y-4 text-gray-300">
                    <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                    <p>
                      When you create an account or use our services, we may collect personal information such as your
                      name, email address, phone number, educational background, and career interests.
                    </p>
                    <h3 className="text-xl font-semibold text-white">Assessment Data</h3>
                    <p>
                      We collect your responses to our career assessment questionnaires to provide personalized career
                      recommendations. This includes your interest scores and career preferences.
                    </p>
                    <h3 className="text-xl font-semibold text-white">Usage Information</h3>
                    <p>
                      We automatically collect information about how you use our platform, including pages visited,
                      features used, and time spent on the platform.
                    </p>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">2. How We Use Your Information</h2>
                  <div className="space-y-4 text-gray-300">
                    <ul className="list-disc list-inside space-y-2">
                      <li>Provide personalized career recommendations and guidance</li>
                      <li>Improve our assessment algorithms and recommendation accuracy</li>
                      <li>Send you relevant educational content and career opportunities</li>
                      <li>Provide customer support and respond to your inquiries</li>
                      <li>Analyze usage patterns to improve our platform</li>
                      <li>Comply with legal obligations and protect our rights</li>
                    </ul>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">3. Information Sharing</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      We do not sell, trade, or rent your personal information to third parties. We may share your
                      information only in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>With your explicit consent</li>
                      <li>With educational institutions or employers when you apply through our platform</li>
                      <li>With service providers who help us operate our platform</li>
                      <li>When required by law or to protect our legal rights</li>
                      <li>In connection with a business transfer or acquisition</li>
                    </ul>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">4. Data Security</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      We implement appropriate technical and organizational measures to protect your personal
                      information against unauthorized access, alteration, disclosure, or destruction. These measures
                      include:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Encryption of data in transit and at rest</li>
                      <li>Regular security assessments and updates</li>
                      <li>Access controls and authentication measures</li>
                      <li>Employee training on data protection</li>
                      <li>Secure data storage and backup procedures</li>
                    </ul>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">5. Your Rights</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>You have the following rights regarding your personal information:</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Access: Request a copy of your personal information</li>
                      <li>Correction: Update or correct inaccurate information</li>
                      <li>Deletion: Request deletion of your personal information</li>
                      <li>Portability: Request transfer of your data to another service</li>
                      <li>Objection: Object to certain processing of your information</li>
                      <li>Restriction: Request limitation of processing in certain circumstances</li>
                    </ul>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">6. Cookies and Tracking</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      We use cookies and similar technologies to enhance your experience on our platform. These help us:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Remember your preferences and settings</li>
                      <li>Analyze platform usage and performance</li>
                      <li>Provide personalized content and recommendations</li>
                      <li>Ensure platform security and prevent fraud</li>
                    </ul>
                    <p>You can control cookie settings through your browser preferences.</p>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">7. Children's Privacy</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      Our platform is designed for students aged 16 and above. We do not knowingly collect personal
                      information from children under 16 without parental consent. If you believe we have collected
                      information from a child under 16, please contact us immediately.
                    </p>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">8. International Data Transfers</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      Your information may be transferred to and processed in countries other than your country of
                      residence. We ensure appropriate safeguards are in place to protect your information during such
                      transfers.
                    </p>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">9. Changes to This Policy</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      We may update this privacy policy from time to time. We will notify you of any material changes by
                      posting the new policy on our platform and updating the "Last updated" date. Your continued use of
                      our services after such changes constitutes acceptance of the updated policy.
                    </p>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">10. Contact Us</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>If you have any questions about this privacy policy or our data practices, please contact us:</p>
                    <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                      <p>
                        <strong className="text-white">Email:</strong> privacy@careerpath.in
                      </p>
                      <p>
                        <strong className="text-white">Phone:</strong> +91 98765 43210
                      </p>
                      <p>
                        <strong className="text-white">Address:</strong> 123 Education Hub, Sector 18, Gurgaon, Haryana
                        122015, India
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
