# Smart Attendance & Scheduling System

A web-based application that enables students to mark attendance within a 10-minute window after class commencement. Built with Laravel (PHP) for the backend and React for the frontend, it ensures real-time updates and efficient attendance tracking.

## Features

- Secure admin, instructor, student login and authentication
- Real-time class schedule display
- Attendance marking within a 10-minute window after class start
- Automatic attendance status: "present", "late", "absent"
- Responsive UI with a countdown timer for the attendance window
- Student can view upcoming classes and mark attendance
- Instructor dashboard for viewing attendance statistics
- Instructor can create schedules
- Admin dashboard for managing classes and viewing overall metrics

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Laravel (PHP), MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Date/Time Handling:** Carbon (PHP) & JavaScript Date API

## Screenshots

*Include relevant screenshots here*

## Getting Started

### Prerequisites

- PHP >=8.2
- Composer
- Node.js & npm
- MySQL

### Backend Setup

1. **Clone the repository:**
   ```bash
    git clone git clone https://github.com/junaid50905/smart_attendance_and_scheduling_system.git
   ```
   ```

2. **Install dependencies:**
   ```bash
    cd smart_attendance_and_scheduling_system
   ```   ```


3. **Install dependencies:**
   ```bash
    composer install
   ```
    composer install
   ```

4. Copy ```.env.example``` to ```.env``` and configure your database settings.


5. **Install dependencies:**
   ```bash
    php artisan key:generate
   ```
   ```

6. **Install dependencies:**
   ```bash
    php artisan migrate
   ```
      ```
   

7. **Run seeder:**
   ```bash
    php artisan migrate:fresh --seed
   ```
   ```


8. **Start the development server:**
   ```bash
    php artisan serve
   ```


### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
    \smart_attendance_and_scheduling_system>cd frontend
   ```

2. **Install dependencies:**
   ```bash
    npm install
   ```
   
3. **Start the development server:**
    ```bash
    npm run dev
    ```

Everything is Done. Now you are ready to use the application.

### Login Credentials
For all users (admin, instructor, student) password is the same

```
email: see your database admins, instructors, and students table
password: password
```

### Here are some users' credentials examples have been given below, and these credentials don't match with your database

#### Instructor
```
email: nbotsford@example.org
password: password
```

#### Student
```
email: nankunding@example.net
password: password
```






