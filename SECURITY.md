# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

The LeakJar team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@leakjar.com**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include in Your Report

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

### Preferred Languages

We prefer all communications to be in English.

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported releases
4. Release patches as soon as possible

### Public Disclosure Timing

We ask that you:

- Allow us a reasonable amount of time to address the issue before public disclosure
- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our service
- Not exploit the vulnerability beyond what is necessary to demonstrate the issue

We aim to address critical security issues within 7 days of disclosure.

## Security Update Process

1. Security patch is prepared privately
2. New release is published with security fix
3. Security advisory is published on GitHub
4. Users are notified via email (if they've opted in)
5. Changelog is updated

## Security Best Practices for Users

### For Administrators

1. **Keep LeakJar Updated**: Always use the latest version
2. **Secure Environment Variables**: Never commit `.env.local` to version control
3. **Use Strong Passwords**: Enforce strong password policies
4. **Enable MFA**: Use multi-factor authentication when available
5. **Regular Audits**: Review user access and API keys regularly
6. **Monitor Logs**: Keep track of suspicious activities
7. **Restrict Admin Access**: Limit admin privileges to trusted users only

### For Developers

1. **Code Review**: All code changes should be reviewed
2. **Dependency Updates**: Keep dependencies up to date
3. **Security Scanning**: Run security scans before deploying
4. **Input Validation**: Always validate and sanitize user input
5. **Secure APIs**: Use authentication and rate limiting
6. **HTTPS Only**: Always use HTTPS in production
7. **Secrets Management**: Use environment variables for sensitive data

### For End Users

1. **Strong Passwords**: Use unique, strong passwords
2. **Enable 2FA**: Enable two-factor authentication
3. **Secure Sessions**: Log out when finished
4. **Report Issues**: Report suspicious activities immediately
5. **API Key Security**: Keep API keys confidential
6. **Regular Password Changes**: Update passwords periodically

## Known Security Considerations

### Authentication

- Supabase handles authentication and session management
- Sessions expire after inactivity
- Password hashing uses bcryptjs with salt rounds
- JWT tokens are used for API authentication

### Authorization

- Role-based access control (RBAC) implemented
- Admin routes are protected with middleware
- API endpoints validate user permissions
- Database queries are scoped to user access

### Data Protection

- All passwords are hashed before storage
- Sensitive data is encrypted in transit (HTTPS)
- API keys are hashed before storage
- Database connections use secure protocols

### Common Attack Vectors

We protect against:

- **SQL Injection**: Using parameterized queries
- **XSS (Cross-Site Scripting)**: Input sanitization and React's built-in protection
- **CSRF (Cross-Site Request Forgery)**: Token-based protection
- **Clickjacking**: X-Frame-Options headers
- **Rate Limiting**: API rate limiting implemented
- **Session Hijacking**: Secure session management

## Vulnerability Bounty Program

We currently do not have a formal bug bounty program, but we deeply appreciate security researchers who responsibly disclose vulnerabilities to us.

### Acknowledgments

We would like to thank the following security researchers:

- *No reports yet*

## Security Contacts

- **Security Team Email**: security@leakjar.com
- **General Support**: support@leakjar.com

## Security Tools We Use

- **Snyk**: Dependency scanning and vulnerability detection
- **ESLint**: Code quality and security linting
- **TypeScript**: Type safety
- **Supabase**: Secure authentication infrastructure
- **Vercel**: Secure hosting platform

## Compliance

LeakJar is designed with security and privacy in mind:

- Data encryption in transit and at rest
- Regular security audits
- Secure development practices
- Privacy-focused data handling

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)

---

**Last Updated**: January 2024

For any security concerns, please contact: security@leakjar.com

