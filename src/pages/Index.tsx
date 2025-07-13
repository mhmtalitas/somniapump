// Ana token oluşturma sayfası - Modern kripto UI tasarımı
import { useState, FormEvent } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WalletConnect } from '@/components/WalletConnect';
import { useToast } from '@/hooks/use-toast';
import { 
  Coins, 
  Sparkles, 
  AlertTriangle, 
  Info,
  Rocket,
  Shield
} from 'lucide-react';

interface TokenFormData {
  name: string;
  symbol: string;
  totalSupply: string;
}

interface FormErrors {
  name?: string;
  symbol?: string;
  totalSupply?: string;
}

const Index = () => {
  const { isConnected } = useAccount();
  const { toast } = useToast();
  
  // Form durumu
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    symbol: '',
    totalSupply: '1000000'
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validasyonu
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Token adı gereklidir';
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Token sembolü gereklidir';
    } else if (formData.symbol.length > 5) {
      newErrors.symbol = 'Token sembolü en fazla 5 karakter olmalı';
    }

    if (!formData.totalSupply.trim()) {
      newErrors.totalSupply = 'Toplam arz gereklidir';
    } else if (isNaN(Number(formData.totalSupply)) || Number(formData.totalSupply) <= 0) {
      newErrors.totalSupply = 'Geçerli bir sayı giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderimi
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Cüzdan Bağlantısı Gerekli",
        description: "Token oluşturmak için önce cüzdanınızı bağlayın.",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simüle edilmiş token oluşturma işlemi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Form verilerini konsola yazdır (şimdilik)
      console.log('Token Oluşturma Verileri:', {
        name: formData.name,
        symbol: formData.symbol.toUpperCase(),
        totalSupply: Number(formData.totalSupply),
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Token Başarıyla Oluşturuldu! 🎉",
        description: `${formData.name} (${formData.symbol.toUpperCase()}) token'ı oluşturuldu.`,
      });

      // Formu sıfırla
      setFormData({
        name: '',
        symbol: '',
        totalSupply: '1000000'
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Token Oluşturma Hatası",
        description: "Token oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background font-sans">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-crypto rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Somnia Token Creator</h1>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Başlık Bölümü */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-crypto bg-clip-text text-transparent">
                Yeni Token Oluştur
              </h1>
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Token'ınızı birkaç adımda oluşturun ve yönetin.
            </p>
          </div>

          {/* Token Oluşturma Formu */}
          <Card className="bg-card/80 backdrop-blur-md border border-primary/20 shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Rocket className="w-6 h-6 text-primary" />
                Token Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Token Adı */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Token Adı
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Örn: Pumpzilla"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Token Sembolü */}
                <div className="space-y-2">
                  <Label htmlFor="symbol" className="text-sm font-medium text-foreground">
                    Token Sembolü
                  </Label>
                  <Input
                    id="symbol"
                    type="text"
                    placeholder="Örn: PZL"
                    value={formData.symbol}
                    onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                    maxLength={5}
                    className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                  {errors.symbol && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.symbol}
                    </p>
                  )}
                </div>

                {/* Toplam Arz */}
                <div className="space-y-2">
                  <Label htmlFor="totalSupply" className="text-sm font-medium text-foreground">
                    Toplam Arz
                  </Label>
                  <Input
                    id="totalSupply"
                    type="number"
                    placeholder="Örn: 1000000"
                    value={formData.totalSupply}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalSupply: e.target.value }))}
                    min="1"
                    className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                  {errors.totalSupply && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.totalSupply}
                    </p>
                  )}
                </div>

                {/* Cüzdan Bağlantı Uyarısı */}
                {!isConnected && (
                  <Alert className="border-destructive/20 bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">
                      Token oluşturmak için cüzdanınızu bağlayın
                    </AlertDescription>
                  </Alert>
                )}

                {/* Token Oluştur Butonu */}
                <Button
                  type="submit"
                  disabled={!isConnected || isSubmitting}
                  className="w-full h-12 bg-gradient-token hover:opacity-90 transition-all duration-300 font-semibold text-lg shadow-glow-primary hover:shadow-glow-accent"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Token Oluşturuluyor...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      Token Oluştur
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Bilgi Kutusu */}
          <Card className="mt-8 bg-muted/20 border-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Test Modu Aktif
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Bu işlem deneme amaçlıdır, henüz mainnet'te değildir. 
                    Gerçek token deployment'ı için Somnia Network mainnet'ini bekleyin.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dekoratif Arka Plan Efektleri */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/3 -right-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default Index;
