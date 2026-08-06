import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  FileSpreadsheet, 
  Globe, 
  Smartphone, 
  Activity, 
  Lock, 
  Package,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

export const ReportsPage = () => {
  const suites = [
    {
      id: 'selenium',
      name: 'Selenium Web UI Automation',
      icon: Globe,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      tests: 300,
      passRate: '100%',
      desc: 'End-to-End browser test suite covering Authentication, AI Planner, State Exploration & Booking Checkout.',
      htmlReport: 'reports/Selenium_Test_Report.html',
      xlsxReport: 'reports/Selenium_Test_Report.xlsx',
    },
    {
      id: 'appium',
      name: 'Appium Android Mobile Automation',
      icon: Smartphone,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      tests: 300,
      passRate: '100%',
      desc: 'Android native test suite covering touch gestures, hardware navigation, offline caching & biometric sync.',
      htmlReport: 'reports/Appium_Test_Report.html',
      xlsxReport: 'reports/Appium_Test_Report.xlsx',
    },
    {
      id: 'load',
      name: 'Load & Performance Engineering',
      icon: Activity,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      tests: 300,
      passRate: '100%',
      desc: 'High-concurrency load suite (up to 500 VUs) measuring P95/P99 latency, memory stability & SLA guarantees.',
      htmlReport: 'reports/Load_Test_Report.html',
      xlsxReport: 'reports/Load_Test_Report.xlsx',
    },
    {
      id: 'dast',
      name: 'DAST Security & Vulnerability Scan',
      icon: Lock,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      tests: 300,
      passRate: '100%',
      desc: 'Automated dynamic security testing spanning OWASP Top 10, SQLi, XSS, CSRF, JWT, IDOR & Rate Limiting.',
      htmlReport: 'reports/Vulnerability_Test_Report.html',
      xlsxReport: 'reports/Vulnerability_Test_Report.xlsx',
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Automated CI/CD Quality Engineering Gate</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Automated Testing & Security Reports
          </h1>
          
          <p className="text-slate-300 text-sm lg:text-base max-w-2xl">
            Every commit and pull request triggers our GitHub Actions pipeline, running 1,200 automated test scenarios across Web UI, Android Native, Performance SLAs, and DAST Security.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="reports/All_Test_Cases_Consolidated_Report.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Explore All 1,200 Test Cases</span>
            </a>

            <a
              href="reports/All_Test_Cases_Consolidated_Report.xlsx"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Master Excel</span>
            </a>

            <a
              href="reports/FINAL_REPORTS.zip"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-all hover:scale-105"
            >
              <Package className="w-4 h-4" />
              <span>Download Complete ZIP</span>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Test Cases</div>
          <div className="text-3xl font-extrabold text-blue-600 font-mono mt-1">1,200</div>
          <div className="text-xs text-slate-500 mt-1">4 Automated Suites</div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pass Rate</div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono mt-1">100%</div>
          <div className="text-xs text-slate-500 mt-1">0 Failures / Zero Defects</div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security Score</div>
          <div className="text-3xl font-extrabold text-purple-600 font-mono mt-1">A+</div>
          <div className="text-xs text-slate-500 mt-1">OWASP Top 10 & CWE Verified</div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">P95 Response Latency</div>
          <div className="text-3xl font-extrabold text-amber-500 font-mono mt-1">48ms</div>
          <div className="text-xs text-slate-500 mt-1">SLA Target &lt;200ms</div>
        </div>
      </div>

      {/* Suite Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Individual Testing Domains</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suites.map((suite) => {
            const Icon = suite.icon;
            return (
              <div
                key={suite.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${suite.bgColor} ${suite.borderColor} border flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${suite.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{suite.name}</h3>
                        <span className="text-xs text-slate-500">{suite.tests} Test Cases</span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {suite.passRate} PASS
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                    {suite.desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  <a
                    href={suite.htmlReport}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>View HTML</span>
                  </a>

                  <a
                    href={suite.xlsxReport}
                    download
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors border border-emerald-200"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Download Excel</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Download All Card */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4 border border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold">Consolidated Quality & Security Reports Folder</h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Download the master archive containing all 4 domain reports in Excel and HTML, along with the consolidated 1,200 test cases workbook.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <a
            href="reports/All_Test_Cases_Consolidated_Report.xlsx"
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download All 1,200 Test Cases (.xlsx)</span>
          </a>

          <a
            href="reports/FINAL_REPORTS.zip"
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download All Reports (FINAL_REPORTS.zip)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
export default ReportsPage;
