import '../css/legal.css';

const TermsOfService = () => {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: September 24, 2025</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            Welcome to ImGalleri. By accessing or using our service, you agree to be bound by these 
            Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            ImGalleri is a social media platform that allows users to upload, share, and discover images. 
            Our service includes features such as:
          </p>
          <ul>
            <li>Image uploading and sharing</li>
            <li>User profiles and social connections</li>
            <li>Commenting and liking posts</li>
            <li>Following other users</li>
            <li>Search functionality</li>
            <li>Social media sharing integration</li>
          </ul>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          
          <h3>3.1 Account Creation</h3>
          <p>
            To use our service, you must create an account and provide accurate, complete, and current 
            information. You are responsible for maintaining the confidentiality of your account credentials.
          </p>

          <h3>3.2 Account Security</h3>
          <ul>
            <li>You must use a strong password as required by our system</li>
            <li>You are responsible for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
            <li>We are not liable for losses due to unauthorized account access</li>
          </ul>

          <h3>3.3 Account Termination</h3>
          <p>
            You may delete your account at any time. We reserve the right to suspend or terminate 
            accounts that violate these Terms.
          </p>
        </section>

        <section>
          <h2>4. User Content</h2>
          
          <h3>4.1 Your Content</h3>
          <p>
            You retain ownership of the content you upload to ImGalleri. By uploading content, you grant 
            us a license to display, store, and share your content as necessary to provide our service.
          </p>

          <h3>4.2 Content Guidelines</h3>
          <p>You agree not to upload or share content that:</p>
          <ul>
            <li>Is illegal, harmful, or violates others' rights</li>
            <li>Contains hate speech, harassment, or discrimination</li>
            <li>Is sexually explicit or inappropriate</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains spam, malware, or malicious code</li>
            <li>Violates privacy of others without consent</li>
            <li>Is false, misleading, or deceptive</li>
          </ul>

          <h3>4.3 Content Moderation</h3>
          <p>
            We reserve the right to remove content that violates these guidelines without notice. 
            Repeated violations may result in account suspension or termination.
          </p>
        </section>

        <section>
          <h2>5. User Conduct</h2>
          <p>You agree to use our service respectfully and legally. You will not:</p>
          <ul>
            <li>Harass, bully, or threaten other users</li>
            <li>Impersonate others or create fake accounts</li>
            <li>Attempt to hack, disrupt, or damage our systems</li>
            <li>Collect user data without permission</li>
            <li>Use automated tools to access our service</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Interfere with other users' enjoyment of the service</li>
          </ul>
        </section>

        <section>
          <h2>6. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and 
            protect your information. By using our service, you also agree to our Privacy Policy.
          </p>
          <ul>
            <li>We store images securely on AWS S3</li>
            <li>Authentication tokens are temporary and expire after 5 hours</li>
            <li>We do not sell your personal data to third parties</li>
            <li>You can delete your content and send account deletion requests at any time</li>
          </ul>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>

          <h3>7.1 User Rights</h3>
          <p>
            You retain all rights to your original content. However, you are responsible for ensuring 
            you have the right to upload and share any content on our platform.
          </p>

          <h3>7.2 Copyright Infringement</h3>
          <p>
            We respect intellectual property rights. If you believe your copyrighted work has been 
            infringed, please contact us with details of the alleged infringement.
          </p>
        </section>

        <section>
          <h2>8. Third-Party Services</h2>
          <p>Our service integrates with third-party services:</p>
          <ul>
            <li><strong>AWS S3:</strong> For secure image storage</li>
            <li><strong>Email Services:</strong> For password reset functionality</li>
            <li><strong>Social Media Platforms:</strong> For sharing features</li>
          </ul>
          <p>
            Use of these third-party services is subject to their respective terms and privacy policies.
          </p>
        </section>

        <section>
          <h2>9. Service Availability</h2>
          <p>
            We strive to maintain service availability, but we do not guarantee uninterrupted access. 
            We may temporarily suspend service for maintenance, updates, or technical issues.
          </p>
        </section>

        <section>
          <h2>10. Disclaimers and Limitations</h2>
          
          <h3>10.1 Service "As Is"</h3>
          <p>
            Our service is provided "as is" without warranties of any kind, either express or implied.
          </p>

          <h3>10.2 Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, 
            incidental, special, consequential, or punitive damages arising from your use of our service.
          </p>

          <h3>10.3 User Responsibility</h3>
          <p>
            You are responsible for your use of the service and any consequences thereof, including 
            the content you upload and your interactions with other users.
          </p>
        </section>

        <section>
          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless ImGalleri from any claims, damages, losses, 
            or expenses arising from your use of the service or violation of these Terms.
          </p>
        </section>

        <section>
          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with applicable laws. Any disputes 
            shall be resolved in the appropriate courts of jurisdiction.
          </p>
        </section>

        <section>
          <h2>13. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. We will notify users of significant changes by 
            posting the updated Terms on our service and updating the "Last updated" date.
          </p>
          <p>
            Your continued use of the service after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2>14. Termination</h2>
          <p>
            Either party may terminate these Terms at any time. Upon termination:
          </p>
          <ul>
            <li>Your access to the service will cease</li>
            <li>Your content may be removed (subject to our Privacy Policy)</li>
            <li>Certain provisions of these Terms will survive termination</li>
          </ul>
        </section>

        <section>
          <h2>15. Contact Information</h2>
          <p>
            If you have questions about these Terms, please contact us at:
          </p>
          <ul>
            <li>Email: imgalleri.auth@gmail.com</li>
          </ul>
        </section>

        <section>
          <h2>16. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining provisions 
            will remain in full force and effect.
          </p>
        </section>

        <section>
          <h2>17. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between 
            you and ImGalleri regarding your use of our service.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;