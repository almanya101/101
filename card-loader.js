/* =====================================================
   🎨 UBT COLOR GUIDE (Card Palette Cheat Sheet)

   Bu projede 3 seviye arka plan var:
   1) Body Background (en arkada): koyu gradient (gece teması)
   2) Card Base (.card / .detail-card): varsayılan beyaz kart
   3) Color Variants (.card-color-1..5): kartın arka planını renklendirir

   -----------------------------------------------------
   ✅ Hangi kart hangi sınıfı almalı? (ÖNERİLEN)
   -----------------------------------------------------

   HERO:
   - class="card hero-card"
   - Not: Hero kendi gradient’ini kullanır. card-color verme.

   NAVIGATION:
   - class="card nav-card"
   - Not: Navigation sarı nav-card ile sabit.

   CONTENT KARTLARI (detail-card):
   - class="detail-card card-color-X"

   -----------------------------------------------------
   🎯 card-color-* anlamları
   -----------------------------------------------------

   card-color-1 (Blue)   #00A4EF  → "Docs / CV / Links" (resmi, güven)
   card-color-2 (Green)  #7FBA00  → "Achievements / Contact" (pozitif, sonuç)
   card-color-3 (Orange) #F7630C  → "About Me / Tech Stack" (enerji, hareket)
   card-color-4 (Purple) #A700AE  → "Experience" (kıdem, derinlik)
   card-color-5 (Yellow) #FFB900  → "Projects / Highlights" (dikkat, vurgu)

   -----------------------------------------------------
   ℹ️ Okunabilirlik notu
   -----------------------------------------------------
   - card-color-1..4: yazı beyaz (color:white)
   - card-color-5: yazı koyu (color:#222) çünkü sarıda beyaz zor okunur.

   -----------------------------------------------------
   Örnek kullanım:
   <div class="detail-card card-color-3">...</div>
   ===================================================== */



/* =====================================================
   CARD LOADER — UBT
   - Tüm kart component'leri burada tanımlanır
   - Sayfalar sadece "hangi kartlar?" der
   - Navigation MANUAL kalır (senin kontrolün)
   ===================================================== */

(function () {
  /* =====================================================
     1) INTERNAL REGISTRY
     - register(): kart template'lerini kaydeder
     - renderInto(): seçilen kartları root'a basar
     ===================================================== */

  // -----------------------------
  // Registry (name -> templateFn)
  // -----------------------------
  const registry = {};

  /**
   * Register a card template function by name.
   * @param {string} name
   * @param {() => string} templateFn
   */
  function register(name, templateFn) {
    registry[name] = templateFn;
  }

  /**
   * Render selected cards into a container element.
   * @param {string} rootId - element id (e.g. "cards-root")
   * @param {string[]} cardNames - registered card keys
   */
  function renderInto(rootId, cardNames) {
    const root = document.getElementById(rootId);
    if (!root) return;

    const html = cardNames
      .map((name) => (registry[name] ? registry[name]() : missingCard(name)))
      .join("\n");

    root.innerHTML = html;
  }
  /* END of block: Internal Registry */


  /* =====================================================
     2) FALLBACKS + HELPERS
     - missingCard(): kart bulunamazsa uyarı kartı basar
     - escapeHtml(): XSS / kırılma önler
     ===================================================== */

  function missingCard(name) {
    return `
      <div class="detail-card card-color-5">
        <h2 class="section-title">Missing card: ${escapeHtml(name)}</h2>
        <p>Card is not registered in card-loader.js</p>
      </div>
      <!-- END of block: Missing Card -->
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  /* END of block: Fallbacks + Helpers */


  /* =====================================================
     3) CARD TEMPLATES (PLACEHOLDERS)
     - ID'ler navigation ile eşleşmeli
     - Sınıflar mevcut CSS ile uyumlu
     ===================================================== */
     
/* =====================================================
   CARD: HERO (EXPLORER)
   ===================================================== */
register("heroExplorer", () => `
  <div id="hero" class="card hero-card">
    <div class="hero-top">
      <div class="hero-logo-box">
        <img src="/img/logoubt.png" class="hero-logo" alt="UBT logo" />
        <span class="hero-domain">ubterzioglu.de</span>
      </div>
      <a href="index.html">
        <img src="/img/z0cliphome.png" class="home-icon" alt="Home" />
      </a>
    </div>

    <h1>Hello Explorer!</h1>
    <p class="title">
      Knowledge corner: links, articles, reviews, and notes.
    </p>
  </div>
  <!-- END of block: Hero (Explorer) -->
`);
/* END of block: Card Template — heroExplorer */


  /* =====================================================
     CARD: HERO (RECRUITER)
     ===================================================== */
  register("heroRecruiter", () => `
    <div id="hero" class="card hero-card">
      <div class="hero-top">
        <div class="hero-logo-box">
          <img src="/img/logoubt.png" class="hero-logo" alt="UBT logo" />
          <span class="hero-domain">ubterzioglu.de</span>
        </div>
        <a href="index.html">
          <img src="/img/z0cliphome.png" class="home-icon" alt="Home" />
        </a>
      </div>

      <h1>Hello Recruiter!</h1>
      <p class="title">Everything you need to evaluate my profile.</p>
    </div>
    <!-- END of block: Hero (Recruiter) -->
  `);
  /* END of block: Card Template — heroRecruiter */



 /* =====================================================
     CARD: HERO (ALIEN)
     ===================================================== */
  register("heroAlien", () => `
    <div id="hero" class="card hero-card">
      <div class="hero-top">
        <div class="hero-logo-box">
          <img src="/img/logoubt.png" class="hero-logo" alt="UBT logo" />
          <span class="hero-domain">ubterzioglu.de</span>
        </div>
        <a href="index.html">
          <img src="/img/z0cliphome.png" class="home-icon" alt="Home" />
        </a>
      </div>

      <h1>Hello alien visitor!</h1>
      <p class="title">What are you curious about humanity?</p>
    </div>
   
  `);
  /* END of block: Card Template — heroAlien */




  /* =====================================================
     CARD: HERO (COLLEAGUE)
     ===================================================== */
  register("heroColleague", () => `
    <div id="hero" class="card hero-card">
      <div class="hero-top">
        <div class="hero-logo-box">
          <img src="/img/logoubt.png" class="hero-logo" alt="UBT logo" />
          <span class="hero-domain">ubterzioglu.de</span>
        </div>
        <a href="index.html">
          <img src="/img/z0cliphome.png" class="home-icon" alt="Home" />
        </a>
      </div>

      <h1>Hello Colleague!</h1>
      <p class="title">
  What do you need?<br>
  Support? Information?<br>
  Getting to know me better?<br>
  Choose a section below to explore!
  <br>
</p>
    </div>
    <!-- END of block: Hero (Colleague) -->
  `);
  /* END of block: Card Template — heroColleague */

  /* =====================================================
     CARD: HERO (CURIOUS)
     ===================================================== */
  register("heroCurious", () => `
    <div id="hero" class="card hero-card">
      <div class="hero-top">
        <div class="hero-logo-box">
          <img src="/img/logoubt.png" class="hero-logo" alt="UBT logo" />
          <span class="hero-domain">ubterzioglu.de</span>
        </div>
        <a href="index.html">
          <img src="/img/z0cliphome.png" class="home-icon" alt="Home" />
        </a>
      </div>

      <h1>Hello Curious Visitor!</h1>
      <p class="title">
  What do you need?<br>
  Support? Information?<br>
  Getting to know me better?<br>
  Articles? Useful links?<br>
  Choose a section below to explore!<br>
</p>
    </div>
    <!-- END of block: Hero (Curious) -->
  `);
  /* END of block: Card Template — heroCurious */



 /* =====================================================
   CARD: CV
   - Two clean CTA blocks (EN/DE)
   - Keeps your existing CSS, only adds small inline styling
   ===================================================== */
register("cv", () => `
  <div id="cv" class="detail-card card-color-1">
    <div class="card-buttons">
      <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
      <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
    </div>

    <h2 class="section-title">My CV</h2>

    <div style="display:flex; flex-direction:column; gap:14px; margin-top:10px;">

      <!-- EN -->
      <div style="background:rgba(255,255,255,0.18); padding:14px 16px; border-radius:14px;">
        ☕ <strong>English CV</strong><br />
        <a
          href="https://drive.google.com/file/d/1T5yUafZI9nRv1aVWeEKBHcU6apZOojP2/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          style="color:inherit; text-decoration:underline; font-weight:600;"
        >
          View / Download (PDF)
        </a>
      </div>

      <!-- DE -->
      <div style="background:rgba(255,255,255,0.18); padding:14px 16px; border-radius:14px;">
        🍺 <strong>German CV</strong><br />
        <a
          href="https://drive.google.com/file/d/15_4pguyDYAYtoqYs_7rwCCzdHknfvZ6D/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          style="color:inherit; text-decoration:underline; font-weight:600;"
        >
          View / Download (PDF)
        </a>
      </div>

    </div>

    <p style="margin-top:14px; opacity:.9; font-size:13px;">
      PDF • ATS-friendly • Updated regularly
    </p>
  </div>
  <!-- END of block: CV -->
`);
/* END of block: Card Template — cv */



  /* =====================================================
   CARD: ACHIEVEMENTS
   ===================================================== */
register("achievements", () => `
  <div id="achievements" class="detail-card card-color-2">
    <div class="card-buttons">
      <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
      <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
    </div>

    <h2 class="section-title">Key Achievements</h2>

    <div class="ach-list">
      <div>🏆 Created 5000+ test cases using HP ALM, Jira, and Polarion over 10+ years of hands-on testing experience.</div>
      <div>🚀 Increased test coverage from 50% to 90% for Daimler projects through systematic test design techniques.</div>
      <div>📈 Achieved 95% test coverage for Swisslog projects using modular test design.</div>
      <div>🤖 Implemented Ranorex automation for three major Daimler systems, integrating CI/CD pipelines (Jenkins).</div>
      <div>⚡ Automated 1000+ test cases with Ranorex & C#, reducing execution time by 40% through optimization.</div>
      <div>🔍 Reviewed automation of 1000+ Selenium–Java test cases, improving execution efficiency by 30%.</div>
      <div>🧭 Defined and implemented a new test strategy for the Daimler PDM System, boosting efficiency by 25%.</div>
      <div>📦 Planned & coordinated 50+ releases for 40,000+ users in the Daimler PDM ecosystem.</div>
      <div>🔧 Managed HP ALM → Jira migration, reducing manual effort by 25% and project costs by 22%.</div>
      <div>💬 Resolved 1000+ support tickets, ensuring quick turnaround and high stakeholder satisfaction.</div>
      <div>👥 Onboarded, mentored, and led 30+ QA colleagues at Daimler & Swisslog.</div>
      <div>📊 Created KPI-based reports in Excel & Polarion, improving visibility and saving 500 man-hours monthly.</div>
      <div>🧪 Conducted 50+ customer sessions (UAT, FAT, SAT) across enterprise-level projects.</div>
    </div>
  </div>
  <!-- END of block: Achievements -->
`);
/* END of block: Card Template — achievements */



  /* =====================================================
   CARD: TECH STACK
   ===================================================== */
register("techStack", () => `
  <div id="tech" class="detail-card card-color-3">
    <div class="card-buttons">
      <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
      <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
    </div>

    <h2 class="section-title">Tech Stack</h2>

    <div class="tech-section">

      <h4>Automation & Frameworks</h4>
      <p>Selenium • Ranorex • Maven • TestNG • JUnit • Cucumber • Gherkin</p>

      <h4>Programming Languages</h4>
      <p>Java • C# • Python</p>

      <h4>API & Integration Testing</h4>
      <p>REST • SOAP • Postman • SoapUI • API Mocking</p>

      <h4>CI/CD & DevOps Pipeline</h4>
      <p>Jenkins • Docker • Git • GitHub</p>

      <h4>Test Management & Tracking</h4>
      <p>JIRA • Xray • HP ALM • Polarion</p>

      <h4>Development & IDE Tools</h4>
      <p>IntelliJ IDEA • Visual Studio • VS Code • Eclipse</p>

      <h4>Methodologies & QA Approach</h4>
      <p>Agile • SCRUM • Waterfall • CI/CD</p>

    </div>
  </div>
  <!-- END of block: Tech Stack -->
`);
/* END of block: Card Template — techStack */


  /* =====================================================
   CARD: EXPERIENCE
   ===================================================== */
register("experience", () => `
  <div id="experience" class="detail-card card-color-4">
    <div class="card-buttons">
      <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
      <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
    </div>

    <h2 class="section-title">Experience</h2>

    <!-- ======================
         Swisslog — Test Lead
         ====================== -->
    <div class="exp-section">
      <div class="exp-header">
        <img src="/img/logoswisslog.png" class="exp-logo" alt="Swisslog logo" />
        <div class="exp-title">
          <h3 class="exp-role">Test Lead</h3>
          <h4 class="exp-company">Swisslog</h4>
          <p class="exp-sub">2021 – 2025 · Dortmund</p>
        </div>
      </div>

      <ul class="exp-list">
        <li>✅ Designed & executed 1,000+ test cases<br /><span>🤖 Polarion, Selenium, Java</span></li>
        <li>✅ Test Lead for one of Swisslog’s largest projects with 500 users & 10 modules<br /><span>🤖 Polarion, WMS, WES</span></li>
        <li>✅ Executed 20+ FAT & SAT sessions with customers<br /><span>🤖 WMS, WES, SynQ, Polarion</span></li>
        <li>✅ Delivered 50+ detailed test & defect reports to Project Management<br /><span>🤖 Polarion, Excel, SCRUM</span></li>
        <li>✅ Prepared 5 complete project-level test plans<br /><span>🤖 Risk-Based Testing, SCRUM, Polarion</span></li>
        <li>✅ Reviewed automation of 1,000+ test cases<br /><span>🤖 Selenium, Java, CI Pipelines</span></li>
        <li>✅ Provided on-site customer support for 5 go-lives / rollouts<br /><span>🤖 WMS, WES, SynQ, Polarion</span></li>
        <li>✅ Mentored & onboarded 15+ colleagues<br /><span>🤖 SCRUM, Knowledge Transfer, Agile Coaching</span></li>
      </ul>
    </div>

    <!-- ======================
         Daimler — Senior Process Manager
         ====================== -->
    <div class="exp-section">
      <div class="exp-header">
        <img src="/img/logodaimler.png" class="exp-logo" alt="Daimler logo" />
        <div class="exp-title">
          <h3 class="exp-role">Senior Process Manager</h3>
          <h4 class="exp-company">Daimler – Mercedes-Benz</h4>
          <p class="exp-sub">2020 – 2021 · Istanbul</p>
        </div>
      </div>

      <ul class="exp-list">
        <li>✅ Built the complete test structure for Daimler’s Part Management System (SRM)<br /><span>🤖 JIRA, Xray, HP ALM, Ranorex, C#</span></li>
        <li>✅ Designed the full test structure for Daimler’s internal communication system (DARRS)<br /><span>🤖 JIRA, HP ALM, Engineering Client, Smaragd</span></li>
        <li>✅ Selected & evaluated test tools via scoring model<br /><span>🤖 JIRA, Xray, Ranorex, HP ALM</span></li>
        <li>✅ Global responsibility for Daimler AG’s Part Management System (SRM)<br /><span>🤖 ~40,000 users · Engineering Client, Smaragd, DARRS</span></li>
        <li>✅ Provided 1st & 2nd level support with 1,000+ resolved tickets<br /><span>🤖 JIRA Service Desk, Defect & Incident Management</span></li>
        <li>✅ Process & test automation with 250+ automated/reviewed test cases<br /><span>🤖 Ranorex, C#, CI Pipelines</span></li>
        <li>✅ Planned & coordinated 10+ enterprise-level releases for SRM<br /><span>🤖 JIRA, Confluence, SCRUM</span></li>
        <li>✅ Prepared 50+ test & management reports for stakeholders<br /><span>🤖 JIRA Dashboards, Excel, Confluence</span></li>
        <li>✅ Onboarded & mentored 5+ colleagues<br /><span>🤖 Agile, Knowledge Transfer, Mentorship</span></li>
      </ul>
    </div>

    <!-- ======================
         Daimler — Senior Test Manager
         ====================== -->
    <div class="exp-section">
      <div class="exp-header">
        <img src="/img/logodaimler.png" class="exp-logo" alt="Daimler logo" />
        <div class="exp-title">
          <h3 class="exp-role">Senior Test Manager</h3>
          <h4 class="exp-company">Daimler – Mercedes-Benz</h4>
          <p class="exp-sub">2017 – 2020 · Istanbul</p>
        </div>
      </div>

      <ul class="exp-list">
        <li>✅ Created the software test strategy for Daimler PDM systems<br /><span>🤖 JIRA, Xray, HP ALM, SCRUM</span></li>
        <li>✅ Quality & release management for PDM system “Smaragd” (10+ releases)<br /><span>🤖 JIRA, Confluence, SCRUM</span></li>
        <li>✅ Executed E2E test activities for core PDM modules<br /><span>🤖 JIRA, HP ALM, E2E Testing</span></li>
        <li>✅ Managed HP ALM → XRAY migration for Smaragd<br /><span>🤖 HP ALM, XRAY, JIRA</span></li>
        <li>✅ Applied SCRUM methodology across test processes<br /><span>🤖 SCRUM, JIRA, Confluence</span></li>
        <li>✅ Selected test tools via scoring model & technical evaluation<br /><span>🤖 Ranorex, JIRA, XRAY, HP ALM, C#</span></li>
        <li>✅ Built JIRA projects from scratch for Daimler test activities<br /><span>🤖 JIRA Administration, Workflow Design, Defect Management</span></li>
        <li>✅ Automated 1,000+ test cases for PDM System “Smaragd”<br /><span>🤖 Ranorex, C#</span></li>
        <li>✅ Mentored & onboarded 20+ colleagues<br /><span>🤖 SCRUM, Knowledge Transfer, Agile Coaching</span></li>
      </ul>
    </div>

    <!-- ======================
         Daimler — Development Engineer
         ====================== -->
    <div class="exp-section">
      <div class="exp-header">
        <img src="/img/logodaimler.png" class="exp-logo" alt="Daimler logo" />
        <div class="exp-title">
          <h3 class="exp-role">Development Engineer</h3>
          <h4 class="exp-company">Daimler – Mercedes-Benz</h4>
          <p class="exp-sub">2007 – 2017</p>
        </div>
      </div>

      <ul class="exp-list">
        <li>✅ Interior design & vehicle components development<br /><span>🤖 Catia V4/V5, Siemens NX, SAP, DOORS, SWAN</span></li>
        <li>✅ Integration team – Project Next Generation Conecto<br /><span>🤖 Catia V5, Siemens NX, SAP, DOORS</span></li>
        <li>✅ Factory support for customer special order vehicles (Mannheim)<br /><span>🤖 Catia V5, SAP, DOORS</span></li>
        <li>✅ Prototype assembly support for NCI E6 vehicles<br /><span>🤖 Catia V5, Siemens NX, SAP, DOORS</span></li>
        <li>✅ Integration support for Setra vehicle assembly projects<br /><span>🤖 Catia V5, Siemens NX, SAP, DOORS</span></li>
      </ul>
    </div>

  </div>
  <!-- END of block: Experience -->
`);
/* END of block: Card Template — experience */



  /* =====================================================
   CARD: CORPORATE PROJECTS
   ===================================================== */
register("corporateProjects", () => `
  <div id="projects-corporate" class="detail-card card-color-5">
    <div class="card-buttons">
      <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
      <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
    </div>

    <h2 class="section-title">🚀 Corporate Projects</h2>

    <div class="proj-wrapper">

      <!-- Smaragd -->
      <div class="proj-item">
        <img src="/img/logosmaragd.png" class="proj-logo" alt="Smaragd logo" />
        <div>
          <h4 class="proj-title">Smaragd – Daimler / Mercedes-Benz</h4>
          <p>
            A global Product Data Management system used by thousands of engineers across Mercedes-Benz.
            Test strategy, quality processes, and release management were established and executed
            throughout the project lifecycle. The system supported highly complex engineering workflows
            and integrations.
          </p>
        </div>
      </div>

      <!-- SRM -->
      <div class="proj-item">
        <img src="/img/logosrm.png" class="proj-logo" alt="SRM logo" />
        <div>
          <h4 class="proj-title">SRM – Daimler / Mercedes-Benz</h4>
          <p>
            A critical Supply & Parts Management platform serving tens of thousands of internal users.
            End-to-end testing, test automation processes, and global rollout support were delivered.
            The project played a key role in ensuring stability across global supply chain operations.
          </p>
        </div>
      </div>

      <!-- DARRS -->
      <div class="proj-item">
        <img src="/img/logodarrs.png" class="proj-logo" alt="DARRS logo" />
        <div>
          <h4 class="proj-title">DARRS – Daimler / Mercedes-Benz</h4>
          <p>
            An internal communication and reporting system used for operational and management-level
            decision processes. Functional, integration, and user acceptance testing activities were
            carried out. The system directly supported data-driven corporate operations.
          </p>
        </div>
      </div>

      <!-- Swisslog TKL -->
      <div class="proj-item">
        <img src="/img/logotkl.png" class="proj-logo" alt="Swisslog TKL logo" />
        <div>
          <h4 class="proj-title">TKL - Swisslog</h4>
          <p>
            A warehouse automation and robotics integration project for logistics operations.
            Software and hardware synchronization tests were executed across robotic and conveyor systems.
            The project required high reliability under real-time operational conditions.
          </p>
        </div>
      </div>

      <!-- Swisslog Kruitbosch -->
      <div class="proj-item">
        <img src="/img/logokruitbosch.png" class="proj-logo" alt="Swisslog Kruitbosch logo" />
        <div>
          <h4 class="proj-title">Kruitbosch – Swisslog </h4>
          <p>
            A warehouse management system supporting retail distribution operations.
            Order picking, stock management, and shipment processes were tested across automated workflows.
            Close interaction between physical automation and software systems was a key success factor.
          </p>
        </div>
      </div>

      <!-- Swisslog Albert Heijn -->
      <div class="proj-item">
        <img src="/img/logoalbert.png" class="proj-logo" alt="Swisslog Albert Heijn logo" />
        <div>
          <h4 class="proj-title">Albert Heijn – Swisslog </h4>
          <p>
            A high-volume warehouse automation project for one of Europe’s largest retail chains.
            System validation, go-live support, and data integrity testing were delivered under heavy
            operational load. The project operated in a high-availability production environment.
          </p>
        </div>
      </div>

      <!-- Swisslog EDEKA -->
      <div class="proj-item">
        <img src="/img/logoedeka.png" class="proj-logo" alt="Swisslog EDEKA logo" />
        <div>
          <h4 class="proj-title">EDEKA – Swisslog </h4>
          <p>
            A large-scale automation project for Germany’s leading supermarket group.
            Pre-go-live validation, integration testing, and operational stability checks were conducted.
            The system ensured uninterrupted warehouse operations during transition phases.
          </p>
        </div>
      </div>

    </div>
  </div>
  <!-- END of block: Corporate Projects -->
`);
/* END of block: Card Template — corporateProjects */


  /* =====================================================
   CARD: PRIVATE PROJECTS
   ===================================================== */
register("privateProjects", () => `
  <div id="projects-private" class="detail-card card-color-1">
    <div class="card-buttons">
      <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
      <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
    </div>

    <h2 class="section-title">🌟 Private Projects</h2>

    <div class="proj-wrapper">

      <!-- UBT Testing -->
      <div class="proj-item">
        <img src="/img/logoubtest.png" class="proj-logo" alt="UBT Testing logo" />
        <div>
          <h4 class="proj-title">UBT – Testing</h4>
          <p>
            A personal quality assurance brand focused on sharing real-world testing experience
            and best practices. The platform covers test strategies, tools, and career-related
            insights, serving as a professional personal knowledge hub.
          </p>
        </div>
      </div>

      <!-- All in 2 Minutes -->
      <div class="proj-item">
        <img src="/img/logoallin2min.png" class="proj-logo" alt="All in 2 Minutes logo" />
        <div>
          <h4 class="proj-title">All in 2 Minutes!</h4>
          <p>
            A short-form content series designed to explain complex topics in under two minutes.
            The concept focuses on speed, clarity, and entertainment—combining educational value
            with engaging presentation.
          </p>
        </div>
      </div>

      <!-- Press Enter to Code -->
      <div class="proj-item">
        <img src="/img/logopressenter.png" class="proj-logo" alt="Press Enter to Code logo" />
        <div>
          <h4 class="proj-title">Press Enter to Code</h4>
          <p>
            A personal tech and coding content channel focused on development, testing, and
            productivity. Content includes programming concepts, automation topics, and learning
            strategies targeting both developers and QA professionals.
          </p>
        </div>
      </div>

      <!-- Software Tester Network -->
      <div class="proj-item">
        <img src="/img/logostn.png" class="proj-logo" alt="Software Tester Network logo" />
        <div>
          <h4 class="proj-title">Software Tester Network</h4>
          <p>
            A professional QA community created to connect software testers globally.
            Knowledge sharing, technical discussions, and career-focused content are actively
            supported, promoting collaboration across different QA expertise levels.
          </p>
        </div>
      </div>

      <!-- CAL Community -->
      <div class="proj-item">
        <img src="/img/logocalcom.png" class="proj-logo" alt="CAL Community logo" />
        <div>
          <h4 class="proj-title">CAL Community</h4>
          <p>
            A digital alumni and social community platform built to strengthen long-term connections.
            The project focuses on engagement, event sharing, and collective interaction, achieving
            strong organic growth in a short time.
          </p>
        </div>
      </div>

      <!-- Picked Scenes -->
      <div class="proj-item">
        <img src="/img/logopicked.png" class="proj-logo" alt="Picked Scenes logo" />
        <div>
          <h4 class="proj-title">Picked Scenes!</h4>
          <p>
            A curated digital project highlighting powerful moments from films and series.
            Each post focuses on storytelling, emotion, and cinematic impact, combining visual
            culture with short-form editorial content.
          </p>
        </div>
      </div>

      <!-- Loved Your T-Shirt -->
      <div class="proj-item">
        <img src="/img/logoloved.png" class="proj-logo" alt="Loved Your T-Shirt logo" />
        <div>
          <h4 class="proj-title">Loved Your T-Shirt</h4>
          <p>
            A social content concept built around street culture, identity, and visual expression
            through clothing. The project connects fashion, humor, and spontaneous interaction,
            emphasizing creativity in everyday moments.
          </p>
        </div>
      </div>

      <!-- Factovium -->
      <div class="proj-item">
        <img src="/img/logofactovium.png" class="proj-logo" alt="Factovium logo" />
        <div>
          <h4 class="proj-title">Factovium</h4>
          <p>
            An educational micro-content platform built around daily “Did you know?” facts.
            The project focuses on curiosity, learning, and knowledge sharing, designed to be
            short, informative, and engaging.
          </p>
        </div>
      </div>

      <!-- Don’t Follow Just Like -->
      <div class="proj-item">
        <img src="/img/logodontfollow.png" class="proj-logo" alt="Don’t Follow Just Like logo" />
        <div>
          <h4 class="proj-title">Don’t Follow Just Like</h4>
          <p>
            An entertainment-focused digital brand built on irony, humor, and experimental social
            content. The concept plays with reversed social-media dynamics and is designed purely
            for engagement and creative expression.
          </p>
        </div>
      </div>

    </div>
  </div>
  <!-- END of block: Private Projects -->
`);
/* END of block: Card Template — privateProjects */



 /* =====================================================
   CARD: CONTACT
   ===================================================== */
register("contact", () => `
  <div id="contact" class="detail-card card-color-2">
    <div class="card-buttons">
      <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
      <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
    </div>

    <h2 class="section-title">İletişim</h2>

    <!-- ICON GRID (3 x 2) -->
    <div style="
      display:grid;
      grid-template-columns: repeat(3, 64px);
      justify-content:center;
      gap:24px 30px;
      margin:32px 0 12px 0;
    ">
    
    <a href="https://wa.me/491739569429" target="_blank" rel="noopener" style="text-decoration:none;">
        <div
          style="
            width:64px;height:64px;border-radius:50%;background:#111;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 6px 14px rgba(0,0,0,.35);
            transition:transform .2s ease, box-shadow .2s ease;
          "
          onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 22px rgba(0,0,0,.45)'"
          onmouseout="this.style.transform='none';this.style.boxShadow='0 6px 14px rgba(0,0,0,.35)'"
        >
          <img src="/img/logox.png" alt="WhatsApp" style="width:32px;height:32px;" />
        </div>
      </a>
    
    
    <a href="https://wa.me/491739569429" target="_blank" rel="noopener" style="text-decoration:none;">
        <div
          style="
            width:64px;height:64px;border-radius:50%;background:#111;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 6px 14px rgba(0,0,0,.35);
            transition:transform .2s ease, box-shadow .2s ease;
          "
          onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 22px rgba(0,0,0,.45)'"
          onmouseout="this.style.transform='none';this.style.boxShadow='0 6px 14px rgba(0,0,0,.35)'"
        >
          <img src="/img/logoreddit.png" alt="WhatsApp" style="width:32px;height:32px;" />
        </div>
      </a>
    
    
    
    <a href="https://wa.me/491739569429" target="_blank" rel="noopener" style="text-decoration:none;">
        <div
          style="
            width:64px;height:64px;border-radius:50%;background:#111;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 6px 14px rgba(0,0,0,.35);
            transition:transform .2s ease, box-shadow .2s ease;
          "
          onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 22px rgba(0,0,0,.45)'"
          onmouseout="this.style.transform='none';this.style.boxShadow='0 6px 14px rgba(0,0,0,.35)'"
        >
          <img src="/img/logofacebook.png" alt="WhatsApp" style="width:32px;height:32px;" />
        </div>
      </a>

      <a href="https://wa.me/491739569429" target="_blank" rel="noopener" style="text-decoration:none;">
        <div
          style="
            width:64px;height:64px;border-radius:50%;background:#111;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 6px 14px rgba(0,0,0,.35);
            transition:transform .2s ease, box-shadow .2s ease;
          "
          onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 22px rgba(0,0,0,.45)'"
          onmouseout="this.style.transform='none';this.style.boxShadow='0 6px 14px rgba(0,0,0,.35)'"
        >
          <img src="/img/logowhatsapp.png" alt="WhatsApp" style="width:32px;height:32px;" />
        </div>
      </a>

      <a href="https://www.linkedin.com/in/ubterzioglu/" target="_blank" rel="noopener" style="text-decoration:none;">
        <div
          style="
            width:64px;height:64px;border-radius:50%;background:#111;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 6px 14px rgba(0,0,0,.35);
            transition:transform .2s ease, box-shadow .2s ease;
          "
          onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 22px rgba(0,0,0,.45)'"
          onmouseout="this.style.transform='none';this.style.boxShadow='0 6px 14px rgba(0,0,0,.35)'"
        >
          <img src="/img/logolinkedin.png" alt="LinkedIn" style="width:32px;height:32px;" />
        </div>
      </a>

      <a href="https://www.instagram.com/ubterzioglu/" target="_blank" rel="noopener" style="text-decoration:none;">
        <div
          style="
            width:64px;height:64px;border-radius:50%;background:#111;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 6px 14px rgba(0,0,0,.35);
            transition:transform .2s ease, box-shadow .2s ease;
          "
          onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 22px rgba(0,0,0,.45)'"
          onmouseout="this.style.transform='none';this.style.boxShadow='0 6px 14px rgba(0,0,0,.35)'"
        >
          <img src="/img/logoinstagram.png" alt="Instagram" style="width:32px;height:32px;" />
        </div>
      </a>

      <a href="https://maps.google.com/?q=Dortmund,Germany" target="_blank" rel="noopener" style="text-decoration:none;">
        <div
          style="
            width:64px;height:64px;border-radius:50%;background:#111;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 6px 14px rgba(0,0,0,.35);
            transition:transform .2s ease, box-shadow .2s ease;
          "
          onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 22px rgba(0,0,0,.45)'"
          onmouseout="this.style.transform='none';this.style.boxShadow='0 6px 14px rgba(0,0,0,.35)'"
        >
          <img src="/img/logolocation.png" alt="Location" style="width:32px;height:32px;" />
        </div>
      </a>

      <a href="tel:+491739569429" style="text-decoration:none;">
        <div
          style="
            width:64px;height:64px;border-radius:50%;background:#111;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 6px 14px rgba(0,0,0,.35);
            transition:transform .2s ease, box-shadow .2s ease;
          "
          onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 22px rgba(0,0,0,.45)'"
          onmouseout="this.style.transform='none';this.style.boxShadow='0 6px 14px rgba(0,0,0,.35)'"
        >
          <img src="/img/logophone.png" alt="Phone" style="width:32px;height:32px;" />
        </div>
      </a>

      <a href="mailto:ubterzioglu@gmail.com" style="text-decoration:none;">
        <div
          style="
            width:64px;height:64px;border-radius:50%;background:#111;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 6px 14px rgba(0,0,0,.35);
            transition:transform .2s ease, box-shadow .2s ease;
          "
          onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 22px rgba(0,0,0,.45)'"
          onmouseout="this.style.transform='none';this.style.boxShadow='0 6px 14px rgba(0,0,0,.35)'"
        >
          <img src="/img/logoemail.png" alt="Email" style="width:32px;height:32px;" />
        </div>
      </a>

    </div>
  </div>
  <!-- END of block: Contact -->
`);
/* END of block: Card Template — contact */



/* =====================================================
   CARD: ABOUT ME
   ===================================================== */
register("aboutme", () => `
  <div id="aboutme" class="detail-card card-color-3">

    <div class="card-buttons">
      <a href="index.html">
        <img src="/img/z0cliphome.png" class="btn-icon" alt="Home" />
      </a>
      <a href="#top">
        <img src="/img/z0clipup.png" class="btn-icon" alt="Up" />
      </a>
    </div>

    <h2 class="section-title">About Me</h2>

    <!-- Profile photo -->
    <div style="display:flex; justify-content:center; margin:16px 0;">
      <img 
        src="/img/picprofile.png"
        alt="Profile photo"
        style="
          width:120px;
          height:120px;
          border-radius:50%;
          object-fit:cover;
          box-shadow:0 6px 18px rgba(0,0,0,.25);
        "
      />
    </div>

    <!-- Description -->
    <p style="font-size:14.5px; line-height:1.6;">
      Senior Software Quality Assurance Engineer with 15+ years of experience
      in test management, test automation, and process optimization.
      Proven expertise in leading global testing initiatives, implementing
      automation frameworks, and managing cross-functional teams.
      Specialized in Agile/SCRUM methodologies, CI/CD pipelines, and quality
      assurance for enterprise systems.
      Strong background in coordinating FAT and SAT activities, mentoring
      teams, and delivering high-quality software solutions.
    </p>

  </div>
  <!-- END of block: About Me -->
`);
/* END of block: Card Template — aboutme */

/* =====================================================
   CARD: SUPPORT
   ===================================================== */
register("support", () => `
  <div id="support" class="detail-card card-color-5">

    <div class="card-buttons">
      <a href="index.html">
        <img src="/img/z0cliphome.png" class="btn-icon" alt="Home" />
      </a>
      <a href="#top">
        <img src="/img/z0clipup.png" class="btn-icon" alt="Up" />
      </a>
    </div>

    <h2 class="section-title">Support</h2>

    <!-- Profile photo -->
    <div style="display:flex; justify-content:center; margin:16px 0;">
      <img 
        src="/img/logosupport.png"
        alt="Profile photo"
        style="
          width:120px;
          height:120px;
          border-radius:50%;
          object-fit:cover;
          box-shadow:0 6px 18px rgba(0,0,0,.25);
        "
      />
    </div>

    <!-- Description -->
    <p style="font-size:14.5px; line-height:1.6;">
  I'm always here to lend a hand, whether it's for professional advice or simply a conversation. Don’t hesitate to reach out by message, email, or phone whenever you need support.<br /><br />

  If you're facing a challenge at work or looking for guidance, feel free to contact me. I strongly believe in collaboration and supporting each other through both easy and difficult moments.<br /><br />

  Sometimes all we need is a second opinion, a bit of feedback, or just someone who listens. You can always reach out to me for that.<br /><br />

  No matter the topic, I’ll do my best to help. Let’s keep moving forward together.
</p>


  </div>
  <!-- END of block: About Me -->
`);
/* END of block: Card Template — SUPPORT */


/* =====================================================
   CARD: GLOBAL WARMING
   ===================================================== */
register("globalwarming", () => `
  <div id="globalwarming" class="detail-card card-color-3">

    <div class="card-buttons">
      <a href="index.html">
        <img src="/img/z0cliphome.png" class="btn-icon" alt="Home" />
      </a>
      <a href="#top">
        <img src="/img/z0clipup.png" class="btn-icon" alt="Up" />
      </a>
    </div>

    <h2 class="section-title">Global Warming</h2>

    <!-- Profile photo -->
    <div style="display:flex; justify-content:center; margin:16px 0;">
      <img 
  src="/img/z0clipglobal.png"
  alt="Profile photo"
  style="
    width:100%;
    max-width:100%;
    aspect-ratio:16 / 9;
    border-radius:14px;
    object-fit:cover;
    box-shadow:0 6px 18px rgba(0,0,0,.25);
    margin:0 16px;   /* metnin biraz içinden başlasın/bitsin */
  "
/>

    </div>

    <!-- Description -->
    <p style="font-size:14.5px; line-height:1.6;">
  Global warming refers to the long-term increase in Earth’s average surface temperature, mainly caused by human activities such as burning fossil fuels and deforestation. These actions release greenhouse gases like carbon dioxide and methane, which trap heat in the atmosphere.<br /><br />

  As a result, glaciers and ice caps are melting, sea levels are rising, and extreme weather events are becoming more frequent. Global warming also disrupts ecosystems, putting many plant and animal species at risk of extinction.<br /><br />

  Human health, food security, and access to clean water are increasingly affected by these changes. Reducing emissions, using renewable energy, and protecting natural habitats are key steps to slow down global warming.
</p>


  </div>
  
`);
/* END of block: Card Template — GLOBALWARMING */


/* =====================================================
   CARD: ARTICLES (DATA-DRIVEN)
   - expects: window.ARTICLES_DATA = [{ title,date,img,href,text }]
   ===================================================== */
register("articles", () => {
  const items = (window.EXPLORER_DATA && window.EXPLORER_DATA.articles) || [];


  const paragraphs = (t) =>
    String(t || "")
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p style="margin:10px 0 0 0; line-height:1.6; opacity:.92;">${p}</p>`)
      .join("");

  return `
    <div id="articles" class="detail-card card-color-3">
      <div class="card-buttons">
        <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
        <a href="zexplorer.html"><img src="/img/z0clipexplorer.png" class="btn-icon" alt="Explorer" /></a>
        <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
      </div>

      <h2 class="section-title">Articles</h2>
      <div style="margin-top:10px; opacity:.85; line-height:1.5; font-size:.95em;">
        One image, one link, clean text.
      </div>

      <div style="margin-top:18px; display:flex; flex-direction:column; gap:16px;">
        ${
          items.length
            ? items
                .map(
                  (it) => `
          <div style="
            padding:14px 14px;
            border-radius:14px;
            background:rgba(0,0,0,.18);
          ">
            ${
              it.img
                ? `<img src="${it.img}" alt="${it.title || "Article image"}" style="
                    width:100%;
                    max-width:100%;
                    aspect-ratio:16 / 9;
                    border-radius:14px;
                    object-fit:cover;
                    box-shadow:0 6px 18px rgba(0,0,0,.25);
                  " />`
                : ``
            }

            <div style="margin-top:12px; display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
              <div style="font-weight:900; line-height:1.25;">${it.title || "Untitled"}</div>
              ${it.date ? `<div style="opacity:.8; font-size:.9em; white-space:nowrap;">${it.date}</div>` : ``}
            </div>

            ${paragraphs(it.text)}

            ${
              it.href
                ? `<div style="margin-top:12px;">
                    <a href="${it.href}" target="_blank" rel="noopener" style="
                      display:inline-flex; align-items:center; gap:8px;
                      padding:8px 10px; border-radius:999px;
                      background:rgba(255,255,255,.14);
                      text-decoration:none; color:inherit;
                      font-weight:800; font-size:.92em;
                    ">
                      <span>Open</span><span style="opacity:.8;">›</span>
                    </a>
                  </div>`
                : ``
            }
          </div>
        `
                )
                .join("")
            : `<div style="opacity:.8;">No articles yet.</div>`
        }
      </div>
    </div>
    <!-- END of block: Articles -->
  `;
});
/* END of block: Card Template — articles */

/* =====================================================
   CARD: HERO (ARTICLES)
   ===================================================== */
register("heroArticles", () => `
  <div id="hero" class="card hero-card">
    <div class="hero-top">
      <div class="hero-logo-box">
        <img src="/img/logoubt.png" class="hero-logo" alt="UBT logo" />
        <span class="hero-domain">ubterzioglu.de</span>
      </div>
      <a href="index.html">
        <img src="/img/z0cliphome.png" class="home-icon" alt="Home" />
      </a>
    </div>

    <h1>Articles</h1>
    <p class="title">One image, one link, clean text.</p>
  </div>
  <!-- END of block: Hero (Articles) -->
`);
/* END of block: Card Template — heroArticles */

/* =====================================================
   CARD: HERO (BOOKMARKS)
   ===================================================== */
register("heroBookmarks", () => `
  <div id="hero" class="card hero-card">
    <div class="hero-top">
      <div class="hero-logo-box">
        <img src="img/logoubt.png" class="hero-logo" alt="UBT logo" />
        <span class="hero-domain">ubterzioglu.de</span>
      </div>
      <a href="index.html">
        <img src="img/z0cliphome.png" class="home-icon" alt="Home" />
      </a>
    </div>

    <h1>Bookmarks</h1>
    <p class="title">
      Curated links I actually use.<br>
      Articles, tools, references, and useful corners of the web.
    </p>
  </div>
  <!-- END of block: Hero (Bookmarks) -->
`);
/* END of block: Card Template — heroBookmarks */


/* =====================================================
   CARD: BOOKMARKS (DATA-DRIVEN)
   - reads: window.EXPLORER_DATA.bookmarks = [{ title, img, href, note }]
   ===================================================== */
register("bookmarks", () => {
  const items = (window.EXPLORER_DATA && window.EXPLORER_DATA.bookmarks) || [];

  return `
    <div id="bookmarks" class="detail-card card-color-1">
      <div class="card-buttons">
        <a href="index.html">
          <img src="img/z0cliphome.png" class="btn-icon" alt="Home" />
        </a>
        <a href="zexplorer.html">
          <img src="img/z0clipexplorer.png" class="btn-icon" alt="Explorer" />
        </a>
        <a href="#top">
          <img src="img/z0clipup.png" class="btn-icon" alt="Up" />
        </a>
      </div>

      <h2 class="section-title">Bookmarks</h2>

      <div style="
        margin-top:14px;
        opacity:.85;
        font-size:.95em;
        line-height:1.5;
      ">
        Hand-picked links I personally use or recommend.<br>
        Clean, simple, and practical.
      </div>

      <!-- BOOKMARK LIST -->
      <div style="
        margin-top:20px;
        display:flex;
        flex-direction:column;
        gap:14px;
      ">
        ${
          items.length
            ? items.map((it) => `
                <div style="
                  padding:14px 16px;
                  border-radius:14px;
                  background:rgba(255,255,255,.14);
                  box-shadow:0 6px 16px rgba(0,0,0,.18);
                ">

                  <div style="display:flex; gap:14px; align-items:flex-start;">
                    ${
                      it.img
                        ? `<img
                            src="${it.img}"
                            alt=""
                            style="
                              width:72px;
                              height:72px;
                              border-radius:50%;
                              object-fit:cover;
                              box-shadow:0 8px 18px rgba(0,0,0,.22);
                              flex:0 0 auto;
                            "
                          />`
                        : ``
                    }

                    <div style="flex:1;">
                      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
                        <div style="font-weight:800; line-height:1.25;">
                          ${it.title || "Untitled"}
                        </div>
                        <div style="opacity:.8; font-weight:900;">↗</div>
                      </div>

                      ${
                        it.note
                          ? `<div style="margin-top:6px; opacity:.9; line-height:1.5; font-size:.95em;">
                               ${it.note}
                             </div>`
                          : ``
                      }

                      ${
                        it.href
                          ? `<a
                              href="${it.href}"
                              target="_blank"
                              rel="noopener"
                              style="
                                display:inline-flex;
                                align-items:center;
                                gap:6px;
                                margin-top:10px;
                                font-weight:800;
                                text-decoration:none;
                                color:inherit;
                                background:rgba(0,0,0,.18);
                                padding:8px 12px;
                                border-radius:999px;
                              "
                            >
                              Open <span style="opacity:.7;">›</span>
                            </a>`
                          : ``
                      }
                    </div>
                  </div>

                </div>
              `).join("")
            : `<div style="opacity:.75;">No bookmarks yet.</div>`
        }
      </div>
    </div>
    <!-- END of block: Bookmarks -->
  `;
});
/* END of block: Card Template — bookmarks */



/* =====================================================
   START: INSIGHTS INIT (GLOBAL) — card-loader.js
   Purpose: Runs after cards render (scripts inside templates won't execute)
   ===================================================== */

window.ubtInitInsights = async function (days = 30) {
  const el = document.getElementById("insights-box");
  if (!el) return;

  const safe = (s) => String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const normalizeList = (arr) => (Array.isArray(arr) ? arr : (arr && arr.stats) ? arr.stats : []);
  const getLabel = (x) => x?.name ?? x?.label ?? x?.id ?? x?.key ?? "(unknown)";
  const getCount = (x) => x?.count ?? x?.total ?? 0;

  const renderBars = (title, list) => {
    const items = normalizeList(list).slice(0, 5);
    const max = Math.max(1, ...items.map(getCount));

    const rows = items.map((it) => {
      const label = safe(getLabel(it));
      const c = getCount(it);
      const w = Math.round((c / max) * 100);
      return `
        <div style="display:flex; align-items:center; gap:10px; margin-top:10px;">
          <div style="width:140px; opacity:.95; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${label}
          </div>
          <div style="flex:1; height:10px; border-radius:999px; background:rgba(0,0,0,.18); overflow:hidden;">
            <div style="height:10px; width:${w}%; border-radius:999px; background:rgba(255,255,255,.55);"></div>
          </div>
          <div style="width:34px; text-align:right; font-weight:900; opacity:.9;">${c}</div>
        </div>
      `;
    }).join("");

    return `
      <div style="margin-top:16px;">
        <div style="font-weight:900; opacity:.95;">${title}</div>
        ${rows || '<div style="margin-top:8px; opacity:.75;">No data.</div>'}
      </div>
    `;
  };

  try {
    const r = await fetch(`/api/insights?days=${encodeURIComponent(days)}`);
    const j = await r.json();

    if (!r.ok || !j || j.error) {
      el.innerHTML = `<div style="opacity:.85;">No data.</div>`;
      return;
    }

    el.innerHTML = `
      <div style="opacity:.8; font-size:.92em;">
        Last ${j.rangeDays} days · ${j.start} → ${j.end}
      </div>
      ${renderBars("Top referrers", j.toprefs)}
      ${renderBars("Browsers", j.browsers)}
      ${renderBars("Systems", j.systems)}
      ${renderBars("Locations", j.locations)}
      ${renderBars("Sizes", j.sizes)}
    `;
  } catch (e) {
    el.innerHTML = `<div style="opacity:.85;">No data.</div>`;
  }
};

/* =====================================================
   END: INSIGHTS INIT (GLOBAL)
   ===================================================== */




   /* =====================================================
   START: CARD: HERO (INSIGHTS) — add to card-loader.js
   ===================================================== */
register("heroInsights", () => `
  <div id="hero" class="card hero-card">
    <div class="hero-top">
      <div class="hero-logo-box">
        <img src="/logoubt.png" class="hero-logo" alt="UBT logo" />
        <span class="hero-domain">ubterzioglu.de</span>
      </div>
      <a href="index.html">
        <img src="img/z0cliphome.png" class="home-icon" alt="Home" />
      </a>
    </div>

    <h1>Insights</h1>
    <p class="title">Private traffic stats powered by GoatCounter.</p>
  </div>
  <!-- END of block: Hero (Insights) -->
`);
/* =====================================================
   END: CARD: HERO (INSIGHTS)
   ===================================================== */




   /* =====================================================
   START: CARD: INSIGHTS — card-loader.js
   Purpose: UI only (no <script> inside template)
   ===================================================== */

register("insights", () => `
  <div id="insights" class="detail-card card-color-1">
    <div class="card-buttons">
      <a href="index.html"><img src="img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
      <a href="#top"><img src="img/z0clipup.png" class="btn-icon" alt="Up" /></a>
    </div>

    <h2 class="section-title">Traffic Insights</h2>

    <div id="insights-box" style="
      margin-top:14px;
      padding:14px 16px;
      border-radius:14px;
      background:rgba(255,255,255,.14);
      box-shadow:0 6px 16px rgba(0,0,0,.18);
      line-height:1.5;
      opacity:.95;
    ">Loading…</div>
  </div>
`);

/* =====================================================
   END: CARD: INSIGHTS
   ===================================================== */



/* =====================================================
   CARD: UPDATES / NEWS (DATA-DRIVEN – TEXT ONLY + LINK)
   - Date format in data: DD-MM-YYYY (e.g. 12-12-2025)
   - Latest on top (pinned first)
   ===================================================== */
register("updates", () => {
  const itemsRaw = (window.EXPLORER_DATA && window.EXPLORER_DATA.updates) || [];

  const parseDMY = (d) => {
    if (!d) return 0;
    const parts = String(d).split("-");
    if (parts.length !== 3) return 0;
    const [dd, mm, yyyy] = parts;
    const D = Number(dd), M = Number(mm), Y = Number(yyyy);
    if (!Y || !M || !D) return 0;
    return new Date(Y, M - 1, D).getTime();
  };

  const items = [...itemsRaw].sort((a, b) => {
    const ap = a?.pinned ? 1 : 0;
    const bp = b?.pinned ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return parseDMY(b?.date) - parseDMY(a?.date);
  });

  const fmt = (d) => (d ? String(d) : "");

  const normalizeHref = (href) => {
    if (!href) return "";
    const s = String(href).trim();
    if (!s) return "";
    // if already absolute or root-relative, keep it
    if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) return s;
    // otherwise make it relative (same folder)
    return s;
  };

  return `
    <div id="updates" class="detail-card card-color-3">

      <div class="card-buttons">
        <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
        <a href="zexplorer.html"><img src="/img/z0clipexplorer.png" class="btn-icon" alt="Explorer" /></a>
        <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
      </div>

      <h2 class="section-title">Haberler / Güncellemeler </h2>

      <div style="margin-top:10px; opacity:.85; font-size:.95em;">
        Güncel haberler ve son yenilikler için buraya göz atın.
      </div>

      <div style="margin-top:18px; display:flex; flex-direction:column; gap:14px;">
        ${
          items.length
            ? items.map(it => {
                const link = normalizeHref(it?.href);
                return `
                  <div style="
                    padding:14px;
                    border-radius:14px;
                    background:rgba(255,255,255,.14);
                    box-shadow:0 6px 16px rgba(0,0,0,.18);
                  ">
                    <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
                      <div style="font-weight:900; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        ${it?.pinned ? "📌 " : ""}${it?.title || "Update"}
                      </div>

                      <div style="opacity:.8; font-size:.9em; flex-shrink:0; white-space:nowrap;">
                        ${fmt(it?.date)}
                      </div>
                    </div>

                    ${
                      it?.text
                        ? `<div style="margin-top:8px; line-height:1.55; opacity:.92;">
                             ${String(it.text).replaceAll("\n", "<br>")}
                           </div>`
                        : ``
                    }

                    ${
                      link
                        ? `<div style="margin-top:10px;">
                            <a href="${link}" style="
                              display:inline-flex;
                              align-items:center;
                              gap:8px;
                              padding:8px 12px;
                              border-radius:999px;
                              background:rgba(0,0,0,.18);
                              text-decoration:none;
                              color:inherit;
                              font-weight:800;
                              font-size:.92em;
                            ">
                              Open <span style="opacity:.7;">›</span>
                            </a>
                          </div>`
                        : ``
                    }
                  </div>
                `;
              }).join("")
            : `<div style="opacity:.75;">Simdilik haber yok!</div>`
        }
      </div>

      <div style="margin-top:18px; opacity:.75; font-size:.9em;">
        Yalnız değilsin! almanya101 seninle!
      </div>
    </div>
  `;
});
/* END of block: Card Template — Ana Sayfa Hbrler  */




/* =====================================================
   CARD: HERO (TOOLS)
===================================================== */

register("heroTools", () => `
  <div id="hero" class="card hero-card">
    <div class="hero-top">
      <div class="hero-logo-box">
        <img src="/img/logoubt.png" class="hero-logo" alt="UBT logo" />
        <span class="hero-domain">ubterzioglu.de</span>
      </div>
      <a href="index.html">
        <img src="/img/z0cliphome.png" class="home-icon" alt="Home" />
      </a>
    </div>

    <h1>Tools by UBT</h1>
<p>
Here you can find tools I built as hobby projects.  
They are made to be fun and useful in daily life.  
Some help you make decisions, some save time,  
and some are just cool things you can say  
“Hey, look what I found!” and show to your friends.
</p>
  </div>
  <!-- END of block: Hero (Tools) -->
`);
/* END of block: Card Template — heroTools */

/* =====================================================
   CARD: HERO (USEFUL APPS)
   ===================================================== */
register("heroApps", () => `
  <div id="hero" class="card hero-card">
    <div class="hero-top">
      <div class="hero-logo-box">
        <img src="/img/logoubt.png" class="hero-logo" alt="UBT logo" />
        <span class="hero-domain">ubterzioglu.de</span>
      </div>
      <a href="index.html">
        <img src="/img/z0cliphome.png" class="home-icon" alt="Home" />
      </a>
    </div>

    <h1>Useful Apps</h1>
    <p class="title">Simple apps that make daily work easier.</p>
  </div>
  <!-- END of block: Hero (Useful Apps) -->
`);
/* END of block: Card Template — heroApps */


/* =====================================================
   CARD: USEFUL APPS (DATA-DRIVEN)
   ===================================================== */
register("apps", () => {
  const data = (window.EXPLORER_DATA && Array.isArray(window.EXPLORER_DATA.apps))
    ? window.EXPLORER_DATA.apps
    : [];

  if (!data.length) {
    return `
      <div id="apps" class="detail-card card-color-4">
        <div class="card-buttons">
          <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
          <a href="zexplorer.html"><img src="/img/z0clipexplorer.png" class="btn-icon" alt="Explorer" /></a>
          <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
        </div>

        <h2 class="section-title">Useful Apps</h2>
        <p style="opacity:.85; margin:0;">
          No apps yet. Add items to <code>EXPLORER_DATA.apps</code>.
        </p>
      </div>
    `;
  }

  const itemsHtml = data.map(item => `
    <a href="${item.href}" target="_blank" rel="noopener noreferrer"
       style="text-decoration:none; color:inherit;">
      <div style="
        display:flex;
        gap:14px;
        align-items:flex-start;
        padding:12px;
        border:1px solid rgba(255,255,255,.10);
        border-radius:16px;
        background: rgba(0,0,0,.10);
        margin:10px 0;
      ">
        <img src="${item.img}" alt="${item.title}"
             style="
               width:72px;
               height:72px;
               border-radius:16px;
               object-fit:cover;
               flex:0 0 auto;
               background: rgba(255,255,255,.06);
               border:1px solid rgba(255,255,255,.10);
             " />
        <div style="min-width:0;">
          <div style="font-weight:800; margin:2px 0 6px 0; line-height:1.25;">
            ${item.title}
          </div>
          <div style="opacity:.88; line-height:1.45;">
            ${item.note}
          </div>
        </div>
      </div>
    </a>
  `).join("");

  return `
    <div id="apps" class="detail-card card-color-4">
      <div class="card-buttons">
        <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
        <a href="zexplorer.html"><img src="/img/z0clipexplorer.png" class="btn-icon" alt="Explorer" /></a>
        <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
      </div>

      <h2 class="section-title">Useful Apps</h2>
      ${itemsHtml}
    </div>
  `;
});
/* END of block: Card Template — apps */

/* =====================================================
   CARD: TOOLS (DATA-DRIVEN)
   ===================================================== */
register("tools", () => {
  const data = (window.EXPLORER_DATA && Array.isArray(window.EXPLORER_DATA.tools))
    ? window.EXPLORER_DATA.tools
    : [];

  if (!data.length) {
    return `
      <div id="tools" class="detail-card card-color-3">
        <div class="card-buttons">
          <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
          <a href="zexplorer.html"><img src="/img/z0clipexplorer.png" class="btn-icon" alt="Explorer" /></a>
          <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
        </div>

        <h2 class="section-title">Tools</h2>
        <p style="opacity:.85; margin:0;">
          No tools yet. Add items to <code>EXPLORER_DATA.tools</code>.
        </p>
      </div>
    `;
  }

  const itemsHtml = data.map(item => `
    <a href="${item.href}" target="_blank" rel="noopener noreferrer"
       style="text-decoration:none; color:inherit;">
      <div style="
        display:flex;
        gap:14px;
        align-items:flex-start;
        padding:12px;
        border:1px solid rgba(255,255,255,.10);
        border-radius:16px;
        background: rgba(0,0,0,.10);
        margin:10px 0;
      ">
        <img src="${item.img}" alt="${item.title}"
             style="
               width:72px;
               height:72px;
               border-radius:16px;
               object-fit:cover;
               flex:0 0 auto;
               background: rgba(255,255,255,.06);
               border:1px solid rgba(255,255,255,.10);
             " />
        <div style="min-width:0;">
          <div style="font-weight:800; margin:2px 0 6px 0; line-height:1.25;">
            ${item.title}
          </div>
          <div style="opacity:.88; line-height:1.45;">
            ${item.note}
          </div>
        </div>
      </div>
    </a>
  `).join("");

  return `
    <div id="tools" class="detail-card card-color-3">
      <div class="card-buttons">
        <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
        <a href="zexplorer.html"><img src="/img/z0clipexplorer.png" class="btn-icon" alt="Explorer" /></a>
        <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
      </div>

      <h2 class="section-title">Tools</h2>
      ${itemsHtml}
    </div>
  `;
});
/* END of block: Card Template — tools */




 /* =====================================================
     CARD: HERO (QAENGINEER)
     ===================================================== */
  register("heroQaengineer", () => `
    <div id="hero" class="card hero-card">
      <div class="hero-top">
        <div class="hero-logo-box">
          <img src="/img/logoubt.png" class="hero-logo" alt="UBT logo" />
          <span class="hero-domain">ubterzioglu.de</span>
        </div>
        <a href="index.html">
          <img src="/img/z0cliphome.png" class="home-icon" alt="Home" />
        </a>
      </div>

      <h1>Hello QA Engineer!</h1>
      <p class="title">
  What do you need?<br>
  Support? Information?<br>
  Getting to know me better?<br>
  Articles? Useful links?<br>
  Choose a section below to explore!<br>
</p>
    </div>
    
  `);
  /* END of block: Card Template — heroCurious */


   /* =====================================================
     CARD: HERO (QAENGINEER)
     ===================================================== */
  register("heroQaengineer", () => `
    <div id="hero" class="card hero-card">
      <div class="hero-top">
        <div class="hero-logo-box">
          <img src="/img/logoubt.png" class="hero-logo" alt="UBT logo" />
          <span class="hero-domain">ubterzioglu.de</span>
        </div>
        <a href="index.html">
          <img src="/img/z0cliphome.png" class="home-icon" alt="Home" />
        </a>
      </div>

      <h1>Hello QA Engineer!</h1>
      <p class="title">
  What do you need?<br>
  Support? Information?<br>Z
  Getting to know me better?<br>
  Articles? Useful links?<br>
  Choose a section below to explore!<br>
</p>
    </div>
   
  `);
  /* END of block: Card Template — heroCurious */



     /* =====================================================
     CARD: HERO (HABERLER)
     ===================================================== */
  register("heroDontknow", () => `
    <div id="hero" class="card hero-card">
      <div class="hero-top">
        <div class="hero-logo-box">
          <img src="/img/logoround.png" class="hero-logo" alt="UBT logo" />
          <span class="hero-domain">almanya101.de</span>
        </div>
        <a href="index.html">
          <img src="/img/z0cliphome.png" class="home-icon" alt="Home" />
        </a>
      </div>

      <h1>Haberler</h1>
      <p class="title">
 Almanya, Avrupa ve Dünya'dan haberler!<br>
   
</p>
    </div>
   
  `);
  /* END of block: Card Template — herodontknow */
















/* =====================================================
     4) PUBLIC API (window.cardLoader)
     ===================================================== */
  window.cardLoader = { register, renderInto };
})();
/* END of file: card-loader.js */








/* =====================================================
   CARD: HABERLER (DATA-DRIVEN – TEXT ONLY + LINK)
   - Date format in data: DD-MM-YYYY (e.g. 12-12-2025)
   - Latest on top (pinned first)
   ===================================================== */
register("haberler", () => {
  const itemsRaw = (window.EXPLORER_DATA && window.EXPLORER_DATA.updates) || [];

  const parseDMY = (d) => {
    if (!d) return 0;
    const parts = String(d).split("-");
    if (parts.length !== 3) return 0;
    const [dd, mm, yyyy] = parts;
    const D = Number(dd), M = Number(mm), Y = Number(yyyy);
    if (!Y || !M || !D) return 0;
    return new Date(Y, M - 1, D).getTime();
  };

  const items = [...itemsRaw].sort((a, b) => {
    const ap = a?.pinned ? 1 : 0;
    const bp = b?.pinned ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return parseDMY(b?.date) - parseDMY(a?.date);
  });

  const fmt = (d) => (d ? String(d) : "");

  const normalizeHref = (href) => {
    if (!href) return "";
    const s = String(href).trim();
    if (!s) return "";
    // if already absolute or root-relative, keep it
    if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) return s;
    // otherwise make it relative (same folder)
    return s;
  };

  return `
    <div id="updates" class="detail-card card-color-3">

      <div class="card-buttons">
        <a href="index.html"><img src="/img/z0cliphome.png" class="btn-icon" alt="Home" /></a>
        <a href="zexplorer.html"><img src="/img/z0clipexplorer.png" class="btn-icon" alt="Explorer" /></a>
        <a href="#top"><img src="/img/z0clipup.png" class="btn-icon" alt="Up" /></a>
      </div>

      <h2 class="section-title">Haberler / Güncellemeler </h2>

      <div style="margin-top:10px; opacity:.85; font-size:.95em;">
        Güncel haberler ve son yenilikler için buraya göz atın.
      </div>

      <div style="margin-top:18px; display:flex; flex-direction:column; gap:14px;">
        ${
          items.length
            ? items.map(it => {
                const link = normalizeHref(it?.href);
                return `
                  <div style="
                    padding:14px;
                    border-radius:14px;
                    background:rgba(255,255,255,.14);
                    box-shadow:0 6px 16px rgba(0,0,0,.18);
                  ">
                    <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
                      <div style="font-weight:900; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        ${it?.pinned ? "📌 " : ""}${it?.title || "Update"}
                      </div>

                      <div style="opacity:.8; font-size:.9em; flex-shrink:0; white-space:nowrap;">
                        ${fmt(it?.date)}
                      </div>
                    </div>

                    ${
                      it?.text
                        ? `<div style="margin-top:8px; line-height:1.55; opacity:.92;">
                             ${String(it.text).replaceAll("\n", "<br>")}
                           </div>`
                        : ``
                    }

                    ${
                      link
                        ? `<div style="margin-top:10px;">
                            <a href="${link}" style="
                              display:inline-flex;
                              align-items:center;
                              gap:8px;
                              padding:8px 12px;
                              border-radius:999px;
                              background:rgba(0,0,0,.18);
                              text-decoration:none;
                              color:inherit;
                              font-weight:800;
                              font-size:.92em;
                            ">
                              Open <span style="opacity:.7;">›</span>
                            </a>
                          </div>`
                        : ``
                    }
                  </div>
                `;
              }).join("")
            : `<div style="opacity:.75;">No updates yet.</div>`
        }
      </div>

      <div style="margin-top:18px; opacity:.75; font-size:.9em;">
        Yalnız değilsin! almanya101 seninle!
      </div>
    </div>
  `;
});
/* END of block: Card Template — Haberler */