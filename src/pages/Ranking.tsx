import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth';
import { getLeaderboard } from '../lib/api';
import {
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  User,
  Instagram
} from 'lucide-react';

interface LeaderboardEntry {
  position: number;
  influencer_id: number;
  name: string;
  level: string;
  points: number;
  instagram_handle?: string;
  avatar_url?: string;
}

interface LeaderboardData {
  period: string;
  leaderboard: LeaderboardEntry[];
}

type Period = 'total' | 'month' | 'week';

export default function RankingPage() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<Period>('month');
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const influencerId = user?.influencer_profile?.id;

  useEffect(() => {
    loadLeaderboard();
  }, [period]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLeaderboard(period);
      setData(response);
    } catch (err: any) {
      console.error('Error loading leaderboard:', err);
      setError('Não foi possível carregar o ranking.');
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = (p: Period) => {
    switch (p) {
      case 'total': return 'Geral';
      case 'month': return 'Este Mês';
      case 'week': return 'Esta Semana';
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
            <Medal className="w-5 h-5 text-white" />
          </div>
        );
      case 3:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <Medal className="w-5 h-5 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
            {position}
          </div>
        );
    }
  };

  const userPosition = data?.leaderboard.find(e => e.influencer_id === influencerId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Ranking de Parceiros
          </h1>
          <p className="text-gray-600 mt-1">
            Veja quem está no topo e acompanhe sua posição!
          </p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="bg-white rounded-xl p-2 inline-flex gap-1 shadow-sm border">
        {(['month', 'week', 'total'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === p
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {getPeriodLabel(p)}
          </button>
        ))}
      </div>

      {/* User Position Card */}
      {userPosition && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                #{userPosition.position}
              </div>
              <div>
                <p className="text-purple-200 text-sm">Sua Posição</p>
                <p className="text-2xl font-bold">{userPosition.name}</p>
                <p className="text-purple-200 text-sm">
                  {userPosition.points.toLocaleString('pt-BR')} pontos
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="font-medium">{userPosition.level}</span>
              </div>
              {userPosition.position <= 10 && (
                <p className="text-sm text-purple-200 mt-1">
                  Top 10!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4" />
            <p className="text-gray-500">Carregando ranking...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">
            {error}
          </div>
        ) : data?.leaderboard.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Nenhum parceiro no ranking ainda.
          </div>
        ) : (
          <div className="divide-y">
            {/* Top 3 Highlight */}
            {data?.leaderboard.slice(0, 3).length === 3 && (
              <div className="p-6 bg-gradient-to-b from-yellow-50 to-white">
                <div className="flex items-end justify-center gap-4">
                  {/* 2nd Place */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <p className="font-medium text-sm text-gray-900 text-center max-w-[100px] truncate">
                      {data.leaderboard[1]?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {data.leaderboard[1]?.points.toLocaleString('pt-BR')} pts
                    </p>
                  </div>

                  {/* 1st Place */}
                  <div className="flex flex-col items-center -mt-4">
                    <Crown className="w-8 h-8 text-yellow-500 mb-1" />
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-2 ring-4 ring-yellow-200">
                      <span className="text-3xl font-bold text-white">1</span>
                    </div>
                    <p className="font-bold text-gray-900 text-center max-w-[120px] truncate">
                      {data.leaderboard[0]?.name}
                    </p>
                    <p className="text-sm text-yellow-600 font-medium">
                      {data.leaderboard[0]?.points.toLocaleString('pt-BR')} pts
                    </p>
                  </div>

                  {/* 3rd Place */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <p className="font-medium text-sm text-gray-900 text-center max-w-[100px] truncate">
                      {data.leaderboard[2]?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {data.leaderboard[2]?.points.toLocaleString('pt-BR')} pts
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Full List */}
            <div className="divide-y">
              {data?.leaderboard.map((entry) => (
                <div
                  key={entry.influencer_id}
                  className={`flex items-center gap-4 p-4 transition-colors ${
                    entry.influencer_id === influencerId
                      ? 'bg-purple-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Position */}
                  {getPositionIcon(entry.position)}

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {entry.avatar_url ? (
                      <img
                        src={entry.avatar_url}
                        alt={entry.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium truncate ${
                        entry.influencer_id === influencerId
                          ? 'text-purple-700'
                          : 'text-gray-900'
                      }`}>
                        {entry.name}
                        {entry.influencer_id === influencerId && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-2">
                            Você
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {entry.level}
                      </span>
                      {entry.instagram_handle && (
                        <span className="flex items-center gap-1">
                          <Instagram className="w-3 h-3" />
                          {entry.instagram_handle}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {entry.points.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500">pontos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Como subir no ranking?
            </h3>
            <p className="text-sm text-blue-700">
              Ganhe pontos realizando vendas com seu cupom exclusivo.
              Quanto mais vendas, mais pontos você acumula!
              Subindo de nível, você pode desbloquear benefícios exclusivos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
