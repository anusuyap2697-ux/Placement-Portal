const API = {
    async getStats() { return (await fetch('/api/stats')).json(); },
    async getStudents() { return (await fetch('/api/students')).json(); },
    async getStudentRanking() { return (await fetch('/api/students/ranking')).json(); },
    async addStudent(d) { const r = await fetch('/api/students', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); return r.json(); },
    async verifyStudent(id) { return (await fetch(`/api/students/${id}/verify`, { method:'PUT' })).json(); },
    async deleteStudent(id) { return (await fetch(`/api/students/${id}`, { method:'DELETE' })).json(); },
    
    async getCompanies() { return (await fetch('/api/companies')).json(); },
    async addCompany(d) { const r = await fetch('/api/companies', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); return r.json(); },
    async approveCompany(id) { return (await fetch(`/api/companies/${id}/approve`, { method:'PUT' })).json(); },
    
    async getJobs() { return (await fetch('/api/jobs')).json(); },
    async addJob(d) { const r = await fetch('/api/jobs', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); return r.json(); },
    
    async getApplications() { return (await fetch('/api/applications')).json(); },
    async applyForJob(sid, jid) {
        const r = await fetch('/api/applications', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({student_id:sid, job_id:jid}) });
        if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json();
    },
    async updateApplicationStatus(id, status) {
        return (await fetch(`/api/applications/${id}/status`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status}) })).json();
    },
    
    async getDrives() { return (await fetch('/api/drives')).json(); },
    
    async getResumes() { return (await fetch('/api/resumes')).json(); },
    async uploadResume(fd) { const r = await fetch('/api/resumes', { method:'POST', body:fd }); if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json(); },
    async deleteResume(id) { return (await fetch(`/api/resumes/${id}`, { method:'DELETE' })).json(); },
    
    async getInterviews() { return (await fetch('/api/interviews')).json(); },
    async addInterview(d) { const r = await fetch('/api/interviews', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); if (!r.ok) { const e = await r.json(); throw new Error(e.error); } return r.json(); },
    async updateInterview(id, d) { return (await fetch(`/api/interviews/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) })).json(); },
    async deleteInterview(id) { return (await fetch(`/api/interviews/${id}`, { method:'DELETE' })).json(); },
    
    async getActivities() { return (await fetch('/api/activities')).json(); },
    
    async getNotifications() { return (await fetch('/api/notifications')).json(); },
    async addNotification(d) { return (await fetch('/api/notifications', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) })).json(); },
    async markNotificationRead(id) { return (await fetch(`/api/notifications/${id}/read`, { method:'PUT' })).json(); },
    async markAllNotificationsRead() { return (await fetch('/api/notifications/read-all', { method:'PUT' })).json(); },
    
    async getOffers() { return (await fetch('/api/offers')).json(); },
    async addOffer(d) { return (await fetch('/api/offers', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) })).json(); },
    
    async getPredictor() { return (await fetch('/api/predictor')).json(); },
    
    async getDeptReports() { return (await fetch('/api/reports/department')).json(); },
    async getCompanyReports() { return (await fetch('/api/reports/company')).json(); },
    
    async search(q) { return (await fetch(`/api/search?q=${encodeURIComponent(q)}`)).json(); }
};
window.API = API;
