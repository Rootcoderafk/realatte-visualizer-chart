
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, Minus } from 'lucide-react';

interface Metrics {
  leads: number;
  qualifiedLeads: number;
  siteVisits: number;
  bookings: number;
  cpl: number;
  cpql: number;
  cpsv: number;
  cpb: number;
  totalBudget: number;
}

const LeadCalculator = () => {
  const [propertyType, setPropertyType] = useState('Residential');
  const [launchType, setLaunchType] = useState('Launch');
  const [location, setLocation] = useState('South Mumbai');
  const [bhk, setBhk] = useState('2 BHK');
  const [marketingChannels, setMarketingChannels] = useState('TextAds+StaticBanners+Reels');
  const [sellUnits, setSellUnits] = useState(50);
  const [duration, setDuration] = useState('6 Months');

  const [metrics, setMetrics] = useState<Metrics>({
    leads: 8333,
    qualifiedLeads: 1833,
    siteVisits: 500,
    bookings: 50,
    cpl: 2160,
    cpql: 9819,
    cpsv: 35999,
    cpb: 359986,
    totalBudget: 17999280
  });

  const calculateMetrics = () => {
    // Base calculations with realistic multipliers based on form inputs
    const baseLeads = sellUnits * 167; // Base multiplier
    const locationMultiplier = location === 'South Mumbai' ? 1.2 : location === 'Andheri' ? 1.0 : 0.8;
    const bhkMultiplier = bhk === '1 BHK' ? 0.8 : bhk === '2 BHK' ? 1.0 : bhk === '3 BHK' ? 1.2 : 1.5;
    const channelMultiplier = marketingChannels.includes('Reels') ? 1.3 : 1.0;
    
    const leads = Math.round(baseLeads * locationMultiplier * bhkMultiplier * channelMultiplier);
    const qualifiedLeads = Math.round(leads * 0.22);
    const siteVisits = Math.round(qualifiedLeads * 0.27);
    const bookings = sellUnits;
    
    const cpl = Math.round((leads * 2160) / leads);
    const cpql = Math.round((qualifiedLeads * 9819) / qualifiedLeads);
    const cpsv = Math.round((siteVisits * 35999) / siteVisits);
    const cpb = Math.round((bookings * 359986) / bookings);
    
    const totalBudget = leads * cpl;

    setMetrics({
      leads,
      qualifiedLeads,
      siteVisits,
      bookings,
      cpl,
      cpql,
      cpsv,
      cpb,
      totalBudget
    });
  };

  useEffect(() => {
    calculateMetrics();
  }, [propertyType, launchType, location, bhk, marketingChannels, sellUnits, duration]);

  const chartData = [
    { month: 'Month 1', bookings: Math.round(metrics.bookings * 0.1), siteVisits: Math.round(metrics.siteVisits * 0.15), cpl: Math.round(metrics.leads * 0.2) },
    { month: 'Month 2', bookings: Math.round(metrics.bookings * 0.2), siteVisits: Math.round(metrics.siteVisits * 0.25), cpl: Math.round(metrics.leads * 0.3) },
    { month: 'Month 3', bookings: Math.round(metrics.bookings * 0.35), siteVisits: Math.round(metrics.siteVisits * 0.4), cpl: Math.round(metrics.leads * 0.45) },
    { month: 'Month 4', bookings: Math.round(metrics.bookings * 0.6), siteVisits: Math.round(metrics.siteVisits * 0.65), cpl: Math.round(metrics.leads * 0.7) },
    { month: 'Month 5', bookings: Math.round(metrics.bookings * 0.8), siteVisits: Math.round(metrics.siteVisits * 0.85), cpl: Math.round(metrics.leads * 0.9) },
    { month: 'Month 6', bookings: metrics.bookings, siteVisits: metrics.siteVisits, cpl: metrics.leads }
  ];

  const pieData = [
    { name: 'Bookings', value: metrics.bookings * metrics.cpb, color: '#f59e0b' },
    { name: 'Site Visits', value: metrics.siteVisits * metrics.cpsv, color: '#8b5cf6' },
    { name: 'CPL', value: metrics.leads * metrics.cpl, color: '#ec4899' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded mr-3"></div>
            <span className="text-purple-400 font-semibold text-sm tracking-wider uppercase">Lead Calculator</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Let's Show You Just How Far Your<br />
            Growth Can Go <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">With Us</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-4xl mx-auto">
            Input your data, and let our ROI-driven strategies show you the scalable growth we can deliver. Precise, data-backed insights to fuel your next big move.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6 space-y-6">
                {/* Property Type */}
                <div>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Launch Type and Location */}
                <div className="grid grid-cols-2 gap-4">
                  <Select value={launchType} onValueChange={setLaunchType}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="Launch">Launch</SelectItem>
                      <SelectItem value="Pre-Launch">Pre-Launch</SelectItem>
                      <SelectItem value="Ready">Ready</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="South Mumbai">South Mumbai</SelectItem>
                      <SelectItem value="Andheri">Andheri</SelectItem>
                      <SelectItem value="Thane">Thane</SelectItem>
                      <SelectItem value="Navi Mumbai">Navi Mumbai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* BHK and Marketing Channels */}
                <div className="grid grid-cols-2 gap-4">
                  <Select value={bhk} onValueChange={setBhk}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="1 BHK">1 BHK</SelectItem>
                      <SelectItem value="2 BHK">2 BHK</SelectItem>
                      <SelectItem value="3 BHK">3 BHK</SelectItem>
                      <SelectItem value="4+ BHK">4+ BHK</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={marketingChannels} onValueChange={setMarketingChannels}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="TextAds+StaticBanners+Reels">TextAds+StaticBanners+Reels</SelectItem>
                      <SelectItem value="TextAds+StaticBanners">TextAds+StaticBanners</SelectItem>
                      <SelectItem value="Video+Display">Video+Display</SelectItem>
                      <SelectItem value="Social+Search">Social+Search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sell Units Counter */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 border border-white/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">Sell Units</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-white/20 border-white/30 text-white hover:bg-white/30"
                          onClick={() => setSellUnits(Math.max(1, sellUnits - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-white font-medium mx-2">{sellUnits}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-white/20 border-white/30 text-white hover:bg-white/30"
                          onClick={() => setSellUnits(sellUnits + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="3 Months">3 Months</SelectItem>
                      <SelectItem value="6 Months">6 Months</SelectItem>
                      <SelectItem value="9 Months">9 Months</SelectItem>
                      <SelectItem value="12 Months">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-xs text-gray-400 pt-4 border-t border-white/20">
                  <p><strong>Disclaimer:</strong> The data presented is based on past experience and is provided for informational purposes only.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Metrics and Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-purple-400">{metrics.leads.toLocaleString()}</div>
                  <div className="text-sm text-purple-300">Leads</div>
                  <div className="text-lg font-semibold text-white mt-2">{metrics.cpl.toLocaleString()}</div>
                  <div className="text-xs text-gray-300">CPL</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-purple-400">{metrics.qualifiedLeads.toLocaleString()}</div>
                  <div className="text-sm text-purple-300">QL</div>
                  <div className="text-lg font-semibold text-white mt-2">{metrics.cpql.toLocaleString()}</div>
                  <div className="text-xs text-gray-300">CPQL</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-purple-400">{metrics.siteVisits.toLocaleString()}</div>
                  <div className="text-sm text-purple-300">SV</div>
                  <div className="text-lg font-semibold text-white mt-2">{metrics.cpsv.toLocaleString()}</div>
                  <div className="text-xs text-gray-300">CPSV</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-purple-400">{metrics.bookings}</div>
                  <div className="text-sm text-purple-300">Bookings</div>
                  <div className="text-lg font-semibold text-white mt-2">{(metrics.cpb / 100000).toFixed(2)}L</div>
                  <div className="text-xs text-gray-300">CPB</div>
                </CardContent>
              </Card>
            </div>

            {/* Total Budget */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    Total Budget: {(metrics.totalBudget / 10000000).toFixed(2)} Cr
                  </div>
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-gray-300">Bookings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="text-gray-300">Site Visits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-pink-500 rounded"></div>
                      <span className="text-gray-300">CPL</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorSiteVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorCPL" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                      <Area
                        type="monotone"
                        dataKey="cpl"
                        stackId="1"
                        stroke="#ec4899"
                        fill="url(#colorCPL)"
                      />
                      <Area
                        type="monotone"
                        dataKey="siteVisits"
                        stackId="1"
                        stroke="#8b5cf6"
                        fill="url(#colorSiteVisits)"
                      />
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="url(#colorBookings)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCalculator;
