import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ProgressProvider } from '../state/ProgressContext';
import { Layout } from '../components/layout/Layout';
import { Home } from '../features/home/Home';
import { RealmMap } from '../features/world/RealmMap';
import { RealmPage } from '../features/world/RealmPage';
import { Archive } from '../features/archive/Archive';
import { EntryPage } from '../features/archive/EntryPage';
import { Collection } from '../features/collection/Collection';

// The forge pulls in the share-card renderer, so it loads on demand.
const Forge = lazy(() => import('../features/forge/Forge').then((m) => ({ default: m.Forge })));

function NotFound() {
  return (
    <div className="empty">
      <h1>Lost in the clouds</h1>
      <p>That path leads nowhere in this world.</p>
      <Link to="/" className="linkish">
        Return home
      </Link>
    </div>
  );
}

export function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="realms" element={<RealmMap />} />
            <Route path="realms/:id" element={<RealmPage />} />
            <Route
              path="forge"
              element={
                <Suspense fallback={<p className="loading">Stoking the forge…</p>}>
                  <Forge />
                </Suspense>
              }
            />
            <Route path="archive" element={<Archive />} />
            <Route path="archive/:id" element={<EntryPage />} />
            <Route path="collection" element={<Collection />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  );
}
