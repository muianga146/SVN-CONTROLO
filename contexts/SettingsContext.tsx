
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SchoolSettings } from '../types';

// Extend the types to include User Profile for the "Admin Profile" requirement
export interface ExtendedSettings extends SchoolSettings {
  user: {
    name: string;
    role: string;
    email: string;
    avatar: string;
  };
}

const DEFAULT_SETTINGS: ExtendedSettings = {
  profile: {
    name: 'Seiva da Nação',
    slogan: 'Gestão Integrada',
    nuit: '400922811',
    address: 'Av. Julius Nyerere, 1342, Polana Cimento, Maputo',
    email: 'contacto@seiva.mz',
    phone: '+258 84 123 4567',
    logo: 'https://ui-avatars.com/api/?name=SN&background=1152d4&color=fff&size=128&font-size=0.4' // Default placeholder
  },
  academic: {
    currentYear: '2024',
    gradingSystem: '0-20',
    passingGrade: 10,
    activeTerms: ['1', '2']
  },
  financial: {
    currency: 'MT - Metical',
    dueDay: '5',
    lateFee: 10,
    tuitionCycle1: 5000,
    tuitionCycle2: 6500,
    bankInfo: 'Millennium Bim\nConta: 123456789\nNIB: 000100001234567890123'
  },
  system: {
    maintenanceMode: false,
    emailAlerts: true,
    smsIntegration: false
  },
  user: {
    name: 'Ricardo Mendes',
    role: 'Administrador',
    email: 'ricardo@seiva.mz',
    avatar: 'https://ui-avatars.com/api/?name=Ricardo+Mendes&background=random'
  }
};

interface SettingsContextType {
  settings: ExtendedSettings;
  updateSettings: (section: keyof ExtendedSettings, data: any) => void;
  updateSchoolLogo: (file: File) => Promise<void>;
  updateUserAvatar: (file: File) => Promise<void>;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ExtendedSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load from LocalStorage on Mount
  useEffect(() => {
    const stored = localStorage.getItem('seiva_app_settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with default to ensure new fields are present if schema changes
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Persist to LocalStorage whenever settings change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('seiva_app_settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // Actions
  const updateSettings = (section: keyof ExtendedSettings, data: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const updateSchoolLogo = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      updateSettings('profile', { logo: base64 });
    } catch (e) {
      console.error("Error uploading logo", e);
    }
  };

  const updateUserAvatar = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      updateSettings('user', { avatar: base64 });
    } catch (e) {
      console.error("Error uploading avatar", e);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('seiva_app_settings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateSchoolLogo, updateUserAvatar, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
