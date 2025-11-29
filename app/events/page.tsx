'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Flame, Calendar, TrendingUp, Users, Trophy } from 'lucide-react';
import Link from 'next/link';

interface EventData {
  id: string;
  name: string;
  description: string;
  currentHealth: number;
  maxHealth: number;
  multiplier: number;
  healthPercentage: number;
  status: string;
  startDate: string;
  endDate: string | null;
  leaderboard: Array<{
    walletAddress: string;
    totalTickets: number;
    totalDamage: number;
    totalAmount: number;
    contributions: number;
  }>;
  totalContributions: number;
  totalAmount: number;
}

export default function EventsListPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000); // Refresh toutes les 10 secondes
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/list');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Chargement des événements...</p>
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
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-4">
            Événements Actifs
          </h1>
          <p className="text-xl text-gray-700">
            Participez aux événements de levée de fonds et aidez les associations
          </p>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
            <Flame className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Aucun événement actif
            </h2>
            <p className="text-gray-600">
              Revenez plus tard pour découvrir de nouveaux événements !
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-2xl">
                  {/* En-tête de la carte */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
                        {event.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                    <Flame className="w-10 h-10 text-orange-600 flex-shrink-0 ml-4 group-hover:animate-bounce" />
                  </div>

                  {/* Badge multiplicateur */}
                  {event.multiplier > 1 && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold mb-4">
                      ⚡ IMPACT x{event.multiplier}
                    </div>
                  )}

                  {/* Barre de progression */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progression
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        {event.currentHealth} / {event.maxHealth} PV
                      </span>
                    </div>
                    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                        style={{ width: `${event.healthPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-blue-600">
                        {event.totalContributions}
                      </div>
                      <div className="text-xs text-gray-600">Dons</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-green-600">
                        {event.totalAmount.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-600">XRP</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <Trophy className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-purple-600">
                        {event.leaderboard.length}
                      </div>
                      <div className="text-xs text-gray-600">Héros</div>
                    </div>
                  </div>

                  {/* Top contributeur */}
                  {event.leaderboard.length > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-3 border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🥇</span>
                          <div>
                            <div className="text-xs text-gray-600">Top donateur</div>
                            <div className="font-mono text-sm font-medium text-gray-800">
                              {event.leaderboard[0].walletAddress.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">
                            {event.leaderboard[0].totalTickets}
                          </div>
                          <div className="text-xs text-gray-600">tickets</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  {event.endDate && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Jusqu'au {formatDate(event.endDate)}</span>
                    </div>
                  )}

                  {/* Call to action */}
                  <div className="mt-4">
                    <div className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-bold text-center group-hover:from-orange-700 group-hover:to-red-700 transition">
                      🚨 Participer à l'événement
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

