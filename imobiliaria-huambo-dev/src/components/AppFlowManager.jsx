'use client'
import { useState, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import ProfileSelectionScreen from './ProfileSelectionScreen';
import { LoaderCircle } from 'lucide-react';

export default function AppFlowManager({ children }) {
  // Estados: 'loading', 'welcome', 'profile', 'main'
  const [flowStep, setFlowStep] = useState('loading'); 

  useEffect(() => {
    const profileChoice = localStorage.getItem('userProfileChoice');
    if (profileChoice) {
      setFlowStep('main');
    } else {
      // MUDANÇA AQUI: O primeiro passo agora é 'profile'
      setFlowStep('profile'); 
    }
  }, []);

  // A função handleContinue já não é necessária, mas podemos mantê-la
  const handleContinue = () => {
    setFlowStep('profile');
  };

  const handleProfileSelect = (profile) => {
    localStorage.setItem('userProfileChoice', profile);
    setFlowStep('main');
  };

  if (flowStep === 'loading') {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <LoaderCircle className="animate-spin h-12 w-12 text-purple-600" />
      </div>
    );
  }

  // O WelcomeScreen nunca será chamado com a lógica atual, mas fica guardado no código
  if (flowStep === 'welcome') {
    return <WelcomeScreen onContinue={handleContinue} />;
  }

  if (flowStep === 'profile') {
    return <ProfileSelectionScreen onProfileSelect={handleProfileSelect} />;
  }

  // Se o flowStep for 'main', mostra a aplicação principal
  return children;
}