// ===== شاشة التحميل =====
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');

    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        app.classList.add('visible');
      }, 1600);
    });

    // احتياط في حال تأخر حدث load
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      app.classList.add('visible');
    }, 3500);

    // ===== دعم تفضيل تقليل الحركة على مستوى النظام =====
    const systemPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function reduceMotion(){ return systemPrefersReducedMotion; }

    // ===== زر العودة للأعلى =====
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 420);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
    });

    // ===== البحث عن خدمة باسمها =====
    const searchInput = document.getElementById('service-search');
    const searchClear = document.getElementById('search-clear');
    const searchMeta = document.getElementById('search-meta');
    const searchResults = document.getElementById('search-results');
    const searchEmpty = document.getElementById('search-empty');
    const tabsBar = document.querySelector('.tabs-bar');
    const tabsContent = document.getElementById('tabs-content');

    const allCards = Array.from(document.querySelectorAll('#tabs-content .service-card'));

    function runSearch(query){
      const q = query.trim().toLocaleLowerCase('ar');

      searchClear.classList.toggle('show', q.length > 0);

      if (!q){
        // العودة للوضع الطبيعي بالتبويبات
        tabsBar.style.display = '';
        tabsContent.style.display = '';
        searchResults.style.display = 'none';
        searchEmpty.style.display = 'none';
        searchResults.innerHTML = '';
        searchMeta.textContent = '';
        return;
      }

      // وضع نتائج البحث: نبحث في كل الخدمات بجميع التبويبات
      tabsBar.style.display = 'none';
      tabsContent.style.display = 'none';

      const matches = allCards.filter(card => {
        const name = card.querySelector('h3').textContent.toLocaleLowerCase('ar');
        return name.includes(q);
      });

      searchResults.innerHTML = '';
      matches.forEach(card => {
        searchResults.appendChild(card.cloneNode(true));
      });

      if (matches.length === 0){
        searchResults.style.display = 'none';
        searchEmpty.style.display = 'block';
        searchMeta.textContent = currentLang === 'ar' ? 'لا توجد نتائج' : 'No results found';
      } else {
        searchResults.style.display = 'grid';
        searchEmpty.style.display = 'none';
        searchMeta.textContent = currentLang === 'ar'
          ? `${matches.length} خدمة مطابقة لـ "${query.trim()}"`
          : `${matches.length} services matching "${query.trim()}"`;
      }
    }

    searchInput.addEventListener('input', (e) => runSearch(e.target.value));
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      runSearch('');
      searchInput.focus();
    });

    // ===== النقر على نتيجة بحث: الانتقال لتبويبها الأصلي بدل فتح الصفحة مباشرة =====
    searchResults.addEventListener('click', (e) => {
      // إذا كان النقر على زر "ابدأ الخدمة" نفسه، اترك السلوك الافتراضي (فتح الصفحة عبر معالج الروابط)
      if (e.target.closest('.card-cta')) return;

      const card = e.target.closest('.service-card');
      if (!card) return;

      const targetTab = card.dataset.tab;
      const targetId = card.id;

      searchInput.value = '';
      runSearch('');

      const btn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
      if (btn) btn.click();

      requestAnimationFrame(() => {
        const original = document.getElementById(targetId);
        if (original){
          original.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' });
          original.classList.add('highlight-flash');
          setTimeout(() => original.classList.remove('highlight-flash'), 1600);
        }
      });
    });

    // ===== تبديل الوضع الفاتح / الداكن (مع حفظ الاختيار عبر الصفحات) =====
    const THEME_STORAGE_KEY = 'khadamati-theme';
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const newTheme = isLight ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (err) {
        // تجاهل بأمان إذا كان التخزين غير متاح
      }
    });

    // ===== قاموس الترجمة (عربي / إنجليزي) =====
    const translations = {
      brandName: { ar: "منصة خدماتي", en: "MyServices Portal" },
      brandTagline: { ar: "البوابة الموحدة للخدمات الحكومية الرقمية", en: "The unified portal for digital government services" },
      statusConnected: { ar: "متصل بالنظام الرسمي", en: "Connected to the official system" },
      systemOk: { ar: "جميع الأنظمة تعمل بشكل طبيعي", en: "All systems are operating normally" },
      themeToggleAria: { ar: "التبديل إلى الوضع الفاتح", en: "Switch to light mode" },
      heroEyebrow: { ar: "مرحبًا بك", en: "Welcome" },
      heroTitle: { ar: "جميع خدماتك الرسمية في مكان واحد، بإجراءات موثوقة وواجهة واضحة.", en: "All your government services in one place, with trusted procedures and a clear interface." },
      heroDesc: { ar: "اختر التبويب المناسب لعرض الخدمات المتاحة، وأنجز معاملاتك إلكترونيًا دون الحاجة لمراجعة الجهات الحكومية.", en: "Pick a category to browse available services and complete your transactions online without visiting an office." },
      searchPlaceholder: { ar: "ابحث عن خدمة باسمها، مثل: جواز السفر", en: "Search for a service by name, e.g. passport" },
      searchAria: { ar: "ابحث عن خدمة باسمها", en: "Search for a service by name" },
      clearAria: { ar: "مسح البحث", en: "Clear search" },
      tabHome: { ar: "الرئيسية", en: "Home" },
      tabCivil: { ar: "الأحوال المدنية", en: "Civil Status" },
      tabTraffic: { ar: "المرور والنقل", en: "Traffic & Transport" },
      tabHealth: { ar: "الصحة", en: "Health" },
      tabMunicipality: { ar: "البلدية والعقار", en: "Municipality & Property" },
      tabLabor: { ar: "العمل والتقاعد", en: "Labor & Retirement" },
      badgePopular: { ar: "الأكثر طلبًا", en: "Most requested" },
      ctaText: { ar: "ابدأ الخدمة ‹", en: "Start service ›" },
      loadingText: { ar: "جارِ تحميل منصة خدماتي...", en: "Loading MyServices Portal..." },
      transitionText: { ar: "جارٍ الانتقال إلى الخدمة...", en: "Taking you to the service..." },
      searchEmptyText: { ar: "لا توجد خدمة مطابقة لبحثك. جرّب كلمة مختلفة.", en: "No matching service found. Try a different word." },
      backToTopAria: { ar: "العودة إلى أعلى الصفحة", en: "Back to top" },
      supportHeading: { ar: "الدعم والمساعدة", en: "Support & Help" },
      policiesHeading: { ar: "السياسات", en: "Policies" },
      statusHeading: { ar: "حالة النظام", en: "System Status" },
      linkContact: { ar: "مركز الاتصال", en: "Contact Center" },
      linkFaq: { ar: "الأسئلة الشائعة", en: "FAQ" },
      linkComplaint: { ar: "تقديم شكوى", en: "Submit a Complaint" },
      linkPrivacy: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
      linkTerms: { ar: "الشروط والأحكام", en: "Terms & Conditions" },
      statusPortal: { ar: "بوابة الخدمات", en: "Services portal" },
      statusAvailable: { ar: "متاحة", en: "available" },
      statusPayment: { ar: "الدفع الإلكتروني", en: "Online payment" },
      statusAvailable2: { ar: "متاح", en: "available" },
      statusNotify: { ar: "خدمة الإشعارات", en: "Notifications" },
      statusMaintenance: { ar: "صيانة مجدولة", en: "scheduled maintenance" },
      copyright: { ar: "جميع الحقوق محفوظة © 2026 منصة خدماتي — بوابة تجريبية للأغراض التصميمية", en: "© 2026 MyServices Portal. All rights reserved — a demo portal for design purposes." },

      card1Title:{ ar:"تجديد الهوية الوطنية", en:"Renew National ID" },
      card1Desc:{ ar:"تجديد بطاقة الهوية إلكترونيًا واستلامها دون مراجعة.", en:"Renew your ID card online and receive it without an office visit." },
      card2Title:{ ar:"إصدار جواز سفر", en:"Issue a Passport" },
      card2Desc:{ ar:"تقديم طلب جواز جديد ومتابعة حالة الإصدار.", en:"Submit a new passport request and track the issuance status." },
      card3Title:{ ar:"سداد الرسوم الحكومية", en:"Pay Government Fees" },
      card3Desc:{ ar:"عرض وسداد جميع الفواتير والمخالفات المستحقة.", en:"View and pay all outstanding bills and fines." },

      card4Title:{ ar:"إصدار شهادة ميلاد", en:"Issue a Birth Certificate" },
      card4Desc:{ ar:"استخراج شهادة ميلاد إلكترونية معتمدة فورًا.", en:"Get an instantly certified digital birth certificate." },
      card5Title:{ ar:"توثيق عقد الزواج", en:"Register a Marriage Contract" },
      card5Desc:{ ar:"تسجيل وتوثيق عقود الزواج والحصول على نسخة رسمية.", en:"Register and certify marriage contracts and get an official copy." },
      card6Title:{ ar:"تحديث سجل الأسرة", en:"Update Family Record" },
      card6Desc:{ ar:"إضافة أو تعديل بيانات أفراد الأسرة في السجل المدني.", en:"Add or edit family members' data in the civil record." },

      card7Title:{ ar:"تجديد رخصة القيادة", en:"Renew Driving License" },
      card7Desc:{ ar:"تجديد الرخصة الفورية إلكترونيًا لمدة تصل إلى خمس سنوات.", en:"Renew your license online instantly for up to five years." },
      card8Title:{ ar:"نقل ملكية مركبة", en:"Transfer Vehicle Ownership" },
      card8Desc:{ ar:"إتمام إجراءات نقل الملكية بين البائع والمشتري.", en:"Complete the ownership transfer between seller and buyer." },
      card9Title:{ ar:"الاستعلام عن المخالفات", en:"Check Traffic Violations" },
      card9Desc:{ ar:"عرض المخالفات المرورية المسجلة على المركبة.", en:"View traffic violations recorded against a vehicle." },

      card10Title:{ ar:"حجز موعد طبي", en:"Book a Medical Appointment" },
      card10Desc:{ ar:"حجز أو تعديل موعدك في المراكز الصحية الحكومية.", en:"Book or reschedule your appointment at public health centers." },
      card11Title:{ ar:"سجل التطعيمات", en:"Vaccination Record" },
      card11Desc:{ ar:"الاطلاع على سجل التطعيمات وإصدار شهادة رسمية.", en:"View your vaccination history and issue an official certificate." },
      card12Title:{ ar:"التحقق من التأمين الصحي", en:"Verify Health Insurance" },
      card12Desc:{ ar:"التحقق من حالة الوثيقة التأمينية وتغطيتها.", en:"Check your insurance policy status and coverage." },

      card13Title:{ ar:"إصدار رخصة بناء", en:"Issue a Building Permit" },
      card13Desc:{ ar:"تقديم مخططات البناء والحصول على الترخيص اللازم.", en:"Submit building plans and obtain the required permit." },
      card14Title:{ ar:"الاستعلام عن صك الملكية", en:"Check Property Deed" },
      card14Desc:{ ar:"التحقق من بيانات الصك العقاري والملاك المسجلين.", en:"Verify property deed data and registered owners." },
      card15Title:{ ar:"تقديم بلاغ بلدي", en:"Submit a Municipal Report" },
      card15Desc:{ ar:"إبلاغ البلدية عن مخالفات أو أعطال في الأحياء.", en:"Report violations or issues in your neighborhood to the municipality." },

      card16Title:{ ar:"توثيق عقد العمل", en:"Register a Work Contract" },
      card16Desc:{ ar:"اعتماد وتوثيق عقود العمل بين الموظف وجهة العمل.", en:"Certify and register work contracts between employee and employer." },
      card17Title:{ ar:"طلب التقاعد المبكر", en:"Apply for Early Retirement" },
      card17Desc:{ ar:"تقديم طلب التقاعد ومتابعة حالة الاستحقاقات.", en:"Submit a retirement request and track your entitlements." },
      card18Title:{ ar:"الاستعلام عن الإعانات", en:"Check Benefits" },
      card18Desc:{ ar:"عرض مستحقات إعانة التوطين والتحويلات الشهرية.", en:"View localization benefit entitlements and monthly transfers." },
    };

    let currentLang = 'ar';
    const langToggle = document.getElementById('lang-toggle');

    function applyLanguage(lang){
      currentLang = lang;
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) el.textContent = translations[key][lang];
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[key]) el.setAttribute('placeholder', translations[key][lang]);
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        if (translations[key]) el.setAttribute('aria-label', translations[key][lang]);
      });

      langToggle.textContent = lang === 'ar' ? 'English' : 'العربية';
      langToggle.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');

      // إعادة تشغيل البحث الحالي لتحديث نص "خدمة مطابقة" إن كان ظاهرًا
      if (searchInput.value.trim()) runSearch(searchInput.value);
    }

    langToggle.addEventListener('click', () => {
      applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
    });

    // ===== شاشة الانتقال بين الصفحات عند فتح أي رابط داخلي =====
    const pageTransition = document.getElementById('page-transition');

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href$=".html"]');
      if (!link) return;
      // إذا كانت البطاقة داخل نتائج البحث، دع معالج البحث يقرر أولًا (لا تفعل شيئًا هنا لروابط CTA؛ التنقل مطلوب فعلًا)
      e.preventDefault();
      pageTransition.classList.add('show');
      setTimeout(() => {
        window.location.href = link.getAttribute('href');
      }, 450);
    });

    // إخفاء شاشة الانتقال دائمًا عند ظهور الصفحة، بما في ذلك العودة عبر زر الرجوع
    // (حيث يستعيد المتصفح أحيانًا الصفحة من bfcache بنفس حالتها القديمة)
    window.addEventListener('pageshow', () => {
      pageTransition.classList.remove('show');
    });

    // ===== منطق التبويبات =====
    const tabButtons = document.querySelectorAll('.tab-btn');
    const panels = {
      home: document.getElementById('panel-home'),
      civil: document.getElementById('panel-civil'),
      traffic: document.getElementById('panel-traffic'),
      health: document.getElementById('panel-health'),
      municipality: document.getElementById('panel-municipality'),
      labor: document.getElementById('panel-labor'),
    };

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        Object.values(panels).forEach(p => p.classList.remove('active'));
        panels[btn.dataset.tab].classList.add('active');
      });
    });
