const Components = {
    Sidebar(activeView = 'admin') {
        const links = [
            { id: 'admin', icon: 'layout-dashboard', label: 'Dashboard' },
            { id: 'students', icon: 'users', label: 'Students' },
            { id: 'companies', icon: 'building-2', label: 'Companies' },
            { id: 'jobs', icon: 'briefcase', label: 'Job Board' },
            { id: 'applications', icon: 'clipboard-list', label: 'Applications' },
            { id: 'resumes', icon: 'file-text', label: 'Resumes' },
            { id: 'interviews', icon: 'calendar-clock', label: 'Interviews' },
            { id: 'skill-gap', icon: 'target', label: 'Skill Gap' },
            { id: 'training', icon: 'book-open', label: 'Training' },
            { id: 'resume-score', icon: 'file-search', label: 'Resume Scorer' },
            { id: 'alumni', icon: 'graduation-cap', label: 'Alumni Mentors' },
            { id: 'notifications', icon: 'bell', label: 'Notifications' },
            { id: 'offers', icon: 'gift', label: 'Offers & Drives' },
            { id: 'predictor', icon: 'brain', label: 'Predictor' },
            { id: 'ranking', icon: 'trophy', label: 'Ranking' },
            { id: 'reports', icon: 'bar-chart-3', label: 'Reports' },
        ];
        return `
            <div class="sidebar glass">
                <div class="sidebar-brand">Placement Portal</div>
                <div style="position:relative;">
                    <input type="text" id="global-search" placeholder="🔍 Search..." class="glass" style="width:100%;border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem 1rem;color:white;font-size:0.85rem;" oninput="App.handleSearch(this.value)">
                    <div id="search-results" style="display:none;position:absolute;top:100%;left:0;right:0;background:var(--background);border:1px solid var(--surface-border);border-radius:var(--radius-md);max-height:300px;overflow-y:auto;z-index:100;margin-top:4px;"></div>
                </div>
                <nav class="sidebar-nav">
                    ${links.map(link => `<a href="#${link.id}" class="nav-link ${activeView === link.id ? 'active' : ''}" data-view="${link.id}"><i data-lucide="${link.icon}" size="18"></i><span>${link.label}</span></a>`).join('')}
                </nav>
                <div style="margin-top:auto;"><a href="#" class="nav-link" style="color:var(--danger);" onclick="alert('Demo Logout')"><i data-lucide="log-out" size="18"></i><span>Logout</span></a></div>
            </div>`;
    },

    StatCard(title, value, icon, color) {
        const bg = color || 'rgba(99,102,241,0.1)';
        const fg = color ? color.replace('0.1','1') : 'var(--primary)';
        return `<div class="stat-card glass fade-in"><div class="icon-box" style="background:${bg};color:${fg};"><i data-lucide="${icon}"></i></div><div><h3 style="font-size:1.5rem;">${value}</h3><p style="font-size:0.8rem;color:var(--text-muted);">${title}</p></div></div>`;
    },

    AdminDashboard(stats, apps = [], activities = []) {
        const getIcon = a => ({CREATE:'👤',APPLY:'📋',SELECT:'✅',SCHEDULE:'📅',COMPLETE:'🎉',VERIFY:'🔒',APPROVE:'🏢',OFFER:'🎁',SHORTLIST:'📌',REJECTED:'❌'}[a]||'📌');
        return `<div class="fade-in">
            <header style="margin-bottom:2rem;"><h1>Admin Dashboard</h1><p>Live placement metrics • ${stats.unreadNotifications||0} unread notifications</p></header>
            <div class="stats-grid">
                ${this.StatCard('Students', stats.totalStudents, 'users')}
                ${this.StatCard('Placed', stats.placedStudents, 'check-circle')}
                ${this.StatCard('Jobs', stats.activeJobs, 'briefcase')}
                ${this.StatCard('Companies', stats.totalCompanies, 'building-2')}
                ${this.StatCard('Applications', stats.totalApplications, 'clipboard-list')}
                ${this.StatCard('Offers', stats.totalOffers, 'gift')}
                ${this.StatCard('Upcoming Interviews', stats.upcomingInterviews, 'calendar')}
                ${this.StatCard('Notifications', stats.unreadNotifications, 'bell')}
            </div>
            <div class="glass" style="padding:1.5rem;margin-bottom:1.5rem;">
                <h2 style="margin-bottom:1rem;">Register New Student</h2>
                <form id="student-reg-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0.75rem;" onsubmit="App.handleStudentRegister(event)">
                    <input type="text" name="id" placeholder="ID (e.g. S009)" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="text" name="name" placeholder="Full Name" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="text" name="dept" placeholder="Dept" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="number" step="0.01" name="gpa" placeholder="CGPA" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="email" name="email" placeholder="Email" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="text" name="phone" placeholder="Phone" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;">
                    <div><label style="font-size:0.7rem;color:var(--text-muted);">DOB</label><input type="date" name="dob" class="glass" style="width:100%;border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required></div>
                    <input type="text" name="skills" placeholder="Skills (comma sep)" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;">
                    <input type="number" name="arrears" placeholder="Arrears" value="0" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;">
                    <button type="submit" class="btn btn-primary">Add Student</button>
                </form>
            </div>
            <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:1.5rem;">
                <div class="glass" style="padding:1.5rem;"><h2>Recent Applications</h2><div class="table-container"><table><thead><tr><th>Student</th><th>Job</th><th>Company</th><th>Status</th></tr></thead><tbody>
                    ${apps.length===0?'<tr><td colspan="4">No applications.</td></tr>':apps.slice(0,8).map(a=>`<tr><td>${a.student_name}</td><td>${a.job_title}</td><td>${a.company_name}</td><td><span style="color:${a.status==='Selected'?'var(--success)':a.status==='Shortlisted'?'var(--primary)':a.status==='Rejected'?'var(--danger)':'var(--warning)'};font-weight:700;">${a.status}</span></td></tr>`).join('')}
                </tbody></table></div></div>
                <div class="glass" style="padding:1.5rem;"><h2 style="margin-bottom:1rem;">🔔 Activity Timeline</h2><div style="display:flex;flex-direction:column;gap:0.5rem;max-height:300px;overflow-y:auto;">
                    ${activities.length===0?'<p style="color:var(--text-muted);">No activities.</p>':activities.slice(0,10).map(a=>`<div style="display:flex;gap:0.5rem;padding:0.4rem;border-radius:var(--radius-md);background:rgba(255,255,255,0.02);"><span>${getIcon(a.action)}</span><div style="flex:1;"><p style="font-size:0.8rem;margin:0;">${a.description}</p><span style="font-size:0.65rem;color:var(--text-muted);">${a.created_at?new Date(a.created_at).toLocaleString('en-IN'):''}</span></div></div>`).join('')}
                </div></div>
            </div>
        </div>`;
    },

    StudentList(students) {
        return `<div class="fade-in">
            <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;"><div><h1>Student Directory</h1><p>${students.length} students registered • ${students.filter(s=>s.verified).length} verified</p></div><a href="/api/export/students" class="btn btn-primary" style="text-decoration:none;" download><i data-lucide="download" size="16"></i> Export CSV</a></header>
            <div class="glass" style="padding:1.5rem;"><div class="table-container"><table><thead><tr><th>ID</th><th>Name</th><th>Dept</th><th>CGPA</th><th>DOB</th><th>Arrears</th><th>Skills</th><th>Verified</th><th>Status</th><th>Actions</th></tr></thead><tbody>
                ${students.length===0?'<tr><td colspan="10">No students.</td></tr>':students.map(s=>`<tr>
                    <td>${s.id}</td><td style="font-weight:600;">${s.name}</td><td>${s.dept}</td><td style="font-weight:700;">${s.gpa}</td>
                    <td style="font-size:0.8rem;">${s.dob?new Date(s.dob).toLocaleDateString('en-IN'):'N/A'}</td>
                    <td>${s.arrears>0?`<span style="color:var(--danger);font-weight:700;">${s.arrears}</span>`:'<span style="color:var(--success);">0</span>'}</td>
                    <td><div style="display:flex;flex-wrap:wrap;gap:2px;">${s.skills?s.skills.split(',').map(sk=>`<span style="background:rgba(99,102,241,0.15);color:var(--primary);padding:1px 5px;border-radius:10px;font-size:0.6rem;font-weight:600;">${sk.trim()}</span>`).join(''):'—'}</div></td>
                    <td>${s.verified?'<span style="color:var(--success);font-weight:700;">✅ Yes</span>':'<span style="color:var(--warning);">⏳ No</span>'}</td>
                    <td><span style="color:${s.status==='Selected'?'var(--success)':'var(--warning)'};font-weight:600;">${s.status}</span></td>
                    <td><div style="display:flex;gap:4px;">${!s.verified?`<button class="btn" style="padding:3px 6px;font-size:0.65rem;border:1px solid var(--success);color:var(--success);background:transparent;" onclick="App.verifyStudent('${s.id}')">Verify</button>`:''}<button class="btn" style="padding:3px 6px;font-size:0.65rem;border:1px solid var(--danger);color:var(--danger);background:transparent;" onclick="App.deleteStudent('${s.id}')">Delete</button></div></td>
                </tr>`).join('')}
            </tbody></table></div></div></div>`;
    },

    CompanyList(companies) {
        return `<div class="fade-in">
            <header style="margin-bottom:2rem;"><h1>Partner Companies</h1><p>${companies.filter(c=>c.approved).length} approved • ${companies.filter(c=>!c.approved).length} pending approval</p></header>
            <div class="glass" style="padding:1.5rem;margin-bottom:2rem;"><h2 style="margin-bottom:1rem;">Register Company</h2>
                <form id="company-reg-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;" onsubmit="App.handleCompanyRegister(event)">
                    <input type="text" name="id" placeholder="ID (e.g. C006)" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="text" name="name" placeholder="Company Name" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="text" name="industry" placeholder="Industry" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="text" name="website" placeholder="Website" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="text" name="contact" placeholder="HR Email" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <button type="submit" class="btn btn-primary">Add Company</button>
                </form>
            </div>
            <div class="stats-grid">${companies.map(c=>`<div class="card glass">
                <div style="display:flex;justify-content:space-between;align-items:start;">
                    <div style="display:flex;gap:0.75rem;align-items:center;"><div class="icon-box" style="background:rgba(236,72,153,0.1);color:var(--secondary);width:40px;height:40px;border-radius:8px;"><i data-lucide="building-2" size="20"></i></div><div><h3 style="font-size:1rem;">${c.name}</h3><p style="font-size:0.75rem;">${c.industry}</p></div></div>
                    ${c.approved?'<span style="background:rgba(16,185,129,0.15);color:var(--success);padding:2px 8px;border-radius:10px;font-size:0.65rem;font-weight:700;">Approved</span>':`<button class="btn" style="padding:3px 8px;font-size:0.65rem;border:1px solid var(--warning);color:var(--warning);background:transparent;" onclick="App.approveCompany('${c.id}')">Approve</button>`}
                </div>
                <div style="font-size:0.8rem;"><span><i data-lucide="globe" size="14" style="vertical-align:middle;margin-right:4px;"></i><a href="https://${c.website}" target="_blank" style="color:var(--primary);text-decoration:none;">${c.website}</a></span><br><span><i data-lucide="mail" size="14" style="vertical-align:middle;margin-right:4px;"></i>${c.contact}</span></div>
            </div>`).join('')}</div></div>`;
    },

    JobBoard(jobs, companies) {
        const approved = companies.filter(c => c.approved);
        return `<div class="fade-in">
            <header style="margin-bottom:2rem;"><h1>Job Opportunities</h1><p>${jobs.length} active positions</p></header>
            <div class="glass" style="padding:1.5rem;margin-bottom:2rem;"><h2 style="margin-bottom:1rem;">Post Job</h2>
                <form id="job-post-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;" onsubmit="App.handleJobPost(event)">
                    <select name="company_id" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required><option value="" disabled selected>Company</option>${approved.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select>
                    <input type="text" name="title" placeholder="Job Title" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="number" step="0.1" name="eligibility" placeholder="Min CGPA" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="number" name="max_arrears" placeholder="Max Arrears" value="0" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;">
                    <input type="text" name="package" placeholder="Package" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="text" name="required_skills" placeholder="Skills (comma sep)" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;">
                    <select name="type" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;"><option value="Full-Time">Full-Time</option><option value="Internship">Internship</option></select>
                    <input type="date" name="deadline" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <button type="submit" class="btn btn-primary">Publish</button>
                </form>
            </div>
            <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));">
                ${jobs.map(j=>`<div class="card glass">
                    <div style="display:flex;justify-content:space-between;">
                        <div>
                            <div style="display:flex;gap:0.5rem;align-items:center;">
                                <h3 style="color:var(--primary);font-size:1.1rem;margin:0;">${j.title}</h3>
                                <span style="background:rgba(99,102,241,0.15);color:var(--accent);padding:2px 6px;border-radius:10px;font-size:0.55rem;font-weight:700;">${j.type||'Full-Time'}</span>
                            </div>
                            <p style="font-size:0.85rem;margin:0.2rem 0;">${j.company_name}</p>
                        </div>
                        <span style="background:rgba(16,185,129,0.1);color:var(--success);padding:4px 8px;border-radius:4px;font-size:0.7rem;font-weight:700;height:fit-content;">${j.package}</span>
                    </div>
                    <div style="font-size:0.8rem;color:var(--text-muted);display:flex;flex-direction:column;gap:0.2rem;margin:0.5rem 0;">
                        <span>Req: ${j.required_skills ? j.required_skills.split(',').join(', ') : 'Any'}</span>
                        <span>Min CGPA: ${j.eligibility} | Max Arrears: ${j.max_arrears||0}</span>
                        <span>Deadline: ${j.deadline}</span>
                    </div>
                    <div style="display:flex;gap:0.5rem;"><input type="text" id="apply-sid-${j.id}" placeholder="Student ID" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.25rem 0.5rem;color:white;width:60%;font-size:0.8rem;"><button class="btn btn-primary" style="width:40%;padding:0.5rem;" onclick="App.applyJob('${j.id}')">Apply</button></div>
                </div>`).join('')}
            </div></div>`;
    },

    ApplicationManager(applications) {
        const statusColors = {Applied:'var(--warning)',Shortlisted:'var(--primary)',Selected:'var(--success)',Rejected:'var(--danger)'};
        return `<div class="fade-in">
            <header style="margin-bottom:2rem;"><h1>📋 Application Management</h1><p>Shortlist, select, or reject candidates. ${applications.length} total applications.</p></header>
            <div class="stats-grid" style="margin-bottom:1.5rem;">
                ${this.StatCard('Applied', applications.filter(a=>a.status==='Applied').length, 'clock')}
                ${this.StatCard('Shortlisted', applications.filter(a=>a.status==='Shortlisted').length, 'list')}
                ${this.StatCard('Selected', applications.filter(a=>a.status==='Selected').length, 'check-circle')}
                ${this.StatCard('Rejected', applications.filter(a=>a.status==='Rejected').length, 'x-circle')}
            </div>
            <div class="glass" style="padding:1.5rem;"><div class="table-container"><table><thead><tr><th>Student</th><th>Dept</th><th>CGPA</th><th>Job</th><th>Company</th><th>Status</th><th>Actions</th></tr></thead><tbody>
                ${applications.map(a=>`<tr><td style="font-weight:600;">${a.student_name}</td><td>${a.dept}</td><td>${a.gpa}</td><td>${a.job_title}</td><td>${a.company_name}</td>
                    <td><span style="padding:3px 8px;border-radius:4px;font-size:0.7rem;font-weight:700;background:rgba(${a.status==='Selected'?'16,185,129':a.status==='Shortlisted'?'99,102,241':a.status==='Rejected'?'239,68,68':'245,158,11'},0.15);color:${statusColors[a.status]};">${a.status}</span></td>
                    <td><div style="display:flex;gap:3px;flex-wrap:wrap;">
                        ${a.status==='Applied'?`<button class="btn" style="padding:2px 6px;font-size:0.6rem;border:1px solid var(--primary);color:var(--primary);background:transparent;" onclick="App.updateAppStatus(${a.id},'Shortlisted')">Shortlist</button>`:''}
                        ${a.status!=='Selected'&&a.status!=='Rejected'?`<button class="btn" style="padding:2px 6px;font-size:0.6rem;border:1px solid var(--success);color:var(--success);background:transparent;" onclick="App.updateAppStatus(${a.id},'Selected')">Select</button>`:''}
                        ${a.status!=='Rejected'&&a.status!=='Selected'?`<button class="btn" style="padding:2px 6px;font-size:0.6rem;border:1px solid var(--danger);color:var(--danger);background:transparent;" onclick="App.updateAppStatus(${a.id},'Rejected')">Reject</button>`:''}
                    </div></td></tr>`).join('')}
            </tbody></table></div></div></div>`;
    },

    NotificationCenter(notifications) {
        const typeIcons = {announcement:'📢',result:'🏆',interview:'📅',alert:'⚠️'};
        const typeColors = {announcement:'var(--primary)',result:'var(--success)',interview:'var(--accent)',alert:'var(--warning)'};
        const unread = notifications.filter(n=>!n.is_read).length;
        return `<div class="fade-in">
            <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;"><div><h1>🔔 Notification Center</h1><p>${unread} unread notifications</p></div>
                ${unread>0?`<button class="btn btn-primary" onclick="App.markAllRead()">Mark All Read</button>`:''}
            </header>
            <div class="glass" style="padding:1.5rem;margin-bottom:1.5rem;"><h2 style="margin-bottom:1rem;">Send Announcement</h2>
                <form id="notif-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;" onsubmit="App.handleSendNotification(event)">
                    <select name="type" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;"><option value="announcement">📢 Announcement</option><option value="alert">⚠️ Alert</option><option value="result">🏆 Result</option><option value="interview">📅 Interview</option></select>
                    <input type="text" name="title" placeholder="Title" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="text" name="message" placeholder="Message" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <button type="submit" class="btn btn-primary">Send</button>
                </form>
            </div>
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
                ${notifications.map(n=>`<div class="glass" style="padding:1rem;border-left:4px solid ${typeColors[n.type]||'var(--primary)'};opacity:${n.is_read?'0.6':'1'};">
                    <div style="display:flex;justify-content:space-between;align-items:start;"><div style="display:flex;gap:0.75rem;"><span style="font-size:1.3rem;">${typeIcons[n.type]||'📌'}</span><div><h3 style="font-size:1rem;margin-bottom:0.25rem;">${n.title}</h3><p style="font-size:0.85rem;">${n.message}</p><span style="font-size:0.7rem;color:var(--text-muted);">${n.created_at?new Date(n.created_at).toLocaleString('en-IN'):''} • ${n.target==='all'?'All Students':'Student: '+n.target}</span></div></div>
                        ${!n.is_read?`<button class="btn" style="padding:3px 8px;font-size:0.65rem;border:1px solid var(--primary);color:var(--primary);background:transparent;white-space:nowrap;" onclick="App.markNotifRead(${n.id})">Mark Read</button>`:''}
                    </div></div>`).join('')}
            </div></div>`;
    },

    OfferTracking(offers, students, companies, jobs) {
        return `<div class="fade-in">
            <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;"><div><h1>🎓 Placement Tracking</h1><p>${offers.length} offers made • Track selected students and offer details</p></div>
                <a href="/api/export/placements" class="btn btn-primary" style="text-decoration:none;" download><i data-lucide="download" size="16"></i> Export CSV</a></header>
            <div class="glass" style="padding:1.5rem;margin-bottom:1.5rem;"><h2 style="margin-bottom:1rem;">Record New Offer</h2>
                <form id="offer-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;" onsubmit="App.handleAddOffer(event)">
                    <select name="student_id" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required><option value="" disabled selected>Student</option>${students.map(s=>`<option value="${s.id}">${s.id} - ${s.name}</option>`).join('')}</select>
                    <select name="company_id" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required><option value="" disabled selected>Company</option>${companies.filter(c=>c.approved).map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select>
                    <select name="job_id" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required><option value="" disabled selected>Job</option>${jobs.map(j=>`<option value="${j.id}">${j.title}</option>`).join('')}</select>
                    <input type="text" name="package" placeholder="Package (e.g. 12 LPA)" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <div><label style="font-size:0.7rem;color:var(--text-muted);">Offer Date</label><input type="date" name="offer_date" class="glass" style="width:100%;border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;"></div>
                    <div><label style="font-size:0.7rem;color:var(--text-muted);">Joining Date</label><input type="date" name="joining_date" class="glass" style="width:100%;border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;"></div>
                    <button type="submit" class="btn btn-primary">Add Offer</button>
                </form>
            </div>
            <div class="glass" style="padding:1.5rem;"><h2 style="margin-bottom:1rem;">Placement Records</h2><div class="table-container"><table><thead><tr><th>Student</th><th>Dept</th><th>Company</th><th>Job</th><th>Package</th><th>Offer Date</th><th>Joining</th><th>Status</th></tr></thead><tbody>
                ${offers.length===0?'<tr><td colspan="8">No offers recorded.</td></tr>':offers.map(o=>`<tr><td style="font-weight:600;">${o.student_name}</td><td>${o.dept}</td><td>${o.company_name}</td><td>${o.job_title}</td><td style="color:var(--success);font-weight:700;">${o.package}</td><td style="font-size:0.85rem;">${o.offer_date||'—'}</td><td style="font-size:0.85rem;">${o.joining_date||'—'}</td><td><span style="padding:3px 8px;border-radius:4px;font-size:0.7rem;font-weight:700;background:rgba(16,185,129,0.15);color:var(--success);">${o.status}</span></td></tr>`).join('')}
            </tbody></table></div></div></div>`;
    },

    ReportsView(stats, deptReports, companyReports) {
        return `<div class="fade-in">
            <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;"><div><h1>📊 Placement Reports</h1><p>Comprehensive analytics and department-wise/company-wise reports</p></div>
                <div style="display:flex;gap:1rem;">
                    <button onclick="window.print()" class="btn" style="background:var(--danger);color:white;border:none;"><i data-lucide="printer" size="16"></i> Generate PDF Report</button>
                    <a href="/api/export/ranking" class="btn btn-primary" style="text-decoration:none;" download><i data-lucide="download" size="16"></i> Export CSV</a>
                </div>
            </header>
            <div class="glass" style="padding:2rem;margin-bottom:1.5rem;"><h3>Overall Selection Ratio</h3>
                <div style="height:14px;background:rgba(255,255,255,0.1);border-radius:7px;margin:1rem 0;overflow:hidden;"><div style="width:${stats.totalStudents>0?(stats.placedStudents/stats.totalStudents)*100:0}%;height:100%;background:linear-gradient(90deg,var(--primary),var(--secondary));transition:width 1s;"></div></div>
                <p style="font-size:1.2rem;font-weight:700;">${stats.totalStudents>0?Math.round((stats.placedStudents/stats.totalStudents)*100):0}% Placement Rate</p>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
                <div class="glass" style="padding:1.5rem;"><h3 style="margin-bottom:1rem;">🏛️ Department-wise Analysis</h3><div class="table-container"><table><thead><tr><th>Department</th><th>Total</th><th>Placed</th><th>%</th><th>Avg CGPA</th><th>Highest</th></tr></thead><tbody>
                    ${(deptReports||[]).map(d=>`<tr><td style="font-weight:600;">${d.dept}</td><td>${d.total}</td><td style="color:var(--success);font-weight:700;">${d.placed}</td><td>${d.total>0?Math.round((d.placed/d.total)*100):0}%</td><td>${d.avg_gpa}</td><td style="color:var(--primary);font-weight:700;">${d.highest_gpa}</td></tr>`).join('')}
                </tbody></table></div></div>
                <div class="glass" style="padding:1.5rem;"><h3 style="margin-bottom:1rem;">🏢 Company-wise Placements</h3><div class="table-container"><table><thead><tr><th>Company</th><th>Industry</th><th>Students Placed</th><th>Packages</th></tr></thead><tbody>
                    ${(companyReports||[]).map(c=>`<tr><td style="font-weight:600;">${c.company_name}</td><td>${c.industry}</td><td style="color:var(--success);font-weight:700;">${c.students_placed}</td><td>${c.packages_offered||'—'}</td></tr>`).join('')}
                </tbody></table></div></div>
            </div>
            <div class="stats-grid">
                ${this.StatCard('Total Students', stats.totalStudents, 'users')}
                ${this.StatCard('Placed', stats.placedStudents, 'check-circle')}
                ${this.StatCard('Active Jobs', stats.activeJobs, 'briefcase')}
                ${this.StatCard('Total Offers', stats.totalOffers, 'gift')}
            </div>
        </div>`;
    },

    ResumeManager(resumes, students) {
        const fmtSize = b => { if(!b) return 'N/A'; if(b<1024) return b+' B'; if(b<1024*1024) return (b/1024).toFixed(1)+' KB'; return (b/(1024*1024)).toFixed(1)+' MB'; };
        const fIcon = n => { const e=n.split('.').pop().toLowerCase(); return e==='pdf'?'📄':e==='doc'||e==='docx'?'📝':'📎'; };
        return `<div class="fade-in"><header style="margin-bottom:2rem;"><h1>Resume Management</h1><p>Upload, view, and manage resumes. PDF/DOC/DOCX, max 5MB.</p></header>
            <div class="glass" style="padding:1.5rem;margin-bottom:2rem;"><h2 style="margin-bottom:1rem;">Upload Resume</h2>
                <form id="resume-upload-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;align-items:end;" onsubmit="App.handleResumeUpload(event)">
                    <div><label style="font-size:0.8rem;color:var(--text-muted);">Student</label><select name="student_id" class="glass" style="width:100%;border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required><option value="" disabled selected>Choose</option>${students.map(s=>`<option value="${s.id}">${s.id} - ${s.name}</option>`).join('')}</select></div>
                    <div><label style="font-size:0.8rem;color:var(--text-muted);">File</label><input type="file" name="resume" accept=".pdf,.doc,.docx" class="glass" style="width:100%;border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required></div>
                    <button type="submit" class="btn btn-primary" style="height:fit-content;">Upload</button></form></div>
            <div class="glass" style="padding:1.5rem;"><h2 style="margin-bottom:1rem;">Resumes (${resumes.length})</h2>${resumes.length===0?'<p style="text-align:center;padding:2rem;color:var(--text-muted);">No resumes.</p>':`<div class="table-container"><table><thead><tr><th>Student</th><th>Dept</th><th>File</th><th>Size</th><th>Date</th><th>Actions</th></tr></thead><tbody>
                ${resumes.map(r=>`<tr><td><div style="display:flex;align-items:center;gap:0.5rem;"><div style="width:30px;height:30px;border-radius:50%;background:rgba(99,102,241,0.15);display:flex;align-items:center;justify-content:center;font-size:0.75rem;">${r.student_name.charAt(0)}</div><div><div style="font-weight:600;">${r.student_name}</div><div style="font-size:0.65rem;color:var(--text-muted);">${r.student_id}</div></div></div></td><td>${r.student_dept||'N/A'}</td><td>${fIcon(r.original_name)} ${r.original_name}</td><td>${fmtSize(r.file_size)}</td><td style="font-size:0.8rem;">${r.uploaded_at?new Date(r.uploaded_at).toLocaleDateString():''}</td><td><div style="display:flex;gap:4px;"><a href="/uploads/resumes/${r.filename}" target="_blank" class="btn" style="padding:3px 6px;font-size:0.65rem;border:1px solid var(--primary);color:var(--primary);background:transparent;text-decoration:none;">View</a><button class="btn" style="padding:3px 6px;font-size:0.65rem;border:1px solid var(--danger);color:var(--danger);background:transparent;" onclick="App.deleteResume(${r.id})">Delete</button></div></td></tr>`).join('')}</tbody></table></div>`}</div></div>`;
    },

    InterviewTracker(interviews, students, jobs) {
        const sts = s => s==='Completed'?'background:rgba(16,185,129,0.15);color:var(--success);':s==='Scheduled'?'background:rgba(99,102,241,0.15);color:var(--primary);':'background:rgba(239,68,68,0.15);color:var(--danger);';
        return `<div class="fade-in"><header style="margin-bottom:2rem;"><h1>📅 Interview Tracker</h1><p>Schedule and track interviews</p></header>
            <div class="stats-grid" style="margin-bottom:1.5rem;">${this.StatCard('Total', interviews.length, 'calendar')}${this.StatCard('Scheduled', interviews.filter(i=>i.status==='Scheduled').length, 'clock')}${this.StatCard('Completed', interviews.filter(i=>i.status==='Completed').length, 'check-circle')}</div>
            <div class="glass" style="padding:1.5rem;margin-bottom:2rem;"><h2 style="margin-bottom:1rem;">Schedule Interview</h2>
                <form id="interview-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0.75rem;" onsubmit="App.handleScheduleInterview(event)">
                    <select name="student_id" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required><option value="" disabled selected>Student</option>${students.map(s=>`<option value="${s.id}">${s.id} - ${s.name}</option>`).join('')}</select>
                    <select name="job_id" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required><option value="" disabled selected>Job</option>${jobs.map(j=>`<option value="${j.id}">${j.title} (${j.company_name})</option>`).join('')}</select>
                    <select name="round" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required><option value="" disabled selected>Round</option><option>Aptitude Test</option><option>Technical Round 1</option><option>Technical Round 2</option><option>Group Discussion</option><option>HR Round</option><option>Final Round</option></select>
                    <input type="date" name="scheduled_date" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="time" name="scheduled_time" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;" required>
                    <input type="text" name="venue" placeholder="Venue" class="glass" style="border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.5rem;color:white;">
                    <button type="submit" class="btn btn-primary">Schedule</button></form></div>
            <div class="glass" style="padding:1.5rem;"><h2 style="margin-bottom:1rem;">All Interviews</h2><div class="table-container"><table><thead><tr><th>Student</th><th>Job</th><th>Company</th><th>Round</th><th>Date/Time</th><th>Venue</th><th>Status</th><th>Feedback</th><th>Actions</th></tr></thead><tbody>
                ${interviews.length===0?'<tr><td colspan="9">No interviews.</td></tr>':interviews.map(i=>`<tr><td style="font-weight:600;">${i.student_name}</td><td>${i.job_title}</td><td>${i.company_name}</td><td style="color:var(--accent);font-weight:600;">${i.round}</td><td style="font-size:0.8rem;">${new Date(i.scheduled_date).toLocaleDateString('en-IN')} ${i.scheduled_time}</td><td style="font-size:0.8rem;">${i.venue}</td><td><span style="padding:3px 8px;border-radius:4px;font-size:0.65rem;font-weight:700;${sts(i.status)}">${i.status}</span></td><td style="font-size:0.75rem;max-width:120px;color:var(--text-muted);">${i.feedback||'—'}</td><td><div style="display:flex;gap:3px;">${i.status==='Scheduled'?`<button class="btn" style="padding:2px 6px;font-size:0.6rem;border:1px solid var(--success);color:var(--success);background:transparent;" onclick="App.updateInterview(${i.id},'Completed')">✓</button>`:''}<button class="btn" style="padding:2px 6px;font-size:0.6rem;border:1px solid var(--danger);color:var(--danger);background:transparent;" onclick="App.deleteInterview(${i.id})">✗</button></div></td></tr>`).join('')}
            </tbody></table></div></div></div>`;
    },

    PlacementPredictor(data) {
        const { predictions, avgSelectedGpa } = data;
        const pc = p => p>=80?'#10b981':p>=60?'#6366f1':p>=40?'#f59e0b':'#ef4444';
        return `<div class="fade-in"><header style="margin-bottom:2rem;"><h1>🎯 Placement Predictor</h1><p>Probability analysis based on CGPA, skills, arrears & verification status</p></header>
            <div class="glass" style="padding:1rem;margin-bottom:1.5rem;border-left:4px solid var(--accent);"><div style="display:flex;gap:2rem;flex-wrap:wrap;font-size:0.85rem;"><span>📊 Avg Selected CGPA: <strong>${avgSelectedGpa?avgSelectedGpa.toFixed(2):'N/A'}</strong></span><span>🧠 CGPA(80%) + Skills(+2%/skill) - Arrears(-15%/arrear)</span><span>👥 ${predictions.length} students</span></div></div>
            <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));">
                ${predictions.map(s=>`<div class="card glass" style="position:relative;overflow:hidden;"><div style="position:absolute;top:0;right:0;width:70px;height:70px;display:flex;align-items:center;justify-content:center;border-radius:0 0 0 100%;background:rgba(${s.probability>=75?'16,185,129':s.probability>=50?'245,158,11':'239,68,68'},0.1);"><span style="font-size:1.2rem;font-weight:800;color:${pc(s.probability)};">${s.probability}%</span></div>
                    <div style="display:flex;align-items:center;gap:0.5rem;"><div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;color:white;font-weight:700;">${s.name.charAt(0)}</div><div><h3 style="font-size:1rem;">${s.name}</h3><p style="font-size:0.75rem;color:var(--text-muted);">${s.id} • ${s.dept} • CGPA:${s.gpa} ${s.arrears>0?'• ⚠️'+s.arrears+' arrears':''} ${!s.verified?'• ❌ Unverified':''}</p></div></div>
                    <div style="margin:0.5rem 0;"><div style="display:flex;justify-content:space-between;font-size:0.7rem;"><span>Probability</span><span style="font-weight:700;color:${pc(s.probability)};">${s.probability}%</span></div><div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;"><div style="width:${s.probability}%;height:100%;background:${pc(s.probability)};border-radius:3px;"></div></div></div>
                    <div style="display:flex;justify-content:space-between;"><span style="padding:2px 8px;border-radius:10px;font-size:0.65rem;font-weight:700;background:rgba(${s.riskColor==='success'?'16,185,129':s.riskColor==='warning'?'245,158,11':'239,68,68'},0.15);color:var(--${s.riskColor});">${s.risk}</span><span style="font-size:0.7rem;color:${s.status==='Selected'?'var(--success)':'var(--text-muted)'};font-weight:600;">${s.status==='Selected'?'✅ Placed':'⏳ Pending'}</span></div>
                    ${s.skills?`<div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:0.3rem;">${s.skills.split(',').map(sk=>`<span style="background:rgba(139,92,246,0.15);color:var(--accent);padding:1px 5px;border-radius:10px;font-size:0.55rem;font-weight:600;">${sk.trim()}</span>`).join('')}</div>`:''}
                </div>`).join('')}
            </div></div>`;
    },

    SelectionRanking(rankedStudents) {
        const medal = r => r===1?'🥇':r===2?'🥈':r===3?'🥉':'#'+r;
        const rs = r => r===1?'background:linear-gradient(135deg,#ffd700,#ffaa00);color:#000;font-weight:800;':r===2?'background:linear-gradient(135deg,#c0c0c0,#a0a0a0);color:#000;font-weight:800;':r===3?'background:linear-gradient(135deg,#cd7f32,#a0622e);color:#fff;font-weight:800;':'background:rgba(99,102,241,0.1);color:var(--primary);font-weight:600;';
        const cg = {}; rankedStudents.forEach(s => cg[s.gpa]=(cg[s.gpa]||0)+1);
        return `<div class="fade-in"><header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;"><div><h1>🏆 Selection Ranking</h1><p>CGPA desc → DOB asc tiebreaker</p></div><a href="/api/export/ranking" class="btn btn-primary" style="text-decoration:none;" download><i data-lucide="download" size="16"></i> CSV</a></header>
            <div class="glass" style="padding:1.5rem;"><div class="table-container"><table><thead><tr><th>Rank</th><th>Student</th><th>Dept</th><th>CGPA</th><th>DOB</th><th>Age</th><th>Arrears</th><th>Status</th><th>Tie?</th></tr></thead><tbody>
                ${rankedStudents.map((s,i)=>{const r=i+1;const tied=cg[s.gpa]>1;const age=s.dob?Math.floor((Date.now()-new Date(s.dob).getTime())/(365.25*24*60*60*1000)):'N/A';return `<tr><td><span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;${rs(r)};font-size:${r<=3?'1.1rem':'0.8rem'};">${medal(r)}</span></td><td><div style="font-weight:600;">${s.name}</div><div style="font-size:0.65rem;color:var(--text-muted);">${s.id}</div></td><td>${s.dept}</td><td style="font-weight:700;color:var(--primary);">${s.gpa}</td><td style="font-size:0.8rem;">${s.dob?new Date(s.dob).toLocaleDateString('en-IN'):'N/A'}</td><td>${age} yrs</td><td>${s.arrears>0?`<span style="color:var(--danger);">${s.arrears}</span>`:'0'}</td><td><span style="color:${s.status==='Selected'?'var(--success)':'var(--warning)'};font-weight:600;">${s.status}</span></td><td>${tied?'<span style="background:rgba(236,72,153,0.15);color:var(--secondary);padding:2px 6px;border-radius:4px;font-size:0.65rem;font-weight:600;">DOB</span>':'—'}</td></tr>`;}).join('')}
            </tbody></table></div></div></div>`;
    },

    SkillGapAnalyzer(data) {
        return `<div class="fade-in">
            <header style="margin-bottom:2rem;"><h1>🎯 Skill Gap Analysis</h1><p>Identify missing skills for specific company requirements</p></header>
            <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));">
                ${data.map(s => `<div class="card glass">
                    <h3 style="font-size:1.1rem;margin-bottom:0.5rem;color:var(--primary);">${s.student_name} <span style="font-size:0.7rem;color:var(--text-muted);">(${s.student_id})</span></h3>
                    ${s.job_matches.map(j => `<div style="margin-top:0.8rem;padding-top:0.8rem;border-top:1px solid rgba(255,255,255,0.1);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
                            <span style="font-size:0.85rem;font-weight:600;">${j.job_title}</span>
                            <span style="font-size:0.75rem;font-weight:700;color:${j.match_percent>=80?'var(--success)':j.match_percent>=50?'var(--warning)':'var(--danger)'};">${j.match_percent}% Match</span>
                        </div>
                        <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.2rem;">Required: ${j.required.join(', ')}</div>
                        <div style="font-size:0.7rem;">Missing: ${j.missing.length===0?'<span style="color:var(--success);">None!</span>':j.missing.map(m=>`<span style="color:var(--danger);font-weight:600;">${m}</span>`).join(', ')}</div>
                    </div>`).join('')}
                </div>`).join('')}
            </div>
        </div>`;
    },

    TrainingPortal(modules) {
        return `<div class="fade-in">
            <header style="margin-bottom:2rem;"><h1>📚 Training & Mock Tests</h1><p>Aptitude, Coding Assessments, and Mock Interviews</p></header>
            <div class="stats-grid">
                ${modules.map(m => `<div class="card glass">
                    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1rem;">
                        <span style="padding:4px 8px;border-radius:4px;font-size:0.65rem;font-weight:700;background:rgba(99,102,241,0.15);color:var(--primary);">${m.type.toUpperCase()}</span>
                        <span style="font-size:0.75rem;color:var(--text-muted);">${new Date(m.date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <h3 style="font-size:1.1rem;margin-bottom:1rem;">${m.title}</h3>
                    <a href="${m.link}" target="_blank" class="btn btn-primary" style="display:block;text-align:center;text-decoration:none;">Start Module</a>
                </div>`).join('')}
            </div>
        </div>`;
    },

    AlumniNetwork(alumni) {
        return `<div class="fade-in">
            <header style="margin-bottom:2rem;"><h1>🎓 Alumni Mentorship</h1><p>Connect with placed alumni for guidance</p></header>
            <div class="stats-grid">
                ${alumni.map(a => `<div class="card glass">
                    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
                        <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg, var(--secondary), var(--accent));display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;font-weight:bold;">${a.name.charAt(0)}</div>
                        <div>
                            <h3 style="font-size:1.1rem;">${a.name}</h3>
                            <p style="font-size:0.8rem;color:var(--text-muted);">${a.position} at <strong style="color:white;">${a.company}</strong></p>
                        </div>
                    </div>
                    <div style="font-size:0.8rem;margin-bottom:0.5rem;"><i data-lucide="mail" size="14" style="vertical-align:middle;margin-right:5px;"></i>${a.email}</div>
                    <div style="font-size:0.8rem;"><i data-lucide="linkedin" size="14" style="vertical-align:middle;margin-right:5px;"></i><a href="https://${a.linkedin}" target="_blank" style="color:var(--primary);text-decoration:none;">${a.linkedin}</a></div>
                </div>`).join('')}
            </div>
        </div>`;
    },

    ResumeScorer() {
        return `<div class="fade-in">
            <header style="margin-bottom:2rem;"><h1>📄 Resume Scoring (AI Simulated)</h1><p>Evaluates resumes and suggests improvements</p></header>
            <div class="glass" style="padding:2rem;max-width:500px;margin:0 auto;text-align:center;">
                <h3 style="margin-bottom:1rem;">Select Student to Analyze</h3>
                <form onsubmit="App.handleResumeScore(event)" style="display:flex;gap:1rem;">
                    <input type="text" name="student_id" placeholder="Student ID (e.g. S001)" class="glass" style="flex:1;border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:0.75rem;color:white;" required>
                    <button type="submit" class="btn btn-primary">Analyze</button>
                </form>
                <div id="resume-score-result" style="margin-top:2rem;display:none;"></div>
            </div>
        </div>`;
    }
};
