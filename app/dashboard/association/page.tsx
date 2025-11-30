'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Save, Building2, MapPin, Phone, Globe, Wallet, Send, TrendingUp, Flame, Plus } from 'lucide-react';
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
  
  const [activeTab, setActiveTab] = useState<'info' | 'wallet' | 'events'>('info');
  const [transferData, setTransferData] = useState({ to: '', amount: '' });
  const [transferring, setTransferring] = useState(false);
  const { walletInfo, balance, refreshBalance } = useXRPLWallet();
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    maxHealth: '1000',
    multiplier: '2.0',
    durationDays: '7',
  });
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [activeEvent, setActiveEvent] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
    fetchActiveEvent();
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

  const fetchActiveEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !association) return;

      const response = await fetch('/api/events/list');
      const data = await response.json();
      
      // Trouver l'événement actif de cette association
      const myEvent = data.events?.find((e: any) => e.associationId === association.id && e.status === 'active');
      setActiveEvent(myEvent || null);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'événement:', error);
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
        body: JSON.stringify(eventForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de l\'événement');
      }

      setMessage({ type: 'success', text: 'Événement créé avec succès !' });
      setEventForm({
        name: '',
        description: '',
        maxHealth: '1000',
        multiplier: '2.0',
        durationDays: '7',
      });
      await fetchActiveEvent();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setCreatingEvent(false);
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
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      🔒 Contactez un administrateur pour modifier votre adresse wallet
                    </p>
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Flame className="w-6 h-6 text-orange-600" />
                    Gestion des Événements
                  </h3>
                </div>

                {/* Événement actif */}
                {activeEvent ? (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-4 border-orange-400 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">{activeEvent.name}</h4>
                        <p className="text-gray-700 mb-2">{activeEvent.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-bold text-orange-600">
                            {activeEvent.currentHealth} / {activeEvent.maxHealth} PV
                          </span>
                          <span className="text-gray-600">Multiplicateur: x{activeEvent.multiplier}</span>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-green-500 text-white rounded-full font-bold text-sm">
                        ACTIF
                      </span>
                    </div>
                    <a
                      href={`/event/${activeEvent.id}`}
                      className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-bold hover:from-orange-700 hover:to-red-700 transition"
                    >
                      Voir l'événement →
                    </a>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6">
                    <p className="text-gray-600 text-center py-4">
                      Aucun événement actif. Créez-en un nouveau ci-dessous.
                    </p>
                  </div>
                )}

                {/* Formulaire de création */}
                {!activeEvent && (
                  <form onSubmit={handleCreateEvent} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-green-600" />
                      Créer un nouvel événement
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'événement *
                      </label>
                      <input
                        type="text"
                        value={eventForm.name}
                        onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                        placeholder="Ex: Brasier des Cimes"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        rows={3}
                        placeholder="Décrivez votre événement de levée de fonds..."
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Points de vie maximum *
                        </label>
                        <input
                          type="number"
                          value={eventForm.maxHealth}
                          onChange={(e) => setEventForm({ ...eventForm, maxHealth: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                          min="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Multiplicateur *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={eventForm.multiplier}
                          onChange={(e) => setEventForm({ ...eventForm, multiplier: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                          min="1"
                          max="5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Durée (jours) *
                        </label>
                        <input
                          type="number"
                          value={eventForm.durationDays}
                          onChange={(e) => setEventForm({ ...eventForm, durationDays: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                          min="1"
                          max="30"
                        />
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>⚠️ Important :</strong> Vous ne pouvez avoir qu'un seul événement actif à la fois. 
                        L'événement se terminera automatiquement à la date de fin ou lorsque les points de vie atteignent 0.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={creatingEvent}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition disabled:opacity-50"
                    >
                      <Flame className="w-5 h-5" />
                      {creatingEvent ? 'Création en cours...' : 'Créer l\'événement'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
