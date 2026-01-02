
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarEvent } from '../../types';

const eventSchema = z.object({
  title: z.string().min(3, "Título é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  startTime: z.string().min(1, "Hora de início obrigatória"),
  endTime: z.string().min(1, "Hora de término obrigatória"),
  category: z.enum(['academic', 'holiday', 'administrative', 'event']),
  location: z.string().optional(),
  description: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  onSuccess: (data: any) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
  initialData?: CalendarEvent | null;
  selectedDate?: Date;
}

export const EventForm: React.FC<EventFormProps> = ({ onSuccess, onDelete, onCancel, initialData, selectedDate }) => {
  // Determine default values based on whether we are Editing or Creating
  const defaultDateStr = initialData 
    ? format(initialData.start, 'yyyy-MM-dd') 
    : selectedDate 
        ? format(selectedDate, 'yyyy-MM-dd') 
        : format(new Date(), 'yyyy-MM-dd');

  const defaultStartTime = initialData ? format(initialData.start, 'HH:mm') : '08:00';
  const defaultEndTime = initialData ? format(initialData.end, 'HH:mm') : '09:00';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || '',
      date: defaultDateStr,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      category: (initialData?.category as any) || 'academic',
      location: initialData?.location || '',
      description: initialData?.description || '',
    }
  });

  const onSubmit = async (data: EventFormValues) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Construct real date objects from form strings for the parent component
    const start = new Date(`${data.date}T${data.startTime}`);
    const end = new Date(`${data.date}T${data.endTime}`);
    
    // Return combined object
    onSuccess({ 
      ...initialData, // Keep ID if exists
      ...data, 
      start, 
      end 
    });
  };

  const handleDelete = () => {
    if (initialData && onDelete) {
      if (window.confirm("Tem certeza que deseja excluir este evento?")) {
        onDelete(initialData.id);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      
      <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">Título do Evento</label>
          <input 
            {...register('title')} 
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
            placeholder="Ex: Exame de Matemática" 
            autoFocus
          />
          {errors.title && <span className="text-xs text-warning">{errors.title.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">Categoria</label>
            <div className="relative">
                <select 
                    {...register('category')}
                    className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                    <option value="academic">Acadêmico</option>
                    <option value="holiday">Feriado</option>
                    <option value="administrative">Administrativo</option>
                    <option value="event">Evento / Festa</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">expand_more</span>
            </div>
         </div>
         <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">Data</label>
            <input 
                type="date"
                {...register('date')} 
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">Início</label>
            <input 
                type="time"
                {...register('startTime')} 
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
         </div>
         <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">Fim</label>
            <input 
                type="time"
                {...register('endTime')} 
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
         </div>
      </div>

      <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">Local (Opcional)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-gray text-[18px]">location_on</span>
            <input 
                {...register('location')} 
                className="w-full pl-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                placeholder="Ex: Sala de Conferências" 
            />
          </div>
      </div>

      <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-gray uppercase tracking-wider">Descrição</label>
          <textarea 
            {...register('description')} 
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[80px]" 
            placeholder="Detalhes adicionais..." 
          />
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 right-0 w-full max-w-md bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-3 z-50 rounded-b-xl">
          {initialData ? (
            <button 
                type="button" 
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
            >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Excluir
            </button>
          ) : (
            <div></div> // Spacer
          )}
          
          <div className="flex gap-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-neutral-gray hover:text-[#0d121b] transition-colors">Cancelar</button>
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                    <span className="material-symbols-outlined text-[18px]">{initialData ? 'save' : 'add_circle'}</span>
                )}
                {initialData ? 'Salvar' : 'Criar Evento'}
            </button>
          </div>
      </div>
    </form>
  );
};
