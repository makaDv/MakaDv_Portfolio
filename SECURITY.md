# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** create public issues or pull requests
2. Email security concerns to: dvdavide07@gmail.com
3. Include detailed information about the vulnerability
4. Allow reasonable time for response and fixes

## Security Measures

This project implements several security measures:

### Client-Side Security
- Content Security Policy (CSP) headers
- HTTPS enforcement (HSTS)
- XSS protection headers
- Clickjacking prevention (X-Frame-Options)
- Input sanitization and validation
- Honeypot spam protection

### Data Protection
- No sensitive data stored in client-side code
- Environment variables for configuration
- Proper .gitignore configuration
- No hardcoded secrets

### Dependencies
- Regular dependency updates via Dependabot
- Security scanning of dependencies
- Minimal attack surface

## Best Practices

- Always use HTTPS in production
- Keep dependencies updated
- Use environment variables for configuration
- Validate all user inputs
- Implement proper error handling
- Avoid exposing sensitive information in logs

## Contact

For security-related questions: dvdavide07@gmail.com
