
import React, { useState, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

type TabId = 'profile' | 'user' | 'academic' | 'financial' | 'system';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, updateSchoolLogo, updateUserAvatar } = useSettings();
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State Refs to capture inputs without re-rendering on every keystroke
  // We sync these on "Save"
  const formRefs = useRef<any>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async (section: TabId) => {
    setIsSaving(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In a real form library we would get data here. 
    // Since we are binding inputs directly to state via onChange in this refactor, 
    // the state in Context is already "fresh" for simple inputs if we controlled them.
    // However, for this UI, let's assume we trigger the Context update directly on Change 
    // OR we collect refs.
    // Strategy: We will update the context directly on input Change for simplicity and "React" feel,
    // so the Save button is mostly for UX feedback and persistence (which happens automatically in our context).
    
    setIsSaving(false);
    showToast('Configurações salvas com sucesso!');
  };

  // Helper to update specific nested fields in context
  const handleChange = (section: keyof typeof settings, field: string, value: any) => {
    updateSettings(section, { [field]: value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await updateSchoolLogo(e.target.files[0]);
      showToast('Logo da escola atualizado!');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await updateUserAvatar(e.target.files[0]);
      showToast('Foto de perfil atualizada!');
    }
  };

  const tabs: { id: TabId; label: string; icon: string; description: string }[] = [
    { id: 'profile', label: 'Identidade da Escola', icon: 'domain', description: 'Logo, Nome e Contatos' },
    { id: 'user', label: 'Perfil do Administrador', icon: 'person', description: 'Dados de Acesso e Avatar' },
    { id: 'academic', label: 'Acadêmico', icon: 'menu_book', description: 'Notas e Trimestres' },
    { id: 'financial', label: 'Financeiro', icon: 'payments', description: 'Mensalidades e Multas' },
    { id: 'system', label: 'Sistema', icon: 'settings_applications', description: 'Manutenção e Alertas' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      
       {/* Toast Notification */}
       {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right fade-in duration-300">
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0d121b] dark:text-white">Configurações do Sistema</h2>
        <div className="flex items-center gap-2 text-sm text-neutral-gray mt-1">
          <span>Home</span>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span>Configurações</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* LEFT COLUMN: NAVIGATION (25%) */}
        <div className="lg:w-1/4 flex flex-col gap-4">
          
          {/* Mobile Dropdown */}
          <div className="lg:hidden">
            <select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value as TabId)}
              className="w-full px-4 py-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
          </div>

          {/* Desktop Vertical Tabs */}
          <nav className="hidden lg:flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-start gap-4 p-4 rounded-xl text-left transition-all border
                  ${activeTab === tab.id 
                    ? 'bg-white dark:bg-surface-dark border-primary/30 shadow-sm' 
                    : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                `}
              >
                <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-neutral-gray'}`}>
                  <span className="material-symbols-outlined">{tab.icon}</span>
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${activeTab === tab.id ? 'text-[#0d121b] dark:text-white' : 'text-neutral-gray'}`}>
                    {tab.label}
                  </h3>
                  <p className="text-xs text-neutral-gray mt-0.5">{tab.description}</p>
                </div>
              </button>
            ))}
          </nav>

          {/* Version Info */}
          <div className="hidden lg:block mt-auto p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-center">
             <p className="text-xs font-semibold text-neutral-gray">Seiva da Nação v1.2.0</p>
             <p className="text-[10px] text-gray-400 mt-1">Licença válida até Dez 2024</p>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT (75%) */}
        <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7ebf3] dark:border-gray-700 shadow-sm p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* TAB A: PERFIL DA ESCOLA */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                 <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Identidade da Escola</h3>
                 <p className="text-sm text-neutral-gray">Personalize o nome, logo e informações de contato.</p>
              </div>

              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                 {/* Logo Upload */}
                 <div className="flex flex-col items-center gap-3 group">
                    <label className="cursor-pointer relative">
                        <div className="size-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800 hover:border-primary transition-colors">
                            {settings.profile.logo ? (
                                <img src={settings.profile.logo} alt="Logo" className="size-full object-contain p-2" />
                            ) : (
                                <span className="material-symbols-outlined text-4xl text-neutral-gray">add_photo_alternate</span>
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                                <span className="material-symbols-outlined text-white">edit</span>
                            </div>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                    <p className="text-xs font-semibold text-primary">Alterar Logo</p>
                 </div>

                 {/* Fields */}
                 <div className="flex-1 grid grid-cols-1 gap-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup 
                            label="Nome da Instituição" 
                            value={settings.profile.name} 
                            onChange={(e) => handleChange('profile', 'name', e.target.value)} 
                        />
                        <InputGroup 
                            label="Slogan / Lema" 
                            value={settings.profile.slogan} 
                            onChange={(e) => handleChange('profile', 'slogan', e.target.value)} 
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup 
                            label="NUIT (Número Fiscal)" 
                            value={settings.profile.nuit} 
                            onChange={(e) => handleChange('profile', 'nuit', e.target.value)} 
                        />
                        <InputGroup 
                            label="Telefone Oficial" 
                            value={settings.profile.phone} 
                            onChange={(e) => handleChange('profile', 'phone', e.target.value)} 
                        />
                    </div>
                    <InputGroup 
                        label="Email Oficial" 
                        value={settings.profile.email} 
                        onChange={(e) => handleChange('profile', 'email', e.target.value)} 
                        type="email" 
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">Endereço Físico</label>
                        <textarea 
                          value={settings.profile.address}
                          onChange={(e) => handleChange('profile', 'address', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[80px]"
                        />
                    </div>
                 </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                  <SaveButton onClick={() => handleSave('profile')} isSaving={isSaving} />
              </div>
            </div>
          )}

           {/* TAB B: PERFIL DO USUÁRIO (NEW) */}
           {activeTab === 'user' && (
            <div className="space-y-8">
              <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                 <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Perfil do Administrador</h3>
                 <p className="text-sm text-neutral-gray">Gerencie seus dados de acesso e aparência.</p>
              </div>

              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                 {/* Avatar Upload */}
                 <div className="flex flex-col items-center gap-3 group">
                    <label className="cursor-pointer relative">
                        <div className="size-32 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800 hover:border-primary transition-colors shadow-sm">
                            <img src={settings.user.avatar} alt="Avatar" className="size-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white">photo_camera</span>
                            </div>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                    <p className="text-xs font-semibold text-primary">Alterar Foto</p>
                 </div>

                 {/* Fields */}
                 <div className="flex-1 grid grid-cols-1 gap-6 w-full">
                    <InputGroup 
                        label="Nome Completo" 
                        value={settings.user.name} 
                        onChange={(e) => handleChange('user', 'name', e.target.value)} 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup 
                            label="Email de Acesso" 
                            value={settings.user.email} 
                            onChange={(e) => handleChange('user', 'email', e.target.value)} 
                        />
                        <InputGroup 
                            label="Cargo / Função" 
                            value={settings.user.role} 
                            onChange={(e) => handleChange('user', 'role', e.target.value)} 
                        />
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/20 mt-4">
                        <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-500 mb-2">Segurança</h4>
                        <button className="text-sm font-medium text-[#0d121b] dark:text-white underline hover:text-primary">
                            Alterar Senha de Acesso
                        </button>
                    </div>
                 </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                  <SaveButton onClick={() => handleSave('user')} isSaving={isSaving} />
              </div>
            </div>
          )}

          {/* TAB C: ACADÊMICO */}
          {activeTab === 'academic' && (
             <div className="space-y-8">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Parametrização Acadêmica</h3>
                    <p className="text-sm text-neutral-gray">Definição de anos letivos e sistema de avaliação.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SelectGroup label="Ano Letivo Atual" value={settings.academic.currentYear} onChange={(e:any) => handleChange('academic', 'currentYear', e.target.value)}>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </SelectGroup>
                    
                    <SelectGroup label="Sistema de Notas" value={settings.academic.gradingSystem} onChange={(e:any) => handleChange('academic', 'gradingSystem', e.target.value)}>
                        <option value="0-20">0 - 20 Valores (Padrão MZ)</option>
                        <option value="0-100">0 - 100 Pontos</option>
                        <option value="A-F">A - F (Internacional)</option>
                    </SelectGroup>

                    <InputGroup 
                        label="Média de Aprovação" 
                        type="number" 
                        value={settings.academic.passingGrade} 
                        onChange={(e) => handleChange('academic', 'passingGrade', Number(e.target.value))} 
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">Períodos Ativos (Trimestres)</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {['1º Trimestre', '2º Trimestre', '3º Trimestre'].map((trim, idx) => (
                             <label key={trim} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1">
                                <input 
                                    type="checkbox" 
                                    defaultChecked={settings.academic.activeTerms.includes((idx + 1).toString())}
                                    className="rounded text-primary focus:ring-primary size-4" 
                                />
                                <span className="text-sm font-medium text-[#0d121b] dark:text-white">{trim}</span>
                             </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                  <SaveButton onClick={() => handleSave('academic')} isSaving={isSaving} />
                </div>
             </div>
          )}

          {/* TAB D: FINANCEIRO */}
          {activeTab === 'financial' && (
            <div className="space-y-8">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Configuração Financeira</h3>
                    <p className="text-sm text-neutral-gray">Regras de faturação e dados bancários.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">Moeda Padrão</label>
                        <input disabled value="MT - Metical" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm text-neutral-gray cursor-not-allowed" />
                    </div>
                    <SelectGroup label="Dia de Vencimento" value={settings.financial.dueDay} onChange={(e:any) => handleChange('financial', 'dueDay', e.target.value)}>
                        {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </SelectGroup>
                    <InputGroup 
                        label="Multa por Atraso (%)" 
                        type="number" 
                        value={settings.financial.lateFee} 
                        onChange={(e) => handleChange('financial', 'lateFee', Number(e.target.value))} 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="md:col-span-2 text-sm font-bold text-primary border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                        Mensalidades por Ciclo
                    </div>
                    <InputGroup 
                        label="1º Ciclo (1ª - 3ª Classe)" 
                        type="number" 
                        value={settings.financial.tuitionCycle1} 
                        onChange={(e) => handleChange('financial', 'tuitionCycle1', Number(e.target.value))} 
                    />
                    <InputGroup 
                        label="2º Ciclo (4ª - 6ª Classe)" 
                        type="number" 
                        value={settings.financial.tuitionCycle2} 
                        onChange={(e) => handleChange('financial', 'tuitionCycle2', Number(e.target.value))} 
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">Dados Bancários para Fatura</label>
                    <textarea 
                        value={settings.financial.bankInfo}
                        onChange={(e) => handleChange('financial', 'bankInfo', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[100px] font-mono"
                        placeholder="Insira NIB, Conta e Banco..."
                    />
                    <p className="text-xs text-neutral-gray">Esta informação aparecerá no rodapé das faturas geradas.</p>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                  <SaveButton onClick={() => handleSave('financial')} isSaving={isSaving} />
                </div>
            </div>
          )}

          {/* TAB E: SISTEMA */}
          {activeTab === 'system' && (
              <div className="space-y-8">
                 <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Sistema & Notificações</h3>
                    <p className="text-sm text-neutral-gray">Controle de acesso e integrações externas.</p>
                </div>

                <div className="flex flex-col gap-6">
                    <SwitchItem 
                        label="Modo de Manutenção" 
                        description="Bloqueia o acesso ao sistema para todos os usuários exceto administradores."
                        checked={settings.system.maintenanceMode}
                        onChange={(val) => handleChange('system', 'maintenanceMode', val)}
                        icon="build"
                        color="text-warning"
                    />
                    <div className="border-t border-gray-100 dark:border-gray-800"></div>
                    <SwitchItem 
                        label="Alertas por Email" 
                        description="Receber notificações quando novos alunos se matricularem."
                        checked={settings.system.emailAlerts}
                        onChange={(val) => handleChange('system', 'emailAlerts', val)}
                        icon="mail"
                        color="text-primary"
                    />
                     <SwitchItem 
                        label="Integração SMS" 
                        description="Ativar envio de SMS automático para encarregados (Requer API Key)."
                        checked={settings.system.smsIntegration}
                        onChange={(val) => handleChange('system', 'smsIntegration', val)}
                        icon="sms"
                        color="text-success"
                    />
                </div>

                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-[#0d121b] dark:text-white">Backup de Segurança</h4>
                        <p className="text-xs text-neutral-gray mt-1">Último backup: Hoje, 08:30</p>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-[#0d121b] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                        Backup Manual
                    </button>
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Reusable Components ---

const InputGroup: React.FC<{ label: string; value: string | number; onChange: (e: any) => void; type?: string }> = ({ label, value, onChange, type = "text" }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">{label}</label>
        <input 
            type={type}
            value={value}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
    </div>
);

const SelectGroup: React.FC<{ label: string; value: string; onChange: (e: any) => void; children: React.ReactNode }> = ({ label, value, onChange, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">{label}</label>
        <div className="relative">
            <select 
                value={value} 
                onChange={onChange}
                className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            >
                {children}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">expand_more</span>
        </div>
    </div>
);

const SaveButton: React.FC<{ onClick: () => void; isSaving: boolean }> = ({ onClick, isSaving }) => (
    <button 
        onClick={onClick}
        disabled={isSaving}
        className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium disabled:opacity-70"
    >
        {isSaving ? (
            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        ) : (
            <span className="material-symbols-outlined text-[20px]">save</span>
        )}
        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
    </button>
);

const SwitchItem: React.FC<{ label: string; description: string; checked: boolean; onChange: (val: boolean) => void; icon: string; color: string }> = ({ label, description, checked, onChange, icon, color }) => (
    <div className="flex items-center justify-between">
        <div className="flex gap-4">
             <div className={`size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${color}`}>
                 <span className="material-symbols-outlined">{icon}</span>
             </div>
             <div>
                 <h4 className="text-sm font-bold text-[#0d121b] dark:text-white">{label}</h4>
                 <p className="text-xs text-neutral-gray max-w-md">{description}</p>
             </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                checked={checked} 
                onChange={(e) => onChange(e.target.checked)} 
                className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
    </div>
);
