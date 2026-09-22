import { NavLink, Outlet } from 'react-router-dom';

const navigation = [
  { label: 'Dashboard', path: '/' },
  { label: 'Students', path: '/students' }
];

function NavigationLinks() {
  return navigation.map(({ label, path }) => (
    <NavLink
      key={path}
      to={path}
      end={path === '/'}
      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
    >
      <span className="nav-mark" aria-hidden="true">{path === '/' ? '▦' : '●'}</span>
      {label}
    </NavLink>
  ));
}

export default function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>StudentMS</span>
        </div>
        <div className="sidebar-section-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          <NavigationLinks />
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" aria-hidden="true" />
          Academic administration
        </div>
      </aside>

      <div className="main-area">
        <header className="mobile-header">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">S</span>
            <span>StudentMS</span>
          </div>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <NavigationLinks />
          </nav>
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
