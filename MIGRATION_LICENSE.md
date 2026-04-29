# Migration System License

## MIT License

Copyright (c) 2026 SprintFund

Permission is hereby granted, free of charge, to any person obtaining a copy
of this migration system documentation and associated software files (the "Software"),
to deal in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Included Components

This license applies to:

### Documentation
- CONTRACT_MIGRATION_GUIDE.md
- USER_MIGRATION_GUIDE.md
- MIGRATION_STATE_RISKS.md
- OPERATOR_MIGRATION_RUNBOOK.md
- MIGRATION_FAQ.md
- MIGRATION_TIMELINE_TEMPLATE.md
- MIGRATION_ANNOUNCEMENT_TEMPLATE.md
- MIGRATION_METRICS.md
- MIGRATION_CHECKLIST.md
- MIGRATION_README.md
- MIGRATION_SUMMARY.md
- MIGRATION_QUICKSTART.md
- MIGRATION_INDEX.md
- MIGRATION_GLOSSARY.md

### Scripts
- scripts/check-legacy-balance.js
- scripts/migrate-stake.js
- scripts/migration-report.js

### Frontend Components
- frontend/src/hooks/useLegacyBalance.ts
- frontend/src/components/MigrationBanner.tsx
- frontend/src/components/MigrationModal.tsx
- frontend/src/components/MigrationStatus.tsx
- frontend/src/components/VersionMismatchWarning.tsx

### Tests
- frontend/src/hooks/useLegacyBalance.test.ts

## Attribution

If you use this migration system in your project, attribution is appreciated but not required.

Suggested attribution:
```
Migration system based on SprintFund's contract migration framework
https://github.com/Mosas2000/SprintFund
```

## Disclaimer

This migration system is provided as-is for use in blockchain projects. Users are responsible for:

- Testing thoroughly on testnets before mainnet deployment
- Conducting security audits appropriate for their use case
- Ensuring compliance with applicable laws and regulations
- Providing adequate support to their users during migration
- Backing up all critical data before migration

The authors and contributors are not liable for:

- Loss of funds due to migration errors
- User experience issues during migration
- Downtime or service interruptions
- Data loss or corruption
- Any other damages arising from use of this system

## Security

While this migration system has been designed with security in mind, it has not been formally audited. Users should:

- Conduct their own security review
- Test extensively on testnets
- Consider professional security audits for high-value deployments
- Monitor migrations closely
- Have rollback plans ready

## Contributions

Contributions to improve this migration system are welcome under the same MIT license.

By contributing, you agree that your contributions will be licensed under the MIT License.

## Third-Party Dependencies

This migration system uses the following third-party libraries:

- @stacks/transactions - MIT License
- @stacks/network - MIT License
- @micro-stacks/react - MIT License
- React - MIT License
- Next.js - MIT License

See individual package licenses for details.

## Support

This migration system is provided without warranty or guaranteed support.

For issues or questions:
- Open a GitHub issue
- Check the documentation
- Review the FAQ

## Updates

This license may be updated from time to time. The latest version will always be available in this repository.

---

**License Version**: 1.0  
**Last Updated**: 2026-04-29  
**Effective Date**: 2026-04-29
