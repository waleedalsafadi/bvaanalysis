// Language and i18n Setup
const i18n = {
    en: {
        title: "Financial Variance Intelligence",
        subtitle: "Upload your Actuals and Budget data to generate an IPO-grade analysis",
        uploadActuals: "Upload Actuals",
        uploadBudget: "Upload Budget",
        dragDrop: "Drag & drop your CSV or Excel file here",
        genReportBtn: "Generate Report",
        loadDbBtn: "Load from Database",
        analyzing: "Analyzing financials...",
        lblDept: "Department Filter:",
        lblPeriod: "Time Period:",
        lblLeadership: "Audience View:",
        optAllDept: "All Departments",
        optFullYear: "Full Year (YTD)",
        optCFO: "CFO",
        optBoard: "Board of Directors",
        optDeptHead: "Department Head",
        aiSummary: "AI Executive Summary",
        reportTitle: "Full Year Variance Report",
        saveDbBtn: "Save to Database",
        exportCsvBtn: "Export CSV",
        thCategory: "P&L Category",
        thDep: "Department",
        thAcc: "Account",
        thBud: "Budget",
        thAct: "Actual",
        thDvar: "$ Variance",
        thPvar: "% Variance",
        catRevenue: 'Revenue',
        catCOGS: 'COGS',
        catOpex: 'Operating Expenses',
        catOther: 'Other Income & Expense',
        catTaxes: 'Taxes',
        catUncat: 'Uncategorized',
        subtotal: 'Subtotal',
        vsBudget: 'vs Budget',
        favorable: 'Favorable',
        unfavorable: 'Unfavorable',
        hypothesis: 'Commentary:'
    },
    ar: {
        title: "منصة تحليل الانحرافات المالية",
        subtitle: "ارفع بيانات الفعلي والميزانية للحصول على تحليل مالي مخصص للشركات الكبرى",
        uploadActuals: "رفع البيانات الفعلية",
        uploadBudget: "رفع بيانات الميزانية",
        dragDrop: "اسحب وأفلت ملف CSV أو إكسل هنا",
        genReportBtn: "إصدار التقرير",
        loadDbBtn: "استيراد من القاعدة",
        analyzing: "جاري تحليل البيانات المالية...",
        lblDept: "تصفية حسب القسم:",
        lblPeriod: "الفترة الزمنية:",
        lblLeadership: "صيغة التقرير للجمهور:",
        optAllDept: "جميع الأقسام",
        optFullYear: "العام بالكامل",
        optCFO: "المدير المالي CFO",
        optBoard: "مجلس الإدارة",
        optDeptHead: "مدير القسم",
        aiSummary: "الملخص التنفيذي بالذكاء الاصطناعي",
        reportTitle: "تقرير انحرافات السنة المالية",
        saveDbBtn: "حفظ في القاعدة",
        exportCsvBtn: "تصدير CSV",
        thCategory: "التصنيف المحاسبي",
        thDep: "القسم",
        thAcc: "الحساب",
        thBud: "الميزانية",
        thAct: "الفعلي",
        thDvar: "الانحراف ($)",
        thPvar: "الانحراف (%)",
        catRevenue: 'الإيرادات',
        catCOGS: 'تكلفة المبيعات',
        catOpex: 'المصاريف التشغيلية',
        catOther: 'إيرادات ومصاريف أخرى',
        catTaxes: 'الضرائب',
        catUncat: 'غير مصنف',
        subtotal: 'المجموع الفرعي',
        vsBudget: 'مقارنة بالميزانية',
        favorable: 'إيجابي',
        unfavorable: 'سلبي',
        hypothesis: 'التعليق المالي:'
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) {
            el.textContent = i18n[lang][key];
        }
    });

    if (mergedReportData) {
        renderDashboard(mergedReportData);
    }
}

document.getElementById('langToggleBtn').addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
});

const translateCategory = (cat) => {
    if (currentLang === 'en') return cat;
    switch(cat) {
        case 'Revenue': return i18n.ar.catRevenue;
        case 'COGS': return i18n.ar.catCOGS;
        case 'Operating Expenses': return i18n.ar.catOpex;
        case 'Other Income & Expense': return i18n.ar.catOther;
        case 'Taxes': return i18n.ar.catTaxes;
        default: return i18n.ar.catUncat;
    }
}

// Hypotheses Generator Based on Leadership Mode
function generateHypothesis(mode, isFav, category, account, lang) {
    const acc = account.toLowerCase();
    
    if (mode === 'CFO') {
        if (lang === 'en') {
            if (category === 'Revenue') return isFav ? 'Strong execution outperformed the target, driving positive top-line growth and naturally expanding volume-driven OPEX.' : 'Missed top-line forecasts indicate micro-market headwinds or delayed deal closures relative to pacing.';
            if (category === 'COGS') return isFav ? 'Effective vendor negotiations and margin optimizations reduced direct costs below required run rate.' : 'Tied directly to top-line performance; volume-driven direct costs expanded proportional to realized revenue throughput.';
            if (acc.includes('commissions')) return 'Directly mirrors top-line pipeline conversion; higher payouts triggered by exceeding targets.';
            if (acc.includes('salar')) return isFav ? 'Lower hiring velocity led to temporary personnel cost savings against forecasted runway.' : 'Slight head-count over-hiring or unanticipated compensation/bonus adjustments drove costs above planned overhead metrics.';
            if (acc.includes('infrastr')) return 'Capex/Opex projects deferred, driving structural savings in IT cost centers without impacting core SLAs.';
            return isFav ? 'Core efficiency realized, actively reducing total spend burn for this account line.' : 'Unplanned expansions in this account exceeded standard allocations due to discretionary over-spend.';
        } else {
            if (category === 'Revenue') return isFav ? 'تنفيذ قوي تجاوز الأهداف، مما أدى لنمو إيجابي في الإيرادات وزيادة في المصاريف المرتبطة بالمبيعات.' : 'عدم تحقيق التوقعات يعكس تحديات في السوق أو تأخراً في إغلاق الصفقات مقارنة بجدول التوقعات.';
            if (category === 'COGS') return isFav ? 'مفاوضات فعالة ووفورات بالهامش التشغيلي خفضت التكاليف المباشرة عن المعدل المعياري.' : 'زيادة طبيعية مرتبطة بنمو المبيعات؛ التكاليف المباشرة زادت طردياً مع حجم الإنتاج والمبيعات.';
            if (acc.includes('commissions')) return 'انعكاس مباشر لقوة التحويل في مسار المبيعات وتجاوز أهداف العمولات.';
            if (acc.includes('salar')) return isFav ? 'تباطؤ توظيف أدى لتحقيق وفر مالي قصير الأجل في مخصصات الرواتب.' : 'زيادة طفيفة في التوظيف أو تعديلات لم تكن مدرجة في الخطة أدت لتجاوز ميزانية الرواتب.';
            if (acc.includes('infrastr')) return 'تأجيل المشاريع التقنية أدى لوفر أساسي دون المساس بكفاءة التشغيل.';
            return isFav ? 'تحقيق كفاءة حقيقية وتقليل ملموس في الإنفاق التشغيلي لهذا الحساب.' : 'توسعات إنفاقية غير دورية أدت لتجاوز المخصصات المعتمدة.';
        }
    } 
    else if (mode === 'Board') {
        if (lang === 'en') {
            if (category === 'Revenue') return isFav ? 'Strategic targets shattered, securing strong long-term traction for the business.' : 'Revenue growth impacted by headwinds; mitigation strategy actively deploying.';
            if (category === 'COGS') return isFav ? 'Healthy gross margin expansion realized, signaling a highly highly scalable core engine.' : 'Gross margin contraction due to top-line volume scale-up.';
            if (category === 'Operating Expenses') return isFav ? 'Diligent capital allocation ensured lean operational burn-rate.' : 'Strategic localized investments triggered temporary OPEX elevation for future ROI.';
            return isFav ? 'Positive variance improving overall runway and cash predictability.' : 'Strategic necessary spend; zero material impact on runway or overarching goals.';
        } else {
            if (category === 'Revenue') return isFav ? 'تم تحطيم الأهداف الاستراتيجية، مما يعزز الاستقرار والنمو طويل الأجل.' : 'أثرت تحديات السوق على الإيرادات، ويجري اتخاذ التدابير الضرورية.';
            if (category === 'COGS') return isFav ? 'توسع صحي في مجمل الربح يعكس كفاءة نموذج العمل القابل للتوسع.' : 'انكماش نسبي في الهامش بسبب زيادة حجم المبيعات والتشغيل.';
            if (category === 'Operating Expenses') return isFav ? 'تخصيص صارم لرأس المال أدى لترشيد الإنفاق التشغيلي.' : 'استثمارات مرحلية مدروسة استدعت رفع الميزانية لتحقيق عوائد مستقبلية.';
            return isFav ? 'انحراف إيجابي يعزز السيولة والتدفقات النقدية.' : 'معدل إنفاق طبيعي ولا يهدد الأهداف الاستراتيجية للمنظمة.';
        }
    } 
    else { // DeptHead
        if (lang === 'en') {
            if (category === 'Revenue') return isFav ? 'Great work crushing targets. Continue incentivizing the team on these high-margin deals.' : 'Review Q3 pipeline coverage aggressively; focus reps on immediate closable opps.';
            if (category === 'COGS') return isFav ? 'Solid vendor management. Let\'s try to lock in these discounted rates for next cycle.' : 'Material costs creeping up. Need to renegotiate SLAs with primary suppliers this quarter.';
            if (acc.includes('salar') || acc.includes('train')) return isFav ? 'We have surplus budget. Let\'s accelerate key hiring reqs.' : 'We are over budget on personnel. Implement a hiring freeze for junior roles immediately.';
            return isFav ? 'Strong budget discipline. Reallocate this surplus to high-impact Q4 projects.' : 'We need to tighten purchase approvals going forward to pull this back in line.';
        } else {
            if (category === 'Revenue') return isFav ? 'عمل رائع في تجاوز الأهداف. استمروا في تحفيز الفريق للتركيز على هذه الصفقات المربحة.' : 'يجب مراجعة الصفقات المتأخرة فوراً ودفع الفريق لإغلاق الفرص المتاحة لتعويض النقص.';
            if (category === 'COGS') return isFav ? 'إدارة قوية للموردين. لنجاول تثبيت هذه الأسعار المخفضة للعام القادم.' : 'التكاليف في ازدياد. يجب إعادة التفاوض مع الموردين الأساسيين هذا الربع.';
            if (acc.includes('salar') || acc.includes('train')) return isFav ? 'لدينا فائض في هذه الميزانية، يمكننا تسريع عمليات التوظيف الحاسمة.' : 'تجاوزنا ميزانية الأفراد، يجب تفعيل التجميد الفوري للتوظيف الجديد غير الضروري.';
            return isFav ? 'انضباط مالي ممتاز. يمكنكم إعادة توجيه الفائض لمشاريع هامة.' : 'نحتاج لتقييد ومراجعة الموافقات الشرائية بقوة للعودة لمسار ميزانيتنا.';
        }
    }
}

// Supabase Setup
const supabaseUrl = 'https://vavlomulwbefbwbpyvzw.supabase.co';
const supabaseKey = 'sb_publishable_zIz2ay3HEAOMf6l-H9j7hg_Z9PMuvD3';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Account Mapping Logic
const ACCOUNT_MAPPING = {
    'revenue': 'Revenue', 'sales': 'Revenue', 'income': 'Revenue', 'subscription': 'Revenue', 'services': 'Revenue', 'fee': 'Revenue',
    'cogs': 'COGS', 'cost of': 'COGS', 'direct labor': 'COGS', 'materials': 'COGS', 'hosting': 'COGS', 'infrastructure': 'COGS', 'server': 'COGS', 'purchase': 'COGS',
    'salary': 'Operating Expenses', 'salaries': 'Operating Expenses', 'wage': 'Operating Expenses', 'benefits': 'Operating Expenses', 'allowance': 'Operating Expenses',
    'bonus': 'Operating Expenses', 'marketing': 'Operating Expenses', 'advertising': 'Operating Expenses', 'campaign': 'Operating Expenses', 'rent': 'Operating Expenses',
    'utilities': 'Operating Expenses', 'software': 'Operating Expenses', 'travel': 'Operating Expenses', 'entertainment': 'Operating Expenses', 'meals': 'Operating Expenses',
    'legal': 'Operating Expenses', 'professional': 'Operating Expenses', 'consulting': 'Operating Expenses', 'audit': 'Operating Expenses', 'depreciation': 'Operating Expenses',
    'amortization': 'Operating Expenses', 'insurance': 'Operating Expenses', 'office': 'Operating Expenses', 'supplies': 'Operating Expenses', 'training': 'Operating Expenses',
    'recruitment': 'Operating Expenses', 'maintenance': 'Operating Expenses', 'telecom': 'Operating Expenses', 'bank charges': 'Operating Expenses',
    'interest': 'Other Income & Expense', 'tax': 'Taxes', 'zakat': 'Taxes'
};

const CATEGORY_ORDER = {
    'Revenue': 1, 'COGS': 2, 'Operating Expenses': 3, 'Other Income & Expense': 4, 'Taxes': 5, 'Uncategorized': 99
};

function categorizeAccount(accountName, department) {
    if (!accountName) return 'Uncategorized';
    const accountLower = accountName.toLowerCase();
    for (const [key, category] of Object.entries(ACCOUNT_MAPPING)) {
        if (accountLower.includes(key)) return category;
    }
    const deptLower = department ? department.toLowerCase() : '';
    if (['finance', 'hr', 'human resources', 'it', 'information technology', 'marketing', 'sales', 'engineering', 'r&d', 'admin', 'management', 'operations', 'legal'].some(d => deptLower.includes(d))) {
        return 'Operating Expenses';
    }
    return 'Uncategorized';
}

// State
let actualsData = null;
let budgetData = null;
let mergedReportData = null;
let loadedFromDb = false;

// DOM Elements
const actualsBox = document.getElementById('actualsBox');
const budgetBox = document.getElementById('budgetBox');
const actualsFileInput = document.getElementById('actualsFile');
const budgetFileInput = document.getElementById('budgetFile');
const analyzeBtn = document.getElementById('analyzeBtn');
const fetchDataBtn = document.getElementById('fetchDataBtn');
const saveToDbBtn = document.getElementById('saveToDbBtn');
const loader = document.getElementById('loader');
const resultsSection = document.getElementById('resultsSection');
const exportCsvBtn = document.getElementById('exportCsvBtn');

const filtersPanel = document.getElementById('filtersPanel');
const deptFilter = document.getElementById('deptFilter');
const periodFilter = document.getElementById('periodFilter');
const leadershipModeFilter = document.getElementById('leadershipModeFilter');

function setupFileUpload(box, input, fileNameDisplayId, dataStoreKey) {
    const fileNameDisplay = document.getElementById(fileNameDisplayId);
    box.addEventListener('click', () => input.click());
    box.addEventListener('dragover', (e) => { e.preventDefault(); box.classList.add('dragover'); });
    box.addEventListener('dragleave', () => box.classList.remove('dragover'));
    box.addEventListener('drop', (e) => {
        e.preventDefault(); box.classList.remove('dragover');
        if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; handleFileSelect(input.files[0], box, fileNameDisplay, dataStoreKey); }
    });
    input.addEventListener('change', () => { if (input.files.length) handleFileSelect(input.files[0], box, fileNameDisplay, dataStoreKey); });
}

setupFileUpload(actualsBox, actualsFileInput, 'actualsFileName', 'actuals');
setupFileUpload(budgetBox, budgetFileInput, 'budgetFileName', 'budget');

function handleFileSelect(file, box, fileNameDisplay, dataStoreKey) {
    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) return alert('Please upload a valid CSV or Excel file.');
    fileNameDisplay.textContent = file.name;
    box.classList.add('has-file');
    loadedFromDb = false;

    const reader = new FileReader();
    reader.onload = function(e) {
        let parsedData = [];
        try {
            if (file.name.endsWith('.csv')) {
                parsedData = parseCSV(e.target.result);
            } else {
                const workbook = XLSX.read(new Uint8Array(e.target.result), {type: 'array'});
                parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {defval: 0});
            }
            parsedData = parsedData.map(row => {
                const newRow = {};
                for (let key in row) {
                    const normKey = key.trim();
                    if (normKey.toLowerCase().includes('actual')) newRow['Actual'] = row[key];
                    else if (normKey.toLowerCase().includes('budget')) newRow['Budget'] = row[key];
                    else newRow[normKey] = row[key];
                }
                return newRow;
            });
            if (dataStoreKey === 'actuals') actualsData = parsedData;
            else budgetData = parsedData;
            
            if (actualsData && budgetData) { 
                analyzeBtn.classList.add('ready'); 
                analyzeBtn.disabled = false; 
                fetchDataBtn.style.display = 'none'; 
            }
        } catch (error) {
            alert('Error parsing file: ' + error.message);
        }
    };
    if (file.name.endsWith('.csv')) reader.readAsText(file); else reader.readAsArrayBuffer(file);
}

function parseCSV(str) {
    const rows = str.trim().split('\n');
    if (rows.length < 2) return [];
    const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];
    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rows[i].split(',');
        const cleanValues = values.map(v => v.trim().replace(/^"|"$/g, ''));
        const rowObj = {};
        headers.forEach((header, index) => { rowObj[header] = cleanValues[index] || 0; });
        data.push(rowObj);
    }
    return data;
}

window.initUserData = async () => {
    if (!window.Clerk || !window.Clerk.user) return;
    const userId = window.Clerk.user.id;
    
    loader.classList.remove('hidden');
    try {
        const { data: actData, error: actErr } = await _supabase.from('actuals').select('*').eq('user_id', userId);
        if (actErr) throw actErr;
        const { data: budData, error: budErr } = await _supabase.from('budgets').select('*').eq('user_id', userId);
        if (budErr) throw budErr;
        
        if (actData && actData.length > 0 || budData && budData.length > 0) {
            actualsData = actData.map(row => ({ Month: row.month, Department: row.department, Account: row.account, Actual: row.amount }));
            budgetData = budData.map(row => ({ Month: row.month, Department: row.department, Account: row.account, Budget: row.amount }));
            loadedFromDb = true;
            
            document.querySelector('.upload-section').style.display = 'none';
            fetchDataBtn.style.display = 'none'; 
            analyzeBtn.style.display = 'none';
            
            setTimeout(() => { 
                populateFilters();
                processData(); 
                loader.classList.add('hidden'); 
                filtersPanel.classList.remove('hidden');
                filtersPanel.style.display = 'block';
                resultsSection.classList.remove('hidden'); 
            }, 800);
        } else {
            // No data found, let user upload files normally
            loader.classList.add('hidden'); 
            fetchDataBtn.style.display = 'none'; 
        }
    } catch (error) { 
        loader.classList.add('hidden');
        console.warn('Initial data load failed or user_id column missing:', error.message);
    }
};

fetchDataBtn.addEventListener('click', async () => {
    // Left for backwards compatibility but shouldn't be used now as initUserData auto-runs
    if (typeof window.initUserData === 'function') window.initUserData();
});

saveToDbBtn.addEventListener('click', async () => {
    if (!actualsData || !budgetData) return;
    saveToDbBtn.disabled = true; saveToDbBtn.textContent = 'Saving...';
    const userId = window.Clerk.user ? window.Clerk.user.id : 'anonymous';
    try {
        const act = actualsData.map(row => ({ user_id: userId, month: row.Month||'FY', department: row.Department||'General', account: row.Account, amount: parseFloat(row.Actual)||0 })).filter(r=>r.account);
        const bud = budgetData.map(row => ({ user_id: userId, month: row.Month||'FY', department: row.Department||'General', account: row.Account, amount: parseFloat(row.Budget)||0 })).filter(r=>r.account);
        if(act.length) { const { error: e1 } = await _supabase.from('actuals').insert(act); if (e1) throw e1; }
        if(bud.length) { const { error: e2 } = await _supabase.from('budgets').insert(bud); if (e2) throw e2; }
        saveToDbBtn.textContent = 'Saved ✔️'; saveToDbBtn.style.color = 'white'; saveToDbBtn.style.background = '#10b981';
    } catch (error) {
        saveToDbBtn.disabled = false; saveToDbBtn.textContent = 'Save Failed - Retry'; alert('Error: ' + error.message);
    }
});

analyzeBtn.addEventListener('click', () => {
    analyzeBtn.style.display = 'none'; fetchDataBtn.style.display = 'none';
    document.querySelector('.upload-section').style.display = 'none'; loader.classList.remove('hidden');
    setTimeout(() => { 
        populateFilters();
        processData(); 
        loader.classList.add('hidden'); 
        filtersPanel.classList.remove('hidden');
        filtersPanel.style.display = 'block';
        resultsSection.classList.remove('hidden'); 
    }, 800);
});

function populateFilters() {
    const depts = new Set();
    const months = new Set();
    
    [...(actualsData||[]), ...(budgetData||[])].forEach(row => {
        if (row.Department) depts.add(row.Department);
        if (row.Month) months.add(row.Month);
    });

    const currentDept = deptFilter.value;
    const currentPeriod = periodFilter.value;

    deptFilter.innerHTML = `<option value="All" data-i18n="optAllDept">${i18n[currentLang].optAllDept}</option>`;
    depts.forEach(d => {
        deptFilter.innerHTML += `<option value="${d}">${d}</option>`;
    });

    periodFilter.innerHTML = `<option value="All" data-i18n="optFullYear">${i18n[currentLang].optFullYear}</option>`;
    months.forEach(m => {
        periodFilter.innerHTML += `<option value="${m}">${m}</option>`;
    });

    if (depts.has(currentDept)) deptFilter.value = currentDept;
    if (months.has(currentPeriod)) periodFilter.value = currentPeriod;
}

deptFilter.addEventListener('change', processData);
periodFilter.addEventListener('change', processData);
leadershipModeFilter.addEventListener('change', () => {
    if (mergedReportData) renderDashboard(mergedReportData);
});

function processData() {
    const selectedDept = deptFilter.value;
    const selectedPeriod = periodFilter.value;

    const filteredActuals = (actualsData || []).filter(row => {
        if (selectedDept !== 'All' && row.Department !== selectedDept) return false;
        if (selectedPeriod !== 'All' && row.Month !== selectedPeriod) return false;
        return true;
    });

    const filteredBudget = (budgetData || []).filter(row => {
        if (selectedDept !== 'All' && row.Department !== selectedDept) return false;
        if (selectedPeriod !== 'All' && row.Month !== selectedPeriod) return false;
        return true;
    });

    const yearlyActuals = groupData(filteredActuals, 'Actual');
    const yearlyBudget = groupData(filteredBudget, 'Budget');
    const map = new Map();
    
    yearlyBudget.forEach(b => { map.set(`${b.Category}|${b.Department}|${b.Account}`, { ...b, Actual: 0 }); });
    yearlyActuals.forEach(a => {
        const key = `${a.Category}|${a.Department}|${a.Account}`;
        if (map.has(key)) map.get(key).Actual = a.Actual; else map.set(key, { ...a, Budget: 0 });
    });

    let merged = Array.from(map.values());
    merged.forEach(row => {
        row.DollarVariance = row.Actual - row.Budget;
        row.PercentVariance = row.Budget !== 0 ? (row.DollarVariance / row.Budget) * 100 : (row.Actual !== 0 ? 100 : 0);
        row.IsFavorable = (row.Category === 'Revenue') ? row.DollarVariance >= 0 : row.DollarVariance <= 0;
    });

    merged.sort((a, b) => {
        const catA = CATEGORY_ORDER[a.Category] || 99;
        const catB = CATEGORY_ORDER[b.Category] || 99;
        if (catA !== catB) return catA - catB;
        if (a.Department !== b.Department) return a.Department.localeCompare(b.Department);
        return a.Account.localeCompare(b.Account);
    });

    mergedReportData = merged;
    saveToDbBtn.style.display = loadedFromDb ? 'none' : 'inline-block';
    renderDashboard(merged);
}

function groupData(data, valueColumn) {
    const grouped = {};
    data.forEach(row => {
        const acc = row.Account || row.account || row.ACCOUNT || ''; if (!acc) return;
        const dep = row.Department || row.department || row.DEPARTMENT || 'General';
        const cat = categorizeAccount(acc, dep);
        let val = parseFloat(typeof row[valueColumn] === 'string' ? row[valueColumn].replace(/[^0-9.-]+/g,"") : row[valueColumn]) || 0;
        const key = `${cat}|${dep}|${acc}`;
        if (!grouped[key]) grouped[key] = { Category: cat, Department: dep, Account: acc, [valueColumn]: 0 };
        grouped[key][valueColumn] += val;
    });
    return Object.values(grouped);
}

const formatCurrency = num => new Intl.NumberFormat(currentLang === 'ar' ? 'ar-SA' : 'en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
const formatPercent = num => new Intl.NumberFormat(currentLang === 'ar' ? 'ar-SA' : 'en-US', { maximumFractionDigits: 1 }).format(num) + '%';

window.toggleCategory = function(categoryId) {
    const row = document.getElementById(`cat-row-${categoryId}`);
    const isCollapsed = row.classList.contains('collapsed');
    if (isCollapsed) {
        row.classList.remove('collapsed'); document.querySelectorAll(`.child-of-${categoryId}`).forEach(el => el.classList.remove('hidden'));
    } else {
        row.classList.add('collapsed'); document.querySelectorAll(`.child-of-${categoryId}`).forEach(el => el.classList.add('hidden'));
    }
};

function renderDashboard(data) {
    const L = i18n[currentLang];
    const mode = leadershipModeFilter.value || 'CFO';
    
    const summary = {};
    data.forEach(row => {
        if (!summary[row.Category]) summary[row.Category] = { Budget: 0, Actual: 0, Variance: 0 };
        summary[row.Category].Budget += row.Budget;
        summary[row.Category].Actual += row.Actual;
        summary[row.Category].Variance += row.DollarVariance;
    });

    const cardsContainer = document.getElementById('summaryCards');
    cardsContainer.innerHTML = '';
    const allCats = Object.keys(summary).sort((a, b) => (CATEGORY_ORDER[a]||99) - (CATEGORY_ORDER[b]||99));
    
    allCats.forEach(cat => {
        if (summary[cat]) {
            const sumData = summary[cat];
            const isFav = cat === 'Revenue' ? sumData.Variance >= 0 : sumData.Variance <= 0;
            const varianceClass = isFav ? 'positive' : 'negative';
            const pct = sumData.Budget !== 0 ? (sumData.Variance / sumData.Budget) * 100 : 0;
            const sign = sumData.Variance > 0 && currentLang === 'en' ? '+' : ''; 

            const card = document.createElement('div');
            card.className = 'summary-card';
            card.innerHTML = `
                <div class="card-title">${translateCategory(cat)}</div>
                <div class="card-value">${formatCurrency(sumData.Actual)}</div>
                <div class="card-variance ${varianceClass}-variance">
                    <span class="variance-badge ${varianceClass}-badge"><span dir="ltr">${sign}${formatPercent(pct)}</span></span>
                    ${L.vsBudget}
                </div>
            `;
            cardsContainer.appendChild(card);
        }
    });

    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = '';
    
    // AI Executive Summary
    const execSummaryPane = document.getElementById('executiveSummary');
    const execSummaryList = document.getElementById('execSummaryList');
    
    if (data.length > 0) {
        execSummaryPane.style.display = 'block';
        execSummaryList.innerHTML = '';
        const topVariances = [...data].sort((a,b) => Math.abs(b.DollarVariance) - Math.abs(a.DollarVariance)).slice(0, 5);
        
        topVariances.forEach(item => {
            const isFav = item.IsFavorable;
            const varianceColor = isFav ? '#10b981' : '#ef4444';
            const outcomeWord = isFav ? L.favorable : L.unfavorable;
            const sign = item.DollarVariance > 0 && currentLang === 'en' ? '+' : '';
            
            const hypothesis = generateHypothesis(mode, isFav, item.Category, item.Account, currentLang);

            const li = document.createElement('li');
            li.style.marginBottom = '12px';
            li.innerHTML = `
                <strong style="color: var(--text-primary);">${item.Department} - ${item.Account}</strong> 
                <span style="color: ${varianceColor}; font-weight: 700; background: ${varianceColor}22; padding: 2px 8px; border-radius: 12px; font-size: 0.85em; margin: 0 4px; display: inline-block;">
                   <span dir="ltr">${sign}${formatCurrency(item.DollarVariance)}</span> (${outcomeWord})
                </span>
                <br />
                <em>${L.hypothesis}</em> <span style="color: var(--text-primary)">${hypothesis}</span>
            `;
            execSummaryList.appendChild(li);
        });
    }

    let currentCategory = '';
    data.forEach(row => {
        const categoryId = row.Category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();

        if (row.Category !== currentCategory) {
            currentCategory = row.Category;
            const sumCat = summary[currentCategory];
            const trHead = document.createElement('tr');
            trHead.id = `cat-row-${categoryId}`;
            trHead.className = 'category-row';
            
            trHead.innerHTML = `
                <td colspan="3"><span class="toggle-icon">▼</span>${translateCategory(currentCategory)} - ${L.subtotal}</td>
                <td class="number-align"><span dir="ltr">${formatCurrency(sumCat.Budget)}</span></td>
                <td class="number-align"><span dir="ltr">${formatCurrency(sumCat.Actual)}</span></td>
                <td class="number-align ${sumCat.Variance > 0 ? (currentCategory==='Revenue'?'cell-positive':'cell-negative') : (currentCategory==='Revenue'?'cell-negative':'cell-positive')}"><span dir="ltr">${formatCurrency(sumCat.Variance)}</span></td>
                <td class="number-align">-</td>
            `;
            trHead.onclick = () => window.toggleCategory(categoryId);
            tbody.appendChild(trHead);
        }

        const isFav = row.IsFavorable;
        const isHighVariance = Math.abs(row.PercentVariance) > 10;
        let rowHighlightClass = isHighVariance ? (isFav ? 'variance-highlight-positive' : 'variance-highlight-negative') : '';
        let badgeHighlightClass = isHighVariance ? (isFav ? 'positive' : 'negative') : '';
        const colorClass = isFav ? 'cell-positive' : 'cell-negative';
        const sign = row.DollarVariance > 0 && currentLang === 'en' ? '+' : '';
        const barColor = isFav ? 'var(--positive)' : 'var(--negative)';
        const barWidth = Math.min(Math.abs(row.PercentVariance), 100);

        const formattedPct = isHighVariance 
            ? `<span class="variance-badge-inline ${badgeHighlightClass}"><span dir="ltr">${sign}${formatPercent(row.PercentVariance)}</span></span>`
            : `<span class="${colorClass}"><span dir="ltr">${sign}${formatPercent(row.PercentVariance)}</span></span>`;

        const tr = document.createElement('tr');
        tr.className = `line-item collapsible-row child-of-${categoryId} ${rowHighlightClass}`;
        tr.innerHTML = `
            <td></td>
            <td>${row.Department}</td>
            <td>${row.Account}</td>
            <td class="number-align"><span dir="ltr">${formatCurrency(row.Budget)}</span></td>
            <td class="number-align"><span dir="ltr">${formatCurrency(row.Actual)}</span></td>
            <td class="number-align variance-cell ${colorClass}"><span dir="ltr">${sign}${formatCurrency(row.DollarVariance)}</span></td>
            <td class="number-align pct-cell" style="display:flex; align-items:center;">
                ${formattedPct}
                <div class="variance-bar-container">
                    <div class="variance-bar-fill" style="width: ${barWidth}%; background-color: ${barColor}"></div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

exportCsvBtn.addEventListener('click', () => {
    if (!mergedReportData) return;
    let csvContent = "data:text/csv;charset=utf-8,Category,Department,Account,Budget,Actual,DollarVariance,PercentVariance\n";
    mergedReportData.forEach(row => {
        csvContent += `"${row.Category}","${row.Department}","${row.Account}",${row.Budget},${row.Actual},${row.DollarVariance},${row.PercentVariance}\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "Budget_Variance_Report.csv";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
});
