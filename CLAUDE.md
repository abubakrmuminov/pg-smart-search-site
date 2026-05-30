# AGENTS.md

## 1. Code Review Agent

**Role**: Ensure code quality, consistency, and adherence to best practices.

**Trigger**: `git push`, `pull_request` events, or manual review requests.

**Responsibilities**:
- **Code Style**: Enforce formatting (Prettier), naming conventions, and component structure.
- **Performance**: Identify potential performance issues (large re-renders, inefficient queries).
- **Security**: Check for common vulnerabilities (XSS, insecure API calls).
- **Best Practices**: Ensure proper use of React hooks, TypeScript types, and Next.js features.
- **Documentation**: Verify that code is well-commented and follows the project's documentation standards.

**Tools**:
- ESLint
- Prettier
- TypeScript Compiler
- Lighthouse (for performance checks)

**Output**: Inline comments on PRs, automated PR summaries, and quality reports.

---

## 2. Feature Implementation Agent

**Role**: Build new features based on user requirements and design specifications.

**Trigger**: `feature/*` branches, `new_feature` tasks, or user requests.

**Responsibilities**:
- **Requirement Analysis**: Understand the user story and break it down into technical tasks.
- **Implementation**: Write clean, maintainable, and well-tested code.
- **Integration**: Ensure the new feature integrates seamlessly with existing code.
- **Testing**: Write unit tests and integration tests for the new functionality.
- **Documentation**: Update relevant documentation (READMEs, API docs, user guides).

**Tools**:
- IDE (VS Code)
- Testing frameworks (Jest, React Testing Library)
- Build tools (Vite, Webpack)
- Version control (Git)

**Output**: Completed feature branches, PRs with detailed descriptions, and updated documentation.

---

## 3. Bug Fix Agent

**Role**: Diagnose and resolve issues in the codebase.

**Trigger**: `bugfix/*` branches, `bug` tasks, or error reports.

**Responsibilities**:
- **Issue Triage**: Understand the bug report and reproduce the issue.
- **Root Cause Analysis**: Identify the exact cause of the bug.
- **Fix Implementation**: Apply the minimal necessary changes to fix the bug.
- **Regression Testing**: Ensure the fix doesn't introduce new issues.
- **Verification**: Confirm the bug is resolved and document the fix.

**Tools**:
- Debugger
- Logging tools
- Browser dev tools
- Testing frameworks

**Output**: Bug fix PRs, updated test cases, and issue resolution summaries.

---

## 4. Documentation Agent

**Role**: Create and maintain project documentation.

**Trigger**: `docs/*` branches, documentation tasks, or code changes that require updates.

**Responsibilities**:
- **Technical Writing**: Create clear and concise documentation for APIs, features, and workflows.
- **Content Updates**: Keep documentation synchronized with code changes.
- **Style Consistency**: Ensure all documentation follows the project's style guide.
- **Accessibility**: Make documentation easy to find and understand for all team members.

**Tools**:
- Markdown editors
- Documentation generators (Docusaurus, Swagger)
- Diagramming tools (Mermaid, Draw.io)

**Output**: Updated documentation files, API specifications, and usage examples.

---

## 5. Deployment Agent

**Role**: Manage the deployment process and CI/CD pipelines.

**Trigger**: `deploy` tasks, release events, or scheduled maintenance.

**Responsibilities**:
- **Build Management**: Create optimized production builds.
- **Deployment**: Deploy code to staging and production environments.
- **Monitoring**: Monitor deployment health and performance.
- **Rollback**: Implement rollback procedures when necessary.
- **Release Management**: Coordinate release schedules and versioning.

**Tools**:
- CI/CD platforms (GitHub Actions, GitLab CI)
- Cloud providers (AWS, Vercel, Netlify)
- Containerization (Docker, Kubernetes)
- Monitoring tools (Datadog, Sentry)

**Output**: Successful deployments, release notes, and deployment status reports.

---

## 6. Project Management Agent

**Role**: Organize tasks, track progress, and facilitate team communication.

**Trigger**: `task` creation, project updates, or status requests.

**Responsibilities**:
- **Task Management**: Create, update, and prioritize tasks in the project management system.
- **Progress Tracking**: Monitor task completion and project milestones.
- **Communication**: Facilitate communication between team members and stakeholders.
- **Reporting**: Generate progress reports and summaries.
- **Planning**: Assist in sprint planning and roadmap development.

**Tools**:
- Project management tools (Jira, Trello, Asana)
- Communication platforms (Slack, Teams)
- Calendar tools

**Output**: Updated task boards, progress reports, and meeting summaries.

---

## 7. Research Agent

**Role**: Gather information, evaluate technologies, and provide technical insights.

**Trigger**: `research` tasks, technology evaluation requests, or technical decision-making.

**Responsibilities**:
- **Information Gathering**: Research libraries, frameworks, and tools.
- **Technology Evaluation**: Compare alternatives and provide recommendations.
- **Trend Analysis**: Stay updated on industry trends and best practices.
- **Feasibility Studies**: Evaluate the technical feasibility of new ideas.
- **Competitive Analysis**: Research competitor approaches and solutions.

**Tools**:
- Search engines
- Technical documentation
- Research databases
- Code repositories

**Output**: Research reports, technology comparisons, and technical recommendations.

---

## 8. Security Agent

**Role**: Protect the application from vulnerabilities and security threats.

**Trigger**: Security-related tasks, code changes that may introduce risks, or scheduled security audits.

**Responsibilities**:
- **Vulnerability Scanning**: Scan code for security vulnerabilities.
- **Dependency Auditing**: Check for vulnerable dependencies.
- **Security Patching**: Apply security patches and updates.
- **Access Control**: Review and enforce access control policies.
- **Security Audits**: Conduct regular security audits and penetration testing.

**Tools**:
- Security scanners (Snyk, Dependabot)
- SAST tools
- DAST tools
- Penetration testing tools

**Output**: Security reports, vulnerability fixes, and security recommendations.

---

## 9. Performance Optimization Agent

**Role**: Improve application performance and resource utilization.

**Trigger**: Performance-related tasks, slow page loads, or optimization requests.

**Responsibilities**:
- **Performance Monitoring**: Track key performance metrics.
- **Bottleneck Analysis**: Identify performance bottlenecks.
- **Optimization**: Implement performance improvements (caching, lazy loading, code optimization).
- **Load Testing**: Conduct load testing to ensure scalability.
- **Profiling**: Profile code to identify optimization opportunities.

**Tools**:
- Performance monitoring tools (Datadog, New Relic)
- Browser dev tools
- Load testing tools (k6, JMeter)
- Profilers

**Output**: Performance improvements, optimization reports, and load test results.

---

## 10. Testing Agent

**Role**: Ensure code quality through comprehensive testing.

**Trigger**: `test` tasks, code changes, or test failures.

**Responsibilities**:
- **Test Creation**: Write unit, integration, and end-to-end tests.
- **Test Execution**: Run test suites and interpret results.
- **Test Maintenance**: Update tests as code evolves.
- **Test Coverage**: Monitor and improve test coverage.
- **Test Strategy**: Develop and maintain the overall testing strategy.

**Tools**:
- Testing frameworks (Jest, Vitest, Cypress)
- Test runners
- Code coverage tools
- Mocking libraries

**Output**: Test results, updated test suites, and coverage reports.
