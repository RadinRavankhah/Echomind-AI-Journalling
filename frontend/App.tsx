import React, { useState, useEffect } from 'react';
import { AppScreen, JournalEntry, AnalyticsOverview } from './types';
import { QUESTIONS } from './constants';
import { Button } from './components/Button';
import { TextInput, TextArea } from './components/Input';
import { EchoCircle } from './components/EchoCircle';
import { Modal } from './components/Modal';
import { Accordion } from './components/Accordion';
import { api } from './services/api';
import { 
  ArrowLeft, Settings, History, LogOut, ChevronRight, X, 
  Trash2, Check, Sparkles, BarChart2, Pin, PinOff 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(api.isAuthenticated() ? AppScreen.HOME : AppScreen.AUTH_GATE);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Data State
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Reflection Flow State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    if (api.isAuthenticated()) {
      loadInitialData();
    }
  }, []);

  const loadInitialData = async () => {
    try {
      const [entriesData, analyticsData] = await Promise.all([
        api.getEntries(),
        api.getAnalytics()
      ]);
      setEntries(entriesData);
      setAnalytics(analyticsData);
    } catch (e) {
      console.error('Error loading data', e);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await api.login(userEmail, password);
      setScreen(AppScreen.HOME);
      loadInitialData();
    } catch (e: any) {
      setErrorMsg(e.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setScreen(AppScreen.AUTH_GATE);
    setUserEmail('');
    setPassword('');
  };

  const handleCreateEntry = async () => {
    setIsLoading(true);
    try {
      const payload: any = {
        title: String(responses['emotion'] || 'New Reflection').slice(0, 50),
      };

      QUESTIONS.forEach(q => {
        payload[q.key] = responses[q.key] ?? '';
      });

      payload.intensity =
        typeof payload.intensity === 'number'
          ? payload.intensity
          : 5;

      const entry = await api.createEntry(payload);
      setEntries([entry, ...entries]);
      setSelectedEntry(entry);
      setScreen(AppScreen.ENTRY_DETAIL);
    } catch {
      setErrorMsg('Failed to save reflection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReflect = async (id: string) => {
    setIsLoading(true);
    try {
      const { entry } = await api.reflect(id);
      setSelectedEntry(entry);
      setEntries(prev => prev.map(e => e.id === id ? entry : e));
    } catch (e) {
      setErrorMsg('Reflection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setEntries(prev => prev.filter(e => e.id !== id));
      setScreen(AppScreen.LIBRARY);
      setSelectedEntry(null);
      await api.deleteEntry(id);
    } catch (e) {
      setErrorMsg('Failed to delete');
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      await api.togglePin(id);
      setEntries(prev => prev.map(e => e.id === id ? { ...e, pinned: !e.pinned } : e));
      if (selectedEntry?.id === id) {
        setSelectedEntry(prev => prev ? { ...prev, pinned: !prev.pinned } : null);
      }
    } catch (e) {
      setErrorMsg('Failed to toggle pin');
    }
  };

  // --- RENDERERS ---

  const renderAuthGate = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <EchoCircle />
      <h1 className="text-3xl font-serif text-[#F5F5F2] mt-8 mb-4">EchoMind</h1>
      <p className="text-gray-400 mb-12 max-w-xs font-light font-sans">
        Listen to the silence of your mind.
      </p>
      <div className="flex flex-col w-full max-w-xs gap-4">
        <Button onClick={() => setScreen(AppScreen.LOGIN)} fullWidth>Get Started</Button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="flex flex-col h-full px-6 pt-12">
      <button onClick={() => setScreen(AppScreen.AUTH_GATE)} className="mb-8 text-gray-500 hover:text-white transition-colors">
        <ArrowLeft size={24} />
      </button>
      <h2 className="text-2xl font-serif mb-8 text-[#F5F5F2]">Identify yourself.</h2>
      <div className="flex flex-col gap-6">
        <TextInput label="Username / Email" value={userEmail} onChange={e => setUserEmail(e.target.value)} />
        <TextInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
      </div>
      <div className="mt-auto mb-12">
        <Button onClick={handleLogin} fullWidth disabled={isLoading || !userEmail || !password}>
          {isLoading ? 'Processing...' : 'Enter'}
        </Button>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-6">
        <button onClick={() => setScreen(AppScreen.LIBRARY)} className="text-gray-500 hover:text-[#F5F5F2]"><History size={24} /></button>
        <button onClick={() => setScreen(AppScreen.ANALYTICS)} className="text-gray-500 hover:text-[#F5F5F2]"><BarChart2 size={24} /></button>
        <button onClick={() => setScreen(AppScreen.SETTINGS)} className="text-gray-500 hover:text-[#F5F5F2]"><Settings size={24} /></button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <EchoCircle />
        <h2 className="text-2xl font-serif text-center mt-8 px-8 leading-relaxed">
          The space is ready.
        </h2>
        {analytics && (
          <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest">
            Current streak: {analytics.streak} days
          </p>
        )}
      </div>

      <div className="p-6 flex flex-col gap-4 mb-8">
        <Button onClick={() => { setResponses({}); setCurrentIndex(0); setScreen(AppScreen.REFLECTION_FLOW); }} fullWidth>New Reflection</Button>
      </div>
    </div>
  );

  const renderReflectionFlow = () => {
    const q = QUESTIONS[currentIndex];
    const val =
      responses[q.key] !== undefined
        ? responses[q.key]
        : q.type === 'slider'
        ? 5
        : '';
    
    return (
      <div className="flex flex-col h-full p-6">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => currentIndex === 0 ? setShowExitModal(true) : setCurrentIndex(prev => prev - 1)} className="text-gray-500">
            {currentIndex === 0 ? <X size={24} /> : <ArrowLeft size={24} />}
          </button>
          <span className="text-xs text-gray-600 tracking-widest uppercase">{currentIndex + 1} / {QUESTIONS.length}</span>
          <div className="w-6" />
        </div>

        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-serif leading-tight mb-8">{q.text}</h2>
          <div className="flex-1">
            {q.type === 'slider' ? (
              <div className="flex flex-col items-center justify-center h-64 gap-8">
                <div className="text-6xl font-serif">{val}/10</div>
                <input type="range" min="0" max="10" step="1" value={val} 
                       onChange={e => setResponses(prev => ({ ...prev, [q.key]: Number(e.target.value) }))}
                       className="w-full" />
              </div>
            ) : (
              <TextArea placeholder="Flow into the void..." value={val as string} 
                        onChange={e => setResponses(prev => ({ ...prev, [q.key]: e.target.value }))}
                        autoFocus />
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={() => currentIndex < QUESTIONS.length - 1 ? setCurrentIndex(i => i + 1) : handleCreateEntry()} fullWidth disabled={isLoading}>
            {currentIndex === QUESTIONS.length - 1 ? (isLoading ? 'Saving...' : 'Complete') : 'Forward'}
          </Button>
        </div>

        <Modal isOpen={showExitModal} title="Abandon Flow?" description="The current silence will be lost."
               primaryAction={() => setShowExitModal(false)} primaryLabel="Stay"
               secondaryAction={() => { setShowExitModal(false); setScreen(AppScreen.HOME); }} secondaryLabel="Leave" />
      </div>
    );
  };

  const renderLibrary = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setScreen(AppScreen.HOME)} className="text-gray-500"><ArrowLeft size={24} /></button>
        <h2 className="text-xl font-serif">Past Echoes</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">
        {entries.map(entry => (
          <div key={entry.id} onClick={() => { setSelectedEntry(entry); setScreen(AppScreen.ENTRY_DETAIL); }}
               className="bg-[#101218] border border-[#2A2C32] rounded-xl p-6 cursor-pointer hover:border-gray-500 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-widest">{new Date(entry.created_at).toLocaleDateString()}</span>
              {entry.pinned && <Pin size={14} className="text-[#F5F5F2]" />}
            </div>
            <h3 className="font-serif text-lg mb-2">{entry.title}</h3>
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-gray-500" style={{ width: `${entry.intensity * 10}%` }}></div>
              </div>
              <span className="text-[10px] text-gray-600 uppercase">Intensity {entry.intensity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEntryDetail = () => {
    if (!selectedEntry) return null;
    return (
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setScreen(AppScreen.LIBRARY)} className="text-gray-500"><ArrowLeft size={24} /></button>
            <span className="text-xs text-gray-500 uppercase tracking-widest">{new Date(selectedEntry.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => handleTogglePin(selectedEntry.id)} className="text-gray-500 hover:text-white">
                {selectedEntry.pinned ? <PinOff size={20} /> : <Pin size={20} />}
             </button>
             <button onClick={() => handleDelete(selectedEntry.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={20} /></button>
          </div>
        </div>

        <h1 className="text-3xl font-serif mb-8 leading-tight">{selectedEntry.title}</h1>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
          {selectedEntry.reflection ? (
            <div className="mb-10 p-6 bg-[#101218] border border-[#2A2C32] rounded-xl relative">
              <Sparkles size={16} className="absolute top-4 right-4 text-gray-600" />
              <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Mirror Reflection</h4>
              <p className="font-serif text-lg leading-relaxed text-gray-300 italic">
                "{selectedEntry.reflection}"
              </p>
            </div>
          ) : (
            <div className="mb-10 p-6 bg-[#0A0B0E] border border-dashed border-[#2A2C32] rounded-xl flex flex-col items-center gap-4 text-center">
              <p className="text-sm text-gray-500">AI can mirror this reflection for deeper insight.</p>
              <Button onClick={() => handleReflect(selectedEntry.id)} variant="secondary" className="text-xs px-4 py-2" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Request Reflection'}
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {/* <Accordion title="plan to do">
                {selectedEntry.intensity}
            </Accordion> */}
            {QUESTIONS.map(q => (
              <Accordion key={q.id} title={q.key.replace(/_/g, ' ')} >
                {selectedEntry[q.key] || '0' ||'—'}
                {q.type === 'slider' && '/10'}
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    if (!analytics) return null;
    return (
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setScreen(AppScreen.HOME)} className="text-gray-500"><ArrowLeft size={24} /></button>
          <h2 className="text-xl font-serif">Insights</h2>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-8 pb-12">
          {/* Streak Card */}
          <div className="bg-[#101218] border border-[#2A2C32] rounded-xl p-8 flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2">Continuity</span>
            <div className="text-5xl font-serif mb-2">{analytics.streak}</div>
            <span className="text-xs text-gray-600 uppercase tracking-widest">Day Streak</span>
          </div>

          {/* Emotional Trends */}
          <div className="flex flex-col gap-4">
             <h3 className="text-xs text-gray-500 uppercase tracking-widest">Dominant Emotions</h3>
             <div className="flex flex-wrap gap-2">
                {analytics.emotional_trends.map(([tag, count], i) => (
                  <div key={i} className="px-4 py-2 border border-[#2A2C32] rounded-full flex items-center gap-2">
                    <span className="text-sm font-serif">{tag}</span>
                    <span className="text-[10px] text-gray-600">{count}x</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Coverage */}
          <div className="flex flex-col gap-4">
             <h3 className="text-xs text-gray-500 uppercase tracking-widest">Self-Mirroring</h3>
             <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
                   <div className="h-full bg-gray-500" style={{ width: `${analytics.reflection_coverage.coverage * 100}%` }}></div>
                </div>
                <span className="text-xs text-gray-500">{Math.round(analytics.reflection_coverage.coverage * 100)}%</span>
             </div>
             <p className="text-[10px] text-gray-600 italic">You reflect on {analytics.reflection_coverage.total_responses} thoughts.</p>
          </div>

          {/* Frequency Chart */}
          <div className="h-48 w-full mt-4">
             <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Frequency</h3>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={analytics.entry_frequency}>
                 <XAxis dataKey="date" hide />
                 <Tooltip cursor={{fill: '#1E1F23'}} contentStyle={{backgroundColor: '#101218', border: '1px solid #2A2C32', borderRadius: '8px'}} />
                 <Bar dataKey="count" fill="#333" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setScreen(AppScreen.HOME)} className="text-gray-500"><ArrowLeft size={24} /></button>
        <h2 className="text-xl font-serif">Preferences</h2>
      </div>
      <div className="flex flex-col gap-4">
        <div className="p-6 border border-[#2A2C32] rounded-xl flex items-center justify-between opacity-50">
          <span className="text-[#F5F5F2]">Biometric Lock</span>
          <span className="text-[10px] text-gray-600 uppercase">Pro</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 text-red-900/50 p-6 border border-red-900/10 rounded-xl hover:bg-red-900/5 transition-colors">
          <LogOut size={20} />
          <span className="text-sm uppercase tracking-widest">Sign Out</span>
        </button>
      </div>
      <div className="mt-auto text-center py-8">
        <p className="text-[10px] text-gray-800 uppercase tracking-[0.3em]">EchoMind v2.1.0</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#050608] min-h-screen text-[#F5F5F2] font-sans antialiased overflow-hidden flex justify-center">
      <div className="w-full max-w-lg h-[100dvh] flex flex-col bg-[#050608] shadow-2xl relative">
        {screen === AppScreen.AUTH_GATE && renderAuthGate()}
        {screen === AppScreen.LOGIN && renderLogin()}
        {screen === AppScreen.HOME && renderHome()}
        {screen === AppScreen.REFLECTION_FLOW && renderReflectionFlow()}
        {screen === AppScreen.LIBRARY && renderLibrary()}
        {screen === AppScreen.ENTRY_DETAIL && renderEntryDetail()}
        {screen === AppScreen.ANALYTICS && renderAnalytics()}
        {screen === AppScreen.SETTINGS && renderSettings()}
      </div>
    </div>
  );
}
