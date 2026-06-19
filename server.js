const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Uploads directory
const uploadsDir = path.join(__dirname, 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        allowed.includes(ext) ? cb(null, true) : cb(new Error('Only PDF, DOC, DOCX allowed'));
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== LOGIN & PASSWORD RESET =====
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM students WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            const user = { ...row };
            delete user.password; // Don't send password to frontend
            return res.json({ success: true, user, role: 'student' });
        }
        
        if (email === 'admin@college.edu' && password === 'admin123') {
            return res.json({ success: true, user: { id: 'admin', name: 'Administrator', email: 'admin@college.edu' }, role: 'admin' });
        }
        res.status(401).json({ error: 'Invalid Email or Password' });
    });
});

// Simulated OTP storage in memory (since we have no real email/DB for OTPs)
const otps = {};

app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
    db.get("SELECT * FROM students WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Email not found' });
        
        // Simulate sending OTP (hardcoded to 123456 for demo)
        otps[email] = '123456';
        console.log(`[SIMULATION] Sent OTP 123456 to ${email}`);
        res.json({ success: true, message: 'OTP sent to email (simulated)' });
    });
});

app.post('/api/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (otps[email] !== otp) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    
    db.run("UPDATE students SET password = ? WHERE email = ?", [newPassword, email], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        delete otps[email];
        res.json({ success: true, message: 'Password reset successfully' });
    });
});

// ===== 1. STATS =====
app.get('/api/stats', (req, res) => {
    const stats = {};
    db.get("SELECT COUNT(*) as count FROM students", (e, r) => {
        stats.totalStudents = r ? r.count : 0;
        db.get("SELECT COUNT(*) as count FROM students WHERE status = 'Selected'", (e, r) => {
            stats.placedStudents = r ? r.count : 0;
            db.get("SELECT COUNT(*) as count FROM jobs", (e, r) => {
                stats.activeJobs = r ? r.count : 0;
                db.get("SELECT COUNT(*) as count FROM companies WHERE approved = 1", (e, r) => {
                    stats.totalCompanies = r ? r.count : 0;
                    db.get("SELECT COUNT(*) as count FROM applications", (e, r) => {
                        stats.totalApplications = r ? r.count : 0;
                        db.get("SELECT COUNT(*) as count FROM offers", (e, r) => {
                            stats.totalOffers = r ? r.count : 0;
                            db.get("SELECT COUNT(*) as count FROM interviews WHERE status = 'Scheduled'", (e, r) => {
                                stats.upcomingInterviews = r ? r.count : 0;
                                db.get("SELECT COUNT(*) as count FROM notifications WHERE is_read = 0", (e, r) => {
                                    stats.unreadNotifications = r ? r.count : 0;
                                    res.json(stats);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// ===== 2. STUDENTS =====
app.get('/api/students', (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/students', (req, res) => {
    const { id, name, dept, gpa, email, phone, dob, skills, arrears, password } = req.body;
    const pwd = password || 'password123';
    db.run(
        `INSERT INTO students (id, name, dept, gpa, email, phone, dob, skills, arrears, password) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, dept, gpa, email, phone, dob, skills, arrears || 0, pwd],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            db.run("INSERT INTO activity_log (action, entity_type, entity_id, description) VALUES (?,?,?,?)",
                ['CREATE', 'student', id, `${name} registered in ${dept} department`]);
            res.status(201).json({ id, name, dept, gpa, email, phone, dob, skills, arrears: arrears||0, verified: 0, status: 'Applied' });
        }
    );
});

app.put('/api/students/:id/verify', (req, res) => {
    db.run("UPDATE students SET verified = 1 WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        db.run("INSERT INTO activity_log (action, entity_type, entity_id, description) VALUES (?,?,?,?)",
            ['VERIFY', 'student', req.params.id, `Student ${req.params.id} profile verified`]);
        res.json({ message: "Student verified" });
    });
});

app.delete('/api/students/:id', (req, res) => {
    db.run("DELETE FROM students WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student deleted" });
    });
});

app.get('/api/students/ranking', (req, res) => {
    db.all("SELECT * FROM students ORDER BY gpa DESC, dob ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ===== 3. COMPANIES =====
app.get('/api/companies', (req, res) => {
    db.all("SELECT * FROM companies", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/companies', (req, res) => {
    const { id, name, industry, website, contact } = req.body;
    if (!id || !name) return res.status(400).json({ error: "ID and Name are required" });
    db.run("INSERT INTO companies (id, name, industry, website, contact, approved) VALUES (?,?,?,?,?,0)",
        [id, name, industry, website, contact],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            db.run("INSERT INTO activity_log (action, entity_type, entity_id, description) VALUES (?,?,?,?)",
                ['CREATE', 'company', id, `${name} registered (pending approval)`]);
            res.status(201).json({ id, name, industry, website, contact, approved: 0 });
        }
    );
});

app.put('/api/companies/:id/approve', (req, res) => {
    db.run("UPDATE companies SET approved = 1 WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        db.run("INSERT INTO activity_log (action, entity_type, entity_id, description) VALUES (?,?,?,?)",
            ['APPROVE', 'company', req.params.id, `Company ${req.params.id} approved by placement officer`]);
        db.run("INSERT INTO notifications (type, title, message, target) VALUES (?,?,?,?)",
            ['announcement', 'Company Approved', `Company ${req.params.id} has been approved and can now post jobs.`, 'all']);
        res.json({ message: "Company approved" });
    });
});

// ===== 4. JOBS =====
app.get('/api/jobs', (req, res) => {
    db.all(`SELECT jobs.*, companies.name as company_name FROM jobs JOIN companies ON jobs.company_id = companies.id`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/jobs', (req, res) => {
    const { company_id, title, description, eligibility, max_arrears, package: pkg, deadline } = req.body;
    if (!company_id || !title) return res.status(400).json({ error: "Company ID and Title required" });
    const id = 'J' + Math.floor(Math.random() * 10000);
    db.run("INSERT INTO jobs (id, company_id, title, description, eligibility, max_arrears, package, deadline) VALUES (?,?,?,?,?,?,?,?)",
        [id, company_id, title, description, eligibility, max_arrears||0, pkg, deadline],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            db.run("INSERT INTO notifications (type, title, message, target) VALUES (?,?,?,?)",
                ['announcement', `New Job: ${title}`, `A new position "${title}" has been posted. Check the Job Board for details.`, 'all']);
            res.status(201).json({ id, company_id, title });
        }
    );
});

// ===== 5. APPLICATIONS (with shortlisting) =====
app.get('/api/applications', (req, res) => {
    db.all(`SELECT applications.*, students.name as student_name, students.gpa, students.dept,
            jobs.title as job_title, companies.name as company_name
            FROM applications
            JOIN students ON applications.student_id = students.id
            JOIN jobs ON applications.job_id = jobs.id
            JOIN companies ON jobs.company_id = companies.id
            ORDER BY applications.applied_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/applications', (req, res) => {
    const { student_id, job_id } = req.body;
    if (!student_id || !job_id) return res.status(400).json({ error: "Student ID and Job ID required" });
    db.get("SELECT gpa, arrears, verified FROM students WHERE id = ?", [student_id], (err, student) => {
        if (!student) return res.status(404).json({ error: "Student not found" });
        if (!student.verified) return res.status(400).json({ error: "Student profile not verified. Contact admin." });
        db.get("SELECT eligibility, max_arrears FROM jobs WHERE id = ?", [job_id], (err, job) => {
            if (!job) return res.status(404).json({ error: "Job not found" });
            if (student.gpa < job.eligibility) return res.status(400).json({ error: `CGPA ${student.gpa} below required ${job.eligibility}` });
            if (student.arrears > job.max_arrears) return res.status(400).json({ error: `Student has ${student.arrears} arrears (max allowed: ${job.max_arrears})` });
            db.run("INSERT INTO applications (student_id, job_id, status) VALUES (?,?,'Applied')", [student_id, job_id],
                function(err) {
                    if (err) return res.status(500).json({ error: err.message });
                    db.run("INSERT INTO activity_log (action, entity_type, entity_id, description) VALUES (?,?,?,?)",
                        ['APPLY', 'application', student_id, `${student_id} applied for job ${job_id}`]);
                    res.status(201).json({ id: this.lastID, student_id, job_id, status: 'Applied' });
                }
            );
        });
    });
});

app.put('/api/applications/:id/status', (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Shortlisted', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });
    
    db.get("SELECT a.student_id, s.name, j.title FROM applications a JOIN students s ON a.student_id = s.id JOIN jobs j ON a.job_id = j.id WHERE a.id = ?", [req.params.id], (err, app) => {
        if (!app) return res.status(404).json({ error: "Application not found" });
        db.run("UPDATE applications SET status = ? WHERE id = ?", [status, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            // Update student status if selected
            if (status === 'Selected') {
                db.run("UPDATE students SET status = 'Selected' WHERE id = ?", [app.student_id]);
            }
            db.run("INSERT INTO activity_log (action, entity_type, entity_id, description) VALUES (?,?,?,?)",
                [status.toUpperCase(), 'application', app.student_id, `${app.name} ${status.toLowerCase()} for ${app.title}`]);
            db.run("INSERT INTO notifications (type, title, message, target) VALUES (?,?,?,?)",
                [status === 'Selected' ? 'result' : 'alert', `Application ${status}`, `${app.name} has been ${status.toLowerCase()} for ${app.title}.`, app.student_id]);
            res.json({ message: `Application ${status}` });
        });
    });
});

// ===== 6. PLACEMENT DRIVES =====
app.get('/api/drives', (req, res) => {
    db.all("SELECT * FROM placement_drives", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ===== 7. RESUMES =====
app.get('/api/resumes', (req, res) => {
    db.all(`SELECT resumes.*, students.name as student_name, students.dept as student_dept
            FROM resumes JOIN students ON resumes.student_id = students.id
            ORDER BY resumes.uploaded_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/resumes', upload.single('resume'), (req, res) => {
    const { student_id } = req.body;
    if (!student_id || !req.file) return res.status(400).json({ error: "Student ID and file required" });
    db.get("SELECT id FROM students WHERE id = ?", [student_id], (err, s) => {
        if (!s) return res.status(404).json({ error: "Student not found" });
        db.run("INSERT INTO resumes (student_id, filename, original_name, file_size) VALUES (?,?,?,?)",
            [student_id, req.file.filename, req.file.originalname, req.file.size],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ id: this.lastID, student_id, filename: req.file.filename });
            });
    });
});

app.delete('/api/resumes/:id', (req, res) => {
    db.get("SELECT filename FROM resumes WHERE id = ?", [req.params.id], (err, row) => {
        if (!row) return res.status(404).json({ error: "Not found" });
        const fp = path.join(uploadsDir, row.filename);
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
        db.run("DELETE FROM resumes WHERE id = ?", [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Deleted" });
        });
    });
});

// ===== 8. INTERVIEWS =====
app.get('/api/interviews', (req, res) => {
    db.all(`SELECT interviews.*, students.name as student_name, jobs.title as job_title, companies.name as company_name
            FROM interviews
            JOIN students ON interviews.student_id = students.id
            JOIN jobs ON interviews.job_id = jobs.id
            JOIN companies ON jobs.company_id = companies.id
            ORDER BY interviews.scheduled_date ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/interviews', (req, res) => {
    const { student_id, job_id, round, scheduled_date, scheduled_time, venue } = req.body;
    if (!student_id || !job_id || !round || !scheduled_date || !scheduled_time)
        return res.status(400).json({ error: "All fields required" });
    db.run("INSERT INTO interviews (student_id, job_id, round, scheduled_date, scheduled_time, venue) VALUES (?,?,?,?,?,?)",
        [student_id, job_id, round, scheduled_date, scheduled_time, venue||'Online'],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            db.run("INSERT INTO activity_log (action, entity_type, entity_id, description) VALUES (?,?,?,?)",
                ['SCHEDULE', 'interview', student_id, `Interview: ${round} on ${scheduled_date}`]);
            db.run("INSERT INTO notifications (type, title, message, target) VALUES (?,?,?,?)",
                ['interview', `Interview Scheduled: ${round}`, `Your ${round} is scheduled for ${scheduled_date} at ${scheduled_time}. Venue: ${venue||'Online'}`, student_id]);
            res.status(201).json({ id: this.lastID });
        });
});

app.put('/api/interviews/:id', (req, res) => {
    const { status, feedback } = req.body;
    db.run("UPDATE interviews SET status = ?, feedback = ? WHERE id = ?", [status, feedback||'', req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Updated" });
        });
});

app.delete('/api/interviews/:id', (req, res) => {
    db.run("DELETE FROM interviews WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted" });
    });
});

// ===== 9. ACTIVITY LOG =====
app.get('/api/activities', (req, res) => {
    db.all("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 25", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ===== 10. NOTIFICATIONS =====
app.get('/api/notifications', (req, res) => {
    db.all("SELECT * FROM notifications ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/notifications', (req, res) => {
    const { type, title, message, target } = req.body;
    if (!title || !message) return res.status(400).json({ error: "Title and message required" });
    db.run("INSERT INTO notifications (type, title, message, target) VALUES (?,?,?,?)",
        [type||'announcement', title, message, target||'all'],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        });
});

app.put('/api/notifications/:id/read', (req, res) => {
    db.run("UPDATE notifications SET is_read = 1 WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Marked as read" });
    });
});

app.put('/api/notifications/read-all', (req, res) => {
    db.run("UPDATE notifications SET is_read = 1", (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "All marked as read" });
    });
});

// ===== 11. OFFERS/PLACEMENT TRACKING =====
app.get('/api/offers', (req, res) => {
    db.all(`SELECT offers.*, students.name as student_name, students.dept, 
            companies.name as company_name, jobs.title as job_title
            FROM offers
            JOIN students ON offers.student_id = students.id
            JOIN companies ON offers.company_id = companies.id
            JOIN jobs ON offers.job_id = jobs.id
            ORDER BY offers.offer_date DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/offers', (req, res) => {
    const { student_id, company_id, job_id, package: pkg, offer_date, joining_date } = req.body;
    if (!student_id || !company_id || !job_id || !pkg) return res.status(400).json({ error: "All fields required" });
    db.run("INSERT INTO offers (student_id, company_id, job_id, package, offer_date, joining_date) VALUES (?,?,?,?,?,?)",
        [student_id, company_id, job_id, pkg, offer_date, joining_date],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            db.run("UPDATE students SET status = 'Selected' WHERE id = ?", [student_id]);
            db.run("INSERT INTO activity_log (action, entity_type, entity_id, description) VALUES (?,?,?,?)",
                ['OFFER', 'offer', student_id, `Offer: ${pkg} from company ${company_id}`]);
            db.run("INSERT INTO notifications (type, title, message, target) VALUES (?,?,?,?)",
                ['result', 'Offer Received!', `Congratulations! You received an offer of ${pkg}. Check Placement Tracking for details.`, student_id]);
            res.status(201).json({ id: this.lastID });
        });
});

// ===== 12. PREDICTOR =====
app.get('/api/predictor', (req, res) => {
    db.all("SELECT * FROM students", [], (err, students) => {
        if (err) return res.status(500).json({ error: err.message });
        db.get("SELECT AVG(gpa) as avg_gpa FROM students WHERE status = 'Selected'", (err, avgRow) => {
            const avgSelectedGpa = avgRow ? avgRow.avg_gpa || 8.0 : 8.0;
            const predictions = students.map(s => {
                let prob = 0;
                if (s.gpa >= 9.0) prob = 95;
                else if (s.gpa >= 8.5) prob = 85;
                else if (s.gpa >= 8.0) prob = 72;
                else if (s.gpa >= 7.5) prob = 58;
                else if (s.gpa >= 7.0) prob = 42;
                else if (s.gpa >= 6.5) prob = 28;
                else prob = 15;
                const skillCount = s.skills ? s.skills.split(',').filter(sk => sk.trim()).length : 0;
                prob = Math.min(99, prob + skillCount * 2);
                if (s.arrears > 0) prob = Math.max(5, prob - s.arrears * 15);
                if (!s.verified) prob = Math.max(5, prob - 10);
                return { ...s, probability: prob,
                    risk: prob >= 75 ? 'Low Risk' : prob >= 50 ? 'Medium Risk' : 'High Risk',
                    riskColor: prob >= 75 ? 'success' : prob >= 50 ? 'warning' : 'danger' };
            });
            predictions.sort((a, b) => b.probability - a.probability);
            res.json({ predictions, avgSelectedGpa });
        });
    });
});

// ===== 13. ENHANCED REPORTS =====
app.get('/api/reports/department', (req, res) => {
    db.all(`SELECT dept, COUNT(*) as total, 
            SUM(CASE WHEN status='Selected' THEN 1 ELSE 0 END) as placed,
            ROUND(AVG(gpa), 2) as avg_gpa,
            MAX(gpa) as highest_gpa
            FROM students GROUP BY dept ORDER BY placed DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/reports/company', (req, res) => {
    db.all(`SELECT c.name as company_name, c.industry,
            COUNT(DISTINCT o.student_id) as students_placed,
            GROUP_CONCAT(DISTINCT o.package) as packages_offered
            FROM companies c
            LEFT JOIN offers o ON c.id = o.company_id
            WHERE c.approved = 1
            GROUP BY c.id ORDER BY students_placed DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ===== 14. CSV EXPORT =====
app.get('/api/export/students', (req, res) => {
    db.all("SELECT * FROM students ORDER BY gpa DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const csv = 'ID,Name,Department,CGPA,Email,Phone,DOB,Skills,Arrears,Verified,Status\n' +
            rows.map(r => `${r.id},${r.name},${r.dept},${r.gpa},${r.email},${r.phone||''},${r.dob||''},"${r.skills||''}",${r.arrears},${r.verified?'Yes':'No'},${r.status}`).join('\n');
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=students_export.csv');
        res.send(csv);
    });
});

app.get('/api/export/ranking', (req, res) => {
    db.all("SELECT * FROM students ORDER BY gpa DESC, dob ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const csv = 'Rank,ID,Name,Department,CGPA,DOB,Arrears,Status\n' +
            rows.map((r, i) => `${i+1},${r.id},${r.name},${r.dept},${r.gpa},${r.dob||''},${r.arrears},${r.status}`).join('\n');
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=ranking_export.csv');
        res.send(csv);
    });
});

app.get('/api/export/placements', (req, res) => {
    db.all(`SELECT o.*, s.name as student_name, s.dept, c.name as company_name, j.title as job_title
            FROM offers o JOIN students s ON o.student_id = s.id
            JOIN companies c ON o.company_id = c.id JOIN jobs j ON o.job_id = j.id`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const csv = 'Student,Department,Company,Job,Package,Offer Date,Joining Date,Status\n' +
            rows.map(r => `${r.student_name},${r.dept},${r.company_name},${r.job_title},${r.package},${r.offer_date||''},${r.joining_date||''},${r.status}`).join('\n');
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=placements_export.csv');
        res.send(csv);
    });
});

// ===== 15. GLOBAL SEARCH =====
app.get('/api/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ students: [], companies: [], jobs: [] });
    const t = `%${q}%`;
    const results = {};
    db.all("SELECT * FROM students WHERE name LIKE ? OR id LIKE ? OR dept LIKE ? OR skills LIKE ?", [t,t,t,t], (e, r) => {
        results.students = r || [];
        db.all("SELECT * FROM companies WHERE name LIKE ? OR industry LIKE ?", [t,t], (e, r) => {
            results.companies = r || [];
            db.all("SELECT j.*, c.name as company_name FROM jobs j JOIN companies c ON j.company_id=c.id WHERE j.title LIKE ? OR c.name LIKE ?", [t,t], (e, r) => {
                results.jobs = r || [];
                res.json(results);
            });
        });
    });
});

// ===== 16. SKILL GAP ANALYSIS =====
app.get('/api/skills/gap', (req, res) => {
    db.all("SELECT id, name, skills FROM students", [], (err, students) => {
        if (err) return res.status(500).json({ error: err.message });
        db.all("SELECT id, title, required_skills FROM jobs WHERE required_skills != ''", [], (err, jobs) => {
            if (err) return res.status(500).json({ error: err.message });
            const analysis = students.map(student => {
                const sSkills = student.skills ? student.skills.toLowerCase().split(',').map(s => s.trim()) : [];
                const jobGaps = jobs.map(job => {
                    const jSkills = job.required_skills.toLowerCase().split(',').map(s => s.trim());
                    const missing = jSkills.filter(js => !sSkills.includes(js));
                    return { job_title: job.title, required: jSkills, missing: missing, match_percent: Math.round(((jSkills.length - missing.length) / jSkills.length) * 100) || 0 };
                }).filter(jg => jg.match_percent > 0).sort((a,b) => b.match_percent - a.match_percent);
                return { student_id: student.id, student_name: student.name, job_matches: jobGaps.slice(0, 3) };
            });
            res.json(analysis);
        });
    });
});

// ===== 17. TRAINING & MOCK TESTS =====
app.get('/api/training', (req, res) => {
    db.all("SELECT * FROM training_modules ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ===== 18. ALUMNI MENTORSHIP =====
app.get('/api/alumni', (req, res) => {
    db.all("SELECT * FROM alumni", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ===== 19. RESUME SCORING (SIMULATED) =====
app.get('/api/resumes/score/:student_id', (req, res) => {
    db.get("SELECT gpa, skills, arrears FROM students WHERE id = ?", [req.params.student_id], (err, student) => {
        if (!student) return res.status(404).json({ error: "Student not found" });
        db.get("SELECT filename FROM resumes WHERE student_id = ? ORDER BY uploaded_at DESC LIMIT 1", [req.params.student_id], (err, resume) => {
            if (!resume) return res.json({ score: 0, feedback: "No resume uploaded. Please upload a resume first." });
            let score = 50;
            let feedback = [];
            if (student.gpa >= 8.5) { score += 20; feedback.push("Excellent academic record highlighted."); }
            else if (student.gpa >= 7.0) { score += 10; feedback.push("Good academics, but emphasize technical skills more."); }
            else { feedback.push("Focus on highlighting projects and certifications to offset lower GPA."); }
            
            const skillCount = student.skills ? student.skills.split(',').length : 0;
            if (skillCount >= 5) { score += 20; feedback.push("Strong technical skills section."); }
            else if (skillCount > 0) { score += 10; feedback.push("Add more relevant technical skills."); }
            else { feedback.push("CRITICAL: Your resume is missing a clear skills section."); }
            
            if (student.arrears === 0) { score += 10; }
            else { feedback.push("Ensure you mention how you overcame academic challenges."); }
            
            res.json({ score: Math.min(score, 100), suggestions: feedback });
        });
    });
});

// ===== 20. DRIVE REGISTRATIONS =====
app.post('/api/drives/:id/register', (req, res) => {
    const { student_id } = req.body;
    db.run("INSERT INTO drive_registrations (student_id, drive_id) VALUES (?, ?)", [student_id, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: "Already registered or error: " + err.message });
        res.json({ message: "Successfully registered for drive!" });
    });
});

// Multer error handler
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large (max 5MB)' });
        return res.status(400).json({ error: err.message });
    }
    if (err) return res.status(400).json({ error: err.message });
    next();
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
