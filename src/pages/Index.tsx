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
import { Coins, Sparkles, AlertTriangle, Info, Rocket, Shield, Upload, X, Image as ImageIcon } from 'lucide-react';
interface TokenFormData {
  name: string;
  symbol: string;
  totalSupply: string;
  image: File | null;
}
interface FormErrors {
  name?: string;
  symbol?: string;
  totalSupply?: string;
  image?: string;
}
const Index = () => {
  console.log('Index bileşeni render ediliyor...');

  // Bu satırda hata oluyor - useAccount hook'u
  const {
    isConnected
  } = useAccount();
  const {
    toast
  } = useToast();
  console.log('Index - wagmi hook sonucu:', {
    isConnected
  });

  // Form durumu
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    symbol: '',
    totalSupply: '1000000',
    image: null
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form validasyonu
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Token name is required';
    }
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Token symbol is required';
    } else if (formData.symbol.length > 5) {
      newErrors.symbol = 'Token symbol must be 5 characters or less';
    }
    if (!formData.totalSupply.trim()) {
      newErrors.totalSupply = 'Total supply is required';
    } else if (isNaN(Number(formData.totalSupply)) || Number(formData.totalSupply) <= 0) {
      newErrors.totalSupply = 'Please enter a valid number';
    }

    // Görsel validasyonu (opsiyonel)
    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
      newErrors.image = 'Image file must be smaller than 5MB';
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
        title: "Wallet Connection Required",
        description: "Please connect your wallet first to create a token."
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
        image: formData.image ? formData.image.name : 'Görsel yok',
        imageSize: formData.image ? `${(formData.image.size / 1024).toFixed(2)} KB` : 'N/A',
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Token Created Successfully! 🎉",
        description: `${formData.name} (${formData.symbol.toUpperCase()}) token has been created.`
      });

      // Formu sıfırla
      setFormData({
        name: '',
        symbol: '',
        totalSupply: '1000000',
        image: null
      });
      setImagePreview(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Token Creation Error",
        description: "An error occurred while creating the token. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Görsel yükleme işlemi
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Dosya tipini kontrol et
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Önizleme için FileReader kullan
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Hata varsa temizle
      setErrors(prev => ({
        ...prev,
        image: undefined
      }));
    }
  };

  // Görseli kaldır
  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    setErrors(prev => ({
      ...prev,
      image: undefined
    }));
  };
  return <div className="min-h-screen bg-gradient-background font-sans">
      {/* Header */}
      <header className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-crypto rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">SomniaPump</h1>
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
                Create New Token
              </h1>
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Create and manage your token in just a few steps.
            </p>
          </div>

          {/* Token Oluşturma Formu */}
          <Card className="bg-card/80 backdrop-blur-md border border-primary/20 shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Rocket className="w-6 h-6 text-primary" />
                Token Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Token Adı */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Token Name
                  </Label>
                  <Input id="name" type="text" placeholder="Enter token name" value={formData.name} onChange={e => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))} className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
                  {errors.name && <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.name}
                    </p>}
                </div>

                {/* Token Sembolü */}
                <div className="space-y-2">
                  <Label htmlFor="symbol" className="text-sm font-medium text-foreground">
                    Token Symbol
                  </Label>
                  <Input id="symbol" type="text" placeholder="Enter symbol" value={formData.symbol} onChange={e => setFormData(prev => ({
                  ...prev,
                  symbol: e.target.value.toUpperCase()
                }))} maxLength={5} className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
                  {errors.symbol && <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.symbol}
                    </p>}
                </div>

                {/* Toplam Arz */}
                <div className="space-y-2">
                  <Label htmlFor="totalSupply" className="text-sm font-medium text-foreground">
                    Total Supply
                  </Label>
                  <Input id="totalSupply" type="number" placeholder="Enter total supply" value={formData.totalSupply} onChange={e => setFormData(prev => ({
                  ...prev,
                  totalSupply: e.target.value
                }))} min="1" className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20" />
                  {errors.totalSupply && <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.totalSupply}
                    </p>}
                </div>

                {/* Token Görseli */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Token Logo (Optional)
                  </Label>
                  
                  {!imagePreview ? <div className="relative">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" id="image-upload" />
                      <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Upload className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Upload token logo
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG, GIF (Max. 5MB)
                            </p>
                          </div>
                          <Button type="button" variant="outline" size="sm" className="pointer-events-none border-primary/30 text-primary">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Select Image
                          </Button>
                        </div>
                      </div>
                    </div> : <div className="relative">
                      <div className="relative border border-border/50 rounded-lg p-4 bg-card/50">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-muted/50 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={imagePreview} alt="Token preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {formData.image?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formData.image ? `${(formData.image.size / 1024).toFixed(2)} KB` : ''}
                            </p>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={removeImage} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>}
                  
                  {errors.image && <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.image}
                    </p>}
                </div>

                {/* Cüzdan Bağlantı Uyarısı */}
                {!isConnected && <Alert className="border-destructive/20 bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">
                      Connect your wallet to create a token
                    </AlertDescription>
                  </Alert>}

                {/* Token Oluştur Butonu */}
                <Button type="submit" disabled={!isConnected || isSubmitting} className="w-full h-12 bg-gradient-token hover:opacity-90 transition-all duration-300 font-semibold text-lg shadow-glow-primary hover:shadow-glow-accent">
                  {isSubmitting ? <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Token...
                    </div> : <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      Create Token
                    </div>}
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
                    Test Mode Active
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This operation is for testing purposes and is not yet on mainnet. 
                    Wait for Somnia Network mainnet for actual token deployment.
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
    </div>;
};
export default Index;