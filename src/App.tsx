import { TurnTimeline } from './components/TurnTimeline';
import { EpithetTracker } from './components/EpithetTracker';
import { StatsDashboard } from './components/StatsDashboard';
import { Optimizer } from './components/Optimizer';
import { SaveLoad } from './components/SaveLoad';
import { usePlannerStore } from './store/planner';
import { LayoutGrid, List, Calendar } from 'lucide-react';
import { useState } from 'react';

type ViewMode = 'full' | 'timeline' | 'epithets';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('full');
  const { getSelectedRaces, getConsecutiveRaceTurns, clearAllRaces, selectAllEpithets, clearEpithets } = usePlannerStore();
  
  const selectedRaces = getSelectedRaces();
  const consecutiveTurns = getConsecutiveRaceTurns();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Uma Musume Trailblazer Planner</h1>
            <p className="text-sm text-gray-500">Schedule races to maximize epithets across 72 turns</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{selectedRaces.length}</span> races selected
              {consecutiveTurns.length > 0 && (
                <span className="ml-2 text-amber-600">
                  ({consecutiveTurns.length} in 3+ consecutive)
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setViewMode('full')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
              viewMode === 'full' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Full
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
              viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Timeline
          </button>
          <button
            onClick={() => setViewMode('epithets')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
              viewMode === 'epithets' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <List className="w-4 h-4" />
            Epithets
          </button>
          
          <div className="flex-1" />
          
          <button
            onClick={clearAllRaces}
            className="px-3 py-1.5 rounded text-sm bg-gray-100 hover:bg-gray-200"
          >
            Clear Races
          </button>
          <button
            onClick={selectAllEpithets}
            className="px-3 py-1.5 rounded text-sm bg-gray-100 hover:bg-gray-200"
          >
            Select All Epithets
          </button>
          <button
            onClick={clearEpithets}
            className="px-3 py-1.5 rounded text-sm bg-gray-100 hover:bg-gray-200"
          >
            Clear Epithets
          </button>
        </div>
      </header>
      
      <main className="p-6">
        {(viewMode === 'full' || viewMode === 'timeline') && (
          <div className={viewMode === 'full' ? 'lg:w-2/3' : 'w-full'}>
            <TurnTimeline />
          </div>
        )}
        
        {viewMode === 'full' && (
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <StatsDashboard />
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <EpithetTracker />
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <Optimizer />
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <SaveLoad />
            </div>
          </div>
        )}
        
        {viewMode === 'epithets' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <EpithetTracker />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
