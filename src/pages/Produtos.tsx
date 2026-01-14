import { useState } from 'react';
import { useAuthStore } from '../stores/auth';
import {
  ExternalLink,
  Copy,
  Shirt,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Tag,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

const STORE_URL = 'https://moodverse.com.br';

const categories = [
  {
    id: 'camisetas',
    name: 'Camisetas',
    description: 'Nossa coleção mais vendida',
    icon: Shirt,
    color: 'bg-purple-100 text-purple-600',
    path: '/roupas?category=camisetas',
  },
  {
    id: 'moletons',
    name: 'Moletons',
    description: 'Conforto e estilo',
    icon: ShoppingBag,
    color: 'bg-pink-100 text-pink-600',
    path: '/roupas?category=moletons',
  },
  {
    id: 'baby-looks',
    name: 'Baby Looks',
    description: 'Modelagem feminina',
    icon: Sparkles,
    color: 'bg-blue-100 text-blue-600',
    path: '/roupas?category=baby-looks',
  },
  {
    id: 'regatas',
    name: 'Regatas',
    description: 'Para dias quentes',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-600',
    path: '/roupas?category=regatas',
  },
];

export default function ProdutosPage() {
  const { user } = useAuthStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const couponCode = user?.influencer_profile?.reference_code || '';

  const copyLink = (path: string, categoryId: string) => {
    const link = `${STORE_URL}${path}&ref=${couponCode}`;
    navigator.clipboard.writeText(link);
    setCopiedId(categoryId);
    toast.success('Link copiado!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyMainLink = () => {
    const link = `${STORE_URL}/roupas?ref=${couponCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Link da loja copiado!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-purple-600" />
          Produtos para Promover
        </h1>
        <p className="text-gray-600 mt-1">
          Divulgue qualquer produto da loja e ganhe comissão em todas as vendas!
        </p>
      </div>

      {/* Main Store Link */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Link da Loja Completa</h2>
            <p className="text-purple-200 text-sm">
              Use este link para direcionar para toda a loja
            </p>
            <code className="block mt-2 bg-white/10 px-3 py-2 rounded-lg text-sm">
              {STORE_URL}/roupas?ref={couponCode}
            </code>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyMainLink}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copiar Link
            </button>
            <a
              href={`${STORE_URL}/roupas`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Visitar Loja
            </a>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Links por Categoria</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isCopied = copiedId === category.id;

            return (
              <div
                key={category.id}
                className="bg-white rounded-xl p-5 border hover:border-purple-200 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{category.description}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyLink(category.path, category.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          isCopied
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copiar Link
                          </>
                        )}
                      </button>
                      <a
                        href={`${STORE_URL}${category.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Ver
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Tag className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">
              Dica: Seu cupom funciona em qualquer produto!
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              Quando você compartilha um link com <code className="bg-yellow-100 px-1 rounded">?ref={couponCode}</code>,
              o cliente automaticamente receberá seu desconto ao finalizar a compra.
              Você ganha comissão em QUALQUER produto que ele comprar!
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                <Check className="w-3 h-3" />
                Camisetas
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                <Check className="w-3 h-3" />
                Moletons
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                <Check className="w-3 h-3" />
                Baby Looks
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                <Check className="w-3 h-3" />
                Regatas
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                <Check className="w-3 h-3" />
                E mais!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
