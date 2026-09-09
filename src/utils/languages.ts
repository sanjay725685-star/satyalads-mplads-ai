import { Language } from '../types';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  region: string;
}

export const INDIAN_LANGUAGES: LanguageOption[] = [
  // National / Official
  { code: 'en', name: 'English', nativeName: 'English', region: 'Pan-India' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'National / North & Central' },
  
  // Northern & Western
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab, Chandigarh, Delhi' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra, Goa' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat, Daman & Diu' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'Jammu & Kashmir, UP, Telangana' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / کٲشُر', region: 'Jammu & Kashmir' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', region: 'Jammu & Kashmir, Himachal' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', region: 'Goa, Coastal Karnataka' },
  { code: 'sd', name: 'Sindhi', nativeName: 'सिंधी / سنڌي', region: 'Gujarat, Maharashtra, Rajasthan' },

  // Southern
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh, Telangana' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu, Puducherry' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala, Lakshadweep' },

  // Eastern & Central
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal, Tripura, Assam' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', region: 'Bihar, Eastern UP, Jharkhand' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', region: 'Bihar, Jharkhand' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', region: 'Jharkhand, West Bengal, Odisha' },

  // North-Eastern & Himalayan
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Assam' },
  { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'মৈতৈলোন্', region: 'Manipur' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', region: 'Assam, Meghalaya' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', region: 'Sikkim, West Bengal (Darjeeling)' },

  // Classical
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', region: 'Pan-India Classical' },
];

export interface NavTranslations {
  dashboard: string;
  projects: string;
  gis_map: string;
  capture_photo: string;
  before_after: string;
  cartels: string;
  satellite: string;
  transparency: string;
  run_rescan: string;
  scanning: string;
  gov_badge: string;
  role_label: string;
}

export const NAV_TRANSLATIONS: Record<Language, NavTranslations> = {
  en: {
    dashboard: 'Dashboard',
    projects: 'Project Directory',
    gis_map: 'GIS Geo-Map',
    capture_photo: 'Capture Site Photo',
    before_after: 'Before/After Slider',
    cartels: 'Cartel Network',
    satellite: 'Satellite SAR',
    transparency: 'Public Transparency',
    run_rescan: 'Run AI Re-Scan',
    scanning: 'Scanning Data...',
    gov_badge: 'GOVERNMENT OF INDIA • MoSPI',
    role_label: 'AUDITOR'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    projects: 'प्रोजेक्ट डायरेक्टरी',
    gis_map: 'जीआईएस जियो-मैप',
    capture_photo: 'साइट फोटो कैप्चर',
    before_after: 'तुलना स्लाइडर',
    cartels: 'कार्टेल नेटवर्क',
    satellite: 'सैटेलाइट रडार',
    transparency: 'सार्वजनिक पारदर्शिता',
    run_rescan: 'एआई पुनः-स्कैन करें',
    scanning: 'डेटा स्कैन हो रहा है...',
    gov_badge: 'भारत सरकार • सांख्यिकी मंत्रालय (MoSPI)',
    role_label: 'लेखा परीक्षक'
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড',
    projects: 'প্রকল্প ডিরেক্টরি',
    gis_map: 'জিআইএস ভূ-মানচিত্র',
    capture_photo: 'সাইট ছবি তুলুন',
    before_after: 'তুলনা স্লাইডার',
    cartels: 'কার্টেল নেটওয়ার্ক',
    satellite: 'স্যাটেলাইট রাডার',
    transparency: 'জনস্বচ্ছতা পোর্টাল',
    run_rescan: 'এআই পুনরায় স্ক্যান',
    scanning: 'তথ্য স্ক্যান করা হচ্ছে...',
    gov_badge: 'ভারত সরকার • MoSPI',
    role_label: 'নিরীক্ষক'
  },
  te: {
    dashboard: 'డ్యాష్‌బోర్డ్',
    projects: 'ప్రాజెక్ట్ డైరెక్టరీ',
    gis_map: 'జిఐఎస్ మ్యాప్',
    capture_photo: 'సైట్ ఫోటో తీయండి',
    before_after: 'పోలిక స్లైడర్',
    cartels: 'కార్టెల్ నెట్‌వర్క్',
    satellite: 'ఉపగ్రహ రాడార్',
    transparency: 'ప్రజా పారదర్శకత',
    run_rescan: 'AI రీ-స్కాన్ చేయండి',
    scanning: 'డేటా స్కాన్ అవుతోంది...',
    gov_badge: 'భారత ప్రభుత్వం • MoSPI',
    role_label: 'ఆడిటర్'
  },
  mr: {
    dashboard: 'डॅशबोर्ड',
    projects: 'प्रकल्प सूची',
    gis_map: 'जीआयएस नकाशा',
    capture_photo: 'साइट फोटो काढा',
    before_after: 'तुलना स्लाइडर',
    cartels: 'कार्टेल नेटवर्क',
    satellite: 'उपग्रह रडार',
    transparency: 'सार्वजनिक पारदर्शकता',
    run_rescan: 'एआय पुन्हा तपासा',
    scanning: 'तपासणी चालू आहे...',
    gov_badge: 'भारत सरकार • MoSPI',
    role_label: 'लेखापरीक्षक'
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    projects: 'திட்ட அடைவு',
    gis_map: 'ஜிஐஎஸ் வரைபடம்',
    capture_photo: 'தளப் புகைப்படம் எடுக்கவும்',
    before_after: 'ஒப்பீட்டு ஸ்லைடர்',
    cartels: 'கார்டெல் நெட்வொர்க்',
    satellite: 'செயற்கைக்கோள் ரேடார்',
    transparency: 'பொது வெளிப்படைத்தன்மை',
    run_rescan: 'AI மறு-ஸ்கேன் செய்யவும்',
    scanning: 'தரவு ஆய்வு செய்யப்படுகிறது...',
    gov_badge: 'இந்திய அரசு • MoSPI',
    role_label: 'தணிக்கையாளர்'
  },
  ur: {
    dashboard: 'ڈیش بورڈ',
    projects: 'منصوبہ ڈائرکٹری',
    gis_map: 'جی آئی ایس نقشہ',
    capture_photo: 'موقع کی تصویر لیں',
    before_after: 'موازنہ سلائیڈر',
    cartels: 'کارٹیل نیٹ ورک',
    satellite: 'سیٹلائٹ ریڈار',
    transparency: 'عوامی شفافیت',
    run_rescan: 'اے آئی دوبارہ اسکین',
    scanning: 'اسکیننگ جاری ہے...',
    gov_badge: 'حکومت ہند • MoSPI',
    role_label: 'آڈیٹر'
  },
  gu: {
    dashboard: 'ડેશબોર્ડ',
    projects: 'પ્રોજેક્ટ ડિરેક્ટરી',
    gis_map: 'જીઆઇએસ નકશો',
    capture_photo: 'સાઇટ ફોટો લો',
    before_after: 'સરખામણી સ્લાઇડર',
    cartels: 'કાર્ટેલ નેટવર્ક',
    satellite: 'સેટેલાઇટ રડાર',
    transparency: 'જાહેર પારદર્શિતા',
    run_rescan: 'એઆઈ પુનઃ સ્કેન',
    scanning: 'ડેટા સ્કેન થઈ રહ્યો છે...',
    gov_badge: 'ભારત સરકાર • MoSPI',
    role_label: 'ઓડિટર'
  },
  kn: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    projects: 'ಯೋಜನೆ ಡೈರೆಕ್ಟರಿ',
    gis_map: 'ಜಿಐಎಸ್ ನಕ್ಷೆ',
    capture_photo: 'ಸೈಟ್ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    before_after: 'ಹೋಲಿಕೆ ಸ್ಲೈಡರ್',
    cartels: 'ಕಾರ್ಟೆಲ್ ನೆಟ್‌ವರ್ಕ್',
    satellite: 'ಉಪಗ್ರಹ ರೇಡಾರ್',
    transparency: 'ಸಾರ್ವಜನಿಕ ಪಾರದರ್ಶಕತೆ',
    run_rescan: 'AI ಮರು-ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    scanning: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    gov_badge: 'ಭಾರತ ಸರ್ಕಾರ • MoSPI',
    role_label: 'ಲೆಕ್ಕ ಪರಿಶೋಧಕ'
  },
  ml: {
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    projects: 'പദ്ധതി ഡയറക്ടറി',
    gis_map: 'ജിഐഎസ് ഭൂപടം',
    capture_photo: 'സൈറ്റ് ഫോട്ടോ എടുക്കുക',
    before_after: 'താരതമ്യ സ്ലൈഡർ',
    cartels: 'കാർട്ടൽ ശൃംഖല',
    satellite: 'ഉപഗ്രഹ റഡാർ',
    transparency: 'പൊതു സുതാര്യത',
    run_rescan: 'AI വീണ്ടും സ്കാൻ ചെയ്യുക',
    scanning: 'ഡാറ്റ സ്കാൻ ചെയ്യുന്നു...',
    gov_badge: 'ഭാരത സർക്കാർ • MoSPI',
    role_label: 'ഓഡിറ്റർ'
  },
  or: {
    dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    projects: 'ପ୍ରକଳ୍ପ ଡିରେକ୍ଟୋରୀ',
    gis_map: 'ଜିଆଇଏସ ମାନଚିତ୍ର',
    capture_photo: 'ସାଇଟ୍ ଫଟୋ ନିଅନ୍ତୁ',
    before_after: 'ତୁଳନା ସ୍ଲାଇଡର୍',
    cartels: 'କାର୍ଟେଲ ନେଟୱର୍କ',
    satellite: 'ଉପଗ୍ରହ ରାଡାର',
    transparency: 'ସାର୍ବଜନୀନ ସ୍ୱଚ୍ଛତା',
    run_rescan: 'AI ପୁନଃ-ସ୍କାନ୍ କରନ୍ତୁ',
    scanning: 'ଡାଟା ଯାଞ୍ଚ ହେଉଛି...',
    gov_badge: 'ଭାରତ ସରକାର • MoSPI',
    role_label: 'ଅଡିଟର'
  },
  pa: {
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    projects: 'ਪ੍ਰੋਜੈਕਟ ਡਾਇਰੈਕਟਰੀ',
    gis_map: 'ਜੀਆਈਐਸ ਨਕਸ਼ਾ',
    capture_photo: 'ਸਾਈਟ ਫੋਟੋ ਲਵੋ',
    before_after: 'ਤੁਲਨਾ ਸਲਾਈਡਰ',
    cartels: 'ਕਾਰਟੈਲ ਨੈੱਟਵਰਕ',
    satellite: 'ਸੈਟੇਲਾਈਟ ਰਾਡਾਰ',
    transparency: 'ਜਨਤਕ ਪਾਰਦਰਸ਼ਤਾ',
    run_rescan: 'AI ਮੁੜ ਸਕੈਨ ਕਰੋ',
    scanning: 'ਸਕੈਨਿੰਗ ਚੱਲ ਰਹੀ ਹੈ...',
    gov_badge: 'ਭਾਰਤ ਸਰਕਾਰ • MoSPI',
    role_label: 'ਆਡੀਟਰ'
  },
  as: {
    dashboard: 'ডেশ্ববৰ্ড',
    projects: 'প্ৰকল্প ডাইৰেক্টৰি',
    gis_map: 'জিআইএছ মেপ',
    capture_photo: 'ছাইট ফটো তোলক',
    before_after: 'তুলনা স্লাইডাৰ',
    cartels: 'কাৰ্টেল নেটৱৰ্ক',
    satellite: 'উপগ্ৰহ ৰাডাৰ',
    transparency: 'ৰাজহুৱা স্বচ্ছতা',
    run_rescan: 'AI পুনৰ স্কেন কৰক',
    scanning: 'তথ্য স্কেন হৈ আছে...',
    gov_badge: 'ভাৰত চৰকাৰ • MoSPI',
    role_label: 'হিচাপ পৰীক্ষক'
  },
  bho: {
    dashboard: 'डैशबोर्ड',
    projects: 'परियोजना सूची',
    gis_map: 'जीआईएस नक्शा',
    capture_photo: 'साइट फोटो खींचीं',
    before_after: 'तुलना स्लाइडर',
    cartels: 'ठेकेदार सिंडिकेट',
    satellite: 'सैटेलाइट जांच',
    transparency: 'जनता पारदर्शिता',
    run_rescan: 'AI फेर से जांच करीं',
    scanning: 'जांच चल रहल बा...',
    gov_badge: 'भारत सरकार • MoSPI',
    role_label: 'ऑडिटर'
  },
  mai: {
    dashboard: 'डैशबोर्ड',
    projects: 'प्रोजेक्ट सूची',
    gis_map: 'जीआईएस नक्शा',
    capture_photo: 'साइट फोटो खींचू',
    before_after: 'तुलना स्लाइडर',
    cartels: 'कार्टेल सिंडिकेट',
    satellite: 'उपग्रह रडार',
    transparency: 'सार्वजनिक पारदर्शिता',
    run_rescan: 'एआई फेर सं जांच',
    scanning: 'जांच भ रहल अछि...',
    gov_badge: 'भारत सरकार • MoSPI',
    role_label: 'लेखा परीक्षक'
  },
  sa: {
    dashboard: 'फलकम् (Dashboard)',
    projects: 'परियोजना निर्देशिका',
    gis_map: 'भूस्थानिक मानचित्रम्',
    capture_photo: 'स्थानचित्र ग्रहणम्',
    before_after: 'तुलना फलकम्',
    cartels: 'व्यापारिक संघजालम्',
    satellite: 'उपग्रह रडार',
    transparency: 'सार्वजनिक स्वच्छता',
    run_rescan: 'एआई पुनर्परीक्षणम्',
    scanning: 'परीक्षणं प्रचलति...',
    gov_badge: 'भारतसर्वकारः • MoSPI',
    role_label: 'लेखापरीक्षकः'
  },
  ks: {
    dashboard: 'ڈیش بورڈ',
    projects: 'منصوبہ فہرست',
    gis_map: 'جی آی ایس نقشہ',
    capture_photo: 'فوٹو تلِو',
    before_after: 'مقابلہ سلائیڈر',
    cartels: 'ٹھیکیدار نیٹ ورک',
    satellite: 'سیٹلائٹ رڈار',
    transparency: 'عوامی شفافیت',
    run_rescan: 'اے آی دوبار جانچ',
    scanning: 'جانچ چلیوان چھ...',
    gov_badge: 'حکومت ہند • MoSPI',
    role_label: 'آڈیٹر'
  },
  ne: {
    dashboard: 'ड्यासबोर्ड',
    projects: 'आयोजना निर्देशिका',
    gis_map: 'जीआईएस नक्सा',
    capture_photo: 'साइट फोटो खिच्नुहोस्',
    before_after: 'तुलना स्लाइडर',
    cartels: 'कार्टेल सञ्जाल',
    satellite: 'उपग्रह रडार',
    transparency: 'सार्वजनिक पारदर्शिता',
    run_rescan: 'AI पुन: जाँच गर्नुहोस्',
    scanning: 'जाँच भइरहेको छ...',
    gov_badge: 'भारत सरकार • MoSPI',
    role_label: 'लेखा परीक्षक'
  },
  kok: {
    dashboard: 'डॅशबोर्ड',
    projects: 'प्रकल्प सूची',
    gis_map: 'जीआयएस नकाशा',
    capture_photo: 'जागेचो फोटो काढा',
    before_after: 'तुलना स्लाइडर',
    cartels: 'कार्टेल जाळें',
    satellite: 'उपग्रह रडार',
    transparency: 'लोकांखातीर पारदर्शकता',
    run_rescan: 'एआय परतून तपासा',
    scanning: 'तपासणी चालू आसा...',
    gov_badge: 'भारत सरकार • MoSPI',
    role_label: 'लेखापरीक्षक'
  },
  sd: {
    dashboard: 'ڊيش بورڊ',
    projects: 'پروجيڪٽ ڊائريڪٽري',
    gis_map: 'جي آءِ ايس نقشو',
    capture_photo: 'سائيٽ جو فوٽو ڪڍو',
    before_after: 'موازنو سلائيڊر',
    cartels: 'ڪارٽيل نيٽ ورڪ',
    satellite: 'سيٽلائيٽ رڊار',
    transparency: 'عوامي شفافيت',
    run_rescan: 'AI ٻيهر اسڪين',
    scanning: 'اسڪيننگ جاري آهي...',
    gov_badge: 'حڪومت هند • MoSPI',
    role_label: 'آڊيٽر'
  },
  doi: {
    dashboard: 'डैशबोर्ड',
    projects: 'प्रोजेक्ट डायरेक्टरी',
    gis_map: 'जीआईएस नक्शा',
    capture_photo: 'जगह दी फोटो खैंचो',
    before_after: 'तुलना स्लाइडर',
    cartels: 'ठेकेदार संगठन',
    satellite: 'उपग्रह रडार',
    transparency: 'लोक पारदर्शिता',
    run_rescan: 'एआई परतै जांचो',
    scanning: 'जांच चलदी पेई ऐ...',
    gov_badge: 'भारत सरकार • MoSPI',
    role_label: 'ऑडिटर'
  },
  mni: {
    dashboard: 'ড্যাশবোর্ড',
    projects: 'প্রোজেক্ট লিষ্ট',
    gis_map: 'জিআইএস মেপ',
    capture_photo: 'ফোটো লৌবীয়ু',
    before_after: 'চাংদম্নবা স্লাইডার',
    cartels: 'কার্টেল নেটওয়ার্ক',
    satellite: 'সেটেলাইট রাডার',
    transparency: 'মীয়ামগী শেংদোকপা',
    run_rescan: 'AI অমুক হন্না য়েংশিনবা',
    scanning: 'য়েংশিল্লি...',
    gov_badge: 'ভারত সরকার • MoSPI',
    role_label: 'অডিটর'
  },
  brx: {
    dashboard: 'डेशबोर्ड',
    projects: 'हाबाफारिनि फारिलाइ',
    gis_map: 'जीआईएस मेप',
    capture_photo: 'जायगानि फोटो ला',
    before_after: 'रुजुनाय स्लाइदार',
    cartels: 'ठेकादारनि हान्जा',
    satellite: 'उपग्रह रडार',
    transparency: 'मख्लाम सोरांथि',
    run_rescan: 'AI फिन नायगिरनाय',
    scanning: 'नायगिरनाय सोलिगासिनो...',
    gov_badge: 'भारत सरकार • MoSPI',
    role_label: 'अडिटार'
  },
  sat: {
    dashboard: 'ᱰᱮᱥᱵᱳᱨᱰ',
    projects: 'ᱯᱨᱚᱡᱮᱠᱴ ᱛᱟᱹᱞᱠᱟᱹ',
    gis_map: 'ᱡᱤᱟᱭᱤᱮᱥ ᱱᱚᱠᱥᱟ',
    capture_photo: 'ᱪᱤᱛᱟᱹᱨ ᱦᱟᱛᱟᱣ ᱢᱮ',
    before_after: 'ᱛᱩᱞᱟᱹᱡᱚᱠᱷᱟ ᱥᱞᱟᱭᱰᱟᱨ',
    cartels: 'ᱠᱟᱨᱴᱮᱞ ᱱᱮᱴᱣᱟᱨᱠ',
    satellite: 'ᱥᱟᱴᱮᱞᱟᱭᱤᱴ ᱨᱟᱰᱟᱨ',
    transparency: 'ᱨᱟᱡᱽ ᱥᱟᱯᱷᱟ',
    run_rescan: 'AI ᱟᱨᱦᱚᱸ ᱧᱮᱞ ᱵᱤᱰᱟᱹᱣ',
    scanning: 'ᱧᱮᱞ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ...',
    gov_badge: 'ᱥᱤᱧᱚᱛ ᱥᱚᱨᱠᱟᱨ • MoSPI',
    role_label: 'ᱚᱰᱤᱴᱟᱨ'
  }
};

export const getNavTranslations = (lang: Language): NavTranslations => {
  return NAV_TRANSLATIONS[lang] || NAV_TRANSLATIONS.en;
};
