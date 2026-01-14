import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import {
  CheckCircle2,
  Circle,
  Copy,
  ExternalLink,
  Gift,
  CreditCard,
  Share2,
  TrendingUp,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: () => void;
  actionLabel?: string;
  icon: React.ReactNode;
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const influencer = user?.influencer_profile;
  const couponCode = influencer?.reference_code || '';
  const referralLink = `https://moodverse.com.br?ref=${couponCode}`;

  // Determine which steps are completed
  const hasPaymentInfo = !!(influencer?.pix_key || influencer?.bank_account);
  const hasSocialMedia = !!(influencer?.instagram_handle || influencer?.tiktok_handle || influencer?.youtube_channel);
  const hasCoupon = !!couponCode;

  const steps: OnboardingStep[] = [
    {
      id: 'approved',
      title: 'Conta Aprovada',
      description: 'Sua conta foi aprovada e você já pode começar a promover!',
      completed: influencer?.status === 'approved',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      id: 'coupon',
      title: 'Cupom Exclusivo',
      description: hasCoupon
        ? `Seu cupom é: ${couponCode}`
        : 'Seu cupom será gerado automaticamente.',
      completed: hasCoupon,
      icon: <Gift className="w-5 h-5" />,
    },
    {
      id: 'payment',
      title: 'Dados de Pagamento',
      description: hasPaymentInfo
        ? 'Seus dados bancários estão configurados.'
        : 'Configure seus dados para receber pagamentos.',
      completed: hasPaymentInfo,
      action: () => navigate('/pagamentos'),
      actionLabel: hasPaymentInfo ? 'Ver Pagamentos' : 'Configurar',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: 'share',
      title: 'Compartilhe seu Link',
      description: 'Divulgue seu link nas redes sociais e comece a ganhar!',
      completed: false,
      action: () => copyLink(),
      actionLabel: 'Copiar Link',
      icon: <Share2 className="w-5 h-5" />,
    },
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const copyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast.success('Cupom copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Link copiado!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">
          Bem-vindo ao MoodVerse Partners!
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Você agora faz parte do nosso programa de parceiros. Siga os passos abaixo para começar a ganhar comissões.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            Seu progresso
          </span>
          <span className="text-sm font-medium text-purple-600">
            {completedSteps}/{steps.length} passos completos
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Coupon Card */}
      {hasCoupon && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">Seu Cupom Exclusivo</p>
              <p className="text-3xl font-bold font-mono tracking-wider">
                {couponCode}
              </p>
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-purple-200 text-sm mb-2">Seu Link de Referência</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white/10 px-3 py-2 rounded-lg text-sm truncate">
                {referralLink}
              </code>
              <button
                onClick={copyLink}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Passos para Começar</h2>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-white rounded-xl p-5 border transition-all ${
                step.completed
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${
                      step.completed ? 'text-green-700' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </h3>
                    {step.completed && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Completo
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${
                    step.completed ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {step.action && (
                  <button
                    onClick={step.action}
                    className={`flex-shrink-0 flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      step.completed
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {step.actionLabel}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Dicas para Aumentar suas Vendas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">
              Compartilhe nas Stories
            </h3>
            <p className="text-sm text-purple-700">
              Stories têm alta visibilidade. Use seu cupom em CTAs como "Use meu código para desconto!"
            </p>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg">
            <h3 className="font-medium text-pink-900 mb-2">
              Crie Conteúdo Autêntico
            </h3>
            <p className="text-sm text-pink-700">
              Mostre os produtos que você usa. Conteúdo genuíno converte mais que propaganda.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              Link na Bio
            </h3>
            <p className="text-sm text-blue-700">
              Coloque seu link de referência na bio do Instagram e TikTok para fácil acesso.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">
              Acompanhe seus Resultados
            </h3>
            <p className="text-sm text-green-700">
              Use o Dashboard para ver quais estratégias estão funcionando melhor.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center gap-2 p-4 bg-white border rounded-xl hover:border-purple-300 transition-colors"
        >
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <span className="font-medium">Ver Dashboard</span>
        </button>
        <button
          onClick={() => navigate('/cupons')}
          className="flex items-center justify-center gap-2 p-4 bg-white border rounded-xl hover:border-purple-300 transition-colors"
        >
          <Gift className="w-5 h-5 text-purple-600" />
          <span className="font-medium">Meu Cupom</span>
        </button>
        <a
          href="https://moodverse.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-4 bg-white border rounded-xl hover:border-purple-300 transition-colors"
        >
          <ExternalLink className="w-5 h-5 text-purple-600" />
          <span className="font-medium">Ver Loja</span>
        </a>
      </div>
    </div>
  );
}
