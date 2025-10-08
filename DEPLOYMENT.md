# Mock-Mate Deployment Guide

This guide covers various deployment options for the Mock-Mate application, from local development to production deployment on cloud platforms.

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker and Docker Compose installed
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd mock-mate
cp env.example .env
# Edit .env with your configuration
```

### 2. Run with Docker Compose
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8080/api
- MySQL: localhost:3306

### 3. Access the Application
- Navigate to http://localhost
- Login with default credentials:
  - Admin: `admin` / `admin123`
  - Mentor: `mentor` / `mentor123`
  - Student: `student1` / `student123`

## 🏗️ Manual Deployment

### Backend Deployment

#### Option 1: Railway/Render
1. **Connect Repository**
   - Push your code to GitHub
   - Connect Railway/Render to your repository

2. **Configure Environment Variables**
   ```
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_jwt_secret
   MAIL_USERNAME=your_email
   MAIL_PASSWORD=your_app_password
   ```

3. **Database Setup**
   - Use Railway/Render's PostgreSQL or external MySQL
   - Update connection string in environment variables

4. **Deploy**
   - Railway: Automatic deployment on push
   - Render: Set build command: `mvn clean package`
   - Set start command: `java -jar target/mock-mate-backend-0.0.1-SNAPSHOT.jar`

#### Option 2: AWS/GCP/Azure
1. **Build Application**
   ```bash
   cd backend
   mvn clean package
   ```

2. **Create Database**
   - Set up RDS (AWS), Cloud SQL (GCP), or Azure Database
   - Configure security groups/firewall rules

3. **Deploy Backend**
   - Use Elastic Beanstalk (AWS), Cloud Run (GCP), or App Service (Azure)
   - Upload JAR file or use container deployment

### Frontend Deployment

#### Option 1: Vercel (Recommended)
1. **Connect Repository**
   - Push code to GitHub
   - Connect Vercel to your repository

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

4. **Deploy**
   - Automatic deployment on push to main branch

#### Option 2: Netlify
1. **Build Settings**
   - Build Command: `npm run build`
   - Publish Directory: `build`

2. **Environment Variables**
   - Add `REACT_APP_API_URL` in site settings

#### Option 3: GitHub Pages
1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/mock-mate",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## 🌐 Production Configuration

### Database Setup
```sql
-- Create production database
CREATE DATABASE mockmate_prod;
CREATE USER 'mockmate_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON mockmate_prod.* TO 'mockmate_user'@'%';
FLUSH PRIVILEGES;
```

### Security Configuration
1. **JWT Secret**
   ```bash
   # Generate strong secret
   openssl rand -base64 32
   ```

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict network access

3. **CORS Configuration**
   ```yaml
   spring:
     cors:
       allowed-origins: https://your-frontend-domain.com
   ```

### Email Configuration
1. **Gmail Setup**
   - Enable 2-factor authentication
   - Generate app password
   - Use app password in environment variables

2. **SMTP Configuration**
   ```yaml
   spring:
     mail:
       host: smtp.gmail.com
       port: 587
       username: your-email@gmail.com
       password: your-app-password
   ```

## 📊 Monitoring and Logging

### Application Monitoring
1. **Health Checks**
   - Endpoint: `/actuator/health`
   - Monitor application status

2. **Metrics**
   - Endpoint: `/actuator/metrics`
   - Track performance metrics

### Logging Configuration
```yaml
logging:
  level:
    com.mockmate: INFO
    org.springframework.security: WARN
  file:
    name: logs/mockmate.log
```

## 🔧 Scaling Considerations

### Database Scaling
1. **Connection Pooling**
   ```yaml
   spring:
     datasource:
       hikari:
         maximum-pool-size: 20
         minimum-idle: 5
   ```

2. **Read Replicas**
   - Configure read-only connections for analytics
   - Use master-slave replication

### Application Scaling
1. **Load Balancing**
   - Use multiple backend instances
   - Configure load balancer (nginx, HAProxy)

2. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Verify network connectivity
   - Ensure database is running

2. **CORS Errors**
   - Update CORS configuration
   - Check frontend URL in backend config

3. **JWT Token Issues**
   - Verify JWT secret configuration
   - Check token expiration settings

4. **Email Not Working**
   - Verify SMTP credentials
   - Check firewall settings
   - Test with different email providers

### Logs and Debugging
```bash
# View application logs
docker-compose logs -f backend

# Check database logs
docker-compose logs -f mysql

# Access database directly
docker-compose exec mysql mysql -u mockmate -p mockmate
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK 17
        uses: actions/setup-java@v2
        with:
          java-version: '17'
      - name: Build with Maven
        run: mvn clean package -DskipTests
      - name: Deploy to Railway
        uses: railway-app/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Performance Optimization

### Frontend Optimization
1. **Code Splitting**
   ```javascript
   const LazyComponent = React.lazy(() => import('./LazyComponent'));
   ```

2. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Compress images

3. **Bundle Analysis**
   ```bash
   npm install --save-dev webpack-bundle-analyzer
   npm run build --analyze
   ```

### Backend Optimization
1. **Database Indexing**
   ```sql
   CREATE INDEX idx_user_email ON users(email);
   CREATE INDEX idx_interview_user ON interview_sessions(user_id);
   ```

2. **Query Optimization**
   - Use pagination for large datasets
   - Implement caching for frequent queries
   - Optimize N+1 queries

## 🔒 Security Checklist

- [ ] Strong JWT secret configured
- [ ] Database credentials secured
- [ ] CORS properly configured
- [ ] HTTPS enabled in production
- [ ] Environment variables secured
- [ ] Regular security updates
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment configuration
3. Test database connectivity
4. Review security settings

For additional help, create an issue in the repository or contact the development team.

---

**Happy Deploying! 🚀**
