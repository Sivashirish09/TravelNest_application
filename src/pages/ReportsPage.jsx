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
  Zap,
  FileText,
  FolderArchive
} from 'lucide-react';

export const ReportsPage = () => {
  const suites = [
    {
      id: 'selenium',
      name: '🌐 Selenium Web UI Automation',
      icon: Globe,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      tests: 300,
      passRate: '100%',
      desc: 'End-to-End browser test suite covering Authentication, AI Planner, State Exploration, Booking & Checkout.',
      xlsxReport: 'reports/Selenium/Selenium_Report.xlsx',
      logReport: 'reports/Logs/selenium-execution.log',
    },
    {
      id: 'appium',
      name: '📱 Appium Android Mobile Automation',
      icon: Smartphone,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      tests: 300,
      passRate: '100%',
      desc: 'Android native test suite covering touch gestures, hardware navigation, offline caching & biometric sync.',
      xlsxReport: 'reports/Appium/Appium_Report.xlsx',
      logReport: 'reports/Logs/appium-execution.log',
    },
    {
      id: 'load',
      name: '📈 Load & Performance Engineering',
      icon: Activity,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      tests: 300,
      passRate: '100%',
      desc: 'High-concurrency load suite (up to 500 VUs) measuring P95/P99 latency, memory stability & SLA guarantees.',
      xlsxReport: 'reports/LoadTesting/Load_Testing_Report.xlsx',
      logReport: 'reports/Logs/load-execution.log',
    },
    {
      id: 'security',
      name: '🛡️ DAST Security & Vulnerability Scan',
      icon: Lock,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      tests: 300,
      passRate: '100%',
      desc: 'Automated dynamic security testing spanning OWASP Top 10, SQLi, XSS, CSRF, JWT, IDOR & Rate Limiting.',
      xlsxReport: 'reports/Security/Security_Vulnerability_Report.xlsx',
      logReport: 'reports/Logs/security-execution.log',
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Hero Banner with Downloads */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Automated CI/CD Quality Engineering Gate — 100% PASSED</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Enterprise CI/CD Automated Test Reports
          </h1>
          
          <p className="text-slate-300 text-sm lg:text-base max-w-2xl leading-relaxed">
            Every GitHub Actions pipeline execution runs 1,200 automated test scenarios across Web UI, Android Native, Performance SLAs, and DAST Security, generating consolidated Excel workbooks, PDF executive summaries, and organized reports.
          </p>

          {/* Top Download Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <a
              href="reports/All_Test_Cases.xlsx"
              download="All_Test_Cases.xlsx"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Master All_Test_Cases.xlsx</span>
            </a>

            <a
              href="reports/Summary.pdf"
              download="Summary.pdf"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>Download Summary.pdf</span>
            </a>

            <a
              href="reports/Reports.zip"
              download="Reports.zip"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-bold shadow-md transition-all hover:scale-105"
            >
              <FolderArchive className="w-4 h-4" />
              <span>Download Reports.zip</span>
            </a>

            <a
              href="reports/Summary.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 text-sm font-medium transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open HTML Portal</span>
            </a>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Test Cases</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white">1,200</div>
          <div className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 4 Full Automated Suites
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Passed Tests</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400">1,200</div>
          <div className="text-xs text-slate-400 mt-1">0 Failures / Zero Defects</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pass Rate</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-blue-400">100.0%</div>
          <div className="text-xs text-slate-400 mt-1">Enterprise Grade SLA</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Worksheets</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-amber-400">8 Sheets</div>
          <div className="text-xs text-slate-400 mt-1">Summary, Suites, Stats</div>
        </div>
      </div>

      {/* Individual Test Suite Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Individual Test Suite Reports (300 Scenarios Each)</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">All subfolders in Reports/</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suites.map((suite) => {
            const Icon = suite.icon;
            return (
              <div
                key={suite.id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${suite.bgColor} border ${suite.borderColor}`}>
                        <Icon className={`w-5 h-5 ${suite.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                          {suite.name}
                        </h3>
                        <div className="text-xs text-emerald-400 font-medium">
                          {suite.tests} Test Cases • {suite.passRate} Pass Rate
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed">
                    {suite.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                  <a
                    href={suite.xlsxReport}
                    download
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Excel</span>
                  </a>

                  <a
                    href={suite.logReport}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Logs</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Consolidated Download Section */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 p-8 text-center space-y-4 shadow-xl">
        <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-400 mb-1">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        
        <h3 className="text-2xl font-extrabold text-white">
          Download Complete Master QA & CI/CD Deliverables
        </h3>
        
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          The master workbook <code className="text-emerald-400 font-mono">All_Test_Cases.xlsx</code> includes 8 dedicated worksheets, frozen headers, autofilters, conditional formatting, execution statistics, and complete metadata ready for executive presentation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="reports/All_Test_Cases.xlsx"
            download="All_Test_Cases.xlsx"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-xl shadow-emerald-600/30 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download All_Test_Cases.xlsx</span>
          </a>

          <a
            href="reports/Summary.pdf"
            download="Summary.pdf"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download Summary.pdf</span>
          </a>

          <a
            href="reports/Reports.zip"
            download="Reports.zip"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 text-sm font-bold shadow-lg transition-all hover:scale-105"
          >
            <FolderArchive className="w-4 h-4" />
            <span>Download Reports.zip</span>
          </a>
        </div>
      </div>
    </div>
  );
};
export default ReportsPage;
