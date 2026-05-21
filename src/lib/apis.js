export const CATEGORY_COLORS = {
  'Telecom': 'from-blue-500 to-cyan-500',
  'OSINT': 'from-red-500 to-rose-600',
  'Vehicle': 'from-orange-500 to-amber-500',
  'Social Media': 'from-purple-500 to-pink-500',
  'Banking': 'from-emerald-500 to-green-600',
  'Email': 'from-yellow-500 to-orange-500',
  'Education': 'from-teal-500 to-cyan-600',
  'Identity': 'from-indigo-500 to-blue-600',
  'Location': 'from-lime-500 to-green-500',
  'Finance': 'from-violet-500 to-purple-600',
  'Business': 'from-slate-500 to-gray-600',
  'Security': 'from-red-600 to-orange-600',
}

export const APIS = [
  // Telecom
  { id: 1, name: 'Mobile Number OSINT', category: 'Telecom', price: 399, icon: '📱', description: 'Get full name, carrier, location and registration date from any Indian mobile number.' },
  { id: 2, name: 'Truecaller Premium API', category: 'Telecom', price: 499, icon: '📞', description: 'Access Truecaller database: name, address, spam score, business info for any number.' },
  { id: 3, name: 'SIM Owner Lookup', category: 'Telecom', price: 349, icon: '🔎', description: 'Find registered name and address of Indian SIM card owners.' },
  { id: 4, name: 'IMEI Tracker API', category: 'Telecom', price: 599, icon: '📡', description: 'Track device info, brand, model and network from IMEI number lookup.' },
  { id: 5, name: 'Call Detail Records', category: 'Telecom', price: 799, icon: '📋', description: 'Retrieve CDR summaries and call analytics for compliance and security purposes.' },
  { id: 6, name: 'Number Portability API', category: 'Telecom', price: 299, icon: '📲', description: 'Check if a number is ported, current carrier, porting history.' },
  // Identity
  { id: 7, name: 'Aadhaar Verify API', category: 'Identity', price: 449, icon: '🪪', description: 'Verify Aadhaar card details including name, DOB, gender and masked number.' },
  { id: 8, name: 'PAN Card Lookup', category: 'Identity', price: 399, icon: '🗂️', description: 'PAN verification: linked name, DOB, and income tax status.' },
  { id: 9, name: 'Voter ID Lookup', category: 'Identity', price: 349, icon: '🗳️', description: 'Verify voter ID card: EPIC number, constituency, polling station info.' },
  { id: 10, name: 'Passport Verify API', category: 'Identity', price: 499, icon: '📕', description: 'Validate Indian passports: holder name, issue date, expiry, and status.' },
  { id: 11, name: 'Driving License API', category: 'Identity', price: 349, icon: '🚗', description: 'DL verification: name, vehicle class, validity, RTO details.' },
  // Vehicle
  { id: 12, name: 'Vehicle RC Lookup', category: 'Vehicle', price: 349, icon: '🚘', description: 'Get vehicle registration details: owner name, model, fuel type, insurance status.' },
  { id: 13, name: 'Challan Check API', category: 'Vehicle', price: 299, icon: '🚨', description: 'Check pending traffic challans for any vehicle by registration number.' },
  { id: 14, name: 'Fastag Status API', category: 'Vehicle', price: 249, icon: '🛣️', description: 'Check FASTag balance, toll transactions, and vehicle tag status.' },
  { id: 15, name: 'Vehicle Insurance API', category: 'Vehicle', price: 399, icon: '🛡️', description: 'Verify vehicle insurance: policy number, validity, insurer details.' },
  // Social Media
  { id: 16, name: 'Instagram OSINT', category: 'Social Media', price: 549, icon: '📸', description: 'Username lookup: followers, following, bio, posts, account creation date.' },
  { id: 17, name: 'WhatsApp Checker', category: 'Social Media', price: 399, icon: '💬', description: 'Check if a number has WhatsApp, profile pic visibility, and status.' },
  { id: 18, name: 'Telegram Username API', category: 'Social Media', price: 449, icon: '✈️', description: 'Lookup Telegram accounts by username or phone: bio, group membership, status.' },
  { id: 19, name: 'Facebook Profile API', category: 'Social Media', price: 499, icon: '👤', description: 'Get Facebook profile data: name, location, employment history and mutual info.' },
  { id: 20, name: 'LinkedIn Lookup', category: 'Social Media', price: 599, icon: '💼', description: 'Professional profile lookup: job title, company, skills, education.' },
  { id: 21, name: 'Twitter/X OSINT API', category: 'Social Media', price: 449, icon: '🐦', description: 'Account details, tweet history, followers, and location data from X (Twitter).' },
  // Banking / Finance
  { id: 22, name: 'Bank Account Verify', category: 'Banking', price: 349, icon: '🏦', description: 'Verify bank account + IFSC: account holder name and account validity.' },
  { id: 23, name: 'UPI ID Lookup', category: 'Banking', price: 299, icon: '💸', description: 'Get registered name from any UPI ID instantly.' },
  { id: 24, name: 'IFSC Details API', category: 'Banking', price: 199, icon: '🏧', description: 'Get bank name, branch, address and MICR from any IFSC code.' },
  { id: 25, name: 'GST Number Verify', category: 'Finance', price: 349, icon: '📊', description: 'Verify GSTIN: business name, state, registration date, filing status.' },
  { id: 26, name: 'ITR Lookup API', category: 'Finance', price: 599, icon: '📁', description: 'Income Tax Return verification and compliance status check API.' },
  // Email
  { id: 27, name: 'Email Breach Finder', category: 'Email', price: 349, icon: '📧', description: 'Check if an email was involved in data breaches with source details.' },
  { id: 28, name: 'Email Validator API', category: 'Email', price: 199, icon: '✉️', description: 'Validate email deliverability, catch-all detection, MX record check.' },
  { id: 29, name: 'Email-to-Name API', category: 'Email', price: 449, icon: '🔍', description: 'Reverse lookup: find person info from an email address across databases.' },
  // Location
  { id: 30, name: 'IP Geolocation API', category: 'Location', price: 249, icon: '🌐', description: 'Get ISP, city, region, coordinates and timezone from any IP address.' },
  { id: 31, name: 'Pincode Lookup API', category: 'Location', price: 149, icon: '📍', description: 'Get district, state, taluka, nearby offices from Indian pincode.' },
  // Education
  { id: 32, name: 'Mark Sheet Verifier', category: 'Education', price: 449, icon: '📜', description: 'Verify 10th/12th mark sheets from major Indian boards via roll number.' },
  { id: 33, name: 'Degree Certificate API', category: 'Education', price: 499, icon: '🎓', description: 'Verify graduation/PG degree certificates from NAD and DigiLocker.' },
  // Business
  { id: 34, name: 'MCA Company Lookup', category: 'Business', price: 399, icon: '🏢', description: 'Get company details from MCA: CIN, directors, paid-up capital, ROC info.' },
  { id: 35, name: 'Startup India Verify', category: 'Business', price: 299, icon: '🚀', description: 'Verify DPIIT startup recognition status and certificate details.' },
  // Security
  { id: 36, name: 'Criminal Record API', category: 'Security', price: 699, icon: '🔒', description: 'Check police records, FIR history and court cases by name/Aadhaar.' },
  { id: 37, name: 'Cyber Crime Lookup', category: 'Security', price: 599, icon: '🕵️', description: 'Check if a number or account is flagged in cybercrime databases.' },
  { id: 38, name: 'Face Match API', category: 'Security', price: 499, icon: '😶', description: 'Compare two face images with AI-powered similarity scoring.' },
]
