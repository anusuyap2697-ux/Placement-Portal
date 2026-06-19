const App = {
    currentView: 'admin',
    searchTimeout: null,
    currentUser: null,
    
    init() {
        this.sidebarContainer = document.getElementById('sidebar-container');
        this.routerView = document.getElementById('router-view');
        this.loadingView = document.getElementById('view-loading');
        
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) this.currentUser = JSON.parse(storedUser);
        
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    handleRoute() {
        if (!this.currentUser) {
            const hash = window.location.hash.replace('#', '') || 'login';
            if (hash === 'forgot') {
                this.currentView = 'forgot';
            } else {
                this.currentView = 'login';
                window.location.hash = 'login';
            }
        } else {
            const hash = window.location.hash.replace('#', '') || 'admin';
            this.currentView = hash === 'login' ? 'admin' : hash;
        }
        this.renderView();
        this.renderSidebar();
    },

    renderSidebar() {
        if (!this.currentUser || this.currentView === 'login') {
            this.sidebarContainer.innerHTML = '';
            this.sidebarContainer.style.display = 'none';
        } else {
            this.sidebarContainer.style.display = 'flex';
            this.sidebarContainer.innerHTML = Components.Sidebar(this.currentView);
            lucide.createIcons();
        }
    },

    async renderView() {
        this.loadingView.style.display = 'block';
        this.routerView.style.display = 'none';
        try {
            let html = '';
            switch(this.currentView) {
                case 'login':
                    html = Components.LoginView();
                    break;
                case 'forgot':
                    html = Components.ForgotPasswordView();
                    break;
                case 'admin':
                    const [stats, apps, activities] = await Promise.all([API.getStats(), API.getApplications(), API.getActivities()]);
                    html = Components.AdminDashboard(stats, apps, activities);
                    break;
                case 'students':
                    html = Components.StudentList(await API.getStudents());
                    break;
                case 'companies':
                    html = Components.CompanyList(await API.getCompanies());
                    break;
                case 'jobs':
                    const [jobs, companies] = await Promise.all([API.getJobs(), API.getCompanies()]);
                    html = Components.JobBoard(jobs, companies);
                    break;
                case 'applications':
                    html = Components.ApplicationManager(await API.getApplications());
                    break;
                case 'resumes':
                    const [resumes, rStudents] = await Promise.all([API.getResumes(), API.getStudents()]);
                    html = Components.ResumeManager(resumes, rStudents);
                    break;
                case 'interviews':
                    const [interviews, iStudents, iJobs] = await Promise.all([API.getInterviews(), API.getStudents(), API.getJobs()]);
                    html = Components.InterviewTracker(interviews, iStudents, iJobs);
                    break;
                case 'notifications':
                    html = Components.NotificationCenter(await API.getNotifications());
                    break;
                case 'offers':
                    const [offers, oStudents, oCompanies, oJobs] = await Promise.all([API.getOffers(), API.getStudents(), API.getCompanies(), API.getJobs()]);
                    html = Components.OfferTracking(offers, oStudents, oCompanies, oJobs);
                    break;
                case 'predictor':
                    html = Components.PlacementPredictor(await API.getPredictor());
                    break;
                case 'ranking':
                    html = Components.SelectionRanking(await API.getStudentRanking());
                    break;
                case 'reports':
                    const [rStats, deptR, compR] = await Promise.all([API.getStats(), API.getDeptReports(), API.getCompanyReports()]);
                    html = Components.ReportsView(rStats, deptR, compR);
                    break;
                case 'skill-gap':
                    html = Components.SkillGapAnalyzer(await API.getSkillGaps());
                    break;
                case 'training':
                    html = Components.TrainingPortal(await API.getTrainingModules());
                    break;
                case 'alumni':
                    html = Components.AlumniNetwork(await API.getAlumni());
                    break;
                case 'resume-score':
                    html = Components.ResumeScorer();
                    break;
                default:
                    html = `<div class="fade-in"><h1>${this.currentView.toUpperCase()} Module</h1><p>Under construction.</p></div>`;
            }
            this.routerView.innerHTML = html;
        } catch (error) {
            console.error(error);
            this.routerView.innerHTML = `<div class="fade-in" style="padding:2rem;border:1px solid var(--danger);border-radius:var(--radius-md);background:rgba(239,68,68,0.1);"><h2 style="color:var(--danger);">Connection Error</h2><p>${error.message}</p><button class="btn btn-primary" style="margin-top:1rem;" onclick="App.renderView()">Retry</button></div>`;
        } finally {
            this.loadingView.style.display = 'none';
            this.routerView.style.display = 'block';
            window.dispatchEvent(new CustomEvent('view-changed'));
        }
    },

    // ===== AUTH HANDLERS =====
    async handleLogin(event) {
        event.preventDefault();
        const d = Object.fromEntries(new FormData(event.target).entries());
        try {
            const res = await API.login(d.email, d.password);
            if (res.success) {
                this.currentUser = res.user;
                localStorage.setItem('currentUser', JSON.stringify(res.user));
                window.location.hash = 'admin';
                this.handleRoute();
            }
        } catch(e) {
            alert('Login failed: ' + e.message);
        }
    },

    async handleForgotPassword(event) {
        event.preventDefault();
        const email = document.getElementById('reset-email').value;
        try {
            const res = await API.forgotPassword(email);
            if (res.success) {
                document.getElementById('forgot-step-1').style.display = 'none';
                document.getElementById('forgot-step-2').style.display = 'block';
            }
        } catch(e) {
            alert('Error: ' + e.message);
        }
    },

    async handleResetPassword(event) {
        event.preventDefault();
        const email = document.getElementById('reset-email').value;
        const d = Object.fromEntries(new FormData(event.target).entries());
        try {
            const res = await API.resetPassword(email, d.otp, d.newPassword);
            if (res.success) {
                alert('Password reset successfully! Please login with your new password.');
                window.location.hash = 'login';
            }
        } catch(e) {
            alert('Error: ' + e.message);
        }
    },

    handleLogout() {
        if (!confirm('Are you sure you want to logout?')) return;
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.hash = 'login';
        this.handleRoute();
    },

    // ===== STUDENT HANDLERS =====
    async handleStudentRegister(event) {
        event.preventDefault();
        const d = Object.fromEntries(new FormData(event.target).entries());
        d.gpa = parseFloat(d.gpa); d.arrears = parseInt(d.arrears) || 0;
        try { await API.addStudent(d); alert('Student registered!'); event.target.reset(); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    async verifyStudent(id) {
        if (!confirm(`Verify student ${id}?`)) return;
        try { await API.verifyStudent(id); alert('Student verified!'); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    async deleteStudent(id) {
        if (!confirm(`Delete student ${id}?`)) return;
        try { await API.deleteStudent(id); alert('Deleted!'); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    // ===== COMPANY HANDLERS =====
    async handleCompanyRegister(event) {
        event.preventDefault();
        const d = Object.fromEntries(new FormData(event.target).entries());
        try { await API.addCompany(d); alert('Company registered (pending approval)!'); event.target.reset(); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    async approveCompany(id) {
        if (!confirm(`Approve company ${id}?`)) return;
        try { await API.approveCompany(id); alert('Company approved!'); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    // ===== JOB HANDLERS =====
    async handleJobPost(event) {
        event.preventDefault();
        const d = Object.fromEntries(new FormData(event.target).entries());
        d.eligibility = parseFloat(d.eligibility); d.max_arrears = parseInt(d.max_arrears) || 0;
        try { await API.addJob(d); alert('Job posted!'); event.target.reset(); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    async applyJob(jobId) {
        const el = document.getElementById(`apply-sid-${jobId}`);
        const sid = el.value.trim();
        if (!sid) { alert('Enter Student ID!'); return; }
        try { await API.applyForJob(sid, jobId); alert('Applied!'); el.value = ''; this.renderView(); } catch(e) { alert('Failed: ' + e.message); }
    },

    // ===== APPLICATION HANDLERS =====
    async updateAppStatus(id, status) {
        if (!confirm(`${status} this application?`)) return;
        try { await API.updateApplicationStatus(id, status); alert(`Application ${status}!`); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    // ===== RESUME HANDLERS =====
    async handleResumeUpload(event) {
        event.preventDefault();
        try { await API.uploadResume(new FormData(event.target)); alert('Uploaded!'); event.target.reset(); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    async deleteResume(id) {
        if (!confirm('Delete resume?')) return;
        try { await API.deleteResume(id); alert('Deleted!'); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    // ===== INTERVIEW HANDLERS =====
    async handleScheduleInterview(event) {
        event.preventDefault();
        const d = Object.fromEntries(new FormData(event.target).entries());
        try { await API.addInterview(d); alert('Interview scheduled!'); event.target.reset(); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    async updateInterview(id, status) {
        const feedback = status === 'Completed' ? prompt('Feedback (optional):') || '' : '';
        try { await API.updateInterview(id, { status, feedback }); alert(`Interview ${status}!`); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    async deleteInterview(id) {
        if (!confirm('Delete interview?')) return;
        try { await API.deleteInterview(id); alert('Deleted!'); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    // ===== NOTIFICATION HANDLERS =====
    async handleSendNotification(event) {
        event.preventDefault();
        const d = Object.fromEntries(new FormData(event.target).entries());
        try { await API.addNotification(d); alert('Notification sent!'); event.target.reset(); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    async markNotifRead(id) {
        try { await API.markNotificationRead(id); this.renderView(); } catch(e) { console.error(e); }
    },

    async markAllRead() {
        try { await API.markAllNotificationsRead(); alert('All marked as read!'); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    // ===== OFFER HANDLERS =====
    async handleAddOffer(event) {
        event.preventDefault();
        const d = Object.fromEntries(new FormData(event.target).entries());
        try { await API.addOffer(d); alert('Offer recorded!'); event.target.reset(); this.renderView(); } catch(e) { alert('Error: ' + e.message); }
    },

    // ===== RESUME SCORING HANDLER =====
    async handleResumeScore(event) {
        event.preventDefault();
        const sid = new FormData(event.target).get('student_id');
        const resDiv = document.getElementById('resume-score-result');
        resDiv.style.display = 'block';
        resDiv.innerHTML = '<p>Analyzing...</p>';
        try {
            const data = await API.getResumeScore(sid);
            if (data.error) throw new Error(data.error);
            const color = data.score >= 80 ? 'var(--success)' : data.score >= 50 ? 'var(--warning)' : 'var(--danger)';
            resDiv.innerHTML = `
                <div style="font-size:3rem;font-weight:800;color:${color};margin-bottom:1rem;">${data.score}/100</div>
                <div style="text-align:left;background:rgba(255,255,255,0.05);padding:1.5rem;border-radius:var(--radius-md);">
                    <h4 style="margin-bottom:0.5rem;color:var(--primary);">AI Feedback & Suggestions</h4>
                    <ul style="font-size:0.85rem;color:var(--text-muted);padding-left:1rem;">
                        ${data.suggestions ? data.suggestions.map(s=>`<li style="margin-bottom:0.4rem;">${s}</li>`).join('') : `<li>${data.feedback}</li>`}
                    </ul>
                </div>
            `;
        } catch(e) {
            resDiv.innerHTML = `<p style="color:var(--danger);">${e.message}</p>`;
        }
    },

    // ===== GLOBAL SEARCH =====
    handleSearch(query) {
        clearTimeout(this.searchTimeout);
        const rd = document.getElementById('search-results');
        if (!query || query.length < 2) { if (rd) rd.style.display = 'none'; return; }
        this.searchTimeout = setTimeout(async () => {
            try {
                const r = await API.search(query);
                const total = r.students.length + r.companies.length + r.jobs.length;
                if (total === 0) { rd.innerHTML = '<div style="padding:1rem;color:var(--text-muted);font-size:0.85rem;">No results.</div>'; }
                else {
                    let h = '';
                    if (r.students.length) { h += '<div style="padding:0.5rem 1rem;font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Students</div>'; r.students.forEach(s => h += `<a href="#students" style="display:block;padding:0.5rem 1rem;color:var(--text-main);text-decoration:none;font-size:0.8rem;border-bottom:1px solid var(--surface-border);">👤 ${s.name} <span style="color:var(--text-muted);font-size:0.7rem;">${s.dept} • ${s.gpa}</span></a>`); }
                    if (r.companies.length) { h += '<div style="padding:0.5rem 1rem;font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Companies</div>'; r.companies.forEach(c => h += `<a href="#companies" style="display:block;padding:0.5rem 1rem;color:var(--text-main);text-decoration:none;font-size:0.8rem;border-bottom:1px solid var(--surface-border);">🏢 ${c.name} <span style="color:var(--text-muted);font-size:0.7rem;">${c.industry}</span></a>`); }
                    if (r.jobs.length) { h += '<div style="padding:0.5rem 1rem;font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Jobs</div>'; r.jobs.forEach(j => h += `<a href="#jobs" style="display:block;padding:0.5rem 1rem;color:var(--text-main);text-decoration:none;font-size:0.8rem;border-bottom:1px solid var(--surface-border);">💼 ${j.title} <span style="color:var(--text-muted);font-size:0.7rem;">${j.company_name}</span></a>`); }
                    rd.innerHTML = h;
                }
                rd.style.display = 'block';
            } catch(e) { console.error(e); }
        }, 300);
    }
};

document.addEventListener('click', e => {
    const rd = document.getElementById('search-results');
    const si = document.getElementById('global-search');
    if (rd && si && !si.contains(e.target) && !rd.contains(e.target)) rd.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => App.init());
