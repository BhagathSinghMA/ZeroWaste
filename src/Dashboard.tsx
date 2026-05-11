import React, { useState, useEffect } from 'react';
import { useAuthStore } from './store';
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  Truck, 
  LogOut, 
  Utensils, 
  TrendingDown, 
  CheckCircle, 
  Clock,
  Menu,
  X,
  User as UserIcon,
  Globe,
  Mail,
  Shield,
  Edit2,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';


// --- Components ---

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { user, logout } = useAuthStore();
  return (
    <nav className="h-16 border-b border-black/5 bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-black/5 rounded-lg">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
          <Utensils size={24} />
          <span>ZeroWaste</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 ml-8 px-3 py-1.5 bg-zinc-50 rounded-full border border-black/5 text-xs text-zinc-500">
          <Globe size={14} className="text-emerald-500" />
          <span className="font-medium">Current Location:</span>
          <span className="text-zinc-900">Downtown, City Center</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium text-zinc-900">{user?.name}</span>
          <span className="text-xs text-zinc-500">{user?.role}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
          <UserIcon size={20} />
        </div>
      </div>
    </nav>
  );
};

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose, viewMode, setViewMode }: any) => {
  const { logout } = useAuthStore();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Donor', 'Volunteer', 'NGO'] },
    { id: 'donate', label: 'Donate Food', icon: PlusCircle, roles: ['Donor'] },
    { id: 'available', label: 'Available Food', icon: List, roles: ['Volunteer', 'NGO'] },
    { id: 'deliveries', label: 'My Deliveries', icon: Truck, roles: ['Volunteer', 'NGO'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(viewMode));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
      <aside className={`fixed lg:sticky top-0 lg:top-16 left-0 h-screen lg:h-[calc(100vh-64px)] w-64 bg-white border-r border-black/5 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex flex-col h-full">
          {/* Mobile Mode Toggle */}
          <div className="lg:hidden mb-6 p-1 bg-zinc-100 rounded-xl border border-black/5 flex">
            <button 
              onClick={() => { setViewMode('Donor'); setActiveTab('dashboard'); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'Donor' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-400'}`}
            >
              Donor
            </button>
            <button 
              onClick={() => { setViewMode('Volunteer'); setActiveTab('dashboard'); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${viewMode !== 'Donor' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-400'}`}
            >
              Volunteer
            </button>
          </div>

          <div className="flex-1 space-y-1">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-zinc-500 hover:bg-zinc-50'}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// --- Views ---

const DashboardView = () => {
  const [stats, setStats] = useState<any>(null);
  const [wasteChartData, setWasteChartData] = useState<any[]>([]);
  const [redistributionChartData, setRedistributionChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseDate = (dateStr: string) => {
    // Accepts yyyy-mm-dd or dd-mm-yyyy (common CSV format) and returns a valid Date.
    const parts = dateStr?.toString().split('-');
    if (parts?.length === 3) {
      const [a, b, c] = parts;
      if (c.length === 4) {
        // dd-mm-yyyy
        return new Date(Number(c), Number(b) - 1, Number(a));
      }
      if (a.length === 4) {
        // yyyy-mm-dd
        return new Date(Number(a), Number(b) - 1, Number(c));
      }
    }
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const formatWeekday = (dateStr: string) => {
    const date = parseDate(dateStr);
    if (!date) return dateStr;
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };

  const weekdayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const normalizeWeeklyData = (data: any[]) => {
    const grouped: Record<string, { waste: number; food_sold: number }> = {};
    data.forEach((item: any) => {
      const label = formatWeekday(item.date);
      if (!weekdayOrder.includes(label)) return;
      if (!grouped[label]) {
        grouped[label] = { waste: 0, food_sold: 0 };
      }
      grouped[label].waste += Number(item.waste || 0);
      grouped[label].food_sold += Number(item.food_sold || 0);
    });

    return weekdayOrder.map((day) => ({
      name: day,
      waste: grouped[day]?.waste || 0,
      food_sold: grouped[day]?.food_sold || 0,
    }));
  };

  const chartData = wasteChartData.length
    ? wasteChartData
    : [
        { name: 'Mon', value: 20 },
        { name: 'Tue', value: 25 },
        { name: 'Wed', value: 13 },
        { name: 'Thu', value: 30 },
        { name: 'Fri', value: 17 },
        { name: 'Sat', value: 22 },
        { name: 'Sun', value: 18 },
      ];

  const redistributionData = redistributionChartData.length
    ? redistributionChartData
    : [
        { name: 'Mon', value: 12 },
        { name: 'Tue', value: 15 },
        { name: 'Wed', value: 9 },
        { name: 'Thu', value: 20 },
        { name: 'Fri', value: 14 },
        { name: 'Sat', value: 17 },
        { name: 'Sun', value: 10 },
      ];

  const isWasteDataNonZero = chartData.some((item) => Number(item.value) > 0);
  const isRedistributionDataNonZero = redistributionData.some((item) => Number(item.value) > 0);


  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('/api/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then((data) => {
        setStats(data);

        const normalized = normalizeWeeklyData(data.weeklyWaste || []);

        const wasteData = normalized.map((item) => ({
          name: item.name,
          value: item.waste,
        }));

        const redistributionData = normalized.map((item) => ({
          name: item.name,
          value: item.food_sold,
        }));

        setWasteChartData(wasteData);
        setRedistributionChartData(redistributionData);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Network error');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!stats) return <div className="p-8">No stats available</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {([
          { label: 'Total Donations', value: stats.total, icon: Utensils, color: 'bg-blue-500' },
          { label: 'Active Requests', value: stats.active, icon: Clock, color: 'bg-amber-500' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'bg-emerald-500' },
          { label: 'AI Predicted Waste (Today)', value: `${stats.predictedWaste}kg`, icon: TrendingDown, color: 'bg-rose-500' },
        ]).map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
            <div className="text-sm text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Food Waste Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Redistribution Efficiency (Last 7 days)</h3>
          <div className="h-64">
            {isRedistributionDataNonZero ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={redistributionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400 border border-dashed border-zinc-200 rounded-xl">
                No redistribution data available for the last 7 days.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DonateView = ({ onCancel }: { onCancel: () => void }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    food_name: '',
    quantity: '',
    contact: '',
    address: '',
    pickup_time: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, donor_id: user?.id, donor_name: user?.name })
      });
      if (res.ok) {
        alert('Donation successful!');
        onCancel(); // Go back to dashboard after success
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-black/5 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold mb-6">Donate Extra Food</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Food Name</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Rice, Bread, Curry"
              value={formData.food_name}
              onChange={e => setFormData({...formData, food_name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Quantity (kg/servings)</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 5kg or 10 servings"
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Contact Number</label>
          <input 
            required
            type="tel" 
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="Your phone number"
            value={formData.contact}
            onChange={e => setFormData({...formData, contact: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Pickup Address</label>
          <textarea 
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all min-h-[100px]"
            placeholder="Full address for pickup"
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Pickup Time</label>
          <input 
            required
            type="datetime-local" 
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            value={formData.pickup_time}
            onChange={e => setFormData({...formData, pickup_time: e.target.value})}
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Donate Now'}
          </button>
          <button 
            type="button"
            className="px-8 py-3 rounded-xl border border-zinc-200 font-semibold hover:bg-zinc-50 transition-all"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const AvailableView = ({ viewMode }: { viewMode: string }) => {
  const [donations, setDonations] = useState<any[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'nearest'>('newest');
  const { user } = useAuthStore();

  const fetchDonations = () => {
    fetch('/api/donations')
      .then(res => res.json())
      .then(data => {
        // Add mock distance for 'nearest' simulation
        const withDistance = data.map((d: any) => ({
          ...d,
          distance: (Math.random() * 5 + 0.5).toFixed(1) // 0.5 to 5.5 km
        }));
        setDonations(withDistance);
      });
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const sortedDonations = [...donations].sort((a, b) => {
    if (sortBy === 'nearest') return parseFloat(a.distance) - parseFloat(b.distance);
    return b.id - a.id;
  });

  const handleAccept = async (id: number) => {
    const res = await fetch(`/api/donations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Accepted', volunteer_id: user?.id })
    });
    if (res.ok) {
      alert('Donation accepted for delivery!');
      setSelectedDonation(null);
      fetchDonations();
    }
  };

  const handleCancel = async (id: number) => {
    const res = await fetch(`/api/donations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Cancelled' })
    });
    if (res.ok) {
      setSelectedDonation(null);
      fetchDonations();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Available Food Donations</h2>
          <div className="text-sm text-zinc-500">{donations.filter(d => d.status === 'Available').length} active requests near you</div>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-black/5 shadow-sm">
          <button 
            onClick={() => setSortBy('newest')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'newest' ? 'bg-emerald-600 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            Newest
          </button>
          <button 
            onClick={() => setSortBy('nearest')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'nearest' ? 'bg-emerald-600 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            Nearest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedDonations.filter(d => d.status === 'Available').map((donation) => (
          <motion.div 
            layoutId={`card-${donation.id}`}
            key={donation.id} 
            onClick={() => setSelectedDonation(donation)}
            className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-zinc-900">{donation.food_name}</h3>
                <p className="text-sm text-emerald-600 font-medium">{donation.quantity}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  donation.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                  donation.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                  'bg-zinc-100 text-zinc-700'
                }`}>
                  {donation.status}
                </span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{donation.distance} km away</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-zinc-600">
              <div className="flex items-center gap-2">
                <UserIcon size={16} className="text-zinc-400" />
                <span>Donor: {donation.donor_name}</span>
              </div>
              <div className="flex items-start gap-2">
                <Truck size={16} className="text-zinc-400 mt-0.5" />
                <span className="truncate">{donation.address}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedDonation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDonation(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              layoutId={`card-${selectedDonation.id}`}
              className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10"
            >
              <div className="h-32 bg-emerald-600 relative">
                <button 
                  onClick={() => setSelectedDonation(null)}
                  className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
                >
                  <X size={20} />
                </button>
                <div className="absolute -bottom-10 left-10 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-emerald-600 border border-black/5">
                  <Utensils size={40} />
                </div>
              </div>
              <div className="p-10 pt-16 space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-bold text-zinc-900">{selectedDonation.food_name}</h2>
                    <span className="text-emerald-600 font-bold text-xl">{selectedDonation.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedDonation.delivery_status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                      selectedDonation.delivery_status === 'Out for Delivery' ? 'bg-purple-100 text-purple-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {selectedDonation.delivery_status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Donor Information</div>
                        <div className="font-semibold text-zinc-900">{selectedDonation.donor_name}</div>
                        <div className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                          <CheckCircle size={14} className="text-emerald-500" />
                          Verified Donor
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                        <Truck size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Pickup Address</div>
                        <div className="text-zinc-900 leading-relaxed">{selectedDonation.address}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                        <Clock size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Pickup Time</div>
                        <div className="text-zinc-900">{new Date(selectedDonation.pickup_time).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                        <PlusCircle size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Contact Details</div>
                        <div className="text-zinc-900 font-bold text-lg">{selectedDonation.contact}</div>
                        <p className="text-xs text-zinc-500 mt-1">Call for coordination only after accepting</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDonation.status === 'Available' && (
                  <div className="flex gap-4 pt-4">
                    {(viewMode === 'Volunteer' || viewMode === 'NGO') && (
                      <button 
                        onClick={() => handleAccept(selectedDonation.id)}
                        className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                      >
                        Accept Donation
                      </button>
                    )}
                    {user?.id === selectedDonation.donor_id && (
                      <button 
                        onClick={() => handleCancel(selectedDonation.id)}
                        className="flex-1 border border-red-200 text-red-600 py-4 rounded-2xl font-bold text-lg hover:bg-red-50 transition-all"
                      >
                        Cancel Donation
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


const DeliveriesView = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const { user } = useAuthStore();

  const fetchDeliveries = () => {
    fetch(`/api/deliveries/${user?.id}`).then(res => res.json()).then(setDeliveries);
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/deliveries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      if (selectedDelivery && selectedDelivery.delivery_id === id) {
        setSelectedDelivery({ ...selectedDelivery, delivery_status: status });
      }
      fetchDeliveries();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Deliveries</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {deliveries.map((del) => (
          <div 
            key={del.delivery_id} 
            onClick={() => setSelectedDelivery(del)}
            className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-zinc-900">{del.food_name}</h3>
                <p className="text-sm text-emerald-600 font-medium">{del.quantity}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                del.delivery_status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                del.delivery_status === 'Out for Delivery' ? 'bg-purple-100 text-purple-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {del.delivery_status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-zinc-600">
              <div className="flex items-start gap-2">
                <Truck size={16} className="text-zinc-400 mt-0.5" />
                <span className="truncate">{del.address}</span>
              </div>
            </div>
            <div className="pt-2">
              {del.delivery_status === 'Accepted' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); updateStatus(del.delivery_id, 'Out for Delivery'); }}
                  className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                >
                  Start Delivery
                </button>
              )}
              {del.delivery_status === 'Out for Delivery' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); updateStatus(del.delivery_id, 'Delivered'); }}
                  className="w-full bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedDelivery && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDelivery(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
            >
              <div className="h-32 bg-emerald-600 relative shrink-0">
                <button 
                  onClick={() => setSelectedDelivery(null)}
                  className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
                >
                  <X size={20} />
                </button>
                <div className="absolute -bottom-10 left-10 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-emerald-600 border border-black/5">
                  <Truck size={40} />
                </div>
              </div>
              <div className="p-10 pt-16 space-y-8 flex-1 overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-bold text-zinc-900">{selectedDelivery.food_name}</h2>
                    <span className="text-emerald-600 font-bold text-xl">{selectedDelivery.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedDelivery.delivery_status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                      selectedDelivery.delivery_status === 'Out for Delivery' ? 'bg-purple-100 text-purple-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {selectedDelivery.delivery_status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Donor Information</div>
                      <div className="font-semibold text-zinc-900">{selectedDelivery.donor_name}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                      <Truck size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Pickup Address</div>
                      <div className="text-zinc-900 leading-relaxed">{selectedDelivery.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Pickup Time</div>
                      <div className="text-zinc-900">{new Date(selectedDelivery.pickup_time).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
                      <PlusCircle size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Contact Details</div>
                      <div className="text-zinc-900 font-bold text-lg">{selectedDelivery.contact}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {selectedDelivery.delivery_status === 'Accepted' && (
                    <button 
                      onClick={() => updateStatus(selectedDelivery.delivery_id, 'Out for Delivery')}
                      className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                    >
                      Start Delivery
                    </button>
                  )}
                  {selectedDelivery.delivery_status === 'Out for Delivery' && (
                    <button 
                      onClick={() => updateStatus(selectedDelivery.delivery_id, 'Delivered')}
                      className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {selectedDelivery.delivery_status === 'Delivered' && (
                    <div className="flex-1 bg-zinc-100 text-zinc-500 py-4 rounded-2xl font-bold text-lg text-center">
                      Delivery Completed
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileView = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    if (user) {
      setUser({ ...user, ...formData });
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
        <div className="h-32 bg-emerald-600 relative">
          <div className="absolute -bottom-12 left-10 w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center text-emerald-600 border border-black/5">
            <UserIcon size={48} />
          </div>
        </div>
        
        <div className="p-10 pt-16 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900">Profile Details</h2>
              <p className="text-zinc-500">Manage your account information</p>
            </div>
            <div className="flex gap-3">
              {isEditing && (
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user?.name || '', email: user?.email || '' });
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all"
                >
                  Cancel
                </button>
              )}
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                  isEditing 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200' 
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit2 size={18} /> Edit Profile</>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <UserIcon size={18} />
                </div>
                <input 
                  disabled={!isEditing}
                  type="text" 
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all disabled:opacity-60"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Mail size={18} />
                </div>
                <input 
                  disabled={!isEditing}
                  type="email" 
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all disabled:opacity-60"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Account Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Shield size={18} />
                </div>
                <input 
                  disabled
                  type="text" 
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-100 bg-zinc-50/10 text-zinc-500 outline-none cursor-not-allowed"
                  value={user?.role}
                />
              </div>
              <p className="text-[10px] text-zinc-400 ml-1 italic">* Role cannot be changed after registration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function Dashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, setLocation] = useState('Downtown, City Center');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState(location);
  const [viewMode, setViewMode] = useState<'Donor' | 'Volunteer' | 'NGO'>(user?.role || 'Donor');

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(tempLocation);
    setIsEditingLocation(false);
  };

  const toggleMode = () => {
    const nextMode = viewMode === 'Donor' ? 'Volunteer' : 'Donor';
    setViewMode(nextMode);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <nav className="h-16 border-b border-black/5 bg-white flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-black/5 rounded-lg">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
            <Utensils size={24} />
            <span>ZeroWaste</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 ml-8">
            {isEditingLocation ? (
              <form onSubmit={handleLocationSubmit} className="flex items-center gap-2">
                <input 
                  autoFocus
                  type="text"
                  className="px-3 py-1.5 bg-white rounded-full border border-emerald-500 text-xs outline-none w-48"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  onBlur={() => setIsEditingLocation(false)}
                />
              </form>
            ) : (
              <button 
                onClick={() => { setTempLocation(location); setIsEditingLocation(true); }}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-full border border-black/5 text-xs text-zinc-500 hover:bg-zinc-100 transition-all group"
              >
                <Globe size={14} className="text-emerald-500" />
                <span className="font-medium">Current Location:</span>
                <span className="text-zinc-900">{location}</span>
                <PlusCircle size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-zinc-100 p-1 rounded-xl border border-black/5">
            <button 
              onClick={() => { setViewMode('Donor'); setActiveTab('dashboard'); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'Donor' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              Donor Mode
            </button>
            <button 
              onClick={() => { setViewMode('Volunteer'); setActiveTab('dashboard'); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode !== 'Donor' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              Volunteer Mode
            </button>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-4 hover:bg-black/5 p-2 rounded-2xl transition-all group"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-zinc-900 group-hover:text-emerald-600 transition-colors">{user?.name}</span>
              <span className="text-xs text-zinc-500">{user?.role}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-200 transition-colors">
              <UserIcon size={20} />
            </div>
          </button>
        </div>
      </nav>
      <div className="flex flex-1">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'donate' && <DonateView onCancel={() => setActiveTab('dashboard')} />}
              {activeTab === 'available' && <AvailableView viewMode={viewMode} />}
              {activeTab === 'deliveries' && <DeliveriesView />}
              {activeTab === 'profile' && <ProfileView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
