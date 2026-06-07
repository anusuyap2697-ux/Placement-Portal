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
            type TEXT DEFAULT 'Full-Time',
            required_skills TEXT DEFAULT '',
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

        // 12. Training & Mock Tests
        db.run(`CREATE TABLE IF NOT EXISTS training_modules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            type TEXT NOT NULL,
            link TEXT NOT NULL,
            date TEXT NOT NULL
        )`);

        // 13. Alumni Mentorship
        db.run(`CREATE TABLE IF NOT EXISTS alumni (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            company TEXT NOT NULL,
            position TEXT NOT NULL,
            email TEXT NOT NULL,
            linkedin TEXT NOT NULL
        )`);

        // 14. Drive Registrations
        db.run(`CREATE TABLE IF NOT EXISTS drive_registrations (
            student_id TEXT,
            drive_id TEXT,
            registered_at TEXT DEFAULT (datetime('now')),
            PRIMARY KEY(student_id, drive_id),
            FOREIGN KEY(student_id) REFERENCES students(id),
            FOREIGN KEY(drive_id) REFERENCES placement_drives(id)
        )`);

        // Seed Data
        db.get("SELECT COUNT(*) as count FROM admins", (err, row) => {
            if (err) return console.error(err);
            if (row && row.count === 0) {
                console.log('Seeding initial data...');
                
                db.run(`INSERT INTO admins (id, username, password) VALUES ('A001', 'admin', 'admin123')`);

                db.run(`INSERT INTO companies (id, name, industry, website, contact, approved) VALUES 
                    ('C001', 'Tech Giant', 'Software Development', 'techgiant.com', 'hr@techgiant.com', 1),
                    ('C002', 'Innovate AI', 'AI & Machine Learning', 'innovate.ai', 'careers@innovate.ai', 1),
                    ('C003', 'Apex Bio', 'BioTech Solutions', 'apexbio.com', 'jobs@apexbio.com', 1),
                    ('C004', 'CloudNet Systems', 'Cloud Computing', 'cloudnet.io', 'recruit@cloudnet.io', 0),
                    ('C005', 'DataVerse Inc', 'Data Analytics', 'dataverse.com', 'hr@dataverse.com', 1)`);

                db.run(`INSERT INTO jobs (id, company_id, title, description, eligibility, max_arrears, package, deadline, type, required_skills) VALUES 
                    ('J001', 'C001', 'Frontend Software Engineer', 'Build robust visual interfaces with React.', 7.5, 0, '12 LPA', '2027-01-07', 'Full-Time', 'React,JavaScript,UI/UX'),
                    ('J002', 'C002', 'Data Science Intern', 'Work on deep learning models and data pipelines.', 8.5, 0, '18 LPA', '2027-03-25', 'Internship', 'Python,Machine Learning,TensorFlow'),
                    ('J003', 'C003', 'System Administrator', 'Manage networks, servers, and security.', 7.0, 1, '8 LPA', '2027-05-21', 'Full-Time', 'Linux,Networking,AWS'),
                    ('J004', 'C005', 'Business Analyst', 'Analyze data and generate insights.', 7.0, 0, '10 LPA', '2027-04-15', 'Full-Time', 'Excel,SQL,Communication'),
                    ('J005', 'C001', 'Backend Developer', 'Design and build APIs with Node.js.', 8.0, 0, '14 LPA', '2027-02-20', 'Full-Time', 'Node.js,MongoDB,API Design')`);

                db.run(`INSERT INTO training_modules (title, type, link, date) VALUES 
                    ('Quantitative Aptitude Masterclass', 'Aptitude', 'https://example.com/aptitude1', '2026-08-15'),
                    ('Data Structures in Java', 'Coding', 'https://example.com/coding1', '2026-08-20'),
                    ('Mock HR Interview', 'Mock', 'https://example.com/mock1', '2026-09-01')`);

                db.run(`INSERT INTO alumni (name, company, position, email, linkedin) VALUES 
                    ('Alice Johnson', 'Tech Giant', 'Senior Frontend Engineer', 'alice@example.com', 'linkedin.com/in/alicej'),
                    ('Bob Smith', 'Innovate AI', 'Data Scientist', 'bob@example.com', 'linkedin.com/in/bobsmith'),
                    ('Charlie Brown', 'DataVerse Inc', 'Product Manager', 'charlie@example.com', 'linkedin.com/in/charlieb')`);

                db.run(`INSERT INTO placement_drives (id, name, date, eligibility_gpa, status) VALUES 
                    ('D001', 'Mega Tech Drive 2026', '2026-09-10', 7.5, 'Active'),
                    ('D002', 'Core Engineering Placements', '2026-10-05', 7.0, 'Upcoming'),
                    ('D003', 'Super Dream Drive', '2027-01-20', 8.0, 'Upcoming')`);

                db.run(`INSERT INTO notifications (type, title, message, target) VALUES 
                    ('announcement', 'Mega Tech Drive 2026', 'Tech Giant, Innovate AI, and 3 more companies visiting on Sep 10. All eligible students must register.', 'all'),
                    ('alert', 'Resume Submission Deadline', 'All students must upload their updated resume before Jan 1, 2027.', 'all'),
                    ('announcement', 'New Company: DataVerse Inc', 'DataVerse Inc (Data Analytics) has been approved and will be posting jobs soon.', 'all')`);
                
                console.log('Seeding completed.');
            }
        });
    });
}

module.exports = db;
