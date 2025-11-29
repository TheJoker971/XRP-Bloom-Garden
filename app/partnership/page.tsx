'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Building2, Mail, Phone, FileText, Send, CheckCircle, TrendingUp, Award, Users } from 'lucide-react';

export default function PartnershipPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simuler l'envoi (à remplacer par un vrai appel API)
    setTimeout(() => {
      setSubmitted(true);
      setSending(false);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 border-2 border-green-200">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Merci pour votre intérêt !
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Votre demande de partenariat a été reçue avec succès.
            </p>
            <p className="text-gray-600 mb-8">
              Notre équipe vous contactera dans les plus brefs délais pour discuter des opportunités de collaboration.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-sky-800 mb-4">
            Devenir Partenaire
          </h1>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
            Soutenez la lutte contre les incendies et bénéficiez d'avantages fiscaux
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Avantages */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Award className="w-8 h-8 text-green-600" />
                Pourquoi devenir partenaire ?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Déductions Fiscales</h3>
                    <p className="text-gray-700 text-sm">
                      Bénéficiez de réductions d'impôts grâce à vos dons aux associations partenaires
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
                  <Users className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Visibilité Accrue</h3>
                    <p className="text-gray-700 text-sm">
                      Votre logo et votre engagement mis en avant sur notre plateforme
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <Building2 className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Impact Mesurable</h3>
                    <p className="text-gray-700 text-sm">
                      Suivez en temps réel l'impact de vos contributions sur les événements
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Award className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Engagement RSE</h3>
                    <p className="text-gray-700 text-sm">
                      Valorisez votre responsabilité sociétale et environnementale
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-lg p-8 border-2 border-green-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Notre Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl font-black text-green-600">50+</div>
                  <div className="text-sm text-gray-600">Associations</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl font-black text-blue-600">10K+</div>
                  <div className="text-sm text-gray-600">Donateurs</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl font-black text-orange-600">500K</div>
                  <div className="text-sm text-gray-600">XRP collectés</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl font-black text-purple-600">25</div>
                  <div className="text-sm text-gray-600">Événements</div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-sky-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Send className="w-8 h-8 text-sky-600" />
              Contactez-nous
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4" />
                  Nom du contact *
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email professionnel *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  rows={5}
                  placeholder="Parlez-nous de votre projet de partenariat..."
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-sky-700 hover:to-blue-700 transition disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer la demande
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                * Champs obligatoires. Vos données sont traitées de manière confidentielle.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

