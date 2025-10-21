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
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '4px',
    backgroundColor: '#333',
    borderRadius: '2px',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: '#666',
  textAlign: 'center',
  maxWidth: '600px',
  margin: '0 auto',
  marginBottom: theme.spacing(6),
}));

const CustomAccordion = styled(Accordion)(({ theme }) => ({
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
  backgroundColor: 'white',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    borderColor: '#333',
  },
  '& .MuiAccordionSummary-root': {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2, 3),
    '&.Mui-expanded': {
      minHeight: 'auto',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(3, 3, 4),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: '#333',
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
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#333',
  marginRight: theme.spacing(2),
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#1a1a1a',
    transform: 'scale(1.05)',
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
    question: 'Is CommercialUK Available for International Property Searches?',
    answer: 'Yes, CommercialUK operates globally with dedicated platforms in the UK, Canada, France, and Spain. Our international presence allows you to search for commercial real estate properties across multiple countries, with localized content and currency options.',
    icon: <BusinessIcon />,
    category: 'Global Reach',
  },
  {
    question: 'Office Space or Coworking: Which Fits Your Business Needs?',
    answer: 'The choice between traditional office space and coworking depends on your business size, growth plans, and operational needs. Traditional offices offer privacy and customization, while coworking spaces provide flexibility and networking opportunities.',
    icon: <TrendingUpIcon />,
    category: 'Business Solutions',
  },
  {
    question: 'What Should I Know Before Investing in Multifamily Properties?',
    answer: 'Multifamily property investment requires understanding market dynamics, property management, financing options, and local regulations. Key factors include location analysis, cash flow projections, and tenant management strategies.',
    icon: <QuestionAnswerIcon />,
    category: 'Investment',
  },
  {
    question: 'How Do I Evaluate Commercial Property Investment Returns?',
    answer: 'Commercial property returns are evaluated through metrics like cap rates, cash-on-cash returns, and internal rate of return (IRR). Consider factors like location, tenant quality, lease terms, and market conditions for comprehensive analysis.',
    icon: <TrendingUpIcon />,
    category: 'Investment',
  },
  {
    question: 'What Are the Key Factors in Commercial Real Estate Due Diligence?',
    answer: 'Due diligence includes property inspection, financial analysis, market research, legal review, environmental assessment, and tenant evaluation. This comprehensive process helps identify potential risks and opportunities before investment.',
    icon: <BusinessIcon />,
    category: 'Due Diligence',
  },
  {
    question: 'How Can I Find the Right Commercial Real Estate Agent?',
    answer: 'Look for agents with local market expertise, proven track record, strong network, and specialization in your property type. Check credentials, references, and ensure they understand your specific investment goals and timeline.',
    icon: <QuestionAnswerIcon />,
    category: 'Professional Services',
  },
];

// Agent → Profile Management specific FAQs
const profileManagementFaqs = [
  {
    question: 'How do I delegate another user to handle my listing?',
    answer: 'Assign listing permissions and access to team members.',
    icon: <QuestionAnswerIcon />,
    category: 'Profile Management',
  },
  {
    question: 'How do I modify my CommercialUK profile?',
    answer: 'Modify your business name, description, and contact information.',
    icon: <BusinessIcon />,
    category: 'Profile Management',
  },
  {
    question: 'How do I edit my email, password, or login credentials?',
    answer: 'Easily update account credentials and contact information.',
    icon: <QuestionAnswerIcon />,
    category: 'Profile Management',
  },
  {
    question: 'Where do I edit my business information?',
    answer: 'Update business information like address, phone, and brand.',
    icon: <BusinessIcon />,
    category: 'Profile Management',
  },
  {
    question: 'Why am I receiving an invalid login error?',
    answer: 'Resolve frequent sign-in problems and login errors.',
    icon: <TrendingUpIcon />,
    category: 'Profile Management',
  },
  {
    question: 'I forgot my password. How do I reset it?',
    answer: 'Utilise the password recovery tool to regain access to your account.',
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
      'You can modify your payment method at any time from your CommercialUK account. Log in to your account, navigate to Billing & Payments within settings, choose Update Payment Method, provide your new card or direct debit details, and save. Your new method will be used for future transactions.',
    icon: <BusinessIcon />,
    category: 'Payment Details',
  },
  {
    question: 'How do I print or download my invoice?',
    answer:
      "Log in to your CommercialUK account, go to Billing & Payments, click Invoices/Receipts, select the invoice you want, and choose Download PDF or Print Invoice. Your invoices remain available in your account history.",
    icon: <QuestionAnswerIcon />,
    category: 'Payment Details',
  },
  {
    question: "What if my payment doesn't go through?",
    answer:
      "If a payment fails, you'll receive an email. Verify your payment method details, ensure sufficient funds/credit, and try reprocessing the payment from Billing & Payments. If it still fails, contact CommercialUK Support for assistance.",
    icon: <TrendingUpIcon />,
    category: 'Payment Details',
  },
  {
    question: 'Can I change my billing cycle (monthly/yearly)?',
    answer:
      'Yes. Visit Billing & Payments, choose Manage Subscription, pick Monthly or Annual billing, and confirm. The new cycle applies from your next renewal date.',
    icon: <BusinessIcon />,
    category: 'Payment Details',
  },
];

// Agent → Listing Promotions (My Listings) specific FAQs
const listingPromotionsFaqs = [
  {
    question: 'How do I add and modify a commercial property listing?',
    answer:
      'Log in to your CommercialUK account. Select Create Listing from your dashboard. Add property details (location, size, price, type, description) and supporting documents (images, floor plans, brochures). Save and publish. To modify, open My Listings, edit the listing, and Save — changes take effect immediately.',
    icon: <TrendingUpIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I delete my property listing?',
    answer:
      'Go to My Listings, select the property, click Delete Listing, and confirm. Warning: deleted listings cannot be recovered.',
    icon: <QuestionAnswerIcon />,
    category: 'Listing Promotions',
  },
  {
    question: 'How do I update contacts on my listing?',
    answer:
      'Open the property in My Listings, go to Contact Information, add/edit/remove contacts, then Save. This ensures enquiries are routed to the correct person.',
    icon: <BusinessIcon />,
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
                  fontWeight: 800,
                  fontSize: isMobile ? '2rem' : '3rem',
                  lineHeight: 1.2,
                  marginBottom: theme.spacing(2),
                }}
              >
                Frequently Asked Questions
              </SectionTitle>
              
              <Subtitle
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  fontSize: isMobile ? '1rem' : '1.25rem',
                  lineHeight: 1.6,
                }}
              >
                Get answers to the most common questions about commercial real estate investment and business solutions
              </Subtitle>

              {/* Top-level tabs */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Tabs
                  value={topTabIndex}
                  onChange={(_, v) => {
                    setTopTabIndex(v);
                    setInnerTabIndex(0);
                  }}
                  variant={isMobile ? 'scrollable' : 'standard'}
                  scrollButtons={isMobile ? 'auto' : false}
                  textColor="inherit"
                  TabIndicatorProps={{ style: { backgroundColor: '#333' } }}
               >
                  {tabConfig.map((tab) => (
                    <Tab
                      key={tab.label}
                      label={tab.label}
                      sx={{
                        fontWeight: 700,
                        textTransform: 'none',
                        color: '#1a1a1a',
                        mx: 1,
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        py: 1.5,
                      }}
                    />
                  ))}
                </Tabs>
              </Box>

              {/* Two-column layout: inner tabs at left, content at right */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '20% 80%' },
                columnGap: { xs: 0, md: 2 },
                rowGap: { xs: 12, md: 0 },
                width: '100%'
              }}>
                <Box sx={{ mt: { xs: 0, md: 0 }, px: { xs: 2, md: 0 }, overflowX: { xs: 'auto', md: 'visible' } }}>
                  <Tabs
                    orientation={isMobile ? 'horizontal' : 'vertical'}
                    value={innerTabIndex}
                    onChange={(_, v) => setInnerTabIndex(v)}
                    variant={isMobile ? 'scrollable' : 'standard'}
                    scrollButtons={isMobile ? 'auto' : false}
                    sx={{
                      borderRight: 'none',
                      '& .MuiTabs-indicator': { display: 'none' },
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        py: 0.75,
                        px: { xs: 0.5, md: 0 },
                        borderRadius: 0,
                        mb: { xs: 0, md: 2 },
                        minHeight: 36,
                        width: { xs: 'auto', md: 'fit-content' },
                        minWidth: 'auto',
                        mr: { xs: 2.5, md: 0 },
                        backgroundColor: 'transparent',
                        transition: 'color 0.2s ease',
                        position: 'relative',
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          right: 'auto',
                          bottom: 0,
                          height: 2,
                          width: '100%',
                          backgroundColor: 'transparent',
                          transition: 'background-color 0.2s ease',
                        },
                      },
                      '& .MuiTab-root:hover': {
                        color: '#000',
                        '&:after': { backgroundColor: '#bbb' },
                      },
                      '& .Mui-selected': {
                        color: '#1a1a1a',
                        fontWeight: 800,
                        backgroundColor: 'transparent',
                        '&:after': { backgroundColor: '#1a1a1a' },
                      },
                    }}
                  >
                    {tabConfig[topTabIndex].subTabs.map((label) => (
                      <Tab key={label} label={label} />
                    ))}
                  </Tabs>
                </Box>
                <Box sx={{ width: '100%', mt: { xs: 0, md: 0 }, pl: { xs: 0, md: 2 } }}>
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
                        : faqs
                    ).map((faq, index) => (
                      <Fade in timeout={800 + index * 200} key={index}>
                        <Box>
                          <CustomAccordion
                            expanded={expanded === `panel${index}`}
                            onChange={handleChange(`panel${index}`)}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                '& .MuiAccordionSummary-content': {
                                  margin: '16px 0',
                                  alignItems: 'center',
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <IconWrapper>
                                  {faq.icon}
                                </IconWrapper>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Chip
                                      label={faq.category}
                                      size="small"
                                      sx={{
                                        backgroundColor: '#333',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        '&:hover': {
                                          backgroundColor: '#1a1a1a',
                                        },
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant={isMobile ? "subtitle1" : "h6"}
                                    sx={{
                                      fontWeight: 600,
                                      color: '#1a1a1a',
                                      fontSize: isMobile ? '1rem' : '1.1rem',
                                      lineHeight: 1.4,
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
                                  color: '#555',
                                  lineHeight: 1.7,
                                  fontSize: isMobile ? '0.95rem' : '1rem',
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
