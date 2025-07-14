// Cüzdan bağlantısı bileşeni - Modern kripto UI
import { useState, useEffect, useRef } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WalletConnect() {
  const [showConnectors, setShowConnectors] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Console log ekleyerek debug yapalım
  console.log('WalletConnect bileşeni render ediliyor...');
  
  // Hook'ları doğrudan kullanıyoruz - hata buradan geliyorsa görürüz
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  
  console.log('WalletConnect - Hook sonuçları:', { 
    isConnected, 
    address, 
    connectorsLength: connectors?.length || 0,
    isPending 
  });

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowConnectors(false);
      }
    };

    if (showConnectors) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showConnectors]);

  // Adres kısaltma fonksiyonu
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Eğer cüzdan bağlıysa bağlı durumu göster
  if (isConnected && address) {
    return (
      <Card className="relative p-3 bg-gradient-crypto-dark border-primary/20 shadow-glow-primary">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-foreground">
              Connected: {formatAddress(address)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => disconnect()}
            className="text-xs border-primary/30 hover:border-primary/50 hover:bg-primary/10"
          >
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setShowConnectors(!showConnectors)}
        disabled={isPending}
        className={cn(
          "bg-gradient-crypto hover:bg-gradient-crypto-dark transition-all duration-300",
          "shadow-glow-primary hover:shadow-glow-accent",
          "font-semibold"
        )}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </Button>

      {showConnectors && connectors && connectors.length > 0 && (
        <Card className="absolute top-12 right-0 w-64 p-4 bg-card border-primary/20 shadow-2xl z-[9999] backdrop-blur-md">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Select Wallet</h3>
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                variant="outline"
                className="w-full justify-start border-border/50 hover:border-primary/50 hover:bg-primary/10 bg-card"
                onClick={() => {
                  connect({ connector });
                  setShowConnectors(false);
                }}
                disabled={isPending}
              >
                <Wallet className="w-4 h-4 mr-2" />
                {connector.name}
              </Button>
            ))}
            <div className="pt-2 border-t border-border/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="w-3 h-3" />
                <span>Secure wallet connection</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}