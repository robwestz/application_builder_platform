# Foundation: Auth/SSO - Keycloak

**Decision:** Keycloak (v26.0.7+)
**Score:** 0.85 / 1.0
**Category:** Authentication & Authorization
**Status:** Active

## Overview

Keycloak is our chosen identity and access management solution for the Appkod platform. It provides enterprise-grade authentication, SSO, and user federation capabilities.

## Why Keycloak?

- **Industry Standard:** Used by Red Hat, NASA, Bosch, and thousands of enterprises
- **Multi-tenant Ready:** Native support for realms (perfect for our multi-tenant platform)
- **OIDC/OAuth2 Compliant:** Full compliance with modern auth standards
- **User Federation:** LDAP, Active Directory, social providers, BankID integration
- **Admin UI:** Comprehensive management interface out-of-the-box
- **EU-Ready:** Can be hosted in EU regions for GDPR compliance
- **Open Source:** Apache 2.0 license

## Scorecard

See [SCORECARD.md](./SCORECARD.md) for detailed evaluation.

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Security | 0.90 | 30% | 0.27 |
| Stability | 0.85 | 25% | 0.21 |
| Performance | 0.80 | 15% | 0.12 |
| Integration Fit | 0.90 | 15% | 0.14 |
| License | 1.00 | 10% | 0.10 |
| Community | 0.85 | 5% | 0.04 |
| **TOTAL** | **0.85** | 100% | **0.88** |

## Alternatives Considered

- **Zitadel:** Faster (Go-based), better UX, but less mature ecosystem
- **Ory/Kratos:** Modern, cloud-native, but missing admin UI
- **Auth0:** Great DX but proprietary/expensive for multi-tenant

See [ALTERNATIVES.md](./ALTERNATIVES.md) for full comparison.

## Integration Strategy

### Next.js (Web)
```typescript
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  realm: 'appkod',
  clientId: 'appkod-web',
});

await keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false,
});
```

### FastAPI (Backend)
```python
from fastapi import Depends, HTTPException
from keycloak import KeycloakOpenID

keycloak_openid = KeycloakOpenID(
    server_url=settings.KEYCLOAK_URL,
    client_id=settings.KEYCLOAK_CLIENT_ID,
    realm_name=settings.KEYCLOAK_REALM,
)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        user_info = keycloak_openid.userinfo(token)
        return user_info
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
```

## Configuration

### Development
- URL: http://localhost:8080
- Admin: admin / admin_dev_password
- Realm: appkod-dev
- Clients: appkod-web, appkod-api

### Production
- URL: https://auth.appkod.se (or tenant subdomain)
- HTTPS required
- PostgreSQL backend (not H2)
- Per-tenant realms for isolation

## Security Considerations

### CVE Status
- **CVE-2024-3656:** Fixed in v25.0.1 (Session fixation)
- **CVE-2024-8698:** Fixed in v26.0.0 (Authorization bypass)
- **Recommendation:** Use v26.0.7+ (latest stable)

### Hardening
1. **Disable default realm** (`master` realm only for super-admin)
2. **Enable MFA** for admin accounts
3. **Use HTTPS** everywhere (no HTTP)
4. **Rotate secrets** regularly (client secrets, admin passwords)
5. **Audit logs** enabled and monitored
6. **Rate limiting** on login endpoints

## Multi-tenant Setup

```yaml
# Per-tenant realm structure
realms:
  - name: tenant-acme
    enabled: true
    users:
      - username: user@acme.com
        roles: [owner]
    clients:
      - clientId: acme-app
        redirectUris: ["https://acme.appkod.se/*"]
```

## Performance

- **Login latency:** ~200-400ms (P95)
- **Token validation:** ~10-20ms (cached)
- **Concurrent users:** 10,000+ per instance
- **Scaling:** Horizontal (multiple instances + shared DB)

## Monitoring

```yaml
# Prometheus metrics
keycloak_logins_total
keycloak_login_errors_total
keycloak_token_issued_total
keycloak_sessions_active
```

## Resources

- **Documentation:** https://www.keycloak.org/documentation
- **GitHub:** https://github.com/keycloak/keycloak
- **Admin Guide:** https://www.keycloak.org/docs/latest/server_admin/
- **BankID Integration:** https://github.com/inventage/keycloak-bankid

## Next Steps

1. Deploy Keycloak in docker-compose (done)
2. Create appkod realm with client configs
3. Integrate with Next.js (session management)
4. Integrate with FastAPI (token validation)
5. Setup BankID provider for Swedish auth
6. Configure multi-tenant realm templates
7. Setup backup/restore procedures
