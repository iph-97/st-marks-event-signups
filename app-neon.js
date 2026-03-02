const { useState, useEffect } = React;
const { Calendar, Users, Mail, Plus, Trash2, Edit2, Check, X } = lucide;

// API helper functions
const api = {
  async getSeries() {
    const response = await fetch('/.netlify/functions/series');
    if (!response.ok) throw new Error('Failed to fetch series');
    return response.json();
  },

  async createSeries(data) {
    const response = await fetch('/.netlify/functions/series', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create series');
    return response.json();
  },

  async updateSeries(data) {
    const response = await fetch('/.netlify/functions/series', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update series');
    return response.json();
  },

  async deleteSeries(id) {
    const response = await fetch('/.netlify/functions/series', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error('Failed to delete series');
    return response.json();
  },

  async getParties(seriesId) {
    const response = await fetch(`/.netlify/functions/parties?seriesId=${seriesId}`);
    if (!response.ok) throw new Error('Failed to fetch parties');
    const parties = await response.json();
    // Parse guests JSON back to array
    return parties.map(p => ({
      ...p,
      guests: typeof p.guests === 'string' ? JSON.parse(p.guests) : p.guests
    }));
  },

  async createParty(data) {
    const response = await fetch('/.netlify/functions/parties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create party');
    const party = await response.json();
    return {
      ...party,
      guests: typeof party.guests === 'string' ? JSON.parse(party.guests) : party.guests
    };
  },

  async updateParty(data) {
    const response = await fetch('/.netlify/functions/parties', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update party');
    const party = await response.json();
    return {
      ...party,
      guests: typeof party.guests === 'string' ? JSON.parse(party.guests) : party.guests
    };
  },

  async deleteParty(id) {
    const response = await fetch('/.netlify/functions/parties', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error('Failed to delete party');
    return response.json();
  }
};

const DinnerPartyManager = () => {
  const [series, setSeries] = useState([]);
  const [currentSeries, setCurrentSeries] = useState(null);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddParty, setShowAddParty] = useState(false);
  const [showAddSeries, setShowAddSeries] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [editingSeries, setEditingSeries] = useState(null);

  // Load series on mount
  useEffect(() => {
    loadSeries();
  }, []);

  // Load parties when series changes
  useEffect(() => {
    if (currentSeries) {
      loadParties(currentSeries.id);
    }
  }, [currentSeries]);

  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadSeries();
      if (currentSeries) {
        loadParties(currentSeries.id);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSeries]);

  const loadSeries = async () => {
    try {
      const data = await api.getSeries();
      setSeries(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading series:', error);
      setLoading(false);
    }
  };

  const loadParties = async (seriesId) => {
    try {
      const data = await api.getParties(seriesId);
      setParties(data);
    } catch (error) {
      console.error('Error loading parties:', error);
    }
  };

  const saveSeries = async (seriesData) => {
    try {
      if (seriesData.id) {
        await api.updateSeries(seriesData);
      } else {
        await api.createSeries(seriesData);
      }
      await loadSeries();
    } catch (error) {
      console.error('Error saving series:', error);
      alert('Failed to save series. Please try again.');
    }
  };

  const deleteSeries = async (seriesId) => {
    if (!confirm('Are you sure you want to delete this series? All associated dinner parties will also be deleted.')) return;
    
    try {
      await api.deleteSeries(seriesId);
      if (currentSeries?.id === seriesId) {
        setCurrentSeries(null);
      }
      await loadSeries();
    } catch (error) {
      console.error('Error deleting series:', error);
      alert('Failed to delete series. Please try again.');
    }
  };

  const saveParty = async (party) => {
    try {
      if (party.id) {
        await api.updateParty(party);
      } else {
        await api.createParty(party);
      }
      await loadParties(currentSeries.id);
    } catch (error) {
      console.error('Error saving party:', error);
      alert('Failed to save party. Please try again.');
    }
  };

  const deleteParty = async (partyId) => {
    if (!confirm('Are you sure you want to delete this dinner party?')) return;
    
    try {
      await api.deleteParty(partyId);
      await loadParties(currentSeries.id);
    } catch (error) {
      console.error('Error deleting party:', error);
      alert('Failed to delete party. Please try again.');
    }
  };

  const selectSeries = (seriesData) => {
    setCurrentSeries(seriesData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Home page - series selection
  if (!currentSeries) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-slate-800 text-white py-8 shadow-md">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-4xl font-serif mb-2">
              St. Mark's Event Sign Ups
            </h1>
            <p className="text-gray-200">Connecting our community through shared meals</p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <button
            onClick={() => setShowAddSeries(true)}
            className="mb-6 bg-red-700 text-white px-6 py-3 rounded hover:bg-red-800 transition flex items-center gap-2 shadow-md mx-auto"
          >
            <Plus size={20} />
            Create New Event Series
          </button>

          {showAddSeries && (
            <SeriesForm
              onSave={async (seriesData) => {
                await saveSeries(seriesData);
                setShowAddSeries(false);
              }}
              onCancel={() => setShowAddSeries(false)}
            />
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.length === 0 ? (
              <div className="col-span-full bg-white rounded shadow-md p-12 text-center border border-gray-200">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 text-lg font-serif">No event series created yet</p>
                <p className="text-gray-500">Click the button above to create your first series!</p>
              </div>
            ) : (
              series.map(s => (
                <SeriesCard
                  key={s.id}
                  series={s}
                  onSelect={() => selectSeries(s)}
                  onEdit={() => setEditingSeries(s)}
                  onDelete={() => deleteSeries(s.id)}
                />
              ))
            )}
          </div>

          {editingSeries && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <SeriesForm
                  series={editingSeries}
                  onSave={async (updatedData) => {
                    await saveSeries({ ...editingSeries, ...updatedData });
                    setEditingSeries(null);
                  }}
                  onCancel={() => setEditingSeries(null)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Series detail page - party management
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-800 text-white py-6 shadow-md">
        <div className="max-w-6xl mx-auto px-6">
          <button
            onClick={() => setCurrentSeries(null)}
            className="text-gray-200 hover:text-white mb-3 flex items-center gap-2"
          >
            ← Back to All Series
          </button>
          <h1 className="text-3xl font-serif mb-1">{currentSeries.title}</h1>
          <p className="text-gray-300 text-sm">{currentSeries.description}</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-2">
                Event window: {currentSeries.start_date} - {currentSeries.end_date}
              </p>
            </div>
            <button
              onClick={() => setEditingSeries(currentSeries)}
              className="text-red-700 hover:text-red-800 p-2"
              title="Edit series"
            >
              <Edit2 size={20} />
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowAddParty(true)}
          className="mb-6 bg-red-700 text-white px-6 py-3 rounded hover:bg-red-800 transition flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Sign Up to Host a Dinner Party
        </button>

        {showAddParty && (
          <PartyForm
            series={currentSeries}
            onSave={async (party) => {
              const newParty = {
                ...party,
                seriesId: currentSeries.id,
                guests: []
              };
              await saveParty(newParty);
              setShowAddParty(false);
            }}
            onCancel={() => setShowAddParty(false)}
          />
        )}

        <div className="grid gap-6">
          {parties.length === 0 ? (
            <div className="bg-white rounded shadow-md p-12 text-center border border-gray-200">
              <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg font-serif">No dinner parties scheduled yet</p>
              <p className="text-gray-500">Click the button above to host the first one!</p>
            </div>
          ) : (
            parties.map(party => (
              <PartyCard
                key={party.id}
                party={party}
                onDelete={() => deleteParty(party.id)}
                onEdit={() => setEditingParty(party)}
                onUpdate={saveParty}
              />
            ))
          )}
        </div>

        {editingParty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <PartyForm
                series={currentSeries}
                party={editingParty}
                onSave={async (updatedParty) => {
                  await saveParty({ ...editingParty, ...updatedParty });
                  setEditingParty(null);
                }}
                onCancel={() => setEditingParty(null)}
              />
            </div>
          </div>
        )}

        {editingSeries && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <SeriesForm
                series={editingSeries}
                onSave={async (updatedData) => {
                  await saveSeries({ ...editingSeries, ...updatedData });
                  setEditingSeries(null);
                }}
                onCancel={() => setEditingSeries(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// SeriesForm, SeriesCard, PartyForm, and PartyCard components remain the same as before
// (Copy from the previous app.js - they don't need changes for the database switch)

const SeriesForm = ({ series, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: series?.title || '',
    description: series?.description || '',
    startDate: series?.start_date || '',
    endDate: series?.end_date || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('End date must be after start date');
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-6 mb-6 max-w-2xl mx-auto border border-gray-200">
      <h2 className="text-2xl font-serif mb-2 text-gray-800">{series ? 'Edit' : 'Create New'} Event Series</h2>
      <p className="text-gray-600 mb-4">Set up a series of dinner parties with a specific time window</p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Series Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Spring 2025 Newcomer Dinners"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-700 focus:border-transparent"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What is this series about? Who should participate?"
          rows="3"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-700 focus:border-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-700 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-700 focus:border-transparent"
            required
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Hosts will only be able to schedule dinners within this date range
      </p>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800 transition flex items-center gap-2"
        >
          <Check size={18} />
          {series ? 'Save Changes' : 'Create Series'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition flex items-center gap-2"
        >
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
};

const SeriesCard = ({ series, onSelect, onEdit, onDelete }) => {
  const startDate = new Date(series.start_date);
  const endDate = new Date(series.end_date);
  const now = new Date();
  const isActive = now >= startDate && now <= endDate;
  const isPast = now > endDate;
  const isFuture = now < startDate;

  return (
    <div 
      className={`bg-white rounded shadow-md overflow-hidden cursor-pointer transition hover:shadow-lg border border-gray-200 ${isPast ? 'opacity-75' : ''}`}
      onClick={onSelect}
    >
      <div className="bg-slate-800 text-white p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif">{series.title}</h3>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-1.5 rounded transition"
              title="Edit series"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-1.5 rounded transition"
              title="Delete series"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        {isActive && (
          <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">
            Active
          </span>
        )}
        {isFuture && (
          <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
            Upcoming
          </span>
        )}
        {isPast && (
          <span className="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded font-medium">
            Completed
          </span>
        )}
      </div>
      
      <div className="p-4">
        {series.description && (
          <p className="text-gray-600 text-sm mb-3">{series.description}</p>
        )}
        <div className="text-sm text-gray-500">
          <p className="flex items-center gap-2 mb-1">
            <Calendar size={16} />
            {series.start_date} - {series.end_date}
          </p>
        </div>
      </div>
    </div>
  );
};

const PartyForm = ({ party, series, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: party?.date || '',
    host: party?.host || '',
    hostEmail: party?.host_email || '',
    location: party?.location || '',
    maxGuests: party?.max_guests || 8,
    kidFriendly: party?.kid_friendly || false,
    description: party?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.host || !formData.hostEmail || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    if (series) {
      const partyDate = new Date(formData.date);
      const seriesStart = new Date(series.start_date);
      const seriesEnd = new Date(series.end_date);
      
      if (partyDate < seriesStart || partyDate > seriesEnd) {
        alert(`Party date must be between ${series.start_date} and ${series.end_date}`);
        return;
      }
    }
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-6 mb-6 border border-gray-200">
      <h2 className="text-2xl font-serif mb-2 text-gray-800">{party ? 'Edit' : 'Host a'} Dinner Party</h2>
      <p className="text-gray-600 mb-4">Sign up to host a dinner party at your home</p>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
          <input
            type="text"
            value={formData.host}
            onChange={(e) => setFormData({ ...formData, host: e.target.value })}
            placeholder="Your name"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-700 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
          <input
            type="email"
            value={formData.hostEmail}
            onChange={(e) => setFormData({ ...formData, hostEmail: e.target.value })}
            placeholder="your@email.com"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-700 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={series?.start_date}
            max={series?.end_date}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-700 focus:border-transparent"
            required
          />
          {series && (
            <p className="text-xs text-gray-500 mt-1">
              Must be between {series.start_date} - {series.end_date}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">How many guests can you accommodate? *</label>
          <input
            type="number"
            value={formData.maxGuests}
            onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
            min="1"
            max="50"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-700 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Location/Address *</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Your address or general area (e.g., 'Capitol Hill')"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-700 focus:border-transparent"
          required
        />
        <p className="text-xs text-gray-500 mt-1">You can share exact address with guests later</p>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.kidFriendly}
            onChange={(e) => setFormData({ ...formData, kidFriendly: e.target.checked })}
            className="w-4 h-4 text-red-700 border-gray-300 rounded focus:ring-red-700"
          />
          <span className="text-sm font-medium text-gray-700">
            Kid-friendly home (children welcome)
          </span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details (Optional)</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Theme, menu ideas, parking info, dietary accommodations, pet info, etc."
          rows="3"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-700 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800 transition flex items-center gap-2"
        >
          <Check size={18} />
          {party ? 'Save Changes' : 'Sign Up to Host'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition flex items-center gap-2"
        >
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
};

const PartyCard = ({ party, onDelete, onEdit, onUpdate }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({ name: '', email: '', dietary: '' });

  const partyDate = new Date(party.date);
  const isPast = partyDate < new Date();
  const spotsLeft = party.max_guests - (party.guests?.length || 0);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!signupForm.name || !signupForm.email) {
      alert('Please enter your name and email');
      return;
    }

    if ((party.guests?.length || 0) >= party.max_guests) {
      alert('Sorry, this party is full!');
      return;
    }

    const newGuest = {
      id: Date.now().toString(),
      ...signupForm,
      signedUpAt: new Date().toISOString()
    };

    const updatedParty = {
      ...party,
      guests: [...(party.guests || []), newGuest]
    };

    await onUpdate(updatedParty);
    setSignupForm({ name: '', email: '', dietary: '' });
    setShowSignup(false);
    alert('Successfully signed up! You\'ll receive reminders before the party.');
  };

  const removeGuest = async (guestId) => {
    if (!confirm('Remove this guest from the party?')) return;
    
    const updatedParty = {
      ...party,
      guests: (party.guests || []).filter(g => g.id !== guestId)
    };
    await onUpdate(updatedParty);
  };

  return (
    <div className={`bg-white rounded shadow-md overflow-hidden border border-gray-200 ${isPast ? 'opacity-75' : ''}`}>
      <div className="bg-slate-800 text-white p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-2xl font-serif mb-1">
              {partyDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <p className="text-gray-300">Hosted by {party.host}{party.host_email ? ` (${party.host_email})` : ''}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded transition"
              title="Edit party"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={onDelete}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded transition"
              title="Delete party"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span>📍 {party.location}</span>
          <span>👥 {party.guests?.length || 0}/{party.max_guests} guests</span>
          {party.kid_friendly && (
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-medium">
              👶 Kid-friendly
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {party.description && (
          <p className="text-gray-600 mb-4 italic">{party.description}</p>
        )}

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-800">Guest List</h4>
            {spotsLeft > 0 && !isPast && (
              <span className="text-sm text-green-600 font-medium">{spotsLeft} spots left</span>
            )}
          </div>

          {(party.guests?.length || 0) === 0 ? (
            <p className="text-gray-400 text-sm">No guests signed up yet</p>
          ) : (
            <div className="space-y-2">
              {(party.guests || []).map(guest => (
                <div key={guest.id} className="flex justify-between items-start bg-gray-50 p-3 rounded border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-800">{guest.name}</p>
                    <p className="text-sm text-gray-500">{guest.email}</p>
                    {guest.dietary && (
                      <p className="text-sm text-gray-600 mt-1">Dietary: {guest.dietary}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeGuest(guest.id)}
                    className="text-red-700 hover:text-red-800 p-1"
                    title="Remove guest"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isPast && spotsLeft > 0 && (
          <>
            {!showSignup ? (
              <button
                onClick={() => setShowSignup(true)}
                className="w-full bg-red-700 text-white py-3 rounded hover:bg-red-800 transition font-medium"
              >
                Sign Up for This Dinner
              </button>
            ) : (
              <form onSubmit={handleSignup} className="bg-gray-50 p-4 rounded border border-gray-200">
                <h5 className="font-semibold text-gray-800 mb-3">Sign Up</h5>
                
                <input
                  type="text"
                  placeholder="Your name *"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                  required
                />
                
                <input
                  type="email"
                  placeholder="Your email *"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                  required
                />
                
                <input
                  type="text"
                  placeholder="Dietary restrictions (optional)"
                  value={signupForm.dietary}
                  onChange={(e) => setSignupForm({ ...signupForm, dietary: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                />
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-700 text-white py-2 rounded hover:bg-red-800 transition"
                  >
                    Confirm Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSignup(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {isPast && (
          <div className="bg-gray-100 text-gray-600 py-2 px-4 rounded text-center">
            This dinner has already occurred
          </div>
        )}

        {!isPast && spotsLeft === 0 && (
          <div className="bg-yellow-50 text-yellow-800 py-2 px-4 rounded text-center font-medium border border-yellow-200">
            This party is full
          </div>
        )}
      </div>
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(DinnerPartyManager));