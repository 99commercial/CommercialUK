import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';

// ----------------------------------------------------------------------

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const FAQSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: '#f8f9fa',
  position: 'relative',
  overflow: 'hidden',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#1a1a1a',
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  position: 'relative',
  fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-16px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #1a1a1a 0%, #f2c514 100%)',
    borderRadius: '2px',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: '#4a4a4a',
  textAlign: 'center',
  maxWidth: '720px',
  margin: '0 auto',
  marginBottom: theme.spacing(6),
  fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
}));

const CustomAccordion = styled(Accordion)(({ theme }) => ({
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderColor: '#1a1a1a',
  },
  marginBottom: theme.spacing(2.5),
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e8e8e8',
  backgroundColor: '#ffffff',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  width: '100%',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    borderColor: '#d0d0d0',
  },
  '& .MuiAccordionSummary-root': {
    borderRadius: '12px',
    padding: theme.spacing(2.5, 3),
    '&.Mui-expanded': {
      minHeight: 'auto',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: '#fafafa',
    },
    '&:hover': {
      backgroundColor: '#f8f8f8',
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(3, 3, 4),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    backgroundColor: '#fafafa',
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: '#1a1a1a',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&.Mui-expanded': {
      transform: 'rotate(180deg)',
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '12px',
  flexShrink: 0,
  color: '#1a1a1a',
  backgroundColor: '#f2c514',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 2px 8px rgba(242, 197, 20, 0.2)',
  '& svg': {
    fontSize: '1.5rem',
  },
  '&:hover': {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    transform: 'scale(1.05) translateY(-2px)',
    boxShadow: '0 4px 12px rgba(26, 26, 26, 0.25)',
  },
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(4),
  marginBottom: theme.spacing(6),
  flexWrap: 'wrap',
}));

const StatItem = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  color: '#333',
  '& .number': {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1a1a1a',
    display: 'block',
    lineHeight: 1,
  },
  '& .label': {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: theme.spacing(0.5),
  },
}));

const faqs = [
  {
    question: 'How can I set up alerts for new commercial listings?',
    answer: 'Create a free CommercialUK account and save your search filters to enable property alerts. This will send you immediate notifications when any new commercial spaces that match your criteria go live, ensuring you are always the first to know.',
    icon: <QuestionAnswerIcon />,
    category: 'Account & Alerts',
  },
  {
    question: 'Can one perform a search using a business or site address?',
    answer: 'Yes, simply type the name of the business, street, or postcode in the search bar. Our system will show all the available commercial listings that are situated in or around that address for your convenience in finding properties in specific business districts or high-demand areas.',
    icon: <BusinessIcon />,
    category: 'Property Search',
  },
  {
    question: 'How do you find commercial properties using specific keywords or requirements?',
    answer: 'You can search for a warehouse, retail unit, office suite, industrial unit, drive-in access, or any other feature in which you have an interest. This will help you rapidly sift through properties to find the ones that meet your operational requirements.',
    icon: <TrendingUpIcon />,
    category: 'Property Search',
  },
];

// Agent → Profile Management specific FAQs
const profileManagementFaqs = [
  {
    question: 'How do I delegate another user to handle my listing?',
    answer: 'You can assign specific listings to team members by granting them listing access and permissions from your account settings. This allows them to manage listings on your behalf.',
    icon: <QuestionAnswerIcon />,
    category: 'Profile Management',
  },
  {
    question: 'How do I modify my CommercialUK profile?',
    answer: 'Go to your profile settings to update your business name, description, and contact details anytime.',
    icon: <BusinessIcon />,
    category: 'Profile Management',
  },
  {
    question: 'How do I edit my email, password, or login credentials?',
    answer: 'Visit the account settings section to update your email, password, or other login details securely.',
    icon: <QuestionAnswerIcon />,
    category: 'Profile Management',
  },
  {
    question: 'Where do I edit my business information?',
    answer: 'Edit your business address, phone number, and branding details directly under the "Business Information" tab in settings.',
    icon: <BusinessIcon />,
    category: 'Profile Management',
  },
  {
    question: 'Why am I receiving an invalid login error?',
    answer: 'Ensure you\'re entering the correct credentials and check for typos. If the issue persists, reset your password or contact support.',
    icon: <TrendingUpIcon />,
    category: 'Profile Management',
  },
  {
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click "Forgot Password" on the login page and follow the recovery steps to regain access to your account.',
    icon: <QuestionAnswerIcon />,
    category: 'Profile Management',
  },
];

// Agent → Targeted Reach specific FAQs
const targetedReachFaqs = [
  {
    question: 'Can I show advertisements to individuals I already have on my contact list?',
    answer:
      "Yes, CommercialUK does allow you to target members of your current contact list. Your advertisements can be shown to them while browsing online after they've been uploaded, helping you reconnect or follow up on probable leads.",
    icon: <TrendingUpIcon />,
    category: 'Targeted Reach',
  },
  {
    question: 'What file type should my contact list be in before uploading?',
    answer:
      'Your contact list should be saved as a CSV (Comma-Separated Values) file. It should have clean contact information like email addresses or phone numbers. Keep the data clean and properly formatted for best results.',
    icon: <BusinessIcon />,
    category: 'Targeted Reach',
  },
  {
    question:
      'How many individuals can I send an email or SMS to from my contact list at one time?',
    answer:
      'You may add a large number of contacts, but for privacy and performance reasons there may be a minimum amount — typically 1,000 contacts — that your campaign must operate effectively.',
    icon: <QuestionAnswerIcon />,
    category: 'Targeted Reach',
  },
  {
    question:
      "Is CommercialUK's targeting facility dependent on your being based in the UK?",
    answer:
      "No, you don't necessarily need to be UK-based to use the tools, but CommercialUK mainly promotes UK-based commercial properties. Some of the features can be limited if you are aiming at or based elsewhere than the UK.",
    icon: <TrendingUpIcon />,
    category: 'Targeted Reach',
  },
  {
    question: 'What types of display ads can I place on CommercialUK?',
    answer:
      'You can show various types of ads like banner ads, targeted audience ads, and featured listings. These will be shown on CommercialUK and other websites your audience is visiting, depending on campaign type.',
    icon: <BusinessIcon />,
    category: 'Targeted Reach',
  },
  {
    question: 'What gets deleted from my campaign when I delete a contact list?',
    answer:
      'When you remove a contact list, the system eliminates that information from current and upcoming campaigns. The list will no longer be utilized for targeting, and it can take up to 48 hours for it to be completely eliminated from the system.',
    icon: <QuestionAnswerIcon />,
    category: 'Targeted Reach',
  },
];

// Agent → Enquiry Tracking specific FAQs
const enquiryTrackingFaqs = [
  {
    question: 'Why does my listing show a different number instead of mine?',
    answer:
      'CommercialUK employs call tracking numbers. A separate tracking number is used instead of your own number so that all calls can be measured, reported, and recorded without revealing your private number.',
    icon: <QuestionAnswerIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'How do I view the details of the people who called me through my listing?',
    answer:
      'You can log in to your CommercialUK dashboard, where call logs, caller information (when provided), and recordings are shown.',
    icon: <BusinessIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'Can I forward calls from the tracking number to my phone without losing data?',
    answer:
      'Yes. All tracking numbers forward directly to your desired contact number, and you will also continue to receive complete call data and recordings in your dashboard.',
    icon: <TrendingUpIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'When my listing expires, does the phone number attached to it no longer work?',
    answer:
      'Yes. As soon as a listing expires or is unpublished, the tracking number that was assigned to it will no longer work.',
    icon: <QuestionAnswerIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'I have a changed phone number — how do I get my ad to reflect this change?',
    answer:
      'Update your new number in your CommercialUK account settings or call support. The system will point your updated phone towards the tracking number.',
    icon: <BusinessIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'As a secondary contact, will I still see lead and call data?',
    answer:
      'Yes, secondary contacts can access lead and call data within the dashboard, but main contact holds settings.',
    icon: <QuestionAnswerIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'Do call tracking numbers appear on all listing package types?',
    answer:
      'No. Call tracking is an option on selected packages. Basic or free listings may not have tracking.',
    icon: <TrendingUpIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'Is it possible to disable call recordings?',
    answer:
      'Yes. You can turn off call recording in your account settings or contact support to turn it off.',
    icon: <BusinessIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: "I was expecting a call to be recorded but didn't notice anything — what did I do wrong?",
    answer:
      'It may occur if recording was turned off, the call was too brief to record, or if the person hung up before connection.',
    icon: <QuestionAnswerIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'Will all calls be recorded, or just answered ones?',
    answer:
      'Connected calls alone are recorded. Missed calls will show up in your dashboard as a log, but not recorded.',
    icon: <TrendingUpIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'Do all my property listings receive a distinctive tracking number?',
    answer:
      'Yes. Every live listing receives a different tracking number so that the leads can be properly attributed.',
    icon: <BusinessIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'Which ad packages provide call recording options?',
    answer:
      'Premium and featured packages have call recording available. Basic packages can have call forwarding without recording.',
    icon: <QuestionAnswerIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'Can I view the number of calls made to me using CommercialUK?',
    answer:
      'Yes. Your dashboard displays total call volumes, caller IDs (where provided), and call length for each.',
    icon: <TrendingUpIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'Will my own number be shown anywhere on the site?',
    answer:
      'No. Your own number is never visible to the public. Only the tracking number is shown.',
    icon: <BusinessIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'Are callers notified that the call may be recorded?',
    answer:
      'Yes. An automated announcement that the call can be recorded for quality and training purposes is played to callers before the call is connected.',
    icon: <QuestionAnswerIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'Is the same tracking number ever going to be used with a different listing?',
    answer:
      'No. A tracking number will be assigned to a listing and never reused until after the initial listing has expired and the reset period has elapsed.',
    icon: <TrendingUpIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'How long does it take before listing a property before call tracking begins?',
    answer:
      'Tracking starts as early as when your listing goes live and the tracking number is active.',
    icon: <BusinessIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'Will the tracking number show up if somebody searches for my company on Google?',
    answer:
      "No. Tracking numbers are used only on CommercialUK's website, and not on Google search or other websites.",
    icon: <QuestionAnswerIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question:
      'If there are several agents listed on the listing, will each of them get a different number?',
    answer:
      'No. The same tracking number is applied to the listing, but all assigned agents will have access to the call and lead data.',
    icon: <TrendingUpIcon />,
    category: 'Enquiry Tracking',
  },
  {
    question: 'How does CommercialUK determine what phone number to apply to my listing?',
    answer:
      'The platform automatically assigns an available tracking number from its pool and connects it to the phone number you’ve provided in your account.',
    icon: <BusinessIcon />,
    category: 'Enquiry Tracking',
  },
];

// Agent → Payment Details specific FAQs
const paymentDetailsFaqs = [
  {
    question: 'How can I modify my payment method or payment details?',
    answer:
      'You can modify your payment method at any time from your CommercialUK account. Log in to your account. Navigate to Billing & Payments within your account settings. Choose Update Payment Method. Provide your new credit/debit card or direct debit information. Save. Your new payment method will be applied to all future transactions.',
    icon: <BusinessIcon />,
    category: 'Payment Details',
  },
  {
    question: 'How do I print or download my invoice?',
    answer:
      "To view your invoices: Log in to your CommercialUK account. Go to Billing & Payments. Click Invoices/Receipts. Select the invoice you'd like to download. Click Download PDF or Print Invoice. All invoices are still in your account history for reference.",
    icon: <QuestionAnswerIcon />,
    category: 'Payment Details',
  },
  {
    question: "What if my payment doesn't go through?",
    answer:
      "If a payment fails, we'll send you an email. Please: Make sure your payment method details are accurate and current. Make sure you have enough money or available credit. Try to reprocess the payment from Billing & Payments in your account. If the problem persists, reach out to CommercialUK Support so that we can resolve it as soon as possible.",
    icon: <TrendingUpIcon />,
    category: 'Payment Details',
  },
  {
    question: 'Can I change my billing cycle (monthly/yearly)?',
    answer:
      'Yes, you can change your billing cycle: Visit Billing & Payments in your account. Choose Manage Subscription. Pick Monthly or Annual billing. Confirm the change. Your new billing cycle will take effect from your next renewal date.',
    icon: <BusinessIcon />,
    category: 'Payment Details',
  },
];

// Agent → Listing Promotions (My Listings) specific FAQs
const listingPromotionsFaqs = [
  {
    question: 'How do I add and modify a commercial property listing?',
    answer:
      'Log in to your CommercialUK account. Select Create Listing from your dashboard. Add property details (location, size, price, type, description). Add supporting documents (images, floor plans, brochures). Save and publish. To modify a listing, edit from your My Listings tab, make changes, and click Save. Changes are effective immediately.',
    icon: <TrendingUpIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I delete my property listing?',
    answer:
      'Go to My Listings in your account. Select the property you want to delete. Click Delete Listing. Confirm to delete. Warning: deleted listings cannot be recovered.',
    icon: <QuestionAnswerIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I update contacts on my listing?',
    answer:
      'Open the property in My Listings. Go to the Contact Information section. Add, edit, or remove contacts. Save changes. This ensures enquiries are directed to the right person.',
    icon: <BusinessIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I build a professional company or agent profile?',
    answer:
      'Go to My Profile under your account. Add your company logo, contact information, and bio. Upload credentials or certifications if applicable. Save updates. A complete profile earns credibility with buyers and renters.',
    icon: <BusinessIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How can I add or modify admins on my listings?',
    answer:
      'Go to Account Settings > Team Management. Add an admin by providing their email. Allocate roles (Admin, Editor, Viewer). Save. Admins can edit and manage listings for you.',
    icon: <QuestionAnswerIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I see my Listing Performance Report?',
    answer:
      'Log in to your account. Go to Analytics > Listing Performance. Choose the property. Views, enquiries, and engagement activity are shown in reports.',
    icon: <TrendingUpIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I update details for an active listing?',
    answer:
      'Simple: Open the listing in My Listings. Make required fields current (price, availability, description). Save. Your listing is refreshed throughout the platform.',
    icon: <QuestionAnswerIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I upload and refresh brochures, floor plans, photos, and documents?',
    answer:
      'Open your property in My Listings. Go to Media & Documents. Add new brochures, floor plans, or photos. To override, remove existing files and add new ones. Save changes.',
    icon: <BusinessIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I upgrade my listing visibility (featured or premium)?',
    answer:
      'Visit My Listings. Select the property you wish to promote. Click Upgrade Visibility. Select Featured or Premium and accept payment. More advanced listings receive greater exposure.',
    icon: <TrendingUpIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I choose which photo is shown as the main photo?',
    answer:
      'Load all property photos in Media & Photos. Hover over the image you want to be displayed as the main photo. Click Set as Main Photo. This photo will be displayed first in searches and on your listing.',
    icon: <QuestionAnswerIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I view and manage leads on my property?',
    answer:
      'Go to the Leads Dashboard in your account. Select the property. View enquiries, messages, and contact details. Allocate follow-ups or export lead data.',
    icon: <TrendingUpIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I set up a marketing or email campaign on CommercialUK?',
    answer:
      'Go to Marketing Tools. Select Email Campaign. Pick a template, add property details and images. Target audience (buyers, tenants, investors). Preview and send.',
    icon: <TrendingUpIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I manage and organize documents for my listings?',
    answer:
      'Go to Media & Documents across all listings. Organize folders for brochures, compliance, and legal documents. Upload documents and label them clearly. This keeps you professional and compliant.',
    icon: <BusinessIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I add highlights, key features, and amenities?',
    answer:
      'Open your listing. Go to the Highlights/Features section. Add details such as parking, transport links, amenities. Save changes. Well-detailed features improve listing engagement.',
    icon: <QuestionAnswerIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I upload or update compliance documents (EPC, safety certificates)?',
    answer:
      'Go to Compliance Documents in your listing. Upload EPC, Gas Safety, EICR, or other certificates. Update or replace as needed. Compliance documents help to build trust with tenants and buyers.',
    icon: <BusinessIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I renew or extend my property listing?',
    answer:
      'Go to My Listings. Select the listing that you want to extend. Click Renew/Extend Listing. Choose the new term and accept payment.',
    icon: <QuestionAnswerIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I change my subscription or billing plan?',
    answer:
      'Go to Billing & Payments in your account. Select Manage Subscription. Change plans (monthly/yearly or package upgrade). Authorise changes.',
    icon: <BusinessIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I advertise multiple properties or portfolios?',
    answer:
      'Use the Portfolio Listing function in Create Listing. Upload details for multiple properties. Bulk manages them in the Portfolio Dashboard. Recommended for developers, agencies, or large landlords.',
    icon: <TrendingUpIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I expose my property to investors and tenants?',
    answer:
      'Become Premium Visibility. Use Targeted Email Campaigns. Broadcast your property on CommercialUK partner networks. These features maximize visibility.',
    icon: <TrendingUpIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I get CommercialUK support?',
    answer:
      'You can reach our support staff via: Help Centre live chat, Support ticket system in your account, Email: support@commercialuk.com, Phone: [insert number]. Support is available [hours of operation].',
    icon: <QuestionAnswerIcon />,
    category: 'Listing Promotions',
  },
];

// Tenant → Profile Management specific FAQs
const tenantProfileManagementFaqs = [
  {
    question: 'Where can I hire a commercial agent to help me search for my property?',
    answer:
      'Use the "Find an Agent" feature to search by location, property type, or services. View profiles, listings, and contact agents directly.',
    icon: <QuestionAnswerIcon />,
    category: 'Tenant Profile Management',
  },
  {
    question: "How do I list a particular commercial agent's listings?",
    answer:
      "Go to the agent's profile and click \"View All Listings\" to see all available listings from that agent.",
    icon: <BusinessIcon />,
    category: 'Tenant Profile Management',
  },
  {
    question: "How do I bookmark a commercial agent's listing in my favourites?",
    answer:
      'Click the heart icon or "Add to Favourites" on the listing. Access saved properties anytime from your Favourites page.',
    icon: <TrendingUpIcon />,
    category: 'Tenant Profile Management',
  },
];

// Tenant → Find a Property Advisor specific FAQs
const tenantFindAdvisorFaqs = [
  {
    question: 'How do I set up new commercial listing alerts & save a search?',
    answer:
      'Apply filters to define criteria (location, type, price). When results appear, click "Save Search". Sign in or sign up if prompted, then choose how often to receive emails for matching new listings.',
    icon: <TrendingUpIcon />,
    category: 'Find a Property Advisor',
  },
  {
    question: 'How can I search for a commercial property by address?',
    answer:
      'Enter the street address (or partial) in the search box, select Commercial if needed, then use the predictive dropdown or press Enter to view results for that location.',
    icon: <BusinessIcon />,
    category: 'Find a Property Advisor',
  },
  {
    question: 'Can I search for a commercial property using a keyword?',
    answer:
      'Yes. Enter a keyword (e.g., warehouse, retail, office space) in the search box. Refine using filters like location and price. Keyword matches appear in titles, descriptions, or listing attributes.',
    icon: <QuestionAnswerIcon />,
    category: 'Find a Property Advisor',
  },
];

// Tenant → Custom Reports specific FAQs
const tenantCustomReportsFaqs = [
  {
    question: 'How do I save a search for new commercial property alerts?',
    answer:
      'Enter your search terms and select "Save Search" or "Create Alert". Log in or sign up if prompted. You will receive email alerts when new properties match your criteria.',
    icon: <TrendingUpIcon />,
    category: 'Custom Reports',
  },
  {
    question: 'How do I search for commercial property by location or address?',
    answer:
      'Use the top search bar to search by town, postcode, or exact address. Then filter results by property type, size, or price range.',
    icon: <BusinessIcon />,
    category: 'Custom Reports',
  },
  {
    question: 'Is it possible to search for a commercial property using keyword or business type?',
    answer:
      'Yes. Use keyword search to enter terms like "café", "retail unit", or "storage" to find properties with specific attributes or uses.',
    icon: <QuestionAnswerIcon />,
    category: 'Custom Reports',
  },
];

// Investor → Document Hub specific FAQs
const investorDocumentHubFaqs = [
  {
    question: 'What is the difference between Standard Access and Enhanced Access in the Data Room?',
    answer: 'With Standard Access, users can view only the essential files, while Enhanced Access gives them access to more confidential documents, analytics, and materials shared with only verified parties. This helps maintain security while supporting serious commercial enquiries.',
    icon: <QuestionAnswerIcon />,
    category: 'Document Hub',
  },
  {
    question: 'Must I add tags to files while uploading?',
    answer: 'Tagging is not required but highly encouraged. It really helps the investors, agents, and other stakeholders find the documents quickly, especially for large projects with numerous files.',
    icon: <BusinessIcon />,
    category: 'Document Hub',
  },
  {
    question: 'Will the documents or information be visible on other platforms besides CommercialUK?',
    answer: 'All files remain within the CommercialUK ecosystem; they do not automatically sync to other external platforms, unless you decide to share them or give permission to your selected partners.',
    icon: <TrendingUpIcon />,
    category: 'Document Hub',
  },
  {
    question: 'Can I create my own folders and organize documents my own way?',
    answer: 'Yes, you can set up custom folders and organize your Data Room to fit your workflow for the project, based on property type, due-diligence category, or however the team prefers.',
    icon: <BusinessIcon />,
    category: 'Document Hub',
  },
  {
    question: 'When I upload or edit files, do I have to save changes separately?',
    answer: 'Yes, all edits should be saved; otherwise, the changes will not take full effect. Unsaved edits will not be visible to other users or even collaborators.',
    icon: <QuestionAnswerIcon />,
    category: 'Document Hub',
  },
  {
    question: 'Why is there a selection to mark the files as \'Open\' within the secure section?',
    answer: 'The \'Open\' setting is for non-sensitive documents that you want to be visible for all users, without any access approvals, such as brochures, floor plans, or general project summaries.',
    icon: <TrendingUpIcon />,
    category: 'Document Hub',
  },
  {
    question: 'How do investors efficiently browse and review Data Room content?',
    answer: 'Investors can use filters, tags, and the folder structure to find key documents quickly and with ease. The preview also allows them to scan files without downloading, making due diligence a lot easier.',
    icon: <BusinessIcon />,
    category: 'Document Hub',
  },
  {
    question: 'Are tenant details, financials, and other sensitive uploaded documents all subject to access permission settings?',
    answer: 'Yes. The access level you select will be applicable for all files within the Data Room, unless permission for individual documents is changed manually.',
    icon: <QuestionAnswerIcon />,
    category: 'Document Hub',
  },
];

// Investor → Custom Report specific FAQs
const investorCustomReportFaqs = [
  {
    question: 'How do I view a report for my commercial listing?',
    answer: 'You can directly access the comprehensive reports from your listing dashboard. In each property, there is a reporting tab where insights, such as page views, enquiries, and visibility metrics, can be found.',
    icon: <BusinessIcon />,
    category: 'Custom Report',
  },
  {
    question: 'Can I download the reports for offline access?',
    answer: 'Yes, all reports are downloadable in PDF or Excel formats for your use in reviewing performance, updating partners, or including the data in investment presentations.',
    icon: <TrendingUpIcon />,
    category: 'Custom Report',
  },
  {
    question: 'What are the types of reporting formats or templates available?',
    answer: 'CommercialUK supports a range of report styles to suit your needs, including enquiry summaries, marketing performance reports, lead-source breakdowns, and property visibility analytics. You can choose which template works best for your reporting purpose.',
    icon: <QuestionAnswerIcon />,
    category: 'Custom Report',
  },
];

// Investor → Search Property specific FAQs
const investorSearchPropertyFaqs = [
  {
    question: 'How can I receive notifications for new commercial listings and save my searches? What are the steps involved?',
    answer: 'By logging into your CommercialUK account, you can set up alerts and save your search preferences, such as location, property type, or size. When you save it, you\'ll receive automatic alerts whenever there are matching commercial properties.',
    icon: <QuestionAnswerIcon />,
    category: 'Search Property',
  },
  {
    question: 'Is it possible to refine my search for commercial properties using specific keywords?',
    answer: 'You have the option to enter your desired keywords, such as warehouse, retail unit, office floor, or industrial space, but you can also add any feature you desire. It facilitates the search for properties that meet your requirements as a business or investment.',
    icon: <TrendingUpIcon />,
    category: 'Search Property',
  },
  {
    question: 'Can you explain how to locate a property using an address?',
    answer: 'To search for the street name, postcode, or business district, simply enter the complete or partial address. The system will show all available commercial listings in that area.',
    icon: <BusinessIcon />,
    category: 'Search Property',
  },
];

export default function HomeFAQ() {
  const [expanded, setExpanded] = useState<string | false>('panel0');
  const [topTabIndex, setTopTabIndex] = useState<number>(0);
  const [innerTabIndex, setInnerTabIndex] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const tabConfig: { label: string; subTabs: string[] }[] = [
    {
      label: 'AGENT | OWNER PORTAL',
      subTabs: [
        'Profile Management',
        'Targeted Reach',
        'Enquiry Tracking',
        'Payment Details',
        'Listing Promotions',
      ],
    },
    {
      label: 'TENANT PORTAL',
      subTabs: [
        'Profile Management',
        'Find a Property Advisor',
        'Custom Reports',
        'Search Properties',
      ],
    },
    {
      label: 'INVESTOR',
      subTabs: [
        'Document Hub',
        'Custom Report',
        'Search Property',
      ],
    },
  ];

  return (
    <FAQSection>
      <ContentWrapper>
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 4 } }}>
          <Fade in timeout={1000}>
            <Box>
              <SectionTitle
                variant={isMobile ? "h3" : "h2"}
                sx={{
                  fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: isMobile ? '2.25rem' : '3.5rem',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: theme.spacing(3),
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Frequently Asked Questions
              </SectionTitle>
              
              <Subtitle
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: isMobile ? '1.05rem' : '1.35rem',
                  lineHeight: 1.7,
                  letterSpacing: '0.01em',
                  color: '#4a4a4a',
                  maxWidth: '720px',
                  margin: '0 auto',
                  marginBottom: theme.spacing(6),
                }}
              >
                Get answers to the most common questions about commercial real estate investment and business solutions
              </Subtitle>

              {/* Top-level tabs */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 5,
                borderBottom: '1px solid #e8e8e8',
                pb: 1,
              }}>
                <Tabs
                  value={topTabIndex}
                  onChange={(_, v) => {
                    setTopTabIndex(v);
                    setInnerTabIndex(0);
                  }}
                  variant={isMobile ? 'scrollable' : 'standard'}
                  scrollButtons={isMobile ? 'auto' : false}
                  textColor="inherit"
                  TabIndicatorProps={{ 
                    style: { 
                      backgroundColor: '#1a1a1a',
                      height: 3,
                      borderRadius: '2px 2px 0 0',
                    } 
                  }}
               >
                  {tabConfig.map((tab) => (
                    <Tab
                      key={tab.label}
                      label={tab.label}
                      sx={{
                        fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                        fontWeight: 700,
                        textTransform: 'none',
                        color: '#6b6b6b',
                        mx: { xs: 0.5, md: 2 },
                        fontSize: { xs: '0.875rem', md: '0.95rem' },
                        letterSpacing: '0.05em',
                        py: 2,
                        px: { xs: 1.5, md: 3 },
                        minHeight: 56,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          color: '#1a1a1a',
                        },
                        '&.Mui-selected': {
                          color: '#1a1a1a',
                          fontWeight: 800,
                        },
                      }}
                    />
                  ))}
                </Tabs>
              </Box>

              {/* Two-column layout: inner tabs at left, content at right */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '22% 78%' },
                columnGap: { xs: 0, md: 4 },
                rowGap: { xs: 4, md: 0 },
                width: '100%',
                alignItems: 'flex-start',
              }}>
                <Box sx={{ 
                  mt: { xs: 0, md: 1 }, 
                  px: { xs: 2, md: 0 }, 
                  overflowX: { xs: 'auto', md: 'visible' },
                  position: { xs: 'relative', md: 'sticky' },
                  top: { xs: 0, md: 20 },
                  alignSelf: 'flex-start',
                }}>
                  <Tabs
                    orientation={isMobile ? 'horizontal' : 'vertical'}
                    value={innerTabIndex}
                    onChange={(_, v) => setInnerTabIndex(v)}
                    variant={isMobile ? 'scrollable' : 'standard'}
                    scrollButtons={isMobile ? 'auto' : false}
                    sx={{
                      borderRight: { xs: 'none', md: '1px solid #e8e8e8' },
                      pr: { xs: 0, md: 3 },
                      '& .MuiTabs-indicator': { display: 'none' },
                      '& .MuiTab-root': {
                        fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        fontSize: { xs: '0.875rem', md: '0.9375rem' },
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                        py: 1.25,
                        px: { xs: 1.5, md: 2 },
                        borderRadius: { xs: '8px', md: '8px 0 0 8px' },
                        mb: { xs: 1, md: 1.5 },
                        minHeight: 44,
                        width: { xs: 'auto', md: '100%' },
                        minWidth: 'auto',
                        mr: { xs: 1.5, md: 0 },
                        backgroundColor: 'transparent',
                        color: '#6b6b6b',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        textAlign: 'left',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 0,
                          backgroundColor: '#1a1a1a',
                          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          borderRadius: { xs: '8px', md: '8px 0 0 8px' },
                        },
                      },
                      '& .MuiTab-root:hover': {
                        color: '#1a1a1a',
                        backgroundColor: '#f8f8f8',
                        '&:before': {
                          width: 3,
                        },
                      },
                      '& .Mui-selected': {
                        color: '#1a1a1a',
                        fontWeight: 700,
                        backgroundColor: '#f8f8f8',
                        '&:before': {
                          width: 3,
                        },
                      },
                    }}
                  >
                    {tabConfig[topTabIndex].subTabs.map((label) => (
                      <Tab key={label} label={label} />
                    ))}
                  </Tabs>
                </Box>
                <Box sx={{ width: '100%', mt: { xs: 0, md: 0 } }}>
                  <Box sx={{ width: '100%' }}>
                    {(
                      topTabIndex === 0 && innerTabIndex === 0
                        ? profileManagementFaqs
                        : topTabIndex === 0 && innerTabIndex === 1
                        ? targetedReachFaqs
                        : topTabIndex === 0 && innerTabIndex === 2
                        ? enquiryTrackingFaqs
                        : topTabIndex === 0 && innerTabIndex === 3
                        ? paymentDetailsFaqs
                        : topTabIndex === 0 && innerTabIndex === 4
                        ? listingPromotionsFaqs
                        : topTabIndex === 1 && innerTabIndex === 0
                        ? tenantProfileManagementFaqs
                        : topTabIndex === 1 && innerTabIndex === 1
                        ? tenantFindAdvisorFaqs
                        : topTabIndex === 1 && innerTabIndex === 2
                        ? tenantCustomReportsFaqs
                        : topTabIndex === 1 && innerTabIndex === 3
                        ? faqs
                        : topTabIndex === 2 && innerTabIndex === 0
                        ? investorDocumentHubFaqs
                        : topTabIndex === 2 && innerTabIndex === 1
                        ? investorCustomReportFaqs
                        : topTabIndex === 2 && innerTabIndex === 2
                        ? investorSearchPropertyFaqs
                        : faqs
                    ).map((faq, index) => (
                      <Fade in timeout={800 + index * 200} key={index}>
                        <Box sx={{ mb: 2.5 }}>
                          <CustomAccordion
                            expanded={expanded === `panel${index}`}
                            onChange={handleChange(`panel${index}`)}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon sx={{ 
                                  fontSize: '1.75rem',
                                  color: '#1a1a1a',
                                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }} />
                              }
                              sx={{
                                '& .MuiAccordionSummary-content': {
                                  margin: '20px 0',
                                  alignItems: 'center',
                                },
                                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                                  transform: 'rotate(180deg)',
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: 2.5 }}>
                                <IconWrapper>
                                  {faq.icon}
                                </IconWrapper>
                                <Box sx={{ flex: 1, pt: 0.5 }}>
                                  <Typography
                                    variant={isMobile ? "subtitle1" : "h6"}
                                    sx={{
                                      fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                                      fontWeight: 700,
                                      color: '#1a1a1a',
                                      fontSize: { xs: '1.0625rem', md: '1.1875rem' },
                                      lineHeight: 1.5,
                                      letterSpacing: '-0.01em',
                                    }}
                                  >
                                    {faq.question}
                                  </Typography>
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                                  fontWeight: 400,
                                  color: '#4a4a4a',
                                  lineHeight: 1.75,
                                  letterSpacing: '0.01em',
                                  fontSize: { xs: '0.9375rem', md: '1.0625rem' },
                                  pl: { xs: 0, md: 9.5 },
                                }}
                              >
                                {faq.answer}
                              </Typography>
                            </AccordionDetails>
                          </CustomAccordion>
                        </Box>
                      </Fade>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Container>
      </ContentWrapper>
    </FAQSection>
  );
}
