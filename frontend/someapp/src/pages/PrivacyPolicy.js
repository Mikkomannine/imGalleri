import '../css/legal.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: September 24, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to ImGalleri. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our social media application 
            and related services.
          </p>
          <p>
            By using our Service, you agree to the collection and use of information in accordance 
            with this Privacy Policy.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information</h3>
          <p>We collect the following personal information when you create an account:</p>
          <ul>
            <li>Username (required)</li>
            <li>Email address (required)</li>
            <li>Password (encrypted and hashed for security)</li>
            <li>First name and last name (optional)</li>
            <li>Phone number (optional)</li>
            <li>Bio/profile description (optional)</li>
            <li>Profile picture (optional)</li>
          </ul>

          <h3>2.2 Content Data</h3>
          <p>We collect and store content you create and share:</p>
          <ul>
            <li>Images you upload to posts</li>
            <li>Post titles and descriptions</li>
            <li>Comments you make on posts</li>
            <li>Likes and social interactions</li>
            <li>Following and follower relationships</li>
          </ul>

          <h3>2.3 Usage Information</h3>
          <ul>
            <li>Timestamps of posts and comments</li>
            <li>Account creation and last activity dates</li>
            <li>Search queries within the application</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain our Service</li>
            <li>Create and manage your account</li>
            <li>Enable social features (following, likes, comments)</li>
            <li>Process and display your uploaded content</li>
            <li>Send password reset emails when requested</li>
            <li>Improve our Service and user experience</li>
            <li>Communicate with you about your account</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Storage and Security</h2>
          
          <h3>4.1 Authentication Data</h3>
          <p>
            We use JSON Web Tokens (JWT) for authentication. These tokens are stored in your browser's 
            localStorage and expire after 5 hours for security. When you log out or the token expires, 
            this data is automatically removed.
          </p>

          <h3>4.2 Image Storage</h3>
          <p>
            Your uploaded images are securely stored on Amazon Web Services (AWS) S3 cloud storage. 
            AWS provides enterprise-level security and data protection. Images are accessed through 
            signed URLs that expire for additional security.
          </p>

          <h3>4.3 Database Security</h3>
          <p>
            Your account information is stored in a secure MongoDB database. Passwords are encrypted 
            using bcrypt hashing and are never stored in plain text.
          </p>
        </section>

        <section>
          <h2>5. Third-Party Services</h2>
          
          <h3>5.1 Amazon Web Services (AWS)</h3>
          <p>
            We use AWS S3 for secure image storage and processing. Your images are subject to 
            AWS's privacy policy and security measures.
          </p>

          <h3>5.2 Email Services</h3>
          <p>
            We use email services (Gmail/Nodemailer) to send password reset links. Your email 
            address may be processed by these services for this purpose only.
          </p>

          <h3>5.3 Social Sharing</h3>
          <p>
            Our app includes sharing buttons for Facebook, Twitter, and LinkedIn. These features 
            are provided by the respective social media platforms and are subject to their privacy policies.
          </p>
        </section>

        <section>
          <h2>6. Data Sharing and Disclosure</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only:</p>
          <ul>
            <li>With service providers (AWS, email services) necessary for app functionality</li>
            <li>When required by law or legal process</li>
            <li>To protect our rights, property, or safety</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        <section>
          <h2>7. Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Access:</strong> View your profile and account information</li>
            <li><strong>Update:</strong> Edit your profile, bio, and account details</li>
            <li><strong>Delete:</strong> Remove individual posts and comments</li>
            <li><strong>Account Deletion:</strong> Request complete account and data deletion</li>
            <li><strong>Data Portability:</strong> Request a copy of your data</li>
            <li><strong>Logout:</strong> Clear authentication tokens at any time</li>
          </ul>
        </section>

        <section>
          <h2>8. Cookies and Local Storage</h2>
          <p>
            We use browser localStorage (not cookies) to maintain your login session. This includes:
          </p>
          <ul>
            <li>Authentication tokens (JWT)</li>
            <li>Basic user information for app functionality</li>
          </ul>
          <p>
            We do not use tracking cookies or third-party advertising cookies. You can clear this 
            data by logging out or clearing your browser's local storage.
          </p>
        </section>

        <section>
          <h2>9. Data Retention</h2>
          <ul>
            <li>Account information: Retained until account deletion</li>
            <li>Posts and images: Retained until manually deleted</li>
            <li>Authentication tokens: Automatically expire after 5 hours</li>
            <li>Comments and interactions: Retained until manually deleted</li>
          </ul>
        </section>

        <section>
          <h2>10. International Data Transfers</h2>
          <p>
            Your data may be processed and stored on servers located outside your country through 
            our use of AWS services. AWS complies with international data protection regulations 
            including GDPR.
          </p>
        </section>

        <section>
          <h2>11. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under 13 years of age. We do not knowingly 
            collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2>12. Changes to Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <ul>
            <li>Email: imgalleri.auth@gmail.com</li>
          </ul>
        </section>

        <section>
          <h2>14. GDPR Compliance</h2>
          <p>
            If you are located in the European Union, you have additional rights under GDPR:
          </p>
          <ul>
            <li>Right to be informed about data processing</li>
            <li>Right of access to your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided above.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;