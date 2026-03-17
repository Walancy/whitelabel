import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './pages/AuthPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider>
      {!isLoggedIn ? (
        <AuthPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <Layout>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
              <p className="text-muted-foreground mt-1">Welcome back, Young Alaska.</p>
            </div>

            {/* Example Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 border rounded-xl bg-card hover:border-foreground/20 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <div className="w-5 h-5 bg-foreground/20 rounded-sm"></div>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">+12.5%</span>
                  </div>
                  <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Metric {i}</h3>
                  <p className="text-2xl font-bold mt-1">$45,231.89</p>
                </div>
              ))}
            </div>

            {/* Example Content Area */}
            <div className="border rounded-xl aspect-[16/9] flex items-center justify-center bg-accent/20 border-dashed">
               <button 
                 onClick={() => setIsLoggedIn(false)}
                 className="text-muted-foreground font-medium hover:text-foreground transition-all underline decoration-dashed underline-offset-4"
               >
                 Sign out to Test Login Screens
               </button>
            </div>
          </div>
        </Layout>
      )}
    </ThemeProvider>
  );
}

export default App;
