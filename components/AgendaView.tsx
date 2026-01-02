
import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent, EventCategory } from '../types';
import { EventForm } from './agenda/EventForm';
import { useSchoolData } from '../contexts/SchoolDataContext';

// --- CONSTANTS & HELPERS ---

const EVENT_COLORS: Record<EventCategory, string> = {
  academic: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  holiday: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
  administrative: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  event: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
};

const CATEGORY_LABELS: Record<EventCategory, string> = {
  academic: 'Acadêmico',
  holiday: 'Feriado',
  administrative: 'Administrativo',
  event: 'Eventos',
};

export const AgendaView: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useSchoolData();

  // Navigation State
  const [currentDate, setCurrentDate] = useState(new Date(new Date().getFullYear(), 9, 1)); 
  
  // Data State
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>(['academic', 'holiday', 'administrative', 'event']);
  
  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null); // Null = Create, Object = Edit
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // For creating new event on specific day

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- CALENDAR LOGIC ---
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const toggleCategory = (cat: EventCategory) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // --- HANDLERS ---

  // 1. Click on Empty Cell -> Create New
  const handleDayClick = (day: Date) => {
    setCurrentEvent(null); // Reset to Create Mode
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  // 2. Click on Event -> Edit Mode
  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation(); // Prevent triggering handleDayClick
    setCurrentEvent(event); // Set Edit Mode
    setIsModalOpen(true);
  };

  // 3. Save (Create or Update)
  const handleSaveEvent = (eventData: CalendarEvent) => {
    if (eventData.id && events.some(e => e.id === eventData.id)) {
        // UPDATE
        updateEvent(eventData);
        showToast("Evento atualizado com sucesso!");
    } else {
        // CREATE
        const newEvent = { ...eventData, id: Math.random().toString(36).substr(2, 9) };
        addEvent(newEvent);
        showToast("Novo evento criado!");
    }
    setIsModalOpen(false);
  };

  // 4. Delete
  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setIsModalOpen(false);
    showToast("Evento removido.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredEvents = events.filter(ev => selectedCategories.includes(ev.category));
  const upcomingEvents = events
    .filter(ev => ev.start >= new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 3);

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-in fade-in duration-300 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-[60] bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right fade-in duration-300">
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* --- SIDEBAR (25%) --- */}
      <div className="w-full md:w-1/4 flex flex-col gap-6">
        
        {/* Primary Action */}
        <button 
          onClick={() => {
              setCurrentEvent(null);
              setSelectedDate(new Date());
              setIsModalOpen(true);
          }}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-medium"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Novo Evento
        </button>

        {/* Mini Calendar (Simplified Static for visual balance) */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7ebf3] dark:border-gray-700 p-4 shadow-sm hidden md:block">
           <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-sm text-[#0d121b] dark:text-white capitalize">
                  {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </span>
              <div className="flex gap-1">
                 <span onClick={prevMonth} className="material-symbols-outlined text-xs text-neutral-gray cursor-pointer hover:text-primary">chevron_left</span>
                 <span onClick={nextMonth} className="material-symbols-outlined text-xs text-neutral-gray cursor-pointer hover:text-primary">chevron_right</span>
              </div>
           </div>
           <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['D','S','T','Q','Q','S','S'].map(d => <span key={d} className="text-neutral-gray font-medium">{d}</span>)}
              {calendarDays.slice(0, 35).map((d, i) => (
                  <span 
                    key={i} 
                    className={`py-1 rounded-full cursor-pointer 
                        ${isSameDay(d, new Date()) ? 'bg-primary text-white' : 'text-[#0d121b] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
                        ${!isSameMonth(d, currentDate) ? 'opacity-30' : ''}
                    `}
                    onClick={() => handleDayClick(d)}
                  >
                      {format(d, 'd')}
                  </span>
              ))}
           </div>
        </div>

        {/* Filters */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7ebf3] dark:border-gray-700 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0d121b] dark:text-white mb-4 uppercase tracking-wider">Categorias</h3>
            <div className="flex flex-col gap-3">
                {(['academic', 'holiday', 'administrative', 'event'] as EventCategory[]).map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`
                            size-5 rounded border flex items-center justify-center transition-colors
                            ${selectedCategories.includes(cat) 
                                ? 'bg-primary border-primary text-white' 
                                : 'bg-transparent border-gray-300 dark:border-gray-600'}
                        `}>
                            {selectedCategories.includes(cat) && <span className="material-symbols-outlined text-[14px]">check</span>}
                        </div>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={selectedCategories.includes(cat)} 
                            onChange={() => toggleCategory(cat)} 
                        />
                        <span className="text-sm text-[#0d121b] dark:text-white group-hover:text-primary transition-colors">
                            {CATEGORY_LABELS[cat]}
                        </span>
                        <span className={`ml-auto size-2 rounded-full ${EVENT_COLORS[cat].split(' ')[0]}`}></span>
                    </label>
                ))}
            </div>
        </div>

        {/* Upcoming List */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7ebf3] dark:border-gray-700 p-5 shadow-sm flex-1">
             <h3 className="text-sm font-bold text-[#0d121b] dark:text-white mb-4 uppercase tracking-wider">Próximos Eventos</h3>
             <div className="flex flex-col gap-4">
                {upcomingEvents.map(ev => (
                    <div 
                        key={ev.id} 
                        onClick={(e) => handleEventClick(e, ev)}
                        className="flex gap-3 items-start p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
                    >
                        <div className={`shrink-0 flex flex-col items-center justify-center w-10 h-10 rounded-lg border ${EVENT_COLORS[ev.category].replace('bg-', 'border-').split(' ')[2] || 'border-gray-200'}`}>
                            <span className="text-[10px] font-bold uppercase text-neutral-gray">{format(ev.start, 'MMM', { locale: ptBR })}</span>
                            <span className="text-sm font-bold text-[#0d121b] dark:text-white">{format(ev.start, 'dd')}</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#0d121b] dark:text-white line-clamp-1">{ev.title}</p>
                            <p className="text-xs text-neutral-gray flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">schedule</span>
                                {format(ev.start, 'HH:mm')}
                                {ev.location && ` • ${ev.location}`}
                            </p>
                        </div>
                    </div>
                ))}
                {upcomingEvents.length === 0 && <p className="text-sm text-neutral-gray italic">Nenhum evento próximo.</p>}
             </div>
        </div>
      </div>

      {/* --- MAIN CALENDAR (75%) --- */}
      <div className="flex-1 flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7ebf3] dark:border-gray-700 shadow-sm overflow-hidden h-[600px] md:h-auto">
         
         {/* Calendar Header */}
         <div className="p-4 border-b border-[#e7ebf3] dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-[#0d121b] dark:text-white capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                    <button onClick={prevMonth} className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md shadow-sm transition-all text-neutral-gray">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button onClick={goToToday} className="px-3 py-1 text-xs font-semibold text-[#0d121b] dark:text-white hover:text-primary">
                        Hoje
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md shadow-sm transition-all text-neutral-gray">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>
            
            <div className="hidden sm:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 text-xs font-semibold">
                <button className="px-3 py-1 bg-white dark:bg-gray-700 shadow-sm rounded-md text-[#0d121b] dark:text-white">Mês</button>
                <button className="px-3 py-1 text-neutral-gray hover:text-[#0d121b] dark:hover:text-white">Semana</button>
                <button className="px-3 py-1 text-neutral-gray hover:text-[#0d121b] dark:hover:text-white">Dia</button>
            </div>
         </div>

         {/* Calendar Grid Header */}
         <div className="grid grid-cols-7 border-b border-[#e7ebf3] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="py-2 text-center text-xs font-semibold text-neutral-gray uppercase tracking-wider">
                    {day}
                </div>
            ))}
         </div>

         {/* Calendar Grid Body */}
         <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-6">
            {calendarDays.map((day, dayIdx) => {
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isTodayDate = isToday(day);
                
                // Find events for this specific day
                const dayEvents = filteredEvents.filter(ev => isSameDay(ev.start, day));

                return (
                    <div 
                        key={day.toISOString()}
                        onClick={() => handleDayClick(day)}
                        className={`
                            border-b border-r border-[#e7ebf3] dark:border-gray-800 p-1 min-h-[80px] flex flex-col gap-1 cursor-pointer transition-colors group
                            ${!isCurrentMonth ? 'bg-gray-50/50 dark:bg-black/20 text-gray-300 dark:text-gray-600' : 'bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                        `}
                    >
                        <div className="flex justify-between items-start p-1">
                            <span className={`
                                text-sm font-medium size-7 flex items-center justify-center rounded-full
                                ${isTodayDate 
                                    ? 'bg-primary text-white shadow-sm' 
                                    : !isCurrentMonth ? 'text-gray-400' : 'text-[#0d121b] dark:text-white'}
                            `}>
                                {format(day, 'd')}
                            </span>
                            
                            {/* Hover Add Icon */}
                            <span className="material-symbols-outlined text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">add</span>
                        </div>

                        {/* Events List for Day */}
                        <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                            {dayEvents.map(ev => (
                                <div 
                                    key={ev.id}
                                    onClick={(e) => handleEventClick(e, ev)}
                                    className={`
                                        text-[10px] font-semibold px-1.5 py-0.5 rounded truncate border-l-2 hover:brightness-95 transition-all
                                        ${EVENT_COLORS[ev.category]}
                                    `}
                                    title={ev.title}
                                >
                                    {ev.title}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
         </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={() => setIsModalOpen(false)}
              ></div>
              <div className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                  <div className="p-5 border-b border-[#e7ebf3] dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
                      <h2 className="text-lg font-bold text-[#0d121b] dark:text-white">
                        {currentEvent ? 'Editar Evento' : 'Novo Evento'}
                      </h2>
                      <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                          <span className="material-symbols-outlined text-neutral-gray text-lg">close</span>
                      </button>
                  </div>
                  <div className="p-5 overflow-y-auto custom-scrollbar">
                      <EventForm 
                        initialData={currentEvent}
                        selectedDate={selectedDate}
                        onSuccess={handleSaveEvent} 
                        onDelete={handleDeleteEvent}
                        onCancel={() => setIsModalOpen(false)} 
                      />
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
