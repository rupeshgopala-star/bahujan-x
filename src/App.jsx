import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { uploadToCloudinary } from './utils/cloudinary';
import { 
  Home, BookOpen, Video, FileText, User, Search, Bell, Bookmark, Download, 
  Settings, LogOut, ChevronRight, Play, Heart, Share2, MessageSquare, Plus, 
  Trash2, Edit, Sun, Moon, ArrowLeft, Menu, X, Shield, Lock, Eye, Filter, CheckCircle,
  CreditCard, Gift, HeartHandshake, Volume2, Sparkles, Send, Award, Share, Smartphone, QrCode,
  Globe, Layers, DollarSign, ExternalLink, ToggleLeft, ToggleRight, Image, Upload,
  Link as LinkIcon, Palette, Type, Database, Key, Camera, Phone, Mail, LogIn, Save, 
  RefreshCw, Zap, Layout, Monitor, UserPlus
} from 'lucide-react';

export default function App() {
  // ==================== ORIGINAL STATES ====================
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [adminTab, setAdminTab] = useState('splash_quote');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [selectedMahapurush, setSelectedMahapurush] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [pdfReaderOpen, setPdfReaderOpen] = useState(false);
  const [donationModal, setDonationModal] = useState(false);
  const [customDonation, setCustomDonation] = useState('501');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [appConfig, setAppConfig] = useState({
    splashTitle: "Bahujan X",
    splashTagline: "ज्ञान • विचार • संघर्ष • सम्मान",
    splashSubtext: "Empowering Bahujan Society with Knowledge",
    quoteOfTheDay: "Shikshit Bano, Sangathit Raho, Sangharsh Karo!",
    quoteAuthor: "Dr. B. R. Ambedkar",
    quoteImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    enableAds: true,
    adBannerText: "Sponsored: Support Bahujan Education Foundation - Donate Today",
    adBannerLink: "https://example.com/donate",
    logoUrl: "",
    logoText: "B",
    primaryColor: "#2563eb",
    accentColor: "#f59e0b",
    fontFamily: "Inter",
    theme: "dark",
    upiId: "rikive@upi",
    adminPin: "1234"
  });

  const [customPages, setCustomPages] = useState([
    { id: 'p1', title: 'Volunteers Group', content: 'Join local city volunteers team for social work and educational rallies.' },
    { id: 'p2', title: 'Press Releases', content: 'Latest official announcements regarding Bahujan X mission and events.' }
  ]);

  const [socialLinks, setSocialLinks] = useState([
    { id: 's1', platform: 'YouTube Channel', url: 'https://youtube.com', active: true },
    { id: 's2', platform: 'Telegram Group', url: 'https://t.me', active: true },
    { id: 's3', platform: 'WhatsApp Community', url: 'https://whatsapp.com', active: true },
    { id: 's4', platform: 'Twitter / X', url: 'https://x.com', active: true }
  ]);

  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageContent, setNewPageContent] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  const [communityPosts, setCommunityPosts] = useState([
    {
      id: '1',
      author: 'Bahujan Mission Team',
      time: '2 hrs ago',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content: 'Shikshit Bano, Sangathit Raho, Sangharsh Karo! Dr. Ambedkar ke is vichar ko ghar-ghar pahuchane me hamara sahayog karein.',
      likes: 142,
      comments: 28,
      isLiked: false,
      badge: 'Verified Admin'
    },
    {
      id: '2',
      author: 'Ravi Kumar Dalit',
      time: '5 hrs ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      content: 'Shiksha hi vah sherni ka doodh hai jo piyega vah daahdega. Aaj se hi e-library se e-books padhna shuru karein!',
      likes: 89,
      comments: 12,
      isLiked: true,
      badge: 'Member'
    }
  ]);
  const [newPostText, setNewPostText] = useState('');

  const [mahapurushList, setMahapurushList] = useState([
    {
      id: '1',
      name: 'Dr. B. R. Ambedkar',
      title: 'Babasaheb / Constitution Maker',
      years: '1891 - 1956',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      bio: 'Dr. Bhimrao Ramji Ambedkar, known as Babasaheb, was an Indian jurist, economist, politician, and social reformer who inspired the Dalit Buddhist movement and campaigned against social discrimination.',
      quotes: 'Shikshit Bano, Sangathit Raho, Sangharsh Karo!',
      timeline: [
        { year: '1891', event: 'Born in Mhow, Madhya Pradesh' },
        { year: '1916', event: 'Obtained Ph.D / M.A. from Columbia University' },
        { year: '1927', event: 'Led Mahad Satyagraha for water rights' },
        { year: '1947', event: 'Appointed Chairman of Drafting Committee' },
        { year: '1956', event: 'Embraced Buddhism at Nagpur with lakhs of followers' }
      ]
    },
    {
      id: '2',
      name: 'Mahatma Jyotirao Phule',
      title: 'Social Reformer & Thinker',
      years: '1827 - 1890',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Jyotirao Govindrao Phule was an Indian social activist, thinker, anti-caste social reformer and writer from Maharashtra. He worked tirelessly for girls education and untouchability eradication.',
      quotes: 'Vidyebina mati geli, matibina neeti geli...',
      timeline: [
        { year: '1827', event: 'Born in Katgun, Maharashtra' },
        { year: '1848', event: 'Opened first school for girls in Bhide Wada, Pune' },
        { year: '1873', event: 'Founded Satyashodhak Samaj for justice' }
      ]
    },
    {
      id: '3',
      name: 'Krantijyoti Savitribai Phule',
      title: 'First Female Teacher of India',
      years: '1831 - 1897',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      bio: 'Savitribai Phule was a pioneer in female education and social upliftment. She faced extreme opposition to educate women and lower caste children.',
      quotes: 'Jao, Shiksha Prapt Karo!',
      timeline: [
        { year: '1831', event: 'Born in Naigaon, Satara' },
        { year: '1848', event: 'Started teaching girls in Pune' }
      ]
    },
    {
      id: '4',
      name: 'Manyavar Kanshi Ram',
      title: 'Bahujan Political Pioneer',
      years: '1934 - 2006',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      bio: 'Founder of BAMCEF, DS4 and Bahujan Samaj Party. Organized Bahujan masses across India for political empowerment.',
      quotes: 'Jiski Jitni Sankhya Bhaari, Uski Utni Hissedari!',
      timeline: [
        { year: '1934', event: 'Born in Punjab' },
        { year: '1978', event: 'Founded BAMCEF' },
        { year: '1984', event: 'Founded Bahujan Samaj Party' }
      ]
    }
  ]);

  const [videosList, setVideosList] = useState([
    { id: '1', title: 'Samvidhan Nirman Ki Aitihaasik Kahani', duration: '18:45', author: 'Bahujan Vision', views: '185K', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80' },
    { id: '2', title: 'Mahatma Phule & Savitribai Phule Kranti', duration: '14:20', author: 'History Uncovered', views: '92K', thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=80' },
    { id: '3', title: 'Periyar E. V. Ramasamy Reform Movement', duration: '22:10', author: 'Bahujan Knowledge', views: '210K', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80' }
  ]);

  const [shortsList, setShortsList] = useState([
    { id: '1', title: 'Shikshit Bano, Sangathit Raho!', likes: '12K', comments: '231', bg: 'bg-gradient-to-br from-blue-900 to-indigo-900' },
    { id: '2', title: 'Equality in Constitution', likes: '8.5K', comments: '142', bg: 'bg-gradient-to-br from-purple-900 to-slate-900' },
    { id: '3', title: 'Satyashodhak Samaj Movement', likes: '15K', comments: '420', bg: 'bg-gradient-to-br from-amber-900 to-slate-900' }
  ]);

  const [booksList, setBooksList] = useState([
    { id: '1', title: 'Jati Ka Vinash (Annihilation of Caste)', pages: '124', size: '1.2 MB', author: 'Dr. B.R. Ambedkar', rating: 5.0, cover: 'bg-gradient-to-br from-amber-900 to-yellow-900' },
    { id: '2', title: 'Buddha Aur Unka Dhamma', pages: '540', size: '3.4 MB', author: 'Dr. B.R. Ambedkar', rating: 4.9, cover: 'bg-gradient-to-br from-blue-900 to-indigo-950' },
    { id: '3', title: 'Gulamgiri (Slavery)', pages: '180', size: '1.8 MB', author: 'Mahatma Jyotirao Phule', rating: 4.9, cover: 'bg-gradient-to-br from-emerald-900 to-teal-950' },
    { id: '4', title: 'The Chamcha Age', pages: '320', size: '2.1 MB', author: 'Manyavar Kanshi Ram', rating: 4.8, cover: 'bg-gradient-to-br from-red-900 to-rose-950' }
  ]);

  // ==================== NEW STATES ====================
  const [onboardingContent, setOnboardingContent] = useState([
  { 
    step: 1, 
    title: 'Mahapurushon Ke Vichar', 
    desc: 'Dr. Ambedkar, Jyotirao Phule aur Anya Bahujan Nayakon ki jeevani aur vichardhara ko vistar se jaanein.', 
    icon: 'B',
    image: '' 
  },
  { 
    step: 2, 
    title: 'Free Digital Library & PDFs', 
    desc: 'Itihasik kitabein, Audiobooks aur Research papers padhein aur download karein bina kisi shulk ke.', 
    icon: 'book',
    image: '' 
  },
  { 
    step: 3, 
    title: 'Community & Support Mission', 
    desc: 'Apne vichar share karein, samajik mission me sahayog (Donate) karein aur sangathit rahein.', 
    icon: 'heart',
    image: '' 
  }
]);

  const [homeIcons, setHomeIcons] = useState([
    { id: 'i1', label: 'Mahapurush', icon: 'User', color: 'text-blue-400', tab: 'mahapurush' },
    { id: 'i2', label: 'E-Books', icon: 'BookOpen', color: 'text-amber-400', tab: 'library' },
    { id: 'i3', label: 'Videos', icon: 'Video', color: 'text-purple-400', tab: 'media' },
    { id: 'i4', label: 'Donate', icon: 'HeartHandshake', color: 'text-emerald-400', modal: true }
  ]);

  const [adPlatforms, setAdPlatforms] = useState({
    admob: { enabled: false, appId: '', bannerId: '' },
    googleAds: { enabled: false, clientId: '' },
    customBanner: { enabled: true },
    other: { enabled: false, name: '', script: '' }
  });

  const [uploadForm, setUploadForm] = useState({
    type: 'video',
    title: '',
    link: '',
    file: null,
    fileName: '',
    imageUrl: '',        // Cloudinary URL yahan aayega
    author: '',
    uploading: false
  });

  const [integrations, setIntegrations] = useState({
    firebase: { connected: false, projectId: '' },
    firestore: { connected: false },
    github: { connected: false, repo: '' },
    cloudinary: { connected: false, cloudName: '' },
    netlify: { connected: false, siteId: '' }
  });

  const [userProfile, setUserProfile] = useState({
    name: 'Bahujan Active Member',
    bio: 'Golden Supporter Badge',
    avatar: '',
    email: '',
    phone: '',
    downloads: [
      { id: 'd1', title: 'Jati Ka Vinash', type: 'PDF', date: '2 days ago' },
      { id: 'd2', title: 'Buddha Aur Unka Dhamma', type: 'PDF', date: '5 days ago' }
    ],
    likedPosts: [],
    myPosts: [],
    comments: []
  });

  const [authMode, setAuthMode] = useState('login');
  const [signupMethod, setSignupMethod] = useState('email');
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [newAdminPin, setNewAdminPin] = useState('');
  const [confirmAdminPin, setConfirmAdminPin] = useState('');
const [showAddReformer, setShowAddReformer] = useState(false);
const [editingReformer, setEditingReformer] = useState(null);

const [reformerForm, setReformerForm] = useState({
  name: '',
  title: '',
  years: '',
  bio: '',
  quotes: '',
  image: '',
  uploading: false
});
// ==================== eBOOK STATES ====================
const [ebookSubTab, setEbookSubTab] = useState('mahapurush');
const [ebookMahapurush, setEbookMahapurush] = useState([]);
const [ebookLanguages, setEbookLanguages] = useState([
  { id: 'hi', name: 'Hindi', code: 'hi', enabled: true },
  { id: 'en', name: 'English', code: 'en', enabled: true },
  { id: 'kn', name: 'Kannada', code: 'kn', enabled: true },
  { id: 'mr', name: 'Marathi', code: 'mr', enabled: true },
  { id: 'ta', name: 'Tamil', code: 'ta', enabled: true },
  { id: 'te', name: 'Telugu', code: 'te', enabled: true },
  { id: 'pa', name: 'Punjabi', code: 'pa', enabled: true },
  { id: 'bn', name: 'Bengali', code: 'bn', enabled: true },
]);
const [ebookBooks, setEbookBooks] = useState([]);
const [ebookForm, setEbookForm] = useState({ name: '', photo: '', bio: '', order: 1, status: 'active' });
const [langForm, setLangForm] = useState({ name: '', code: '' });
const [bookUploadForm, setBookUploadForm] = useState({
  mahapurushId: '', languageId: '', title: '', author: '', category: '',
  description: '', featured: false, coverFile: null, coverUrl: '', pdfFile: null, pdfUrl: ''
});
const [bookUploading, setBookUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);

// ==================== USER eBOOK FLOW STATES ====================
const [ebookView, setEbookView] = useState('mahapurush'); // mahapurush | languages | books | reader
const [selectedEbookMahapurush, setSelectedEbookMahapurush] = useState(null);
const [selectedEbookLanguage, setSelectedEbookLanguage] = useState(null);
const [selectedEbookBook, setSelectedEbookBook] = useState(null);
const [pdfPage, setPdfPage] = useState(1);
const [pdfScale, setPdfScale] = useState(1.0);
const [pdfDarkMode, setPdfDarkMode] = useState(false);
const [pdfBookmarks, setPdfBookmarks] = useState([]);
const [showPdfChapters, setShowPdfChapters] = useState(false);
const [showPdfSearch, setShowPdfSearch] = useState(false);
const [pdfSearchQuery, setPdfSearchQuery] = useState('');

  // Splash timer
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen('onboarding'), 2600);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

// ==================== LOAD DATA FROM FIRESTORE ====================
useEffect(() => {
  const loadData = async () => {
    try {
      const docRef = doc(db, "settings", "appConfig");
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        if (data.appConfig) setAppConfig(data.appConfig);
        if (data.onboardingContent) setOnboardingContent(data.onboardingContent);
        if (data.homeIcons) setHomeIcons(data.homeIcons);
        if (data.customPages) setCustomPages(data.customPages);
        if (data.socialLinks) setSocialLinks(data.socialLinks);
        if (data.mahapurushList) setMahapurushList(data.mahapurushList);
        if (data.videosList) setVideosList(data.videosList);
        if (data.booksList) setBooksList(data.booksList);
        if (data.communityPosts) setCommunityPosts(data.communityPosts);

if (data.ebookMahapurush) setEbookMahapurush(data.ebookMahapurush);
if (data.ebookLanguages) setEbookLanguages(data.ebookLanguages);
if (data.ebookBooks) setEbookBooks(data.ebookBooks);
        console.log("✅ Data loaded from Firestore");
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  loadData();
}, []);

  // ==================== HELPERS ====================
  const openUPI = (amount) => {
  const upi = appConfig.upiId || 'rikive@upi';
  const url = `upi://pay?pa=\( {upi}&pn=Bahujan%20X&am= \){amount}&cu=INR&tn=Mission%20Support`;
  window.location.href = url;
  
  setTimeout(() => {
    alert(`UPI app open ho raha hai...\nUPI ID: \( {upi}\nAmount: ₹ \){amount}`);
  }, 600);
};



  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setUploadForm(prev => ({
      ...prev,
      file: file,
      fileName: file.name,
      uploading: true,
      imageUrl: ''
    }));

    const url = await uploadToCloudinary(file);

...
alert("✅ Uploaded successfully to Cloudinary!\n\n" + url);

  } catch (error) {
    console.error(error);
    alert("❌ Upload failed: " + error.message);
    setUploadForm(prev => ({ ...prev, uploading: false }));
  }
};

  const connectIntegration = (service) => {
    const urls = {
      firebase: 'https://console.firebase.google.com/',
      firestore: 'https://console.firebase.google.com/',
      github: 'https://github.com/login',
      cloudinary: 'https://cloudinary.com/users/login',
      netlify: 'https://app.netlify.com/'
    };
    window.open(urls[service], '_blank');
    setIntegrations(prev => ({
      ...prev,
      [service]: { ...prev[service], connected: true }
    }));
    alert(`${service.toUpperCase()} console open ho gaya.`);
  };

  const downloadToDevice = (item) => {
    alert(`"${item.title || item}" download shuru...\nFile aapke device Downloads folder me save hogi.`);
  };

const saveAllSettings = async () => {
  try {
    const docRef = doc(db, "settings", "appConfig");
    await setDoc(docRef, {
      appConfig,
      onboardingContent,
      homeIcons,
      customPages,
      socialLinks,
      mahapurushList,
      videosList,
      booksList,
      communityPosts,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    alert("✅ Settings permanently saved!");
  } catch (err) {
    console.error(err);
    alert("❌ Save failed: " + err.message);
  }
};

const saveEbookMahapurush = async () => {
  if (!ebookForm.name.trim()) return alert('Name required');
  
  let updated;
  if (ebookForm.id) {
    updated = ebookMahapurush.map(m => m.id === ebookForm.id ? { ...ebookForm } : m);
  } else {
    updated = [...ebookMahapurush, { ...ebookForm, id: Date.now().toString() }];
  }
  setEbookMahapurush(updated);
  setEbookForm({ name: '', photo: '', bio: '', order: 1, status: 'active' });
  
  // Firestore me save (optional)
  await setDoc(doc(db, "settings", "appConfig"), { ebookMahapurush: updated }, { merge: true });
  alert('Saved!');
};

const saveLanguage = () => {
  if (!langForm.name.trim()) return;
  const newLang = { id: Date.now().toString(), ...langForm, enabled: true };
  setEbookLanguages([...ebookLanguages, newLang]);
  setLangForm({ name: '', code: '' });
};

const toggleLanguage = (id) => {
  setEbookLanguages(ebookLanguages.map(l => 
    l.id === id ? { ...l, enabled: !l.enabled } : l
  ));
};

const saveEbookBook = async () => {
  if (!bookUploadForm.mahapurushId || !bookUploadForm.languageId || !bookUploadForm.title) {
    return alert('Mahapurush, Language aur Title required hain');
  }

  setBookUploading(true);
  setUploadProgress(0);

  try {
    let coverUrl = bookUploadForm.coverUrl || '';
    let pdfUrl = bookUploadForm.pdfUrl || '';

    // Cover Image
if (bookUploadForm.coverFile) {
  coverUrl = await uploadToCloudinary(bookUploadForm.coverFile);
}

// PDF
if (bookUploadForm.pdfFile) {
  pdfUrl = await uploadToCloudinary(bookUploadForm.pdfFile);
}

    if (!pdfUrl) {
      alert('PDF file ya PDF link required hai');
      setBookUploading(false);
      return;
    }

    const newBook = {
      id: Date.now().toString(),
      mahapurushId: bookUploadForm.mahapurushId,
      languageId: bookUploadForm.languageId,
      title: bookUploadForm.title,
      author: bookUploadForm.author,
      category: bookUploadForm.category,
      description: bookUploadForm.description,
      featured: bookUploadForm.featured,
      coverUrl,
      pdfUrl,
      createdAt: new Date().toISOString()
    };

    const updatedBooks = [...ebookBooks, newBook];
    setEbookBooks(updatedBooks);

    // Firestore me save
    await setDoc(doc(db, "settings", "appConfig"), {
      ebookBooks: updatedBooks
    }, { merge: true });

    // Form reset
    setBookUploadForm({
      mahapurushId: '', languageId: '', title: '', author: '', category: '',
      description: '', featured: false, coverFile: null, coverUrl: '', pdfFile: null, pdfUrl: ''
    });

    alert('✅ Book successfully uploaded to Cloudinary!');
  } catch (err) {
    console.error(err);
    alert('Upload failed: ' + err.message);
  }

  setBookUploading(false);
  setUploadProgress(0);
};

const resetReformerForm = () => {
  setReformerForm({
    name: '',
    title: '',
    years: '',
    bio: '',
    quotes: '',
    image: '',
    uploading: false
  });
  setEditingReformer(null);
  setShowAddReformer(false);
};
const saveReformer = async () => {
  if (!reformerForm.name.trim()) {
    alert("Name required");
    return;
  }

  try {
    let updatedList;

    if (editingReformer) {
      // Edit mode
      updatedList = mahapurushList.map(item => 
        item.id === editingReformer.id 
          ? { ...item, ...reformerForm, id: editingReformer.id }
          : item
      );
    } else {
      // Add mode
      const newReformer = {
        id: Date.now().toString(),
        ...reformerForm,
        timeline: [],
        images: [],
        videos: [],
        books: [],
        pdfs: []
      };
      updatedList = [...mahapurushList, newReformer];
    }

    setMahapurushList(updatedList);

    // Firestore me save
    await setDoc(doc(db, "settings", "appConfig"), {
      mahapurushList: updatedList,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    alert(editingReformer ? "✅ Reformer updated!" : "✅ Reformer added!");
    resetReformerForm();

  } catch (err) {
    alert("Error: " + err.message);
  }
};
const deleteReformer = async (id) => {
  if (!confirm("Kya aap is leader ko delete karna chahte ho?")) return;

  try {
    const updatedList = mahapurushList.filter(item => item.id !== id);
    setMahapurushList(updatedList);

    await setDoc(doc(db, "settings", "appConfig"), {
      mahapurushList: updatedList,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    alert("✅ Deleted successfully");
  } catch (err) {
    alert("Delete failed: " + err.message);
  }
};
const startEditReformer = (leader) => {
  setEditingReformer(leader);
  setReformerForm({
    name: leader.name || '',
    title: leader.title || '',
    years: leader.years || '',
    bio: leader.bio || '',
    quotes: leader.quotes || '',
    image: leader.image || '',
    uploading: false
  });
  setShowAddReformer(true);
};

  // ==================== SPLASH ====================
  const renderSplash = () => (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute w-64 h-64 bg-amber-500/10 rounded-full blur-2xl top-1/4"></div>
      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 p-1 shadow-2xl shadow-blue-500/30 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center border border-blue-400/30">
            {appConfig.logoUrl ? (
              <img src={appConfig.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
            ) : (
              <span className="text-6xl font-black bg-gradient-to-r from-blue-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">{appConfig.logoText || 'B'}</span>
            )}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-wider text-white">{appConfig.splashTitle}</h1>
          <p className="text-xs text-amber-400 font-semibold tracking-widest mt-1 uppercase">{appConfig.splashTagline}</p>
        </div>
        <div className="pt-8 flex items-center space-x-2 text-slate-400 text-xs">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>{appConfig.splashSubtext}</span>
        </div>
      </div>
    </div>
  );

  // ==================== ONBOARDING ====================
  const renderOnboarding = () => (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 max-w-md mx-auto relative">
      <div className="flex justify-between items-center z-10">
        <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">Version 2.0</span>
        <button onClick={() => setCurrentScreen('app')} className="text-slate-400 hover:text-white text-xs font-medium">Skip Intro</button>
      </div>
      <div className="flex flex-col items-center text-center my-auto space-y-6">
        <div className="w-56 h-56 rounded-full bg-gradient-to-b from-blue-600/20 to-amber-500/10 border border-blue-500/30 flex items-center justify-center p-4 relative shadow-2xl overflow-hidden">
  {onboardingContent[onboardingStep - 1]?.image ? (
    <img
      src={onboardingContent[onboardingStep - 1].image}
      alt="Onboarding"
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <>
      {onboardingStep === 1 && (
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center text-3xl font-black text-amber-400">
            {onboardingContent[0]?.icon || 'B'}
          </div>
          <p className="text-lg font-bold text-white">{onboardingContent[0]?.title}</p>
        </div>
      )}
      {onboardingStep === 2 && <BookOpen className="w-24 h-24 text-blue-400 animate-pulse" />}
      {onboardingStep === 3 && <HeartHandshake className="w-24 h-24 text-amber-400 animate-bounce" />}
    </>
  )}
</div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{onboardingContent[onboardingStep - 1]?.title}</h2>
          <p className="text-slate-400 text-xs max-w-xs leading-relaxed">{onboardingContent[onboardingStep - 1]?.desc}</p>
        </div>
        <div className="flex space-x-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${onboardingStep === step ? 'w-8 bg-amber-400' : 'w-2 bg-slate-800'}`}></div>
          ))}
        </div>
      </div>
      <button 
        onClick={() => {
          if (onboardingStep < 3) setOnboardingStep(onboardingStep + 1);
          else setCurrentScreen('auth');
        }}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all text-sm"
      >
        {onboardingStep === 3 ? 'Explore Bahujan X' : 'Continue'}
      </button>
    </div>
  );

  // ==================== AUTH (with Signup options) ====================
  const renderAuth = () => (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center p-6 max-w-md mx-auto">
      <button onClick={() => setCurrentScreen('onboarding')} className="text-slate-400 mb-6 flex items-center text-xs">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-amber-400 text-3xl font-black mb-3 shadow-lg overflow-hidden">
  {appConfig.logoUrl ? (
    <img src={appConfig.logoUrl} alt="Logo" className="w-full h-full object-cover" />
  ) : (
    <span>{appConfig.logoText || 'B'}</span>
  )}
</div>
        <h1 className="text-2xl font-bold">{authMode === 'login' ? 'Welcome to Bahujan X' : 'Create Account'}</h1>
        <p className="text-slate-400 text-xs mt-1">Aapke apne Samajik & Shiksha Platform me swagat hai</p>
      </div>

      {authMode === 'signup' && (
        <div className="flex space-x-2 mb-4">
          {['email', 'google', 'mobile'].map(m => (
            <button key={m} onClick={() => setSignupMethod(m)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border ${signupMethod === m ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
              {m === 'email' ? 'Email' : m === 'google' ? 'Google' : 'Mobile'}
            </button>
          ))}
        </div>
      )}

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setCurrentScreen('app'); }}>
        {signupMethod !== 'google' && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {signupMethod === 'mobile' ? 'Mobile Number' : 'Mobile / Email Address'}
              </label>
              <input type="text" placeholder={signupMethod === 'mobile' ? '+91 98765 43210' : 'email@example.com'} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-white" />
            </div>
            {signupMethod === 'email' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-white" />
              </div>
            )}
          </>
        )}

        {signupMethod === 'google' && (
          <button type="button" onClick={() => { alert('Google Sign-In (Firebase Auth se connect karein)'); setCurrentScreen('app'); }}
            className="w-full bg-white text-slate-900 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2">
            <Globe className="w-4 h-4" /> <span>Continue with Google</span>
          </button>
        )}

        {signupMethod !== 'google' && (
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 transition-all">
            {authMode === 'login' ? 'Login & Start Learning' : 'Create Account'}
          </button>
        )}
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        {authMode === 'login' ? (
          <>New to Platform? <span className="text-amber-400 font-bold cursor-pointer" onClick={() => setAuthMode('signup')}>Sign Up</span> | <span className="text-amber-400 font-bold cursor-pointer" onClick={() => setCurrentScreen('app')}>Continue as Guest</span></>
        ) : (
          <>Already have account? <span className="text-amber-400 font-bold cursor-pointer" onClick={() => setAuthMode('login')}>Login</span></>
        )}
      </div>
    </div>
  );

  // ==================== HEADER ====================
  const renderHeader = () => (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-amber-400 font-black text-lg shadow overflow-hidden">
  {appConfig.logoUrl ? (
    <img src={appConfig.logoUrl} alt="Logo" className="w-full h-full object-cover" />
  ) : (
    <span>{appConfig.logoText || 'B'}</span>
  )}
</div>
        <div>
          <span className="font-bold text-sm text-white tracking-wide block">{appConfig.splashTitle}</span>
          <span className="text-[9px] text-amber-400 font-medium">Mission & Knowledge</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => setDonationModal(true)} className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold flex items-center animate-pulse">
          <HeartHandshake className="w-3.5 h-3.5 mr-1 text-amber-400" /> Support
        </button>
        <button 
          onClick={() => {
            if (isAdminLoggedIn) setCurrentScreen('admin_panel');
            else setCurrentScreen('admin_login');
          }} 
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full font-medium flex items-center border border-slate-700"
        >
          <Shield className="w-3 h-3 mr-1 text-blue-400" /> Admin
        </button>
      </div>
    </header>
  );

  // ==================== BOTTOM NAV ====================
  const renderBottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 max-w-md mx-auto flex justify-around py-2 px-1">
      {[
        { id: 'home', label: 'Home', icon: Home },
        { id: 'mahapurush', label: 'Leaders', icon: User },
        { id: 'media', label: 'Media', icon: Video },
        { id: 'library', label: 'Library', icon: BookOpen },
        { id: 'community', label: 'Social', icon: MessageSquare },
        { id: 'pages', label: 'Pages', icon: Layers },
        { id: 'profile', label: 'Profile', icon: Settings }
      ].map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedMahapurush(null);
              setSelectedBook(null);
            }}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-colors ${
              isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-amber-400' : ''}`} />
            <span className="text-[8px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );

  // ==================== DONATION MODAL (UPI redirect) ====================
  const renderDonationModal = () => (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 relative space-y-4">
        <button onClick={() => setDonationModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Mission Support / Sahayog</h3>
          <p className="text-xs text-slate-400">Bahujan X app ko aage badhane me yogdan dein.</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['100', '210', '501', '1001', '2100', '5000'].map((amt) => (
            <button
              key={amt}
              onClick={() => setCustomDonation(amt)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                customDonation === amt ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs text-slate-400">Custom Amount (₹)</label>
          <input type="number" value={customDonation} onChange={(e) => setCustomDonation(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1" />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
          <QrCode className="w-10 h-10 text-amber-400 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-white">Direct UPI Support</p>
            <p className="text-[10px] text-slate-400 font-mono">{appConfig.upiId || 'rikive@upi'}</p>
          </div>
        </div>

        <button 
          onClick={() => {
            openUPI(customDonation);
            setDonationModal(false);
          }}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 py-3 rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20"
        >
          Proceed ₹{customDonation} — Pay via UPI
        </button>
      </div>
    </div>
  );

  // ==================== HOME ====================
  const renderHomeContent = () => (
    <div className="space-y-5 pb-20">
      {appConfig.enableAds && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs text-amber-300 shadow">
          <span className="truncate mr-2 text-[11px] font-medium">{appConfig.adBannerText}</span>
          <a href={appConfig.adBannerLink} target="_blank" rel="noreferrer" className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg font-bold text-[10px] flex-shrink-0">
            Open
          </a>
        </div>
      )}

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search Mahapurush, Books, Audio, PDFs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 text-white"
        />
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 p-4 border border-blue-500/20 shadow-lg">
        <div className="flex items-center space-x-3">
          <img src={appConfig.quoteImage} alt="Ambedkar" className="w-14 h-14 rounded-full object-cover border-2 border-amber-400/50 shadow-md" />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Today's Quote
              </span>
              <button onClick={() => alert("Playing quote audio...")} className="p-1 rounded-full bg-blue-600/30 text-blue-400 hover:text-white">
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-bold text-white mt-1 leading-snug">"{appConfig.quoteOfTheDay}"</p>
            <p className="text-[10px] text-slate-400 mt-0.5">— {appConfig.quoteAuthor}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {homeIcons.map((btn, idx) => {
          const IconMap = { User, BookOpen, Video, HeartHandshake };
          const Icon = IconMap[btn.icon] || User;
          return (
            <button
              key={idx}
              onClick={() => {
                if (btn.modal) setDonationModal(true);
                else setActiveTab(btn.tab);
              }}
              className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col items-center hover:border-slate-700 transition-all"
            >
              <Icon className={`w-5 h-5 mb-1 ${btn.color}`} />
              <span className="text-[10px] text-slate-300 font-medium">{btn.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="font-bold text-white text-sm">Bahujan Reformers</h3>
          <button onClick={() => setActiveTab('mahapurush')} className="text-xs text-amber-400 font-medium hover:underline">See All</button>
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {mahapurushList.map((m) => (
            <div
              key={m.id}
              onClick={() => { setSelectedMahapurush(m); setActiveTab('mahapurush'); }}
              className="flex-shrink-0 w-28 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center cursor-pointer hover:border-amber-500/40 transition-all"
            >
              <img src={m.image} alt={m.name} className="w-14 h-14 rounded-full object-cover mx-auto mb-2 border border-slate-700" />
              <h4 className="text-[11px] font-bold text-white truncate">{m.name}</h4>
              <p className="text-[9px] text-slate-400 truncate">{m.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="font-bold text-white text-sm">Latest Videos</h3>
          <button onClick={() => setActiveTab('media')} className="text-xs text-amber-400 font-medium hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {videosList.slice(0, 2).map((vid) => (
            <div
              key={vid.id}
              onClick={() => setSelectedVideo(vid)}
              className="flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-slate-700"
            >
              <div className="relative w-32 h-20 bg-slate-800 flex-shrink-0">
                <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1.5 py-0.5 rounded text-white font-mono">{vid.duration}</span>
              </div>
              <div className="p-2.5 flex flex-col justify-between flex-1">
                <h4 className="text-xs font-semibold text-white line-clamp-2">{vid.title}</h4>
                <div className="flex justify-between items-center text-[9px] text-slate-400">
                  <span>{vid.author}</span>
                  <span>{vid.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="font-bold text-white text-sm">Popular E-Books & PDFs</h3>
          <button onClick={() => setActiveTab('library')} className="text-xs text-amber-400 font-medium hover:underline">View Library</button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {booksList.slice(0, 2).map((book) => (
            <div
              key={book.id}
              onClick={() => { setSelectedBook(book); setActiveTab('library'); }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 cursor-pointer hover:border-slate-700"
            >
              <div className={`h-20 ${book.cover} rounded-lg mb-2 flex items-center justify-center p-2 text-center text-white text-[10px] font-bold shadow`}>
                {book.title}
              </div>
              <h4 className="text-xs font-bold text-white truncate">{book.title}</h4>
              <p className="text-[10px] text-slate-400 truncate">{book.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== MAHAPURUSH ====================
  const renderMahapurushModule = () => {
    if (selectedMahapurush) {
      return (
        <div className="space-y-4 pb-20">
          <button onClick={() => setSelectedMahapurush(null)} className="flex items-center text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Leaders
          </button>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center relative overflow-hidden">
            <img src={selectedMahapurush.image} alt={selectedMahapurush.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-2 border-2 border-amber-400/50 shadow-lg" />
            <h2 className="text-lg font-bold text-white">{selectedMahapurush.name}</h2>
            <p className="text-xs text-amber-400 font-medium">{selectedMahapurush.title}</p>
            <p className="text-[10px] text-slate-400">{selectedMahapurush.years}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <h3 className="text-xs font-bold text-white mb-1.5 border-b border-slate-800 pb-1.5">Biography & Mission</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedMahapurush.bio}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <h3 className="text-xs font-bold text-white mb-2 border-b border-slate-800 pb-1.5">Key Events & Timeline</h3>
            <div className="space-y-2.5 border-l border-slate-800 ml-2 pl-3">
              {selectedMahapurush.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-amber-400"></div>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">{item.year}</span>
                  <p className="text-xs text-slate-300 mt-0.5">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-3 pb-20">
        <h2 className="text-base font-bold text-white">Bahujan Leaders & Reformers</h2>
        <div className="grid grid-cols-1 gap-2.5">
          {mahapurushList.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMahapurush(m)}
              className="flex items-center space-x-3 bg-slate-900 border border-slate-800 rounded-xl p-2.5 cursor-pointer hover:border-amber-500/30"
            >
              <img src={m.image} alt={m.name} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="text-xs font-bold text-white">{m.name}</h3>
                <p className="text-[10px] text-amber-400">{m.title}</p>
                <p className="text-[9px] text-slate-500">{m.years}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==================== LIBRARY (Full eBook Roadmap) ====================
const renderLibraryModule = () => {

  // ---------- 1. MAHAPURUSH LIST ----------
  if (ebookView === 'mahapurush') {
    return (
      <div className="space-y-4 pb-20">
        <h2 className="text-base font-bold text-white">Bahujan Mahapurush eBooks</h2>
        <p className="text-xs text-slate-400 -mt-2">Select a leader to explore books</p>

        <div className="grid grid-cols-2 gap-3">
          {ebookMahapurush
            .filter(mp => mp.status === 'active')
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((mp) => (
              <div
                key={mp.id}
                onClick={() => {
                  setSelectedEbookMahapurush(mp);
                  setEbookView('languages');
                }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center cursor-pointer hover:border-amber-500/40 active:scale-95 transition-all"
              >
                <img
                  src={mp.photo || 'https://via.placeholder.com/80'}
                  alt={mp.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-blue-500/40"
                />
                <h3 className="text-xs font-bold text-white leading-tight">{mp.name}</h3>
              </div>
            ))}
        </div>

        {ebookMahapurush.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm">
            Abhi koi Mahapurush add nahi hua.<br />Admin panel se add karein.
          </div>
        )}
      </div>
    );
  }

  // ---------- 2. LANGUAGE SELECTION ----------
  if (ebookView === 'languages' && selectedEbookMahapurush) {
    return (
      <div className="space-y-4 pb-20">
        <button
          onClick={() => {
            setEbookView('mahapurush');
            setSelectedEbookMahapurush(null);
          }}
          className="flex items-center text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Mahapurush
        </button>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <img
            src={selectedEbookMahapurush.photo || 'https://via.placeholder.com/60'}
            className="w-14 h-14 rounded-full object-cover border border-amber-400/40"
          />
          <div>
            <h2 className="text-sm font-bold text-white">{selectedEbookMahapurush.name}</h2>
            <p className="text-xs text-slate-400">Select a language</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {ebookLanguages
            .filter(lang => lang.enabled)
            .map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setSelectedEbookLanguage(lang);
                  setEbookView('books');
                }}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl py-4 font-medium text-sm text-white transition-all"
              >
                {lang.name}
              </button>
            ))}
        </div>
      </div>
    );
  }

  // ---------- 3. BOOKS LIST ----------
  if (ebookView === 'books' && selectedEbookMahapurush && selectedEbookLanguage) {
    const filteredBooks = ebookBooks.filter(
      (b) =>
        b.mahapurushId === selectedEbookMahapurush.id &&
        b.languageId === selectedEbookLanguage.id
    );

    return (
      <div className="space-y-4 pb-20">
        <button
          onClick={() => {
            setEbookView('languages');
            setSelectedEbookLanguage(null);
          }}
          className="flex items-center text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Languages
        </button>

        <div>
          <h2 className="text-sm font-bold text-white">
            {selectedEbookMahapurush.name} — {selectedEbookLanguage.name} eBooks
          </h2>
          <p className="text-xs text-slate-400">{filteredBooks.length} books available</p>
        </div>

        <div className="space-y-3">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => {
                setSelectedEbookBook(book);
                setPdfPage(1);
                setEbookView('reader');
              }}
              className="flex gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3 cursor-pointer hover:border-slate-700 active:scale-[0.98] transition-all"
            >
              <div className="w-16 h-24 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-center p-1 text-slate-400">
                    No Cover
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white line-clamp-2">{book.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{book.author || 'Unknown Author'}</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {book.category && `${book.category} • `}PDF
                </p>
                {book.featured && (
                  <span className="inline-block mt-1.5 text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 self-center" />
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm">
            Is language mein abhi koi book nahi hai.<br />Admin panel se upload karein.
          </div>
        )}
      </div>
    );
  }

  // ---------- 4. ADVANCED PDF READER ----------
  if (ebookView === 'reader' && selectedEbookBook) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col max-w-md mx-auto ${pdfDarkMode ? 'bg-black' : 'bg-slate-950'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/95">
          <button
            onClick={() => {
              setEbookView('books');
              setSelectedEbookBook(null);
            }}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 mx-3 min-w-0">
            <h1 className="text-xs font-bold text-white truncate">{selectedEbookBook.title}</h1>
            <p className="text-[10px] text-slate-400">
              {selectedEbookLanguage?.name} • Page {pdfPage}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setPdfScale(s => Math.max(0.6, s - 0.15))}
              className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg text-sm"
            >
              −
            </button>
            <button
              onClick={() => setPdfScale(s => Math.min(2.2, s + 0.15))}
              className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg text-sm"
            >
              +
            </button>
            <button
              onClick={() => setPdfDarkMode(!pdfDarkMode)}
              className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg text-xs"
            >
              {pdfDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* PDF Area */}
        <div className="flex-1 overflow-auto flex justify-center items-start p-2 bg-slate-900/30">
          {selectedEbookBook.pdfUrl ? (
            <iframe
              src={`\( {selectedEbookBook.pdfUrl}#page= \){pdfPage}`}
              title={selectedEbookBook.title}
              className="w-full h-full rounded-xl border border-slate-800"
              style={{ minHeight: '70vh' }}
            />
          ) : (
            <div className="text-center mt-20 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 text-amber-400" />
              <p>PDF link available nahi hai</p>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="p-3 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setPdfPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold disabled:opacity-40"
            >
              ‹ Prev
            </button>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={pdfPage}
                onChange={(e) => setPdfPage(Number(e.target.value) || 1)}
                className="w-14 bg-slate-950 border border-slate-700 rounded-lg text-center py-1 text-xs"
              />
            </div>

            <button
              onClick={() => setPdfPage(p => p + 1)}
              className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold"
            >
              Next ›
            </button>
          </div>

          <div className="flex justify-center gap-6 text-xs">
            <button
              onClick={() => {
                if (pdfBookmarks.includes(pdfPage)) {
                  setPdfBookmarks(pdfBookmarks.filter(p => p !== pdfPage));
                } else {
                  setPdfBookmarks([...pdfBookmarks, pdfPage]);
                }
              }}
              className="text-amber-400"
            >
              {pdfBookmarks.includes(pdfPage) ? '★ Bookmarked' : '☆ Bookmark'}
            </button>
            <button onClick={() => setShowPdfSearch(true)} className="text-slate-300">
              🔍 Search
            </button>
            <button onClick={() => setShowPdfChapters(true)} className="text-slate-300">
              📑 Chapters
            </button>
          </div>
        </div>

        {/* Chapters Panel */}
        {showPdfChapters && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowPdfChapters(false)} />
            <div className="relative ml-auto w-72 max-w-full bg-slate-900 h-full overflow-y-auto p-4 border-l border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm">Chapters</h3>
                <button onClick={() => setShowPdfChapters(false)} className="text-2xl text-slate-400">×</button>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                PDF ke chapters yahan dikhenge (agar PDF mein outline ho).
              </p>
              <div className="space-y-2">
                {[1, 5, 12, 25, 40].map((pg) => (
                  <button
                    key={pg}
                    onClick={() => {
                      setPdfPage(pg);
                      setShowPdfChapters(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-xs"
                  >
                    Page {pg}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Panel */}
        {showPdfSearch && (
          <div className="fixed inset-0 z-50 flex items-end">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowPdfSearch(false)} />
            <div className="relative w-full bg-slate-900 rounded-t-3xl p-5 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm">Search inside PDF</h3>
                <button onClick={() => setShowPdfSearch(false)} className="text-2xl text-slate-400">×</button>
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={pdfSearchQuery}
                  onChange={(e) => setPdfSearchQuery(e.target.value)}
                  placeholder="Type to search..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs"
                />
                <button className="bg-blue-600 px-5 rounded-xl text-xs font-bold">
                  Go
                </button>
              </div>
              <p className="text-xs text-slate-500 text-center py-6">
                Search results yahan dikhenge
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return null;
};

  // ==================== COMMUNITY ====================
  const renderCommunityModule = () => (
    <div className="space-y-4 pb-20">
      <h2 className="text-base font-bold text-white">Community Feed & Thoughts</h2>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
        <textarea
          placeholder="Apne vichar ya sandesh share karein..."
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 text-white resize-none"
          rows={2}
        />
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500">Post responsibly according to mission guidelines</span>
          <button
            onClick={() => {
              if (!newPostText.trim()) return;
              setCommunityPosts([
                {
                  id: Date.now().toString(),
                  author: 'You (Member)',
                  time: 'Just now',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
                  content: newPostText,
                  likes: 0,
                  comments: 0,
                  isLiked: false,
                  badge: 'Member'
                },
                ...communityPosts
              ]);
              setNewPostText('');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1"
          >
            <Send className="w-3 h-3" /> <span>Post</span>
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {communityPosts.map((post) => (
          <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center space-x-2.5">
              <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs font-bold text-white">{post.author}</h4>
                  <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-medium">{post.badge}</span>
                </div>
                <p className="text-[9px] text-slate-500">{post.time}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{post.content}</p>
            <div className="flex items-center space-x-4 border-t border-slate-800/80 pt-2 text-xs text-slate-400">
              <button 
                onClick={() => {
                  setCommunityPosts(communityPosts.map(p => p.id === post.id ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p));
                }}
                className={`flex items-center space-x-1 text-[11px] ${post.isLiked ? 'text-red-400 font-bold' : ''}`}
              >
                <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-red-400' : ''}`} /> <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-[11px]">
                <MessageSquare className="w-3.5 h-3.5" /> <span>{post.comments}</span>
              </button>
              <button onClick={() => alert("Post link copied!")} className="flex items-center space-x-1 text-[11px]">
                <Share2 className="w-3.5 h-3.5" /> <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==================== CUSTOM PAGES ====================
  const renderCustomPagesModule = () => (
    <div className="space-y-4 pb-20">
      <h2 className="text-base font-bold text-white">Custom Pages & Social Channels</h2>
      <div className="space-y-2.5">
        {customPages.map((pg) => (
          <div key={pg.id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <h3 className="text-xs font-bold text-amber-400">{pg.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{pg.content}</p>
          </div>
        ))}
      </div>
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2 mt-4">
        <h3 className="text-xs font-bold text-white mb-2">Official Social Media Handles</h3>
        <div className="grid grid-cols-2 gap-2">
          {socialLinks.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer"
              className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-blue-400 flex items-center justify-between font-medium hover:border-blue-500/40">
              <span>{s.platform}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== PROFILE (Expanded) ====================
  const renderProfileModule = () => (
    <div className="space-y-4 pb-20">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
        <div className="relative w-20 h-20 mx-auto mb-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-amber-400 flex items-center justify-center font-bold text-xl shadow">
            {userProfile.avatar ? <img src={userProfile.avatar} className="w-full h-full rounded-full object-cover" alt="avatar" /> : 'BU'}
          </div>
          <button onClick={() => alert('Profile pic change (Cloudinary upload)')} className="absolute bottom-0 right-0 bg-amber-500 text-slate-950 p-1 rounded-full">
            <Camera className="w-3 h-3" />
          </button>
        </div>
        {profileEditMode ? (
          <input value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm text-white text-center w-full" />
        ) : (
          <h2 className="text-base font-bold text-white">{userProfile.name}</h2>
        )}
        <p className="text-xs text-amber-400">{userProfile.bio}</p>
        <button onClick={() => setProfileEditMode(!profileEditMode)} className="mt-2 text-xs text-blue-400">
          {profileEditMode ? 'Save' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
        <button className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800/50">
          <div className="flex items-center space-x-2.5 text-slate-300">
            <Download className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium">My Downloads ({userProfile.downloads.length})</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
        {userProfile.downloads.map(d => (
          <div key={d.id} className="px-3 py-2 flex justify-between items-center text-xs text-slate-400">
            <span>{d.title} • {d.date}</span>
            <button onClick={() => {
              setUserProfile({...userProfile, downloads: userProfile.downloads.filter(x => x.id !== d.id)});
              alert('Download removed');
            }} className="text-red-400"><Trash2 className="w-3 h-3" /></button>
          </div>
        ))}
        <button className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800/50">
          <div className="flex items-center space-x-2.5 text-slate-300">
            <Heart className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium">Liked Posts</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
        <button className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800/50">
          <div className="flex items-center space-x-2.5 text-slate-300">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium">My Posts & Comments</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
        <button className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800/50">
          <div className="flex items-center space-x-2.5 text-slate-300">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium">Donation History</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
        <button className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800/50">
          <div className="flex items-center space-x-2.5 text-slate-300">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium">About Bahujan X Mission</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <button onClick={() => setCurrentScreen('auth')} className="w-full bg-red-500/10 text-red-400 border border-red-500/20 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5">
        <LogOut className="w-4 h-4" />
        <span>Logout Account</span>
      </button>
    </div>
  );

  // ==================== ADMIN LOGIN ====================
  const renderAdminLogin = () => (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center p-6 max-w-md mx-auto">
      <button onClick={() => setCurrentScreen('app')} className="text-slate-400 mb-6 flex items-center text-xs">
        <ArrowLeft className="w-4 h-4 mr-1" /> Exit Security Login
      </button>
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-4">
        <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/40 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
          <Lock className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Super Admin Access</h2>
          <p className="text-xs text-slate-400 mt-1">Surgical security verification for app owner.</p>
        </div>
        <div className="text-left space-y-2">
          <label className="text-xs font-semibold text-slate-300">Enter Secret Security Passcode</label>
          <input
            type="password"
            placeholder="Enter passcode"
            value={adminPasscode}
            onChange={(e) => setAdminPasscode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-white"
          />
        </div>
        <button
          onClick={() => {
            if (adminPasscode === appConfig.adminPin || adminPasscode === 'admin') {
              setIsAdminLoggedIn(true);
              setCurrentScreen('admin_panel');
            } else {
              alert('Galat Passcode!');
            }
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30"
        >
          Unlock Master Control Panel
        </button>
      </div>
    </div>
  );

  // ==================== SUPER ADMIN PANEL (ALL TABS) ====================
  const renderAdminPanel = () => (
    <div className="min-h-screen bg-slate-950 text-white p-4 max-w-4xl mx-auto space-y-5 pb-20">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold uppercase">
            Master Dynamic Console
          </span>
          <h1 className="text-lg font-bold mt-1">Super Admin Panel</h1>
        </div>
        <button onClick={() => setCurrentScreen('app')} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300 border border-slate-700 flex items-center space-x-1">
          <Eye className="w-3.5 h-3.5 mr-1 text-blue-400" />
          <span>View App Live</span>
        </button>
      </div>

      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'splash_quote', label: 'Splash & Quotes', icon: Sparkles },
          { id: 'logo_brand', label: 'Logo & Branding', icon: Image },
          { id: 'onboarding', label: 'Onboarding', icon: Layout },
          { id: 'home_icons', label: 'Home Icons', icon: Monitor },
          { id: 'pages', label: 'Add Pages & Links', icon: Layers },
          { id: 'social', label: 'Social Media', icon: Globe },
          { id: 'ads', label: 'Ads & Earning', icon: DollarSign },
          { id: 'monetization', label: 'Ad Platforms', icon: Zap },
          { id: 'upload', label: 'Upload Center', icon: Upload },
          { id: 'content', label: 'Leaders & Books', icon: BookOpen },
          { id: 'security', label: 'Security PIN', icon: Key },
          { id: 'ebooks', label: 'eBooks', icon: BookOpen },
          { id: 'themes', label: 'Themes & Fonts', icon: Palette },
          { id: 'donate_settings', label: 'Donate / UPI', icon: HeartHandshake }
        ].map((t) => {
          const Icon = t.icon;
          const isAct = adminTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setAdminTab(t.id)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl font-bold transition-all flex-shrink-0 ${
                isAct ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Splash & Quotes */}
{adminTab === 'splash_quote' && (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
    <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
      Opening Animation & Quote Settings
    </h2>

    <div className="space-y-3">
      {/* App Title */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">App Title Name</label>
        <input
          type="text"
          value={appConfig.splashTitle}
          onChange={(e) => setAppConfig({ ...appConfig, splashTitle: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
        />
      </div>

      {/* Opening Tagline */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">Opening Tagline</label>
        <input
          type="text"
          value={appConfig.splashTagline}
          onChange={(e) => setAppConfig({ ...appConfig, splashTagline: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
        />
      </div>

      <div className="pt-2 border-t border-slate-800 space-y-3">
        {/* Quote of the Day */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Quote of the Day</label>
          <textarea
            value={appConfig.quoteOfTheDay}
            onChange={(e) => setAppConfig({ ...appConfig, quoteOfTheDay: e.target.value })}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white resize-none"
          />
        </div>

        {/* Quote Author */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Quote Author</label>
          <input
            type="text"
            value={appConfig.quoteAuthor}
            onChange={(e) => setAppConfig({ ...appConfig, quoteAuthor: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>

        {/* ========== IMAGE UPLOAD / DELETE SECTION ========== */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Quote Image</label>

          {/* Current Image Preview */}
          {appConfig.quoteImage ? (
            <div className="flex items-center gap-3 mb-2">
              <img
                src={appConfig.quoteImage}
                alt="Quote"
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400/50"
              />
              <button
                onClick={() => {
                  if (confirm("Quote image delete karna hai?")) {
                    setAppConfig({ ...appConfig, quoteImage: "" });
                  }
                }}
                className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Image
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 mb-2">No image selected</p>
          )}

          {/* Upload new image */}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              try {
                const url = await uploadToCloudinary(file);
                setAppConfig((prev) => ({ ...prev, quoteImage: url }));
                alert("✅ Quote image uploaded!");
              } catch (err) {
                alert("Upload failed: " + err.message);
              }
            }}
            className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:text-xs file:font-bold"
          />

          {/* Manual URL option */}
          <input
            type="text"
            value={appConfig.quoteImage || ""}
            onChange={(e) => setAppConfig({ ...appConfig, quoteImage: e.target.value })}
            placeholder="Ya image URL paste karo..."
            className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>
      </div>

      {/* REAL SAVE BUTTON */}
      <button
        onClick={saveAllSettings}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5"
      >
        <CheckCircle className="w-4 h-4" />
        <span>Save Changes (Permanent)</span>
      </button>
    </div>
  </div>
)}

      {/* Logo & Branding */}
{adminTab === 'logo_brand' && (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
    <h2 className="text-xs font-bold text-amber-400 uppercase">Logo & Branding</h2>
    
    <div>
      <label className="text-xs font-semibold text-slate-300 block mb-1">Logo Text (fallback)</label>
      <input 
        type="text" 
        value={appConfig.logoText} 
        onChange={(e) => setAppConfig({...appConfig, logoText: e.target.value})}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
      />
    </div>

    <div>
      <label className="text-xs font-semibold text-slate-300 block mb-1">Logo Image URL</label>
      <input 
        type="text" 
        value={appConfig.logoUrl} 
        onChange={(e) => setAppConfig({...appConfig, logoUrl: e.target.value})}
        placeholder="https://..." 
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
      />
    </div>

    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={async (e) => {
          const f = e.target.files[0];
          if (!f) return;
          try {
            const url = await uploadToCloudinary(f);
            setAppConfig(prev => ({ ...prev, logoUrl: url }));
            alert("✅ Logo uploaded successfully!");
          } catch (err) {
            alert("Logo upload failed: " + err.message);
          }
        }} 
        className="text-xs text-slate-400"
      />
      <button 
        onClick={saveAllSettings}
        className="mt-2 bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
      >
        Save Logo
      </button>
    </div>
  </div>
)}
              
                      {/* Onboarding */}
{adminTab === 'onboarding' && (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
    <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
      Onboarding Screens (3 Steps)
    </h2>

    {onboardingContent.map((ob, idx) => (
      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-amber-400 font-bold">Step {ob.step}</p>
          <button
            onClick={() => {
              if (confirm(`Step ${ob.step} ka content clear karna hai?`)) {
                const updated = [...onboardingContent];
                updated[idx] = { ...updated[idx], title: '', desc: '', image: '', icon: '' };
                setOnboardingContent(updated);
              }
            }}
            className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-lg font-bold flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Title</label>
          <input
            type="text"
            value={ob.title}
            onChange={(e) => {
              const updated = [...onboardingContent];
              updated[idx].title = e.target.value;
              setOnboardingContent(updated);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            placeholder="Step title..."
          />
        </div>

        {/* Description / Thought */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Description / Thought</label>
          <textarea
            value={ob.desc}
            onChange={(e) => {
              const updated = [...onboardingContent];
              updated[idx].desc = e.target.value;
              setOnboardingContent(updated);
            }}
            rows={3}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white resize-none"
            placeholder="Is step ka vichar / description..."
          />
        </div>

        {/* Icon Text (fallback) */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Icon Text (agar image nahi hai)</label>
          <input
            type="text"
            value={ob.icon || ''}
            onChange={(e) => {
              const updated = [...onboardingContent];
              updated[idx].icon = e.target.value;
              setOnboardingContent(updated);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            placeholder="B / book / heart..."
          />
        </div>

        {/* ========== IMAGE UPLOAD / DELETE ========== */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Step Image</label>

          {ob.image ? (
            <div className="flex items-center gap-3 mb-2">
              <img
                src={ob.image}
                alt={`Step ${ob.step}`}
                className="w-16 h-16 rounded-xl object-cover border border-amber-400/40"
              />
              <button
                onClick={() => {
                  if (confirm("Is step ki image delete karni hai?")) {
                    const updated = [...onboardingContent];
                    updated[idx].image = '';
                    setOnboardingContent(updated);
                  }
                }}
                className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Image
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 mb-2">No image selected</p>
          )}

          {/* Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              try {
                const url = await uploadToCloudinary(file);
                const updated = [...onboardingContent];
                updated[idx].image = url;
                setOnboardingContent(updated);
                alert(`✅ Step ${ob.step} image uploaded!`);
              } catch (err) {
                alert("Upload failed: " + err.message);
              }
            }}
            className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:text-xs file:font-bold"
          />

          {/* Manual URL */}
          <input
            type="text"
            value={ob.image || ''}
            onChange={(e) => {
              const updated = [...onboardingContent];
              updated[idx].image = e.target.value;
              setOnboardingContent(updated);
            }}
            placeholder="Ya image URL paste karo..."
            className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
      </div>
    ))}

    {/* Save Button */}
    <button
      onClick={saveAllSettings}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5"
    >
      <CheckCircle className="w-4 h-4" />
      <span>Save Onboarding (Permanent)</span>
    </button>
  </div>
)}

      {/* Home Icons */}
      {adminTab === 'home_icons' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase">Home Quick Action Icons</h2>
          {homeIcons.map((ic, idx) => (
            <div key={ic.id} className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg">
              <input type="text" value={ic.label} onChange={(e) => {
                const u = [...homeIcons]; u[idx].label = e.target.value; setHomeIcons(u);
              }} className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" />
              <input type="text" value={ic.color} onChange={(e) => {
                const u = [...homeIcons]; u[idx].color = e.target.value; setHomeIcons(u);
              }} className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" />
            </div>
          ))}
          <button onClick={saveAllSettings} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Save Icons</button>
        </div>
      )}

      {/* Pages */}
      {adminTab === 'pages' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-xs font-bold text-amber-400 uppercase">Add New Custom Page</h2>
            <input type="text" placeholder="Page Title" value={newPageTitle} onChange={(e) => setNewPageTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            <textarea placeholder="Page Content" value={newPageContent} onChange={(e) => setNewPageContent(e.target.value)} rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white resize-none" />
            <button onClick={() => {
              if (!newPageTitle.trim()) return;
              setCustomPages([...customPages, { id: Date.now().toString(), title: newPageTitle, content: newPageContent }]);
              setNewPageTitle(''); setNewPageContent('');
              alert('Naya Page add ho gaya!');
            }} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1">
              <Plus className="w-4 h-4" /> <span>Publish New Page</span>
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-white mb-2">Live Custom Pages ({customPages.length})</h3>
            {customPages.map((pg) => (
              <div key={pg.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <p className="text-xs font-bold text-white">{pg.title}</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-xs">{pg.content}</p>
                </div>
                <button onClick={() => setCustomPages(customPages.filter(p => p.id !== pg.id))} className="p-1.5 bg-red-500/10 text-red-400 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social */}
      {adminTab === 'social' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-xs font-bold text-amber-400 uppercase">Add Social Media Links</h2>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Platform Name" value={newSocialPlatform} onChange={(e) => setNewSocialPlatform(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              <input type="text" placeholder="URL" value={newSocialUrl} onChange={(e) => setNewSocialUrl(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <button onClick={() => {
              if (!newSocialPlatform.trim() || !newSocialUrl.trim()) return;
              setSocialLinks([...socialLinks, { id: Date.now().toString(), platform: newSocialPlatform, url: newSocialUrl, active: true }]);
              setNewSocialPlatform(''); setNewSocialUrl('');
              alert('Social Link added!');
            }} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1">
              <Plus className="w-4 h-4" /> <span>Add Social Link</span>
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-white mb-2">Current Social Channels</h3>
            {socialLinks.map((s) => (
              <div key={s.id} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <p className="text-xs font-bold text-white">{s.platform}</p>
                  <p className="text-[10px] text-blue-400 font-mono">{s.url}</p>
                </div>
                <button onClick={() => setSocialLinks(socialLinks.filter(item => item.id !== s.id))} className="p-1.5 bg-red-500/10 text-red-400 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ads */}
      {adminTab === 'ads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase">Ads & Banner Revenue Control</h2>
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Enable In-App Ads / Banners</p>
              <p className="text-[10px] text-slate-400">Turn banners ON/OFF</p>
            </div>
            <button onClick={() => setAppConfig({ ...appConfig, enableAds: !appConfig.enableAds })}
              className={`p-2 rounded-xl font-bold text-xs flex items-center space-x-1 ${appConfig.enableAds ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-600/20 text-red-400 border border-red-500/30'}`}>
              {appConfig.enableAds ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              <span>{appConfig.enableAds ? 'Ads Active' : 'Ads Disabled'}</span>
            </button>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block">Sponsored Banner Ad Text</label>
            <input type="text" value={appConfig.adBannerText} onChange={(e) => setAppConfig({ ...appConfig, adBannerText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <button onClick={() => alert('Ads Settings Saved!')} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Save Ads Settings</button>
        </div>
      )}

      {/* Monetization / Ad Platforms */}
      {adminTab === 'monetization' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase">Ad Platforms (AdMob / Google / Others)</h2>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-white">Google AdMob</p>
              <button onClick={() => setAdPlatforms({...adPlatforms, admob: {...adPlatforms.admob, enabled: !adPlatforms.admob.enabled}})}
                className={`text-xs px-2 py-1 rounded ${adPlatforms.admob.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {adPlatforms.admob.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <input placeholder="AdMob App ID" value={adPlatforms.admob.appId} onChange={(e) => setAdPlatforms({...adPlatforms, admob: {...adPlatforms.admob, appId: e.target.value}})}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white" />
            <input placeholder="Banner Ad Unit ID" value={adPlatforms.admob.bannerId} onChange={(e) => setAdPlatforms({...adPlatforms, admob: {...adPlatforms.admob, bannerId: e.target.value}})}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white" />
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-white">Google Ads</p>
              <button onClick={() => setAdPlatforms({...adPlatforms, googleAds: {...adPlatforms.googleAds, enabled: !adPlatforms.googleAds.enabled}})}
                className={`text-xs px-2 py-1 rounded ${adPlatforms.googleAds.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {adPlatforms.googleAds.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <input placeholder="Client ID" value={adPlatforms.googleAds.clientId} onChange={(e) => setAdPlatforms({...adPlatforms, googleAds: {...adPlatforms.googleAds, clientId: e.target.value}})}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white" />
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-white">Other / Custom Ad Network</p>
              <button onClick={() => setAdPlatforms({...adPlatforms, other: {...adPlatforms.other, enabled: !adPlatforms.other.enabled}})}
                className={`text-xs px-2 py-1 rounded ${adPlatforms.other.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {adPlatforms.other.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <input placeholder="Network Name" value={adPlatforms.other.name} onChange={(e) => setAdPlatforms({...adPlatforms, other: {...adPlatforms.other, name: e.target.value}})}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white" />
          </div>
          <button onClick={() => alert('Ad platform settings saved!')} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Save Ad Platforms</button>
        </div>
      )}

      {/* Upload Center */}
      {adminTab === 'upload' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase">Upload Center (Link ya Device Storage)</h2>
          <div className="flex space-x-2">
            {['video', 'pdf', 'image', 'book'].map(t => (
              <button key={t} onClick={() => setUploadForm({...uploadForm, type: t})}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${uploadForm.type === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          <input type="text" placeholder="Title" value={uploadForm.title} onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          <input type="text" placeholder="Author / Channel" value={uploadForm.author} onChange={(e) => setUploadForm({...uploadForm, author: e.target.value})}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <p className="text-xs font-bold text-white flex items-center"><LinkIcon className="w-3.5 h-3.5 mr-1" /> Option 1: Paste Link</p>
            <input type="text" placeholder="https://..." value={uploadForm.link} onChange={(e) => setUploadForm({...uploadForm, link: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white" />
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <p className="text-xs font-bold text-white flex items-center"><Upload className="w-3.5 h-3.5 mr-1" /> Option 2: Device Storage se Upload</p>
            <input type="file" accept={uploadForm.type === 'video' ? 'video/*' : uploadForm.type === 'pdf' || uploadForm.type === 'book' ? '.pdf' : 'image/*'} 
              onChange={handleFileUpload} className="text-xs text-slate-400" />
            {uploadForm.uploading && <p className="text-[10px] text-amber-400">Uploading...</p>}
            {uploadForm.fileName && !uploadForm.uploading && (
              <p className="text-[10px] text-emerald-400">
                Selected: {uploadForm.fileName}
                {uploadForm.imageUrl && " ✅ Uploaded"}
              </p>
            )}
          </div>
          <button onClick={() => {
            if (!uploadForm.title) return alert('Title required');
          
            // Agar device se upload kiya hai to Cloudinary URL use karo, warna link
            const finalUrl = uploadForm.imageUrl || uploadForm.link;
          
            if (uploadForm.type === 'video') {
              setVideosList(prev => [...prev, {
                id: Date.now().toString(),
                title: uploadForm.title,
                duration: '00:00',
                author: uploadForm.author || 'Admin',
                views: '0',
                thumbnail: finalUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500'
              }]);
            } 
            else if (uploadForm.type === 'pdf' || uploadForm.type === 'book') {
              setBooksList(prev => [...prev, {
                id: Date.now().toString(),
                title: uploadForm.title,
                pages: '0',
                size: '0 MB',
                author: uploadForm.author || 'Admin',
                rating: 5.0,
                cover: finalUrl || 'bg-gradient-to-br from-blue-900 to-indigo-950',
                fileUrl: finalUrl
              }]);
            }
            else if (uploadForm.type === 'image') {
              // Image ke liye alag list nahi hai to abhi alert + console
              alert("Image uploaded: " + finalUrl);
              console.log("Image URL:", finalUrl);
            }
          
            alert(`${uploadForm.type.toUpperCase()} successfully added!`);
            setUploadForm({ type: 'video', title: '', link: '', file: null, fileName: '', imageUrl: '', author: '', uploading: false });
          }} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1">
            <Plus className="w-4 h-4" /> <span>Publish Upload</span>
          </button>
        </div>
      )}

      {/* Content */}
      {adminTab === 'content' && (
  <div className="space-y-4">
    
    {/* Buttons */}
    <div className="flex flex-wrap gap-2">
      <button 
        onClick={() => { resetReformerForm(); setShowAddReformer(true); }}
        className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
      >
        + Add Reformer
      </button>
    </div>

    {/* Add / Edit Form */}
    {showAddReformer && (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-amber-400">
          {editingReformer ? 'Edit Reformer' : 'Add New Reformer'}
        </h3>

        <input 
          type="text" 
          placeholder="Full Name (e.g. Dr. B. R. Ambedkar)"
          value={reformerForm.name}
          onChange={(e) => setReformerForm({...reformerForm, name: e.target.value})}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
        />

        <input 
          type="text" 
          placeholder="Title (e.g. Babasaheb / Constitution Maker)"
          value={reformerForm.title}
          onChange={(e) => setReformerForm({...reformerForm, title: e.target.value})}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
        />

        <input 
          type="text" 
          placeholder="Years (e.g. 1891 - 1956)"
          value={reformerForm.years}
          onChange={(e) => setReformerForm({...reformerForm, years: e.target.value})}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
        />

        <textarea 
          placeholder="Biography"
          value={reformerForm.bio}
          onChange={(e) => setReformerForm({...reformerForm, bio: e.target.value})}
          rows={3}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
        />

        <input 
          type="text" 
          placeholder="Famous Quote"
          value={reformerForm.quotes}
          onChange={(e) => setReformerForm({...reformerForm, quotes: e.target.value})}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
        />

        {/* Image Upload */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400">Main Photo</p>
          <input 
            type="file" 
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              try {
                setReformerForm(prev => ({...prev, uploading: true}));
                const url = await uploadToCloudinary(file);
                setReformerForm(prev => ({...prev, image: url, uploading: false}));
              } catch (err) {
                alert("Upload failed");
                setReformerForm(prev => ({...prev, uploading: false}));
              }
            }}
            className="text-xs text-slate-400"
          />
          {reformerForm.uploading && <p className="text-xs text-amber-400">Uploading...</p>}
          {reformerForm.image && (
            <img src={reformerForm.image} alt="Preview" className="w-20 h-20 object-cover rounded-xl" />
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button 
            onClick={saveReformer}
            className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs"
          >
            {editingReformer ? 'Update Reformer' : 'Save Reformer'}
          </button>
          <button 
            onClick={resetReformerForm}
            className="px-4 bg-slate-700 text-white font-bold py-2 rounded-xl text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {/* Existing Leaders List */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      <h3 className="text-xs font-bold text-white">Current Leaders ({mahapurushList.length})</h3>
      
      {mahapurushList.map((leader) => (
        <div key={leader.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src={leader.image || 'https://via.placeholder.com/50'} 
              alt={leader.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-bold text-white">{leader.name}</p>
              <p className="text-[10px] text-slate-400">{leader.title}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => startEditReformer(leader)}
              className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => deleteReformer(leader.id)}
              className="p-2 bg-red-600/20 text-red-400 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      {/* Security PIN */}
      {adminTab === 'security' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase">Change Admin Security PIN</h2>
          <p className="text-xs text-slate-400">Input blank rehta hai. Naya PIN set karein.</p>
          <input type="password" placeholder="New PIN" value={newAdminPin} onChange={(e) => setNewAdminPin(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          <input type="password" placeholder="Confirm New PIN" value={confirmAdminPin} onChange={(e) => setConfirmAdminPin(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          <button onClick={() => {
            if (newAdminPin && newAdminPin === confirmAdminPin) {
              setAppConfig({...appConfig, adminPin: newAdminPin});
              setNewAdminPin(''); setConfirmAdminPin('');
              alert('Admin PIN successfully changed!');
            } else alert('PIN match nahi kiya ya empty hai');
          }} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Update PIN</button>
        </div>
      )}

      {/* ==================== eBOOKS MANAGEMENT ==================== */}
{adminTab === 'ebooks' && (
  <div className="space-y-5">
    
    {/* Sub Tabs */}
    <div className="flex flex-wrap gap-2">
      {['mahapurush', 'languages', 'upload', 'analytics'].map((sub) => (
        <button
          key={sub}
          onClick={() => setEbookSubTab(sub)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            ebookSubTab === sub 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          {sub === 'mahapurush' && 'Mahapurush'}
          {sub === 'languages' && 'Languages'}
          {sub === 'upload' && 'Upload Book'}
          {sub === 'analytics' && 'Analytics'}
        </button>
      ))}
    </div>

    {/* ===== MAHAPURUSH MANAGEMENT ===== */}
    {ebookSubTab === 'mahapurush' && (
      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase">Add / Edit Mahapurush</h3>
          
          <input
            type="text"
            placeholder="Name (Dr. B. R. Ambedkar)"
            value={ebookForm.name}
            onChange={(e) => setEbookForm({...ebookForm, name: e.target.value})}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Photo URL"
            value={ebookForm.photo}
            onChange={(e) => setEbookForm({...ebookForm, photo: e.target.value})}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          />
          <textarea
            placeholder="Short Bio"
            value={ebookForm.bio}
            onChange={(e) => setEbookForm({...ebookForm, bio: e.target.value})}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white resize-none"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Order"
              value={ebookForm.order}
              onChange={(e) => setEbookForm({...ebookForm, order: e.target.value})}
              className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <select
              value={ebookForm.status}
              onChange={(e) => setEbookForm({...ebookForm, status: e.target.value})}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <button
            onClick={saveEbookMahapurush}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
          >
            {ebookForm.id ? 'Update Mahapurush' : 'Add Mahapurush'}
          </button>
        </div>

        {/* List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-80 overflow-y-auto">
          <h3 className="text-xs font-bold text-white mb-2">All Mahapurush ({ebookMahapurush.length})</h3>
          {ebookMahapurush.map((mp) => (
            <div key={mp.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <img src={mp.photo || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-bold text-white">{mp.name}</p>
                  <p className="text-[10px] text-slate-400">Order: {mp.order} • {mp.status}</p>
                </div>
              </div>
              <button
                onClick={() => setEbookForm({...mp})}
                className="text-blue-400 text-xs font-bold"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* ===== LANGUAGE MANAGEMENT ===== */}
    {ebookSubTab === 'languages' && (
      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase">Add Language</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Language Name (Hindi)"
              value={langForm.name}
              onChange={(e) => setLangForm({...langForm, name: e.target.value})}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Code (hi)"
              value={langForm.code}
              onChange={(e) => setLangForm({...langForm, code: e.target.value})}
              className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <button
            onClick={saveLanguage}
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs"
          >
            Add Language
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <h3 className="text-xs font-bold text-white mb-2">Global Languages</h3>
          {ebookLanguages.map((lang) => (
            <div key={lang.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-medium text-white">{lang.name} ({lang.code})</span>
              <button
                onClick={() => toggleLanguage(lang.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  lang.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {lang.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* ===== UPLOAD BOOK (FIREBASE STORAGE) ===== */}
    {ebookSubTab === 'upload' && (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        <h3 className="text-xs font-bold text-amber-400 uppercase">Upload eBook (Cloudinary)</h3>

        <select
          value={bookUploadForm.mahapurushId}
          onChange={(e) => setBookUploadForm({...bookUploadForm, mahapurushId: e.target.value})}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
        >
          <option value="">Select Mahapurush</option>
          {ebookMahapurush.map(mp => (
            <option key={mp.id} value={mp.id}>{mp.name}</option>
          ))}
        </select>

        <select
          value={bookUploadForm.languageId}
          onChange={(e) => setBookUploadForm({...bookUploadForm, languageId: e.target.value})}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
        >
          <option value="">Select Language</option>
          {ebookLanguages.filter(l => l.enabled).map(lang => (
            <option key={lang.id} value={lang.id}>{lang.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Book Title"
          value={bookUploadForm.title}
          onChange={(e) => setBookUploadForm({...bookUploadForm, title: e.target.value})}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
        />

        <input
          type="text"
          placeholder="Author"
          value={bookUploadForm.author}
          onChange={(e) => setBookUploadForm({...bookUploadForm, author: e.target.value})}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
        />

        <input
          type="text"
          placeholder="Category (Social Justice)"
          value={bookUploadForm.category}
          onChange={(e) => setBookUploadForm({...bookUploadForm, category: e.target.value})}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={bookUploadForm.featured}
            onChange={(e) => setBookUploadForm({...bookUploadForm, featured: e.target.checked})}
          />
          <span className="text-xs text-slate-300">Featured Book</span>
        </div>

        <textarea
          placeholder="Short Description"
          value={bookUploadForm.description}
          onChange={(e) => setBookUploadForm({...bookUploadForm, description: e.target.value})}
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white resize-none"
        />

        {/* Cover Image */}
        <div>
          <p className="text-[10px] text-slate-400 mb-1">Cover Image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBookUploadForm({...bookUploadForm, coverFile: e.target.files[0]})}
            className="text-xs text-slate-400 mb-1"
          />
          <input
            type="text"
            placeholder="Or paste Cover URL"
            value={bookUploadForm.coverUrl}
            onChange={(e) => setBookUploadForm({...bookUploadForm, coverUrl: e.target.value})}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>

        {/* PDF */}
        <div>
          <p className="text-[10px] text-slate-400 mb-1">PDF File (Local) ya Link</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setBookUploadForm({...bookUploadForm, pdfFile: e.target.files[0]})}
            className="text-xs text-slate-400 mb-1"
          />
          <input
            type="text"
            placeholder="Or paste PDF Direct Link"
            value={bookUploadForm.pdfUrl}
            onChange={(e) => setBookUploadForm({...bookUploadForm, pdfUrl: e.target.value})}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>

        {/* Progress */}
        {bookUploading && (
          <div>
            <p className="text-xs text-amber-400 mb-1">Uploading... {uploadProgress}%</p>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={saveEbookBook}
          disabled={bookUploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs"
        >
          {bookUploading ? `Uploading ${uploadProgress}%...` : 'Upload & Publish eBook'}
        </button>
      </div>
    )}

    {/* ===== ANALYTICS ===== */}
    {ebookSubTab === 'analytics' && (
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{ebookBooks.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Total Books</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{ebookLanguages.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Languages</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{ebookMahapurush.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Mahapurush</p>
        </div>
      </div>
    )}
  </div>
)}

      {/* Themes */}
      {adminTab === 'themes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase">Themes / Fonts / Colors</h2>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Color</label>
            <input type="color" value={appConfig.primaryColor} onChange={(e) => setAppConfig({...appConfig, primaryColor: e.target.value})} className="w-full h-10 rounded" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Accent Color</label>
            <input type="color" value={appConfig.accentColor} onChange={(e) => setAppConfig({...appConfig, accentColor: e.target.value})} className="w-full h-10 rounded" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Font Family</label>
            <select value={appConfig.fontFamily} onChange={(e) => setAppConfig({...appConfig, fontFamily: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
              <option>Inter</option>
              <option>Poppins</option>
              <option>Roboto</option>
              <option>Noto Sans</option>
            </select>
          </div>
          <button onClick={() => alert('Theme saved!')} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Save Theme</button>
        </div>
      )}

      {/* Donate / UPI */}
      {adminTab === 'donate_settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase">Donate / UPI Settings</h2>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">UPI ID</label>
            <input type="text" value={appConfig.upiId} onChange={(e) => setAppConfig({...appConfig, upiId: e.target.value})}
              placeholder="rikive@upi" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <p className="text-xs text-slate-400">User jab Proceed dabayega to UPI app open hoga.</p>
          <button onClick={() => alert('UPI settings saved!')} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Save UPI</button>
        </div>
      )}
    </div>
  );

  // ==================== SCREEN CONTROLLER ====================
  if (currentScreen === 'splash') return renderSplash();
  if (currentScreen === 'onboarding') return renderOnboarding();
  if (currentScreen === 'auth') return renderAuth();
  if (currentScreen === 'admin_login') return renderAdminLogin();
  if (currentScreen === 'admin_panel') return renderAdminPanel();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center font-sans">
      {donationModal && renderDonationModal()}
      <div className="w-full max-w-md bg-slate-950 border-x border-slate-800 min-h-screen relative flex flex-col shadow-2xl">
        {renderHeader()}
        <main className="flex-1 p-3.5 overflow-y-auto">
          {activeTab === 'home' && renderHomeContent()}
          {activeTab === 'mahapurush' && renderMahapurushModule()}
          {activeTab === 'library' && renderLibraryModule()}
          {activeTab === 'media' && (
            <div className="space-y-3 pb-20">
              <h2 className="text-base font-bold text-white">Videos & Media</h2>
              {videosList.map((vid) => (
                <div key={vid.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="relative h-40 bg-slate-800">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                    <button className="absolute inset-0 m-auto w-10 h-10 bg-amber-500/90 rounded-full flex items-center justify-center text-slate-950 shadow-lg">
                      <Play className="w-5 h-5 ml-0.5 fill-slate-950" />
                    </button>
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-xs font-bold text-white">{vid.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'community' && renderCommunityModule()}
          {activeTab === 'pages' && renderCustomPagesModule()}
          {activeTab === 'profile' && renderProfileModule()}
        </main>
        {renderBottomNav()}
      </div>
    </div>
  );
}
