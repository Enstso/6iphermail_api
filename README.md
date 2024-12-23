# 6iphermai Api

A powerful API built with Adonis that centralizes email security features. This API handles authentication, threat detection, and integrates with various services to ensure email safety. It provides functionalities such as email verification, phishing detection, and more, acting as the core backend service for email protection systems.

## Features

- **Authentication**: Handles user authentication via OAuth2.0.
- **Caching**: Efficient caching to improve performance and reduce redundant checks, with Redis.
- **Secure Data Handling**: Ensures secure storage of critical data.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Adonis Framework installed
- Database (e.g., MariaDb)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Enstso/6iphermail_api.git
    ```

2. Install dependencies:

Set up environment variables:

Copy .env.example to .env:

```bash
cp .env.example .env
```

Update the .env file with your database credentials and other configurations.

Run database migrations:

```bash
adonis migration:run
```

### API Endpoints
#### Authentication Routes (/api/auth)

POST /api/auth/register: Registers a new user.

POST /api/auth/login: Logs in an existing user.

GET /api/auth/discord: Redirect to Discord OAuth2.

GET /api/auth/discord/callback: Callback from Discord OAuth2.

GET /api/auth/github: Redirect to GitHub OAuth2.

GET /api/auth/github/callback: Callback from GitHub OAuth2.

GET /api/auth/google: Redirect to Google OAuth2.

GET /api/auth/google/callback: Callback from Google OAuth2.

GET /api/auth/logout: Logs out the current user.

#### Gmail Routes (/api/gmail/6iphermail)

GET /api/gmail/6iphermail/mails: Fetches Gmail messages.

GET /api/gmail/6iphermail/app-mails: Fetches Gmail messages (v2).

POST /api/gmail/6iphermail/mail/identifier: Identifies the Gmail email.

GET /api/gmail/6iphermail/whois: Get Gmail account information.

GET /api/gmail/6iphermail/threads: Get Gmail email threads.

Note: All routes under /api/gmail/6iphermail require authentication.

#### General Routes (/api/6iphermail)

GET /api/6iphermail/generateAuthCode: Generates an authentication code.

POST /api/6iphermail/contacts: Sends an email to support.

GET /api/6iphermail/me: Retrieves user profile information.

POST /api/6iphermail/updateAccount: Updates the user account information.

Other Routes

POST /api/verifyAuthCode: Verifies the authentication code.


## Configuration

This API uses OAuth2.0 for authentication and is fully configurable through the .env file. You can set up the following configurations:

- Database: Configure your database settings in .env (e.g., DB_HOST, DB_USER, DB_PASSWORD).
- OAuth2.0: Set OAuth credentials for external services (e.g., Google, Discord).
- Caching: Set cache expiration times and caching methods (e.g., Redis).
