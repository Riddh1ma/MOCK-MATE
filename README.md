# Mock-Mate: JAVA Based Mock Interview Platform

Mock-Mate is a comprehensive web-based platform that simulates technical and behavioral mock interviews for students preparing for campus placements. It provides coding tests, HR interview practice, automatic feedback, analytics, and peer-to-peer sessions.

## 🎯 Features

### Core Features
- **User Management**: Registration, login, profile management with role-based access (Students, Mentors, Admins)
- **Interview Management**: Create, schedule, and join mock interviews (technical & behavioral)
- **Question Bank**: Store technical MCQs, coding problems, and HR questions with adaptive difficulty
- **Coding Evaluation**: Auto-evaluate code submissions (Java, Python, C++, JavaScript) with test cases
- **Behavioral Analysis**: AI-powered analysis of interview responses with sentiment analysis
- **Performance Tracking**: Comprehensive analytics dashboard with progress tracking
- **Peer-to-Peer Sessions**: Practice with other students in real-time
- **Notification System**: Email and in-app notifications for interviews and feedback

### Technical Features
- **Responsive Design**: Modern UI with light/dark mode support
- **Real-time Updates**: Live coding evaluation and feedback
- **Adaptive Learning**: Difficulty adjustment based on performance
- **Multi-language Support**: Code execution in multiple programming languages
- **Secure Authentication**: JWT-based authentication with role-based access control

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.0 with Java 17
- **Database**: MySQL with JPA/Hibernate
- **Security**: Spring Security with JWT
- **APIs**: RESTful APIs with comprehensive error handling
- **Code Execution**: Multi-language code execution engine

### Frontend (React)
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query for server state
- **Routing**: React Router v6
- **UI Components**: Custom components with Framer Motion animations

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mock-mate/backend
   ```

2. **Configure Database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE mockmate;
   ```

3. **Configure Application**
   ```bash
   # Update application.yml with your database credentials
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/mockmate
       username: your_username
       password: your_password
   ```

4. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```

   The backend will be available at `http://localhost:8080/api`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:8080/api" > .env
   ```

4. **Start Development Server**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 🔑 Default Credentials

The application comes with pre-configured users:

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: ADMIN

### Mentor User
- **Username**: `mentor`
- **Password**: `mentor123`
- **Role**: MENTOR

### Student Users
- **Username**: `student1` to `student5`
- **Password**: `student123`
- **Role**: STUDENT

## 📁 Project Structure

```
mock-mate/
├── backend/
│   ├── src/main/java/com/mockmate/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── security/       # Security configuration
│   │   └── service/        # Business logic
│   └── src/main/resources/
│       └── application.yml # Application configuration
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   └── package.json
└── README.md
```

## 🛠️ API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/leaderboard` - Get leaderboard

### Interview Management
- `POST /api/interviews` - Create interview
- `GET /api/interviews` - Get user interviews
- `PUT /api/interviews/{id}/start` - Start interview
- `PUT /api/interviews/{id}/complete` - Complete interview

### Question Bank
- `GET /api/questions` - Get questions with filters
- `GET /api/questions/{id}` - Get specific question
- `GET /api/questions/random` - Get random questions

### Coding Evaluation
- `POST /api/coding/submit` - Submit code solution
- `GET /api/coding/submissions` - Get user submissions
- `POST /api/coding/test` - Test code execution

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Components**: Real-time code editor with syntax highlighting
- **Progress Tracking**: Visual progress indicators and performance charts
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🔧 Configuration

### Environment Variables

#### Backend
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing secret
- `MAIL_USERNAME` - Email username for notifications
- `MAIL_PASSWORD` - Email password for notifications

#### Frontend
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_WS_URL` - WebSocket URL for real-time features

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with Maven build command: `mvn clean package`

### Frontend Deployment (Vercel)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@mockmate.com or join our Discord community.

## 🎯 Future Enhancements

- [ ] Video interview recording and analysis
- [ ] Advanced AI feedback with GPT integration
- [ ] Mobile app development
- [ ] Integration with popular job boards
- [ ] Company-specific interview preparation
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Collaborative coding sessions

---

**Mock-Mate** - Master your technical interviews with AI-powered practice sessions! 🚀

