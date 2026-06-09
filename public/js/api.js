const BASE_URL = window.location.hostname.includes('github.io') ? 'https://placement-portal-3-lv7i.onrender.com' : '';

const API = {
    async getStats() { return (await fetch(BASE_URL + '/api/stats')).json(); },
    async getStudents() { return (await fetch(BASE_URL + '/api/students')).json(); },
    async getStudentRanking() { return (await fetch(BASE_URL + '/api/students/ranking')).json(); },
    async addStudent(d) { const r = await fetch(BASE_URL + '/api/students', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); return r.json(); },
    async verifyStudent(id) { return (await fetch(`/api/students/${id}/verify`, { method:'PUT' })).json(); },
    async deleteStudent(id) { return (await fetch(`/api/students/${id}`, { method:'DELETE' })).json(); },
    
    async getCompanies() { return (await fetch(BASE_URL + '/api/companies')).json(); },
    async addCompany(d) { const r = await fetch(BASE_URL + '/api/companies', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); return r.json(); },
    async approveCompany(id) { return (await fetch(`/api/companies/${id}/approve`, { method:'PUT' })).json(); },
    
    async getJobs() { return (await fetch(BASE_URL + '/api/jobs')).json(); },
    async addJob(d) { const r = await fetch(BASE_URL + '/api/jobs', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); return r.json(); },
    
    async getApplications() { return (await fetch(BASE_URL + '/api/applications')).json(); },
    async applyForJob(sid, jid) {
        const r = await fetch(BASE_URL + '/api/applications', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({student_id:sid, job_id:jid}) });
        if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json();
    },
    async updateApplicationStatus(id, status) {
        return (await fetch(`/api/applications/${id}/status`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status}) })).json();
    },
    
    async getDrives() { return (await fetch(BASE_URL + '/api/drives')).json(); },
    
    async getResumes() { return (await fetch(BASE_URL + '/api/resumes')).json(); },
    async uploadResume(fd) { const r = await fetch(BASE_URL + '/api/resumes', { method:'POST', body:fd }); if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json(); },
    async deleteResume(id) { return (await fetch(`/api/resumes/${id}`, { method:'DELETE' })).json(); },
    
    async getInterviews() { return (await fetch(BASE_URL + '/api/interviews')).json(); },
    async addInterview(d) { const r = await fetch(BASE_URL + '/api/interviews', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json(); },
    async updateInterview(id, d) { return (await fetch(`/api/interviews/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) })).json(); },
    async deleteInterview(id) { return (await fetch(`/api/interviews/${id}`, { method:'DELETE' })).json(); },
    
    async getActivities() { return (await fetch(BASE_URL + '/api/activities')).json(); },
    
    async getNotifications() { return (await fetch(BASE_URL + '/api/notifications')).json(); },
    async addNotification(d) { return (await fetch(BASE_URL + '/api/notifications', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) })).json(); },
    async markNotificationRead(id) { return (await fetch(`/api/notifications/${id}/read`, { method:'PUT' })).json(); },
    async markAllNotificationsRead() { return (await fetch(BASE_URL + '/api/notifications/read-all', { method:'PUT' })).json(); },
    
    async getOffers() { return (await fetch(BASE_URL + '/api/offers')).json(); },
    async addOffer(d) { return (await fetch(BASE_URL + '/api/offers', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) })).json(); },
    
    async getPredictor() { return (await fetch(BASE_URL + '/api/predictor')).json(); },
    
    async getDeptReports() { return (await fetch(BASE_URL + '/api/reports/department')).json(); },
    async getCompanyReports() { return (await fetch(BASE_URL + '/api/reports/company')).json(); },
const BASE_URL = window.location.hostname.includes('github.io') ? 'https://placement-portal-3-lv7i.onrender.com' : '';

const API = {
    async getStats() { return (await fetch(BASE_URL + '/api/stats')).json(); },
    async getStudents() { return (await fetch(BASE_URL + '/api/students')).json(); },
    async getStudentRanking() { return (await fetch(BASE_URL + '/api/students/ranking')).json(); },
    async addStudent(d) { const r = await fetch(BASE_URL + '/api/students', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); return r.json(); },
    async verifyStudent(id) { return (await fetch(`/api/students/${id}/verify`, { method:'PUT' })).json(); },
    async deleteStudent(id) { return (await fetch(`/api/students/${id}`, { method:'DELETE' })).json(); },
    
    async getCompanies() { return (await fetch(BASE_URL + '/api/companies')).json(); },
    async addCompany(d) { const r = await fetch(BASE_URL + '/api/companies', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); return r.json(); },
    async approveCompany(id) { return (await fetch(`/api/companies/${id}/approve`, { method:'PUT' })).json(); },
    
    async getJobs() { return (await fetch(BASE_URL + '/api/jobs')).json(); },
    async addJob(d) { const r = await fetch(BASE_URL + '/api/jobs', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); return r.json(); },
    
    async getApplications() { return (await fetch(BASE_URL + '/api/applications')).json(); },
    async applyForJob(sid, jid) {
        const r = await fetch(BASE_URL + '/api/applications', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({student_id:sid, job_id:jid}) });
        if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json();
    },
    async updateApplicationStatus(id, status) {
        return (await fetch(`/api/applications/${id}/status`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status}) })).json();
    },
    
    async getDrives() { return (await fetch(BASE_URL + '/api/drives')).json(); },
    
    async getResumes() { return (await fetch(BASE_URL + '/api/resumes')).json(); },
    async uploadResume(fd) { const r = await fetch(BASE_URL + '/api/resumes', { method:'POST', body:fd }); if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json(); },
    async deleteResume(id) { return (await fetch(`/api/resumes/${id}`, { method:'DELETE' })).json(); },
    
    async getInterviews() { return (await fetch(BASE_URL + '/api/interviews')).json(); },
    async addInterview(d) { const r = await fetch(BASE_URL + '/api/interviews', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json(); },
    async updateInterview(id, d) { return (await fetch(`/api/interviews/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) })).json(); },
    async deleteInterview(id) { return (await fetch(`/api/interviews/${id}`, { method:'DELETE' })).json(); },
    
    async getActivities() { return (await fetch(BASE_URL + '/api/activities')).json(); },
    
    async getNotifications() { return (await fetch(BASE_URL + '/api/notifications')).json(); },
    async addNotification(d) { return (await fetch(BASE_URL + '/api/notifications', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) })).json(); },
    async markNotificationRead(id) { return (await fetch(`/api/notifications/${id}/read`, { method:'PUT' })).json(); },
    async markAllNotificationsRead() { return (await fetch(BASE_URL + '/api/notifications/read-all', { method:'PUT' })).json(); },
    
    async getOffers() { return (await fetch(BASE_URL + '/api/offers')).json(); },
    async addOffer(d) { return (await fetch(BASE_URL + '/api/offers', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) })).json(); },
    
    async getPredictor() { return (await fetch(BASE_URL + '/api/predictor')).json(); },
    
    async getDeptReports() { return (await fetch(BASE_URL + '/api/reports/department')).json(); },
    async getCompanyReports() { return (await fetch(BASE_URL + '/api/reports/company')).json(); },
    
    async search(q) { return (await fetch(`/api/search?q=${encodeURIComponent(q)}`)).json(); },

    async getSkillGaps() { return (await fetch(BASE_URL + '/api/skills/gap')).json(); },
    async getTrainingModules() { return (await fetch(BASE_URL + '/api/training')).json(); },
    async getAlumni() { return (await fetch(BASE_URL + '/api/alumni')).json(); },
    async getResumeScore(id) { return (await fetch(BASE_URL + `/api/resumes/score/${id}`)).json(); },
    async registerForDrive(id, sid) { const r = await fetch(BASE_URL + `/api/drives/${id}/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({student_id:sid}) }); if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json(); },
    async login(userid, password) { const r = await fetch(BASE_URL + '/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({userid, password}) }); if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json(); },
    async forgotPassword(email) { const r = await fetch(BASE_URL + '/api/forgot-password', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email}) }); if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json(); },
    async resetPassword(email, otp, newPassword) { const r = await fetch(BASE_URL + '/api/reset-password', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email, otp, newPassword}) }); if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json(); }
};
window.API = API;
