'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Save, Building2, MapPin, Phone, Globe, Wallet, Send, Image, TrendingUp, Flame, Calendar, Zap, Trophy, Plus } from 'lucide-react';
import { useXRPLWallet } from '@/components/providers/XRPLWalletProvider';

export default function AssociationDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [association, setAssociation] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'nature',
    address: '',
    phone: '',
    website: '',
    logo: '',
    walletAddress: '',
  });
  
  const [activeTab, setActiveTab] = useState<'info' | 'wallet' | 'nfts' | 'events'>('info');
  const [transferData, setTransferData] = useState({ to: '', amount: '' });
  const [transferring, setTransferring] = useState(false);
  const [nfts, setNfts] = useState<any[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);
  const { walletInfo, balance, refreshBalance } = useXRPLWallet();
  
  // États pour les événements
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    name: '',
    description: '',
    maxHealth: '1000',
    multiplier: '2',
    durationDays: '7',
  });

  useEffect(() => {
    fetchProfile();
    fetchEvents();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.user.role !== 'ASSOCIATION') {
        router.push('/login');
        return;
      }

      if (data.user.association) {
        setFormData({
          name: data.user.association.name || '',
          description: data.user.association.description || '',
          type: data.user.association.type || 'nature',
          address: data.user.association.address || '',
          phone: data.user.association.phone || '',
          website: data.user.association.website || '',
          logo: data.user.association.logo || '',
          walletAddress: data.user.association.walletAddress || '',
        });
        setAssociation(data.user.association);
        
        // Charger les NFTs si un wallet est connecté
        if (walletInfo?.address) {
          fetchNFTs(walletInfo.address);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/association/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      setMessage({ type: 'success', text: 'Informations mises à jour avec succès' });
      setAssociation(data.association);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const fetchNFTs = async (address: string) => {
    setLoadingNFTs(true);
    try {
      const response = await fetch(`/api/xrpl/nfts?address=${address}`);
      const data = await response.json();
      setNfts(data.nfts || []);
    } catch (error) {
      console.error('Erreur lors du chargement des NFTs:', error);
    } finally {
      setLoadingNFTs(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletInfo?.address) {
      setMessage({ type: 'error', text: 'Veuillez connecter votre wallet' });
      return;
    }

    setTransferring(true);
    setMessage(null);

    try {
      const response = await fetch('/api/xrpl/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAddress: walletInfo.address,
          toAddress: transferData.to,
          amount: transferData.amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du transfert');
      }

      setMessage({ type: 'success', text: 'Transfert effectué avec succès' });
      setTransferData({ to: '', amount: '' });
      await refreshBalance();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setTransferring(false);
    }
  };

  useEffect(() => {
    if (walletInfo?.address && activeTab === 'nfts') {
      fetchNFTs(walletInfo.address);
    }
  }, [walletInfo, activeTab]);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await fetch('/api/events/list');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingEvent(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      setMessage({ type: 'success', text: 'Événement créé avec succès !' });
      setEventFormData({
        name: '',
        description: '',
        maxHealth: '1000',
        multiplier: '2',
        durationDays: '7',
      });
      await fetchEvents();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setCreatingEvent(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'nature': return '🌿';
      case 'eau': return '💧';
      case 'humanitaire': return '❤️';
      case 'air': return '💨';
      case 'feu': return '🔥';
      default: return '🌿';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nature': return 'from-green-500 to-emerald-500';
      case 'eau': return 'from-blue-500 to-cyan-500';
      case 'humanitaire': return 'from-pink-500 to-rose-500';
      case 'air': return 'from-sky-400 to-blue-400';
      case 'feu': return 'from-red-500 to-orange-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header avec type d'association */}
          <div className={`bg-gradient-to-r ${getTypeColor(formData.type)} p-6 text-white`}>
            <div className="flex items-center gap-4">
              <div className="text-5xl">{getTypeIcon(formData.type)}</div>
              <div>
                <h1 className="text-3xl font-bold">{formData.name || 'Mon Association'}</h1>
                <p className="text-white/90 mt-1">Dashboard de gestion</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex gap-2 px-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === 'info'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Informations
              </button>
              <button
                onClick={() => setActiveTab('wallet')}
                className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === 'wallet'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Send className="w-4 h-4 inline mr-2" />
                Wallet XRP
              </button>
              <button
                onClick={() => setActiveTab('nfts')}
                className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === 'nfts'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Image className="w-4 h-4 inline mr-2" />
                Mes NFTs
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === 'events'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Flame className="w-4 h-4 inline mr-2" />
                Événements
              </button>
            </div>
          </div>

          <div className="p-8">
            {association && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Statut:</strong>{' '}
                  <span
                    className={`px-2 py-1 rounded ${
                      association.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : association.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {association.status === 'APPROVED'
                      ? 'Approuvée'
                      : association.status === 'REJECTED'
                      ? 'Rejetée'
                      : 'En attente'}
                  </span>
                </p>
              </div>
            )}

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'info' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4" />
                    Nom de l'association
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'association
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="nature">🌿 Nature & Forêts</option>
                    <option value="eau">💧 Eau & Océans</option>
                    <option value="humanitaire">❤️ Humanitaire</option>
                    <option value="air">💨 Air & Climat</option>
                    <option value="feu">🔥 Prévention Incendies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4" />
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4" />
                      Site web
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Wallet className="w-4 h-4" />
                      Adresse Wallet XRPL
                    </label>
                    <input
                      type="text"
                      value={formData.walletAddress}
                      onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            )}

            {activeTab === 'wallet' && (
              <div className="space-y-6">
                {/* Wallet Info */}
                {walletInfo ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Votre Wallet</h3>
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Adresse</p>
                      <p className="font-mono text-sm bg-white p-3 rounded border border-green-200 break-all">
                        {walletInfo.address}
                      </p>
                      <p className="text-sm text-gray-600 mt-4">Solde</p>
                      <p className="text-3xl font-bold text-green-600">
                        {balance || '0'} XRP
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800">
                      Veuillez connecter votre wallet depuis le header pour accéder à cette fonctionnalité.
                    </p>
                  </div>
                )}

                {/* Transfer Form */}
                {walletInfo && (
                  <form onSubmit={handleTransfer} className="bg-white border border-gray-200 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Send className="w-5 h-5 text-green-600" />
                      Transférer des XRP
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse destinataire
                      </label>
                      <input
                        type="text"
                        value={transferData.to}
                        onChange={(e) => setTransferData({ ...transferData, to: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Montant (XRP)
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={transferData.amount}
                        onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={transferring}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                      {transferring ? 'Transfert en cours...' : 'Envoyer'}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Note: Cette fonctionnalité est en mode démo. En production, la signature se ferait via votre wallet.
                    </p>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                {/* Formulaire de création d'événement */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-6 border-2 border-orange-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-6 h-6 text-orange-600" />
                    Créer un Événement
                  </h3>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>ℹ️ Important :</strong> Un seul événement peut être actif à la fois. Assurez-vous qu'aucun autre événement n'est en cours avant de créer le vôtre.
                    </p>
                  </div>

                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'événement *
                      </label>
                      <input
                        type="text"
                        value={eventFormData.name}
                        onChange={(e) => setEventFormData({ ...eventFormData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Le Brasier des Cimes"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={eventFormData.description}
                        onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        rows={3}
                        placeholder="Un incendie menace la forêt..."
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Points de vie (HP) *
                        </label>
                        <input
                          type="number"
                          value={eventFormData.maxHealth}
                          onChange={(e) => setEventFormData({ ...eventFormData, maxHealth: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          min="100"
                          max="10000"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Multiplicateur *
                        </label>
                        <select
                          value={eventFormData.multiplier}
                          onChange={(e) => setEventFormData({ ...eventFormData, multiplier: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="1">x1 (Normal)</option>
                          <option value="1.5">x1.5</option>
                          <option value="2">x2 (Recommandé)</option>
                          <option value="3">x3 (Intense)</option>
                          <option value="5">x5 (Extrême)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Durée (jours) *
                        </label>
                        <input
                          type="number"
                          value={eventFormData.durationDays}
                          onChange={(e) => setEventFormData({ ...eventFormData, durationDays: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          min="1"
                          max="30"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={creatingEvent}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition disabled:opacity-50 font-bold"
                    >
                      <Flame className="w-5 h-5" />
                      {creatingEvent ? 'Création en cours...' : 'Créer l\'événement'}
                    </button>
                  </form>
                </div>

                {/* Liste des événements */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      Événements ({events.length})
                    </h3>
                    <button
                      onClick={fetchEvents}
                      disabled={loadingEvents}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                    >
                      {loadingEvents ? 'Chargement...' : 'Actualiser'}
                    </button>
                  </div>

                  {loadingEvents ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Chargement des événements...</p>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Flame className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Aucun événement pour le moment</p>
                      <p className="text-sm text-gray-500 mt-2">Créez votre premier événement ci-dessus !</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className={`p-4 rounded-lg border-2 ${
                            event.status === 'active'
                              ? 'bg-orange-50 border-orange-300'
                              : event.status === 'completed'
                              ? 'bg-green-50 border-green-300'
                              : 'bg-gray-50 border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900">{event.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                event.status === 'active'
                                  ? 'bg-orange-500 text-white'
                                  : event.status === 'completed'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-500 text-white'
                              }`}
                            >
                              {event.status === 'active' ? '🔥 Actif' : event.status === 'completed' ? '✅ Terminé' : '⏸️ Inactif'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="bg-white p-2 rounded text-center">
                              <div className="text-xs text-gray-600">HP Restants</div>
                              <div className="text-lg font-bold text-orange-600">
                                {event.currentHealth}/{event.maxHealth}
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded text-center">
                              <div className="text-xs text-gray-600">Multiplicateur</div>
                              <div className="text-lg font-bold text-purple-600">x{event.multiplier}</div>
                            </div>
                            <div className="bg-white p-2 rounded text-center">
                              <div className="text-xs text-gray-600">Contributions</div>
                              <div className="text-lg font-bold text-blue-600">{event.totalContributions || 0}</div>
                            </div>
                            <div className="bg-white p-2 rounded text-center">
                              <div className="text-xs text-gray-600">XRP Collectés</div>
                              <div className="text-lg font-bold text-green-600">{event.totalAmount?.toFixed(0) || 0}</div>
                            </div>
                          </div>

                          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                            <div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                              style={{ width: `${event.healthPercentage}%` }}
                            />
                          </div>

                          {event.endDate && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Fin prévue : {new Date(event.endDate).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          )}

                          {event.status === 'active' && (
                            <a
                              href={`/event/${event.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 block w-full text-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition font-semibold text-sm"
                            >
                              Voir l'événement →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'nfts' && (
              <div className="space-y-6">
                {walletInfo ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Image className="w-5 h-5 text-green-600" />
                        Mes NFTs ({nfts.length})
                      </h3>
                      <button
                        onClick={() => fetchNFTs(walletInfo.address)}
                        disabled={loadingNFTs}
                        className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition disabled:opacity-50"
                      >
                        {loadingNFTs ? 'Chargement...' : 'Actualiser'}
                      </button>
                    </div>

                    {loadingNFTs ? (
                      <div className="text-center py-12">
                        <p className="text-gray-600">Chargement des NFTs...</p>
                      </div>
                    ) : nfts.length === 0 ? (
                      <div className="bg-gray-50 p-12 rounded-lg text-center">
                        <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucun NFT trouvé</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Vos NFTs apparaîtront ici une fois que vous en aurez reçu.
                        </p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {nfts.map((nft, index) => (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                          >
                            <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg mb-3 flex items-center justify-center">
                              <Image className="w-12 h-12 text-green-600" />
                            </div>
                            <p className="font-medium text-gray-900 mb-1">NFT #{index + 1}</p>
                            <p className="text-xs text-gray-500 font-mono truncate">
                              {nft.NFTokenID}
                            </p>
                            {nft.URI && (
                              <p className="text-xs text-gray-400 mt-2 truncate">
                                URI: {nft.URI}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800">
                      Veuillez connecter votre wallet depuis le header pour voir vos NFTs.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
