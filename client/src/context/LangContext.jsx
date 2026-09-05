import { createContext, useContext, useState, useCallback } from 'react';

// Feature 23: Bangla / English language toggle.
// A tiny in-app i18n dictionary — t('key') returns the label in the active language.
const STRINGS = {
  en: {
    appName: 'Bachao',
    tagline: 'Coordinating flood & disaster relief in Bangladesh',
    home: 'Live Map',
    postRequest: 'Post Request',
    myRequests: 'My Requests',
    volunteer: 'Volunteer',
    campaigns: 'Campaigns',
    shelters: 'Shelters',
    missing: 'Missing Persons',
    organizations: 'Organizations',
    resourceBoard: 'Resource Board',
    impact: 'Impact',
    admin: 'Admin',
    notifications: 'Notifications',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    sos: 'SOS',
    needType: 'Need type',
    urgency: 'Urgency',
    district: 'District',
    status: 'Status',
    description: 'Description',
    peopleAffected: 'People affected',
    submit: 'Submit',
    all: 'All',
    claim: 'Claim',
    food: 'Food',
    water: 'Water',
    medicine: 'Medicine',
    rescue: 'Rescue',
    shelter: 'Shelter',
    resource: 'Resource',
    normal: 'Normal',
    high: 'High',
    open: 'Open',
    claimed: 'Claimed',
    fulfilled: 'Fulfilled',
    closed: 'Closed',
    filters: 'Filters',
    clickMapToPin: 'Click on the map to pin the location',
    welcome: 'Welcome',
  },
  bn: {
    appName: 'বাঁচাও',
    tagline: 'বাংলাদেশে বন্যা ও দুর্যোগ ত্রাণ সমন্বয়',
    home: 'লাইভ ম্যাপ',
    postRequest: 'সাহায্য চাই',
    myRequests: 'আমার অনুরোধ',
    volunteer: 'স্বেচ্ছাসেবক',
    campaigns: 'ক্যাম্পেইন',
    shelters: 'আশ্রয়কেন্দ্র',
    missing: 'নিখোঁজ ব্যক্তি',
    organizations: 'সংস্থা',
    resourceBoard: 'রিসোর্স বোর্ড',
    impact: 'প্রভাব',
    admin: 'অ্যাডমিন',
    notifications: 'বিজ্ঞপ্তি',
    login: 'লগইন',
    register: 'নিবন্ধন',
    logout: 'লগআউট',
    sos: 'এসওএস',
    needType: 'প্রয়োজনের ধরন',
    urgency: 'জরুরিতা',
    district: 'জেলা',
    status: 'অবস্থা',
    description: 'বিবরণ',
    peopleAffected: 'ক্ষতিগ্রস্ত মানুষ',
    submit: 'জমা দিন',
    all: 'সব',
    claim: 'গ্রহণ করুন',
    food: 'খাবার',
    water: 'পানি',
    medicine: 'ঔষধ',
    rescue: 'উদ্ধার',
    shelter: 'আশ্রয়',
    resource: 'সম্পদ',
    normal: 'সাধারণ',
    high: 'উচ্চ',
    open: 'খোলা',
    claimed: 'গৃহীত',
    fulfilled: 'সম্পন্ন',
    closed: 'বন্ধ',
    filters: 'ফিল্টার',
    clickMapToPin: 'অবস্থান নির্ধারণ করতে ম্যাপে ক্লিক করুন',
    welcome: 'স্বাগতম',
  },
};

const LangContext = createContext(null);

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('bachao_lang') || 'en');

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'en' ? 'bn' : 'en';
      localStorage.setItem('bachao_lang', next);
      return next;
    });
  }, []);

  // Falls back to English, then to the key itself, so a missing key is harmless.
  const t = useCallback((key) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key, [lang]);

  return <LangContext.Provider value={{ lang, toggle, t }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
