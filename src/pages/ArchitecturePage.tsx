import { Link } from '@/components/Link';
import { ArrowRight, Server, Database, Cloud, GitBranch, Box, Layers, Shield, Zap, Container } from 'lucide-react';

export function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Platform Architecture</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            CloudMart is built as a cloud-native marketplace with a React frontend, Spring Boot backend,
            PostgreSQL database, Redis caching, Docker containerization, and AWS deployment readiness.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Architecture diagram */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
          <h2 className="text-xl font-bold text-gray-900">System Overview</h2>
          <div className="mt-6 flex flex-col items-center gap-4 lg:flex-row lg:justify-center">
            <ArchBox icon={Layers} title="React + TypeScript" subtitle="Vite / Tailwind CSS" color="sky" />
            <Arrow label="REST API" />
            <ArchBox icon={Server} title="Spring Boot" subtitle="Spring Security / JPA" color="emerald" />
            <Arrow label="JDBC" />
            <ArchBox icon={Database} title="PostgreSQL" subtitle="Primary datastore" color="blue" />
          </div>
          <div className="mt-4 flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <ArchBox icon={Zap} title="Redis" subtitle="Cache layer (cache-aside)" color="rose" />
              <div className="text-xs text-gray-500">↕ Spring Boot reads/writes cache</div>
            </div>
          </div>
        </div>

        {/* Layers */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <TechCard
            icon={Layers}
            title="Frontend (Working Demo)"
            color="bg-sky-50 text-sky-600"
            items={[
              'React 18 + TypeScript',
              'Vite build tooling',
              'Tailwind CSS for styling',
              'Hash-based routing (no external router dependency)',
              'API service layer with VITE_API_BASE_URL configuration',
              '10 API service modules: auth, users, products, categories, cart, orders, payments, reviews, sellers, admin',
              'JWT token management with automatic refresh',
              'Context-based auth and cart state management',
            ]}
          />
          <TechCard
            icon={Server}
            title="Backend (Spring Boot Source)"
            color="bg-emerald-50 text-emerald-600"
            items={[
              'Java 17 + Spring Boot 3.2',
              'Spring Security with JWT authentication',
              'Spring Data JPA + Hibernate ORM',
              'Role-based access control (CUSTOMER, SELLER, ADMIN)',
              'RESTful API design with OpenAPI/Swagger',
              'Global exception handling with custom error DTOs',
              'Bean Validation for request payloads',
              'MapStruct for entity-DTO mapping',
              'Flyway database migrations',
            ]}
          />
          <TechCard
            icon={Database}
            title="Database (PostgreSQL)"
            color="bg-blue-50 text-blue-600"
            items={[
              '13 entities: User, Role, SellerProfile, Product, Category, ProductImage, Cart, CartItem, Order, OrderItem, Payment, Review, AuditLog',
              'Proper foreign key relationships and constraints',
              'Indexes on frequently queried columns',
              'Timestamps (createdAt, updatedAt) on all entities',
              'Flyway migration scripts for schema versioning',
              'Transactional service layer operations',
            ]}
          />
          <TechCard
            icon={Zap}
            title="Caching (Redis)"
            color="bg-rose-50 text-rose-600"
            items={[
              'Cache-aside pattern for products and categories',
              'Configurable TTL per cache namespace',
              'Automatic cache invalidation on writes',
              'Spring Cache abstraction with Redis backend',
              'Separate cache configurations for different data types',
            ]}
          />
          <TechCard
            icon={Container}
            title="Docker"
            color="bg-purple-50 text-purple-600"
            items={[
              'Multi-stage Dockerfile for backend (Maven build + JRE runtime)',
              'Multi-stage Dockerfile for frontend (npm build + nginx serve)',
              'docker-compose.yml orchestrates frontend, backend, PostgreSQL, Redis',
              'All configuration via environment variables — no hardcoded credentials',
              'Health checks for all services',
            ]}
          />
          <TechCard
            icon={GitBranch}
            title="CI/CD (GitHub Actions)"
            color="bg-amber-50 text-amber-600"
            items={[
              'Backend: compile, test, package JAR',
              'Frontend: install, lint, build',
              'Docker: build and tag images',
              'Deployment-ready pipeline for AWS (ECS/EKS)',
              'Workflow files provided — not yet connected to AWS',
            ]}
          />
        </div>

        {/* Status table */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">Implemented Locally</th>
                <th className="px-4 py-3">Working Demo</th>
                <th className="px-4 py-3">Deployment-Ready</th>
                <th className="px-4 py-3">Actually Deployed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {[
                { c: 'React Frontend', local: true, demo: true, ready: true, deployed: false },
                { c: 'Spring Boot Backend', local: true, demo: false, ready: true, deployed: false },
                { c: 'PostgreSQL Database', local: true, demo: false, ready: true, deployed: false },
                { c: 'Redis Cache', local: true, demo: false, ready: true, deployed: false },
                { c: 'Docker Containers', local: true, demo: false, ready: true, deployed: false },
                { c: 'CI/CD Pipeline', local: true, demo: false, ready: true, deployed: false },
                { c: 'AWS Infrastructure', local: false, demo: false, ready: true, deployed: false },
              ].map((r) => (
                <tr key={r.c}>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.c}</td>
                  <td className="px-4 py-3"><StatusBadge on={r.local} /></td>
                  <td className="px-4 py-3"><StatusBadge on={r.demo} /></td>
                  <td className="px-4 py-3"><StatusBadge on={r.ready} /></td>
                  <td className="px-4 py-3"><StatusBadge on={r.deployed} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 p-8 text-center">
          <Shield size={32} className="mx-auto text-white" />
          <h2 className="mt-4 text-2xl font-bold text-white">Production-Ready Architecture</h2>
          <p className="mx-auto mt-2 max-w-xl text-sky-50">
            The frontend demo runs in-browser with mock data. The Spring Boot backend source
            is complete and can be compiled and run with Docker Compose.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-sky-600 hover:bg-sky-50"
          >
            Explore the Marketplace
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ArchBox({ icon: Icon, title, subtitle, color }: { icon: typeof Server; title: string; subtitle: string; color: string }) {
  const colorMap: Record<string, string> = {
    sky: 'border-sky-300 bg-sky-50 text-sky-700',
    emerald: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    blue: 'border-blue-300 bg-blue-50 text-blue-700',
    rose: 'border-rose-300 bg-rose-50 text-rose-700',
  };
  return (
    <div className={`flex flex-col items-center rounded-2xl border-2 px-6 py-5 text-center ${colorMap[color]}`}>
      <Icon size={28} />
      <div className="mt-2 font-bold">{title}</div>
      <div className="text-xs opacity-70">{subtitle}</div>
    </div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-400">{label}</span>
      <ArrowRight size={24} className="text-gray-300" />
    </div>
  );
}

function TechCard({ icon: Icon, title, color, items }: { icon: typeof Server; title: string; color: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
          <Icon size={22} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <ul className="mt-4 space-y-1.5 text-sm text-gray-600">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusBadge({ on }: { on: boolean }) {
  return on ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Yes</span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">No</span>
  );
}
