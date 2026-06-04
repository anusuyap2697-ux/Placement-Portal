const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'placement.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to SQLite database', err);
    } else {
        console.log('Connected to SQLite database');
        initializeSchema();
    }
});

function initializeSchema() {
    db.serialize(() => {
        // 1. Admins Table
        db.run(`CREATE TABLE IF NOT EXISTS admins (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);

        // 2. Students Table (enhanced with arrears, verification, phone)
        db.run(`CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            dept TEXT,
            gpa REAL,
            email TEXT,
            phone TEXT DEFAULT '',
            dob TEXT,
            skills TEXT DEFAULT '',
            arrears INTEGER DEFAULT 0,
            verified INTEGER DEFAULT 0,
            status TEXT DEFAULT 'Applied'
        )`);

        // 3. Companies Table (enhanced with approval)
        db.run(`CREATE TABLE IF NOT EXISTS companies (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            industry TEXT,
            website TEXT,
            contact TEXT,
            approved INTEGER DEFAULT 1
        )`);

        // 4. Jobs Table
        db.run(`CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            company_id TEXT,
            title TEXT,
            description TEXT,
            eligibility REAL,
            max_arrears INTEGER DEFAULT 0,
            package TEXT,
            deadline TEXT,
            FOREIGN KEY(company_id) REFERENCES companies(id)
        )`);

        // 5. Applications Table (enhanced with shortlist stage)
        db.run(`CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT,
            job_id TEXT,
            status TEXT DEFAULT 'Applied',
            applied_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY(student_id) REFERENCES students(id),
            FOREIGN KEY(job_id) REFERENCES jobs(id)
        )`);

        // 6. Placement Drives Table
        db.run(`CREATE TABLE IF NOT EXISTS placement_drives (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            date TEXT,
            eligibility_gpa REAL,
            status TEXT DEFAULT 'Upcoming'
        )`);

        // 7. Resumes Table
        db.run(`CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            filename TEXT NOT NULL,
            original_name TEXT NOT NULL,
            file_size INTEGER,
            uploaded_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY(student_id) REFERENCES students(id)
        )`);

        // 8. Interviews Table
        db.run(`CREATE TABLE IF NOT EXISTS interviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            job_id TEXT NOT NULL,
            round TEXT NOT NULL,
            scheduled_date TEXT NOT NULL,
            scheduled_time TEXT NOT NULL,
            venue TEXT DEFAULT 'Online',
            status TEXT DEFAULT 'Scheduled',
            feedback TEXT DEFAULT '',
            FOREIGN KEY(student_id) REFERENCES students(id),
            FOREIGN KEY(job_id) REFERENCES jobs(id)
        )`);

        // 9. Activity Log Table
        db.run(`CREATE TABLE IF NOT EXISTS activity_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            entity_type TEXT NOT NULL,
            entity_id TEXT,
            description TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        )`);

        // 10. Notifications Table
        db.run(`CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            target TEXT DEFAULT 'all',
            created_at TEXT DEFAULT (datetime('now'))
        )`);

        // 11. Offers/Placement Records Table
        db.run(`CREATE TABLE IF NOT EXISTS offers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            company_id TEXT NOT NULL,
            job_id TEXT NOT NULL,
            package TEXT NOT NULL,
            offer_date TEXT,
            joining_date TEXT,
            offer_letter TEXT DEFAULT '',
            status TEXT DEFAULT 'Offered',
            FOREIGN KEY(student_id) REFERENCES students(id),
            FOREIGN KEY(company_id) REFERENCES companies(id),
            FOREIGN KEY(job_id) REFERENCES jobs(id)
        )`);

        // Seed Data
        db.get("SELECT COUNT(*) as count FROM admins", (err, row) => {
            if (err) return console.error(err);
            if (row && row.count === 0) {
                console.log('Seeding initial data...');
                
                db.run(`INSERT INTO admins (id, username, password) VALUES ('A001', 'admin', 'admin123')`);

                db.run(`INSERT INTO students (id, name, dept, gpa, email, phone, dob, skills, arrears, verified, status) VALUES 
                    ('S001', 'John Doe', 'CSE', 8.5, 'john.doe@college.edu', '9876543210', '2003-05-14', 'React,JavaScript,Node.js,MongoDB', 0, 1, 'Selected'),
                    ('S002', 'Jane Smith', 'ECE', 7.8, 'jane.smith@college.edu', '9876543211', '2003-08-22', 'Python,MATLAB,Circuit Design', 0, 1, 'Applied'),
                    ('S003', 'Mike Ross', 'CSE', 9.2, 'mike.ross@college.edu', '9876543212', '2002-12-03', 'Python,TensorFlow,Machine Learning,Data Science', 0, 1, 'Selected'),
                    ('S004', 'Rachel Zane', 'MECH', 8.1, 'rachel.zane@college.edu', '9876543213', '2003-03-17', 'AutoCAD,SolidWorks,ANSYS', 1, 0, 'Applied'),
                    ('S005', 'Harvey Specter', 'CSE', 7.5, 'harvey@college.edu', '9876543214', '2003-01-10', 'Java,Spring Boot,AWS', 0, 1, 'Applied'),
                    ('S006', 'Donna Paulsen', 'IT', 8.8, 'donna@college.edu', '9876543215', '2003-06-25', 'React,Angular,UI/UX Design', 0, 1, 'Applied'),
                    ('S007', 'Louis Litt', 'ECE', 6.9, 'louis@college.edu', '9876543216', '2002-11-08', 'VLSI,Embedded Systems', 2, 0, 'Applied'),
                    ('S008', 'Jessica Pearson', 'MECH', 9.0, 'jessica@college.edu', '9876543217', '2003-09-30', 'AutoCAD,CATIA,Thermal Analysis', 0, 1, 'Selected')`);

                db.run(`INSERT INTO companies (id, name, industry, website, contact, approved) VALUES 
                    ('C001', 'Tech Giant', 'Software Development', 'techgiant.com', 'hr@techgiant.com', 1),
                    ('C002', 'Innovate AI', 'AI & Machine Learning', 'innovate.ai', 'careers@innovate.ai', 1),
                    ('C003', 'Apex Bio', 'BioTech Solutions', 'apexbio.com', 'jobs@apexbio.com', 1),
                    ('C004', 'CloudNet Systems', 'Cloud Computing', 'cloudnet.io', 'recruit@cloudnet.io', 0),
                    ('C005', 'DataVerse Inc', 'Data Analytics', 'dataverse.com', 'hr@dataverse.com', 1)`);

                db.run(`INSERT INTO jobs (id, company_id, title, description, eligibility, max_arrears, package, deadline) VALUES 
                    ('J001', 'C001', 'Frontend Software Engineer', 'Build robust visual interfaces with React.', 7.5, 0, '12 LPA', '2027-01-07'),
                    ('J002', 'C002', 'Data Science Intern', 'Work on deep learning models and data pipelines.', 8.5, 0, '18 LPA', '2027-03-25'),
                    ('J003', 'C003', 'System Administrator', 'Manage networks, servers, and security.', 7.0, 1, '8 LPA', '2027-05-21'),
                    ('J004', 'C005', 'Business Analyst', 'Analyze data and generate insights.', 7.0, 0, '10 LPA', '2027-04-15'),
                    ('J005', 'C001', 'Backend Developer', 'Design and build APIs with Node.js.', 8.0, 0, '14 LPA', '2027-02-20')`);

                db.run(`INSERT INTO applications (student_id, job_id, status) VALUES 
                    ('S001', 'J001', 'Selected'),
                    ('S002', 'J001', 'Shortlisted'),
                    ('S003', 'J002', 'Selected'),
                    ('S004', 'J003', 'Applied'),
                    ('S005', 'J001', 'Applied'),
                    ('S005', 'J004', 'Shortlisted'),
                    ('S006', 'J001', 'Applied'),
                    ('S006', 'J005', 'Shortlisted'),
                    ('S008', 'J003', 'Selected')`);

                db.run(`INSERT INTO placement_drives (id, name, date, eligibility_gpa, status) VALUES 
                    ('D001', 'Mega Tech Drive 2026', '2026-09-10', 7.5, 'Active'),
                    ('D002', 'Core Engineering Placements', '2026-10-05', 7.0, 'Upcoming'),
                    ('D003', 'Super Dream Drive', '2027-01-20', 8.0, 'Upcoming')`);

                db.run(`INSERT INTO interviews (student_id, job_id, round, scheduled_date, scheduled_time, venue, status, feedback) VALUES 
                    ('S001', 'J001', 'Technical Round 1', '2027-01-15', '10:00', 'Room 301', 'Completed', 'Strong problem-solving'),
                    ('S001', 'J001', 'HR Round', '2027-01-18', '14:00', 'Online - Zoom', 'Completed', 'Excellent communication'),
                    ('S003', 'J002', 'Aptitude Test', '2027-03-28', '09:00', 'Exam Hall A', 'Completed', 'Scored 92/100'),
                    ('S003', 'J002', 'Technical Round 1', '2027-04-02', '11:00', 'Room 205', 'Scheduled', ''),
                    ('S002', 'J001', 'Aptitude Test', '2027-01-15', '09:00', 'Exam Hall A', 'Completed', 'Scored 78/100'),
                    ('S004', 'J003', 'Technical Round 1', '2027-05-25', '10:30', 'Online - Teams', 'Scheduled', ''),
                    ('S005', 'J004', 'Group Discussion', '2027-04-18', '11:00', 'Seminar Hall', 'Scheduled', ''),
                    ('S006', 'J005', 'Technical Round 1', '2027-02-22', '10:00', 'Room 102', 'Scheduled', '')`);

                db.run(`INSERT INTO notifications (type, title, message, target) VALUES 
                    ('announcement', 'Mega Tech Drive 2026', 'Tech Giant, Innovate AI, and 3 more companies visiting on Sep 10. All eligible students must register.', 'all'),
                    ('result', 'Selection Result: Tech Giant', 'John Doe and Mike Ross have been selected for Frontend Software Engineer and Data Science Intern respectively.', 'all'),
                    ('interview', 'Interview Schedule Update', 'Technical Round 1 for System Administrator at Apex Bio scheduled for May 25, 2027.', 'S004'),
                    ('alert', 'Resume Submission Deadline', 'All students must upload their updated resume before Jan 1, 2027.', 'all'),
                    ('announcement', 'New Company: DataVerse Inc', 'DataVerse Inc (Data Analytics) has been approved and will be posting jobs soon.', 'all'),
                    ('result', 'Shortlist: Backend Developer', 'Donna Paulsen shortlisted for Backend Developer at Tech Giant.', 'S006')`);

                db.run(`INSERT INTO offers (student_id, company_id, job_id, package, offer_date, joining_date, status) VALUES 
                    ('S001', 'C001', 'J001', '12 LPA', '2027-01-20', '2027-07-01', 'Accepted'),
                    ('S003', 'C002', 'J002', '18 LPA', '2027-04-10', '2027-07-15', 'Offered'),
                    ('S008', 'C003', 'J003', '8 LPA', '2027-06-01', '2027-08-01', 'Accepted')`);

                db.run(`INSERT INTO activity_log (action, entity_type, entity_id, description) VALUES 
                    ('CREATE', 'student', 'S001', 'John Doe registered in CSE department'),
                    ('CREATE', 'student', 'S003', 'Mike Ross registered in CSE department'),
                    ('VERIFY', 'student', 'S001', 'John Doe profile verified by admin'),
                    ('APPLY', 'application', 'S001', 'John Doe applied for Frontend Software Engineer'),
                    ('SHORTLIST', 'application', 'S002', 'Jane Smith shortlisted for Frontend Software Engineer'),
                    ('SELECT', 'application', 'S001', 'John Doe selected for Frontend Software Engineer'),
                    ('SELECT', 'application', 'S003', 'Mike Ross selected for Data Science Intern'),
                    ('OFFER', 'offer', 'S001', 'Offer letter sent to John Doe - 12 LPA at Tech Giant'),
                    ('SCHEDULE', 'interview', 'S001', 'Interview scheduled: Technical Round 1'),
                    ('COMPLETE', 'interview', 'S001', 'Interview completed: John Doe passed Technical Round 1'),
                    ('APPROVE', 'company', 'C005', 'DataVerse Inc approved by placement officer')`);
                
                console.log('Seeding completed.');
            }
        });
    });
}

module.exports = db;
